'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { JobCard } from '@/components/jobs/job-card'
import type { JobPost, CargoJobCategory } from '@/components/jobs/job-card'

const JOB_FILTERS: { value: CargoJobCategory | 'all'; label: string }[] = [
  { value: 'all',             label: '전체' },
  { value: 'sales_offer',     label: '영업·오퍼' },
  { value: 'customs',         label: '통관·수출입' },
  { value: 'intl_logistics',  label: '국제물류' },
  { value: 'airport_resident', label: '공항상주' },
  { value: 'other_cargo',     label: '기타카고' },
]

const CAREER_LEVELS = [
  { value: 'all',  label: '전체', min: null, max: null },
  { value: 'entry', label: '신입',  min: 0, max: 0 },
  { value: '1-2',  label: '1~2년', min: 1, max: 2 },
  { value: '3-5',  label: '3~5년', min: 3, max: 5 },
  { value: '6-10', label: '6~10년', min: 6, max: 10 },
  { value: '10+',  label: '10년+', min: 10, max: null },
]

const DEADLINE_OPTIONS = [
  { value: 'all', label: '전체', days: null },
  { value: '3d',  label: '3일 내', days: 3 },
  { value: '7d',  label: '7일 내', days: 7 },
  { value: '14d', label: '14일 내', days: 14 },
]

const CAREER_LINKS = [
  { name: '대한항공 카고',     href: 'https://recruit.koreanair.com' },
  { name: '아시아나카고',      href: 'https://www.flyasiana.com' },
  { name: '에어인천',         href: 'https://www.airincheon.com' },
  { name: '제주항공',         href: 'https://recruit.jejuair.net' },
  { name: '판토스',           href: 'https://www.pantos.com' },
  { name: 'CJ대한통운',       href: 'https://recruit.cjlogistics.com' },
  { name: '현대글로비스',      href: 'https://www.hyundai-glovis.net' },
  { name: '롯데글로벌로지스',  href: 'https://www.lotteglogis.com' },
]

type CareerValue = 'all' | 'entry' | '1-2' | '3-5' | '6-10' | '10+'
type DeadlineValue = 'all' | '3d' | '7d' | '14d'

function SidebarBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${
        active
          ? 'bg-[var(--arum-sky)]/10 text-[var(--arum-sky)] font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      {children}
    </button>
  )
}

export function JobFilterList({ jobs }: { jobs: JobPost[] }) {
  const [category, setCategory] = useState<CargoJobCategory | 'all'>('all')
  const [career, setCareer]     = useState<CareerValue>('all')
  const [deadline, setDeadline] = useState<DeadlineValue>('all')

  const now = Date.now()

  const filtered = jobs.filter((job) => {
    if (category !== 'all' && job.jobCategory !== category) return false

    if (career !== 'all') {
      const lvl = CAREER_LEVELS.find((l) => l.value === career)!
      const min = job.careerMinYears ?? 0
      if (lvl.min !== null && min < lvl.min) return false
      if (lvl.max !== null && min > lvl.max) return false
    }

    if (deadline !== 'all' && job.deadlineAt) {
      const opt = DEADLINE_OPTIONS.find((d) => d.value === deadline)!
      if (opt.days !== null) {
        const dl = new Date(job.deadlineAt).getTime()
        if (dl - now > opt.days * 86_400_000) return false
      }
    }

    return true
  })

  return (
    <div className="flex gap-6">
      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:block w-48 flex-shrink-0">
        <div className="rounded-xl border border-border bg-card p-4 sticky top-20">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">카고 직군</p>
          <div className="flex flex-col gap-0.5">
            {JOB_FILTERS.map(({ value, label }) => (
              <SidebarBtn key={value} active={category === value} onClick={() => setCategory(value as CargoJobCategory | 'all')}>
                {label}
              </SidebarBtn>
            ))}
          </div>

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-2">경력</p>
          <div className="flex flex-col gap-0.5">
            {CAREER_LEVELS.map(({ value, label }) => (
              <SidebarBtn key={value} active={career === value} onClick={() => setCareer(value as CareerValue)}>
                {label}
              </SidebarBtn>
            ))}
          </div>

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-5 mb-2">마감</p>
          <div className="flex flex-col gap-0.5">
            {DEADLINE_OPTIONS.map(({ value, label }) => (
              <SidebarBtn key={value} active={deadline === value} onClick={() => setDeadline(value as DeadlineValue)}>
                {label}
              </SidebarBtn>
            ))}
          </div>
        </div>
      </aside>

      {/* 공고 목록 */}
      <div className="flex-1 min-w-0">
        {/* 모바일 chips */}
        <div className="flex gap-2 flex-wrap mb-4 lg:hidden">
          {JOB_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCategory(value as CargoJobCategory | 'all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === value
                  ? 'bg-[var(--arum-sky)] text-white border-[var(--arum-sky)]'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">
            조건에 맞는 공고가 없습니다.
          </p>
        )}

        {/* 공식 채용 딥링크 */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">주요 화물사 공식 채용 바로가기</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CAREER_LINKS.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground hover:border-[var(--arum-sky)] hover:text-[var(--arum-sky)] transition-colors"
              >
                {name} <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
