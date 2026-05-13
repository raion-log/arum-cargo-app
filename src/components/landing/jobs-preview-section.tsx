'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { JobCard } from '@/components/jobs/job-card'
import type { JobPost } from '@/components/jobs/job-card'

const JOBS: JobPost[] = [
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

export function JobsPreviewSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="mx-auto max-w-6xl">

        {/* Section header */}
        <div className="mb-14">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--arum-sky)] mb-3">
            Cargo Jobs
          </p>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
                이번 주 카고 채용
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
              href="/jobs"
              className="flex items-center gap-1.5 text-base font-medium text-[var(--arum-sky)] hover:underline mt-2"
            >
              전체 채용 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-lg text-muted-foreground">
            승무원·정비사 없이 항공 화물 직군만 — 영업·오퍼·통관·공항상주
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {JOBS.map((job) => (
            <motion.div key={job.id} variants={itemVariants}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' as const }}
          className="mt-10 text-center"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-md border-2 border-[var(--arum-sky)] px-8 py-3.5 text-base font-semibold text-[var(--arum-sky)] hover:bg-[var(--arum-sky)] hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(30,144,255,0.35)]"
          >
            모든 카고 채용 보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>

    </section>
  )
}
