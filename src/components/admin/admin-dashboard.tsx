'use client'

import { useState } from 'react'
import { ExternalLink, CheckCircle2, Archive, RefreshCw } from 'lucide-react'

type PendingNews = { id: string; title: string; source_name: string; category: string; published_at: string; source_url: string }
type PendingJob  = { id: string; title: string; company_name: string; job_category: string; deadline_at: string | null; source_url: string }
type IngestLog  = { id: string; source_type: string; fetched: number; inserted: number; skipped: number; errors: number; ran_at: string }

interface Props {
  pendingNews: PendingNews[]
  pendingJobs: PendingJob[]
  stats: { total: number; active: number; pending: number } | null
  logs: IngestLog[]
  isConfigured: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  freight_market: '운임·시황', airline: '항공사', airport_infra: '공항·인프라',
  regulation: '규제·정책', global: '글로벌', uncategorized: '미분류',
  sales_offer: '영업·오퍼', customs: '통관·수출입', intl_logistics: '국제물류',
  airport_resident: '공항상주', other_cargo: '기타카고',
}

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

function useApproval(type: 'news' | 'jobs') {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<string | null>(null)

  async function act(id: string, action: 'approve' | 'archive') {
    setLoading(id)
    try {
      await fetch(`/api/admin/${type}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
      setDone((prev) => { const next = new Set(prev); next.add(id); return next })
    } finally {
      setLoading(null)
    }
  }
  return { done, loading, act }
}

function NewsRow({ item, onAct, loading }: { item: PendingNews; onAct: (action: 'approve' | 'archive') => void; loading: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <a href={item.source_url} target="_blank" rel="noopener noreferrer"
          className="text-sm font-medium hover:text-[var(--arum-sky)] flex items-start gap-1 group">
          <span className="line-clamp-2">{item.title}</span>
          <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
        </a>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.source_name} · {CATEGORY_LABELS[item.category] ?? item.category} · {new Date(item.published_at).toLocaleDateString('ko-KR')}
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button disabled={loading} onClick={() => onAct('approve')}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors">
          <CheckCircle2 className="h-3.5 w-3.5" /> 승인
        </button>
        <button disabled={loading} onClick={() => onAct('archive')}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors">
          <Archive className="h-3.5 w-3.5" /> 보류
        </button>
      </div>
    </div>
  )
}

function JobRow({ item, onAct, loading }: { item: PendingJob; onAct: (action: 'approve' | 'archive') => void; loading: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <a href={item.source_url} target="_blank" rel="noopener noreferrer"
          className="text-sm font-medium hover:text-[var(--arum-sky)] flex items-start gap-1 group">
          <span className="line-clamp-1">{item.title}</span>
          <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
        </a>
        <p className="text-xs text-muted-foreground mt-0.5">
          {item.company_name} · {CATEGORY_LABELS[item.job_category] ?? item.job_category}
          {item.deadline_at ? ` · ~${new Date(item.deadline_at).toLocaleDateString('ko-KR')}` : ''}
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button disabled={loading} onClick={() => onAct('approve')}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors">
          <CheckCircle2 className="h-3.5 w-3.5" /> 승인
        </button>
        <button disabled={loading} onClick={() => onAct('archive')}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50 transition-colors">
          <Archive className="h-3.5 w-3.5" /> 보류
        </button>
      </div>
    </div>
  )
}

export function AdminDashboard({ pendingNews, pendingJobs, stats, logs, isConfigured }: Props) {
  const [tab, setTab] = useState<'news' | 'jobs' | 'logs'>('news')
  const newsApproval = useApproval('news')
  const jobsApproval = useApproval('jobs')

  const [ingestLoading, setIngestLoading] = useState<string | null>(null)
  async function triggerIngest(type: 'news' | 'jobs') {
    setIngestLoading(type)
    try {
      await fetch(`/api/${type}/ingest`, {
        method: 'POST',
        headers: { 'x-cron-secret': '' },
      })
    } finally {
      setIngestLoading(null)
    }
  }

  if (!isConfigured) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-base font-semibold mb-2">Supabase 연동 필요</p>
        <p className="text-sm text-muted-foreground mb-4">
          <code className="bg-muted px-1 py-0.5 rounded text-xs">.env.local</code>에 아래 키를 추가하면 실데이터가 연결됩니다.
        </p>
        <pre className="text-left text-xs bg-muted rounded-lg p-4 inline-block">
{`NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=`}
        </pre>
      </div>
    )
  }

  const visibleNews = pendingNews.filter((n) => !newsApproval.done.has(n.id))
  const visibleJobs = pendingJobs.filter((j) => !jobsApproval.done.has(j.id))

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="전체 구독자" value={stats?.total ?? 0} />
        <StatCard label="활성 구독자" value={stats?.active ?? 0} />
        <StatCard label="뉴스 승인 대기" value={visibleNews.length} />
        <StatCard label="채용 승인 대기" value={visibleJobs.length} />
      </div>

      {/* Ingest 수동 트리거 */}
      <div className="flex gap-3 flex-wrap">
        <button
          disabled={ingestLoading === 'news'}
          onClick={() => triggerIngest('news')}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-[var(--arum-sky)] hover:text-[var(--arum-sky)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${ingestLoading === 'news' ? 'animate-spin' : ''}`} />
          뉴스 ingest 실행
        </button>
        <button
          disabled={ingestLoading === 'jobs'}
          onClick={() => triggerIngest('jobs')}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:border-[var(--arum-sky)] hover:text-[var(--arum-sky)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${ingestLoading === 'jobs' ? 'animate-spin' : ''}`} />
          채용 ingest 실행
        </button>
      </div>

      {/* 탭 */}
      <div>
        <div className="flex gap-1 border-b border-border mb-4">
          {(['news', 'jobs', 'logs'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? 'border-[var(--arum-sky)] text-[var(--arum-sky)]' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              {t === 'news' ? `뉴스 (${visibleNews.length})` : t === 'jobs' ? `채용 (${visibleJobs.length})` : 'Ingest 로그'}
            </button>
          ))}
        </div>

        {tab === 'news' && (
          <div className="rounded-xl border border-border bg-card p-4">
            {visibleNews.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">대기 중인 뉴스가 없습니다.</p>
            ) : (
              visibleNews.map((item) => (
                <NewsRow key={item.id} item={item}
                  loading={newsApproval.loading === item.id}
                  onAct={(action) => newsApproval.act(item.id, action)} />
              ))
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="rounded-xl border border-border bg-card p-4">
            {visibleJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">대기 중인 채용 공고가 없습니다.</p>
            ) : (
              visibleJobs.map((item) => (
                <JobRow key={item.id} item={item}
                  loading={jobsApproval.loading === item.id}
                  onAct={(action) => jobsApproval.act(item.id, action)} />
              ))
            )}
          </div>
        )}

        {tab === 'logs' && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['소스', '수집', '저장', '스킵', '오류', '실행 시각'].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-6 text-sm">로그가 없습니다.</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t border-border">
                      <td className="px-4 py-2.5 font-mono text-xs">{log.source_type}</td>
                      <td className="px-4 py-2.5 tabular-nums">{log.fetched}</td>
                      <td className="px-4 py-2.5 tabular-nums text-emerald-600">{log.inserted}</td>
                      <td className="px-4 py-2.5 tabular-nums text-muted-foreground">{log.skipped}</td>
                      <td className="px-4 py-2.5 tabular-nums text-red-500">{log.errors}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(log.ran_at).toLocaleString('ko-KR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
