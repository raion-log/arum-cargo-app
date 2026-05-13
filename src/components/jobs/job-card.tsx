import Link from 'next/link'
import { MapPin, ExternalLink, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { differenceInDays } from 'date-fns'

export type CargoJobCategory =
  | 'sales_offer' | 'customs' | 'intl_logistics'
  | 'airport_resident' | 'other_cargo'

export interface JobPost {
  id: string
  title: string
  companyName: string
  companyLogoUrl?: string
  sourceUrl: string
  jobCategory: CargoJobCategory
  employmentType: string
  location?: string
  careerMinYears?: number
  careerMaxYears?: number
  deadlineAt?: string
  trustScore?: number
}

const JOB_CATEGORY_LABELS: Record<CargoJobCategory, string> = {
  sales_offer: '영업·오퍼',
  customs: '통관·수출입',
  intl_logistics: '국제물류',
  airport_resident: '공항상주',
  other_cargo: '기타카고',
}

function DeadlineBadge({ deadline }: { deadline?: string }) {
  if (!deadline) return null
  const daysLeft = differenceInDays(new Date(deadline), new Date())
  if (daysLeft < 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">마감</span>

  const isUrgent = daysLeft <= 3
  return (
    <span
      className={cn(
        'text-xs px-2 py-0.5 rounded-full font-medium',
        isUrgent
          ? 'bg-red-100 text-red-600 deadline-urgent'
          : daysLeft <= 7
          ? 'bg-orange-100 text-orange-600'
          : 'bg-green-100 text-green-600'
      )}
    >
      D-{daysLeft}
    </span>
  )
}

function TrustScore({ score }: { score?: number }) {
  if (!score) return null
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={cn('text-xs', i < score ? 'text-yellow-400' : 'text-gray-200')}>★</span>
      ))}
    </div>
  )
}

export function JobCard({ job }: { job: JobPost }) {
  const careerLabel =
    job.careerMinYears != null && job.careerMaxYears != null
      ? `${job.careerMinYears}~${job.careerMaxYears}년`
      : job.careerMinYears != null
      ? `${job.careerMinYears}년+`
      : '경력무관'

  return (
    <article className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
            {job.companyLogoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={job.companyLogoUrl} alt={job.companyName} className="h-6 w-6 object-contain" />
              : <Building2 className="h-4 w-4 text-muted-foreground" />
            }
          </div>
          <span className="text-xs text-muted-foreground">{job.companyName}</span>
        </div>
        <DeadlineBadge deadline={job.deadlineAt} />
      </div>

      <h3 className="font-semibold text-sm leading-snug mb-2">{job.title}</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
          {JOB_CATEGORY_LABELS[job.jobCategory]}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{careerLabel}</span>
        {job.location && (
          <span className="text-xs flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />{job.location}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <TrustScore score={job.trustScore} />
        <Link
          href={job.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--arum-sky)] hover:underline"
        >
          공고 보기 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </article>
  )
}
