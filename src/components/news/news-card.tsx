import Link from 'next/link'
import { ExternalLink, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NewsCategory =
  | 'freight_market' | 'airline' | 'airport_infra'
  | 'regulation' | 'global' | 'uncategorized'

export interface NewsArticle {
  id: string
  title: string
  summaryKo: string
  sourceName: string
  sourceUrl: string
  category: NewsCategory
  publishedAt: string
  isEditorPick?: boolean
  editorComment?: string
  editorTone?: 'observation' | 'action' | 'background'
}

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  freight_market: '운임·시황',
  airline: '항공사',
  airport_infra: '공항·인프라',
  regulation: '규제·정책',
  global: '글로벌',
  uncategorized: '기타',
}

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  freight_market: 'bg-blue-100 text-blue-700',
  airline: 'bg-sky-100 text-sky-700',
  airport_infra: 'bg-indigo-100 text-indigo-700',
  regulation: 'bg-purple-100 text-purple-700',
  global: 'bg-teal-100 text-teal-700',
  uncategorized: 'bg-gray-100 text-gray-600',
}

const TONE_LABELS = {
  observation: '관찰',
  action: '액션',
  background: '배경',
}

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', CATEGORY_COLORS[article.category])}>
          {CATEGORY_LABELS[article.category]}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(article.publishedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3">{article.summaryKo}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{article.sourceName}</span>
        <Link
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--arum-sky)] hover:underline"
        >
          원문 보기 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </article>
  )
}

export function EditorPickBanner({ article }: { article: NewsArticle }) {
  if (!article.isEditorPick) return null

  return (
    <div className="rounded-xl border-l-4 border-[var(--arum-sky)] bg-sky-50 p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-[var(--arum-sky)] uppercase tracking-wide">에디터 Pick</span>
        {article.editorTone && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">
            {TONE_LABELS[article.editorTone]}
          </span>
        )}
      </div>
      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{article.title}</h3>
      {article.editorComment && (
        <p className="text-sm text-foreground/80 leading-relaxed mb-2">{article.editorComment}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{article.sourceName}</span>
        <Link
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-[var(--arum-sky)] hover:underline"
        >
          원문 보기 <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
