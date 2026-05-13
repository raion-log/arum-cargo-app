'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const STEPS = [
  { n: '01', title: '구독', desc: '이메일만 입력하면\n즉시 시작됩니다' },
  { n: '02', title: '에디터 선별', desc: '현직자가 매일\n뉴스 5건 큐레이션' },
  { n: '03', title: '07:00 발송', desc: 'KST 오전 7시\n정각에 발송' },
  { n: '04', title: '5분 브리핑', desc: '출근 전 5분으로\n업계 흐름 파악 완료' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function WorkflowSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="py-24 px-4 bg-[var(--arum-ink)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section header */}
          <motion.div variants={stepVariants} className="mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--arum-sky)] mb-3">
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-3">
              어떻게 받아보나요?
            </h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
              className="h-[3px] bg-[var(--arum-sky)] rounded-full"
            />
            <p className="mt-4 text-lg text-white/50">매일 아침, 딱 4단계</p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {STEPS.map((step, i) => (
              <motion.div key={step.n} variants={stepVariants} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-0 border-t-2 border-dashed border-white/12" />
                )}
                <div className="flex flex-col gap-5">
                  <div className="h-16 w-16 rounded-xl bg-[var(--arum-sky)] flex items-center justify-center font-display font-bold text-white text-xl shadow-[0_0_20px_rgba(30,144,255,0.35)]">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-base text-white/50 leading-relaxed whitespace-pre-line">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

    </section>
  )
}
