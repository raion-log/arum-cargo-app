import { JobCard } from '@/components/jobs/job-card'
import type { JobPost, CargoJobCategory } from '@/components/jobs/job-card'
import { ExternalLink } from 'lucide-react'

const JOB_FILTERS: { value: CargoJobCategory | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'sales_offer', label: '영업·오퍼' },
  { value: 'customs', label: '통관·수출입' },
  { value: 'intl_logistics', label: '국제물류' },
  { value: 'airport_resident', label: '공항상주' },
  { value: 'other_cargo', label: '기타카고' },
]

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

const CAREER_LINKS = [
  '대한항공 카고', '아시아나카고', '에어인천', '제주항공',
  '판토스', 'CJ대한통운', '현대글로비스', '롯데글로벌로지스',
]

export default function JobsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-10" style={{ paddingTop: 96 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">항공 화물 채용</h1>
          <p className="text-sm text-muted-foreground">{MOCK_JOBS.length}건 등록</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 필터 사이드바 */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="rounded-xl border border-border bg-card p-4 sticky top-20">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">카고 직군</p>
            <div className="flex flex-col gap-1">
              {JOB_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  className={`text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
                    value === 'all'
                      ? 'bg-[var(--arum-sky)]/10 text-[var(--arum-sky)] font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-3">경력</p>
            {['신입', '1~2년', '3~5년', '6~10년', '10년+'].map((level) => (
              <button key={level} className="block w-full text-left text-sm px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                {level}
              </button>
            ))}

            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-3">마감</p>
            {['3일 내', '7일 내', '14일 내', '전체'].map((d) => (
              <button key={d} className="block w-full text-left text-sm px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                {d}
              </button>
            ))}
          </div>
        </aside>

        {/* 공고 목록 */}
        <div className="flex-1">
          {/* 모바일 필터 chips */}
          <div className="flex gap-2 flex-wrap mb-4 lg:hidden">
            {JOB_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  value === 'all'
                    ? 'bg-[var(--arum-sky)] text-white border-[var(--arum-sky)]'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* 공식 채용 딥링크 */}
          <div className="mt-10">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">주요 화물사 공식 채용 바로가기</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CAREER_LINKS.map((name) => (
                <a
                  key={name}
                  href="#"
                  className="flex items-center justify-between gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:border-[var(--arum-sky)] hover:text-[var(--arum-sky)] transition-colors"
                >
                  {name} <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
