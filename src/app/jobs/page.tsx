import { JobFilterList } from '@/components/jobs/job-filter-list'
import type { JobPost } from '@/components/jobs/job-card'

const MOCK_JOBS: JobPost[] = [
  {
    id: 'j1',
    title: '항공화물 영업·오퍼 담당자',
    companyName: '판토스',
    sourceUrl: '#',
    jobCategory: 'sales_offer',
    employmentType: 'full_time',
    location: '인천공항(ICN)',
    careerMinYears: 1,
    careerMaxYears: 5,
    deadlineAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 5,
  },
  {
    id: 'j2',
    title: '국제물류 통관 전문가 (신입 가능)',
    companyName: 'CJ대한통운',
    sourceUrl: '#',
    jobCategory: 'customs',
    employmentType: 'full_time',
    location: '인천공항(ICN)',
    careerMinYears: 0,
    careerMaxYears: 2,
    deadlineAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 5,
  },
  {
    id: 'j3',
    title: '항공화물 수출입 오퍼레이터',
    companyName: '현대글로비스',
    sourceUrl: '#',
    jobCategory: 'intl_logistics',
    employmentType: 'full_time',
    location: '인천공항(ICN)',
    careerMinYears: 2,
    careerMaxYears: 7,
    deadlineAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 4,
  },
  {
    id: 'j4',
    title: '공항 상주 화물 핸들링 직원',
    companyName: '한국공항공사',
    sourceUrl: '#',
    jobCategory: 'airport_resident',
    employmentType: 'full_time',
    location: '김포(GMP)',
    careerMinYears: 0,
    careerMaxYears: 3,
    deadlineAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 5,
  },
  {
    id: 'j5',
    title: '항공화물 영업 Manager (중견 이상)',
    companyName: '에어인천',
    sourceUrl: '#',
    jobCategory: 'sales_offer',
    employmentType: 'full_time',
    location: '인천공항(ICN)',
    careerMinYears: 5,
    careerMaxYears: 10,
    deadlineAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 4,
  },
]

async function getJobs(): Promise<JobPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return MOCK_JOBS
  }
  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()
    const { data } = await supabase
      .from('job_posts')
      .select('id,title,company_name,source_url,job_category,employment_type,location,career_min_years,career_max_years,deadline_at,trust_score')
      .eq('is_approved', true)
      .eq('is_archived', false)
      .order('created_at', { ascending: false })
      .limit(50)
    if (!data?.length) return MOCK_JOBS
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      companyName: r.company_name,
      sourceUrl: r.source_url,
      jobCategory: r.job_category,
      employmentType: r.employment_type,
      location: r.location ?? undefined,
      careerMinYears: r.career_min_years ?? undefined,
      careerMaxYears: r.career_max_years ?? undefined,
      deadlineAt: r.deadline_at ?? undefined,
      trustScore: r.trust_score ?? undefined,
    }))
  } catch {
    return MOCK_JOBS
  }
}

export default async function JobsPage() {
  const jobs = await getJobs()

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10" style={{ paddingTop: 96 }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">항공 화물 채용</h1>
        <p className="text-sm text-muted-foreground">{jobs.length}건 등록</p>
      </div>
      <JobFilterList jobs={jobs} />
    </main>
  )
}
