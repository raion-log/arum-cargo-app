import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase'

// 카고 14 키워드 (CLAUDE.md §6)
const CARGO_KEYWORDS = [
  '항공화물', '에어카고', '화물운임', 'TAC Index',
  '인천공항 화물', '항공 포워더', '콘솔사', '항공물류',
  '항공운임', 'ULD 항공', '화물터미널', '항공 수출입',
  '카고 운임', '항공화물 채용',
]

type NewsCategory =
  | 'freight_market'
  | 'airline'
  | 'airport_infra'
  | 'regulation'
  | 'global'
  | 'uncategorized'

function detectCategory(title: string, desc: string): NewsCategory {
  const t = (title + ' ' + desc).toLowerCase()
  if (/운임|시황|tac|index|freight rate|화물량/.test(t)) return 'freight_market'
  if (/항공사|대한항공|아시아나|에어|airline|취항|노선|편수/.test(t)) return 'airline'
  if (/공항|터미널|인프라|airport|terminal|건설|설비/.test(t)) return 'airport_infra'
  if (/규제|정책|관세|통관|법|제도|허가|인증/.test(t)) return 'regulation'
  if (/글로벌|해외|국제|세계|iata|icao/.test(t)) return 'global'
  return 'freight_market'
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
}

function makeSlug(url: string): string {
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 16)
}

export async function POST(req: NextRequest) {
  // Cron 보안 검증
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET not set' }, { status: 503 })
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase credentials not set' }, { status: 503 })
  }

  const supabase = createServerClient()
  const summary = { fetched: 0, inserted: 0, skipped: 0, errors: 0 }

  for (const keyword of CARGO_KEYWORDS) {
    try {
      const url = new URL('https://openapi.naver.com/v1/search/news.json')
      url.searchParams.set('query', keyword)
      url.searchParams.set('display', '5')
      url.searchParams.set('sort', 'date')

      const res = await fetch(url.toString(), {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
        next: { revalidate: 0 },
      })
      if (!res.ok) { summary.errors++; continue }

      const data = await res.json()
      summary.fetched += data.items?.length ?? 0

      for (const item of data.items ?? []) {
        const sourceUrl: string = item.originallink || item.link
        const ingestHash = crypto.createHash('sha256').update(sourceUrl).digest('hex')
        const title = stripHtml(item.title)
        const summaryKo = stripHtml(item.description)

        let sourceName = '뉴스'
        try { sourceName = new URL(sourceUrl).hostname.replace(/^www\./, '') } catch { /* noop */ }

        const { error } = await supabase.from('news_articles').upsert({
          slug: makeSlug(sourceUrl),
          title,
          summary_ko: summaryKo,
          source_name: sourceName,
          source_url: sourceUrl,
          source_type: 'naver_news',
          category: detectCategory(title, summaryKo),
          published_at: new Date(item.pubDate).toISOString(),
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

  // ingest 로그 저장
  await supabase.from('ingest_logs').insert({
    source_type: 'naver_news',
    fetched: summary.fetched,
    inserted: summary.inserted,
    skipped: summary.skipped,
    errors: summary.errors,
  })

  return NextResponse.json({ ok: true, ...summary })
}
