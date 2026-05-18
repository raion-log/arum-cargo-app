'use client'

import { useState } from 'react'
import { NewsCard, EditorPickBanner } from '@/components/news/news-card'
import type { NewsArticle, NewsCategory } from '@/components/news/news-card'

const CATEGORIES: { value: NewsCategory | 'all'; label: string }[] = [
  { value: 'all',           label: '전체' },
  { value: 'freight_market', label: '운임·시황' },
  { value: 'airline',        label: '항공사' },
  { value: 'airport_infra',  label: '공항·인프라' },
  { value: 'regulation',     label: '규제·정책' },
  { value: 'global',         label: '글로벌' },
]

export function NewsFilterList({ articles }: { articles: NewsArticle[] }) {
  const [active, setActive] = useState<NewsCategory | 'all'>('all')

  const filtered = active === 'all' ? articles : articles.filter((a) => a.category === active)
  const editorPick = filtered.find((a) => a.isEditorPick)
  const rest = filtered.filter((a) => !a.isEditorPick)

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              active === value
                ? 'bg-[var(--arum-sky)] text-white border-[var(--arum-sky)]'
                : 'border-border text-muted-foreground hover:border-[var(--arum-sky)] hover:text-[var(--arum-sky)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {editorPick && <EditorPickBanner article={editorPick} />}

      <div className="flex flex-col gap-3">
        {rest.length > 0 ? (
          rest.map((article) => <NewsCard key={article.id} article={article} />)
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">
            해당 카테고리의 뉴스가 없습니다.
          </p>
        )}
      </div>
    </>
  )
}
