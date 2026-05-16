import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase'

// 카고 직군 키워드
const CARGO_JOB_KEYWORDS = [
  '항공화물', '화물영업', '통관', '수출입', '포워더', '공항상주', '국제물류', '에어카고', '화물운송', '콘솔',
]

type CargoJobCategory = 'sales_offer' | 'customs' | 'intl_logistics' | 'airport_resident' | 'other_cargo'

function detectJobCategory(title: string): CargoJobCategory {
  const t = title.toLowerCase()
  if (/영업|오퍼|sales|offer/.test(t)) return 'sales_offer'
  if (/통관|수출입|customs|clearance/.test(t)) return 'customs'
  if (/국제물류|포워더|forwarder|물류/.test(t)) return 'intl_logistics'
  if (/공항|상주|핸들링|ramp/.test(t)) return 'airport_resident'
  return 'other_cargo'
}

function makeSlug(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 16)
}

// ── Saramin API 호출 ───────────────────────────────────────
async function fetchSaramin(keyword: string, accessKey: string) {
  const url = new URL('https://oapi.saramin.co.kr/job-search')
  url.searchParams.set('access-key', accessKey)
  url.searchParams.set('keywords', keyword)
  url.searchParams.set('job_mid_cd', '2') // 물류·무역·운송 직종
  url.searchParams.set('count', '10')
  url.searchParams.set('fields', 'expiration-date,location,experience-level')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 0 },
  })
  if (!res.ok) return []

  const data = await res.json()
  return data?.jobs?.job ?? []
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const saraminKey = process.env.SARAMIN_API_KEY
  if (!saraminKey) {
    return NextResponse.json({ error: 'SARAMIN_API_KEY not set' }, { status: 503 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase credentials not set' }, { status: 503 })
  }

  const supabase = createServerClient()
  const summary = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const keyword of CARGO_JOB_KEYWORDS) {
    try {
      const jobs = await fetchSaramin(keyword, saraminKey)
      summary.fetched += jobs.length

      for (const job of jobs) {
        const sourceUrl: string = job.url
        const ingestHash = crypto.createHash('sha256').update(sourceUrl).digest('hex')
        const title: string = job.position?.title ?? ''

        // 비카고 직군 필터 (DB trigger와 이중 방어)
        if (/승무원|객실|조종사|부기장|항공정비|정비사|기장/.test(title)) {
          summary.skipped++
          continue
        }

        const deadlineRaw = job.expiration?.date
        const deadlineAt = deadlineRaw ? new Date(deadlineRaw).toISOString() : null

        const { error } = await supabase.from('job_posts').upsert({
          slug: makeSlug(sourceUrl),
          title,
          company_name: job.company?.detail?.name ?? '미상',
          source_url: sourceUrl,
          source_type: 'saramin',
          job_category: detectJobCategory(title),
          employment_type: 'full_time',
          location: job.location?.name ?? null,
          career_min_years: job['experience-level']?.min ?? null,
          career_max_years: job['experience-level']?.max ?? null,
          deadline_at: deadlineAt,
          trust_score: 3,
          is_approved: false,
          ingest_hash: ingestHash,
        }, { onConflict: 'ingest_hash', ignoreDuplicates: true })

        if (error) summary.errors++
        else summary.inserted++
      }
    } catch {
      summary.errors++
    }
  }

  await supabase.from('ingest_logs').insert({
    source_type: 'saramin',
    fetched: summary.fetched,
    inserted: summary.inserted,
    skipped: summary.skipped,
    errors: summary.errors,
  })

  return NextResponse.json({ ok: true, ...summary })
}
