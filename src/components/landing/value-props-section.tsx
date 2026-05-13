'use client'

import { Eye, AlarmClock, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { LucideIcon } from 'lucide-react'

const PROPS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Eye,
    title: '11년차 현직자 큐레이션',
    desc: '이론이 아닌 현장의 시선으로 선별한 뉴스. 매일 수십 개 중 5건만 고릅니다.',
  },
  {
    icon: AlarmClock,
    title: '매일 07:00 5분 브리핑',
    desc: '출근 전 5분, 오늘의 화물 업계 흐름을 파악하세요. 놓치면 하루가 늦습니다.',
  },
  {
    icon: Package,
    title: '카고 채용만 모은 허브',
    desc: '승무원·정비사 없이, 화물 직군(영업·통관·오퍼·공항상주)만 정리합니다.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export function ValuePropsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            왜 아름 카고인가요?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            항공 화물 업계에서 일하거나 들어오려는 사람을 위한 가장 빠른 정보 루트
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROPS.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
                <Icon className="h-5 w-5 text-[var(--arum-sky)]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
