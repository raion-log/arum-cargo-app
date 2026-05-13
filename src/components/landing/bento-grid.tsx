'use client'

import Link from 'next/link'
import { Newspaper, Briefcase, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { EditorPickBanner } from '@/components/news/news-card'
import { JobCard } from '@/components/jobs/job-card'
import type { NewsArticle } from '@/components/news/news-card'
import type { JobPost } from '@/components/jobs/job-card'

const EDITOR_PICK: NewsArticle = {
  id: '1',
  title: '인천공항 화물 처리량, 1분기 전년 대비 12% 증가…항공사 화물기 증편 검토',
  summaryKo:
    '인천국제공항공사가 발표한 2026년 1분기 화물 통계에 따르면 총 처리량이 전년 동기 대비 12.3% 증가한 것으로 나타났다. 대한항공과 아시아나항공은 추가 화물기 노선 증편을 검토 중이며, 이커머스 물량 급증이 주요 원인으로 분석됐다.',
  sourceName: '항공화물신문',
  sourceUrl: '#',
  category: 'freight_market',
  publishedAt: '2026-04-24T07:00:00Z',
  isEditorPick: true,
  editorComment:
    '이커머스 수요가 화물 처리량을 끌어올리고 있다. 항공사 증편은 단기 운임 상승 압력으로 이어질 가능성이 높다.',
  editorTone: 'observation',
}

const NEWS_ITEMS: NewsArticle[] = [
  {
    id: '2',
    title: 'TAC Index 상하이발 유럽 노선 운임 3주 연속 상승세',
    summaryKo:
      'Baltic Air Freight Index 기준 상하이~유럽 구간 항공 운임이 3주 연속 오름세를 기록했다.',
    sourceName: 'The Loadstar',
    sourceUrl: '#',
    category: 'freight_market',
    publishedAt: '2026-04-24T05:30:00Z',
  },
  {
    id: '3',
    title: '대한항공, 인천~LA 화물 전용 노선 주 4회로 증편',
    summaryKo:
      '대한항공 카고는 오는 6월부터 인천~로스앤젤레스 B747F 운항 편수를 주 2회에서 4회로 늘린다고 밝혔다.',
    sourceName: '항공뉴스',
    sourceUrl: '#',
    category: 'airline',
    publishedAt: '2026-04-23T09:00:00Z',
  },
  {
    id: '4',
    title: '관세청, 특송화물 전자상거래 목록통관 한도 상향 검토',
    summaryKo:
      '관세청이 현행 미화 150달러인 특송화물 목록통관 면세 한도를 200달러로 상향하는 방안을 검토 중이다.',
    sourceName: '세관뉴스',
    sourceUrl: '#',
    category: 'regulation',
    publishedAt: '2026-04-23T06:00:00Z',
  },
]

const JOB_SPOTLIGHT: JobPost[] = [
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
    title: 'ULD 관리·운영 담당자',
    companyName: 'DHL',
    sourceUrl: '#',
    jobCategory: 'airport_resident',
    employmentType: 'full_time',
    location: '인천공항(ICN)',
    careerMinYears: 2,
    careerMaxYears: 5,
    deadlineAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    trustScore: 4,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function BentoGrid() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Editor Pick — 50% */}
        <motion.div
          variants={cardVariants}
          animate={inView ? 'visible' : 'hidden'}
          initial="hidden"
          transition={{ delay: 0, duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-border bg-card p-5 h-full">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="h-4 w-4 text-[var(--arum-sky)]" />
              <span className="text-xs font-semibold text-[var(--arum-sky)] uppercase tracking-wide">오늘의 에디터 Pick</span>
            </div>
            <EditorPickBanner article={EDITOR_PICK} />
          </div>
        </motion.div>

        {/* News Stack — 50% */}
        <motion.div
          variants={cardVariants}
          animate={inView ? 'visible' : 'hidden'}
          initial="hidden"
          transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-border bg-card p-4 h-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">최신 뉴스</span>
              <Link href="/news" className="text-xs text-[var(--arum-sky)] hover:underline flex items-center gap-1">
                전체 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {NEWS_ITEMS.map((article) => (
              <div key={article.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                <p className="text-xs font-medium line-clamp-2 mb-1">{article.title}</p>
                <span className="text-xs text-muted-foreground">{article.sourceName}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Job Spotlight — single box, 3 cards */}
        <motion.div
          variants={cardVariants}
          animate={inView ? 'visible' : 'hidden'}
          initial="hidden"
          transition={{ delay: 0.16, duration: 0.4, ease: 'easeOut' }}
          className="lg:col-span-4"
        >
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-[var(--arum-sky)]" />
              <span className="text-sm font-semibold text-foreground">주목 채용</span>
              <Link href="/jobs" className="ml-auto text-xs text-[var(--arum-sky)] hover:underline flex items-center gap-1">
                전체 보기 <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {JOB_SPOTLIGHT.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  )
}
