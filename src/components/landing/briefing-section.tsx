'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const EDITOR_PICK = {
  title: '인천공항 화물 처리량, 1분기 전년 대비 12% 증가…항공사 화물기 증편 검토',
  summaryKo: '인천국제공항공사가 발표한 2026년 1분기 화물 통계에 따르면 총 처리량이 전년 동기 대비 12.3% 증가한 것으로 나타났다. 대한항공과 아시아나항공은 추가 화물기 노선 증편을 검토 중이며, 이커머스 물량 급증이 주요 원인으로 분석됐다.',
  sourceName: '항공화물신문',
  sourceUrl: '#',
  editorComment: '이커머스 수요가 화물 처리량을 끌어올리고 있다. 항공사 증편은 단기 운임 상승 압력으로 이어질 가능성이 높다.',
}

const NEWS_ITEMS = [
  { id: '2', title: 'TAC Index 상하이발 유럽 노선 운임 3주 연속 상승세', sourceName: 'The Loadstar', category: '화물시장' },
  { id: '3', title: '대한항공, 인천~LA 화물 전용 노선 주 4회로 증편', sourceName: '항공뉴스', category: '항공사' },
  { id: '4', title: '관세청, 특송화물 전자상거래 목록통관 한도 상향 검토', sourceName: '세관뉴스', category: '규제·정책' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function BriefingSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--arum-sky)] mb-3">
            Today&apos;s Brief
          </p>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                오늘의 브리핑
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
                className="h-[3px] bg-[var(--arum-sky)] rounded-full mt-3"
              />
            </div>
            <Link
              href="/news"
              className="flex items-center gap-1.5 text-base font-medium text-[var(--arum-sky)] hover:underline mt-2"
            >
              전체 뉴스 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            11년차 현직자가 오늘 고른 뉴스 · 매일 07:00 발송
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col gap-6"
        >
          {/* Editor Pick */}
          <motion.div variants={itemVariants}>
            <div className="rounded-xl border border-border bg-card p-8 lg:p-10 transition-all duration-300 hover:border-[var(--arum-sky)]/30 hover:shadow-[0_0_28px_rgba(30,144,255,0.10)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex rounded-sm bg-[var(--arum-sky)] px-3 py-1 text-xs font-bold text-white tracking-wide uppercase">
                  에디터 PICK
                </span>
                <span className="text-sm text-muted-foreground">관찰</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug mb-4">
                {EDITOR_PICK.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                {EDITOR_PICK.summaryKo}
              </p>
              <div className="border-l-4 border-[var(--arum-sky)] pl-5 mb-6">
                <p className="text-base text-foreground font-medium leading-relaxed italic">
                  &ldquo;{EDITOR_PICK.editorComment}&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{EDITOR_PICK.sourceName}</span>
                <a
                  href={EDITOR_PICK.sourceUrl}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--arum-sky)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  원문 보기 <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* News cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEWS_ITEMS.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <div className="rounded-xl border border-border bg-card p-6 h-full flex flex-col justify-between gap-4 transition-all duration-300 hover:border-[var(--arum-sky)]/30 hover:shadow-[0_0_24px_rgba(30,144,255,0.10)]">
                  <div>
                    <span className="inline-flex rounded-sm bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 mb-3 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h4 className="text-base font-semibold text-foreground leading-snug">
                      {item.title}
                    </h4>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.sourceName}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}
