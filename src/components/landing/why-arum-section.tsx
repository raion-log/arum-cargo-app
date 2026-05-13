'use client'

import { Eye, AlarmClock, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import type { LucideIcon } from 'lucide-react'

const FEATURES: { icon: LucideIcon; accent: string; title: string; desc: string }[] = [
  {
    icon: Eye,
    accent: '#1E90FF',
    title: '현직자 큐레이션',
    desc: '이론이 아닌 현장의 시선으로 선별한 뉴스. 매일 수십 개 중 5건만 고릅니다. 기사 뒤의 맥락까지 에디터 코멘트로 제공합니다.',
  },
  {
    icon: AlarmClock,
    accent: '#34D399',
    title: '매일 07:00 5분 브리핑',
    desc: '출근 전 5분, 오늘의 화물 업계 흐름을 파악하세요. 바쁜 업무 시작 전에 가장 중요한 정보만 담아 발송합니다.',
  },
  {
    icon: Package,
    accent: '#818CF8',
    title: '카고 채용만 모은 허브',
    desc: '승무원·정비사 없이, 영업·오퍼·통관·공항상주 화물 직군만 정리합니다. 취준생도 현직자도 이직에 바로 활용할 수 있습니다.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function WhyArumSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="py-24 px-4 bg-[var(--arum-ink)]">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--arum-sky)] mb-3">
            Why Arum Cargo
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            왜 아름 카고인가요?
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
            className="h-[3px] bg-[var(--arum-sky)] rounded-full mt-3"
          />
          <p className="mt-4 text-lg text-white/50">
            항공 화물 업계에서 일하거나 들어오려는 사람을 위한 가장 빠른 정보 루트
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {FEATURES.map(({ icon: Icon, accent, title, desc }) => (
            <motion.div key={title} variants={itemVariants}>
              <div
                className="rounded-xl p-8 h-full flex flex-col gap-6 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, ${accent}12 0%, rgba(255,255,255,0.04) 100%)`,
                  border: `1px solid ${accent}25`,
                  boxShadow: 'none',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${accent}20`; (e.currentTarget as HTMLElement).style.borderColor = `${accent}45` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = `${accent}25` }}
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: accent }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-base text-white/55 leading-relaxed">{desc}</p>
                </div>
                <div
                  className="h-[2px] rounded-full mt-auto"
                  style={{ background: `linear-gradient(90deg, ${accent}70, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
