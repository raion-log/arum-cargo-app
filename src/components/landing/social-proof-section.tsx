'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CARGO_PARTNERS = [
  { name: 'Pantos',           color: '#E31837' },
  { name: 'CJ대한통운',       color: '#D40511' },
  { name: 'DHL',              color: '#FFCC00', text: '#1a1a1a' },
  { name: 'FedEx',            color: '#4D148C' },
  { name: '대한항공 카고',    color: '#003087' },
  { name: '아시아나 카고',    color: '#C0392B' },
  { name: '한진',             color: '#1E3A8A' },
  { name: '롯데글로벌로지스', color: '#ED1C24' },
  { name: '세방항공',         color: '#1E40AF' },
  { name: '카고룩스코리아',   color: '#1E3A8A' },
  { name: '스위스포트',       color: '#00205B' },
  { name: 'SATS',             color: '#003087' },
  { name: '에어인천',         color: '#1D4ED8' },
  { name: '제주항공 카고',    color: '#F97316' },
]

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function SocialProofSection() {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v: number) => Math.round(v))
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      animate(count, 482, { duration: 1.8, ease: 'easeOut' })
    }
  }, [inView, count])

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section header */}
          <motion.div variants={fadeUpVariants} className="mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--arum-sky)] mb-3">
              Community
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              함께하는 업계 사람들
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
              className="h-[3px] bg-[var(--arum-sky)] rounded-full mt-3"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUpVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <motion.span className="text-6xl font-bold font-display text-foreground tabular-nums">
                  {rounded}
                </motion.span>
                <span className="text-3xl font-semibold text-foreground pb-1">명</span>
              </div>
              <p className="text-base text-muted-foreground">현재 구독자 수</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold font-display text-foreground">68</span>
                <span className="text-3xl font-semibold text-foreground pb-1">%</span>
              </div>
              <p className="text-base text-muted-foreground">4주 유지율</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <span className="text-6xl font-bold font-display text-foreground">14</span>
                <span className="text-3xl font-semibold text-foreground pb-1">개사</span>
              </div>
              <p className="text-base text-muted-foreground">채용 파트너</p>
            </div>
          </motion.div>

          {/* 파트너 기업 레이블 */}
          <motion.p
            variants={fadeUpVariants}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6"
          >
            파트너 기업
          </motion.p>
        </motion.div>
      </div>

      {/* Full-width marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="marquee-track py-2">
          {[...CARGO_PARTNERS, ...CARGO_PARTNERS].map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center bg-white rounded-lg px-5 py-3 mx-2 shadow-sm border border-gray-100"
              style={{ borderLeft: `3px solid ${p.color}` }}
            >
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: p.text ?? '#1a1a1a' }}
              >
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
