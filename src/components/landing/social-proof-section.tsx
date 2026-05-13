'use client'

import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const CARGO_PARTNERS = [
  'Pantos', 'CJ대한통운', 'DHL', 'FedEx', '대한항공 카고',
  '아시아나 카고', '한진', '롯데글로벌로지스', '세방항공',
  '카고룩스코리아', '스위스포트', 'SATS', '에어인천', '제주항공 카고',
]

const logoContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.3 } },
}
const logoItemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}
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
    <section className="py-24 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
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

          {/* Logo wall */}
          <motion.div variants={fadeUpVariants}>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              파트너 기업
            </p>
            <motion.div
              variants={logoContainerVariants}
              className="flex flex-wrap gap-3"
            >
              {CARGO_PARTNERS.map((name) => (
                <motion.span
                  key={name}
                  variants={logoItemVariants}
                  className="inline-flex rounded-sm border border-border bg-card px-5 py-2 text-base font-medium text-muted-foreground transition-all duration-300 hover:border-[var(--arum-sky)]/40 hover:text-foreground"
                >
                  {name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
