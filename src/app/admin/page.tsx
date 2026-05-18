import { createServerClient } from '@/lib/supabase'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

async function getData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { pendingNews: [], pendingJobs: [], stats: null, logs: [] }
  }
  try {
    const sb = createServerClient()
    const [newsRes, jobsRes, statsRes, logsRes] = await Promise.all([
      sb.from('news_articles').select('id,title,source_name,category,published_at,source_url')
        .eq('is_approved', false).order('published_at', { ascending: false }).limit(20),
      sb.from('job_posts').select('id,title,company_name,job_category,deadline_at,source_url')
        .eq('is_approved', false).eq('is_archived', false).order('created_at', { ascending: false }).limit(20),
      sb.from('subscribers').select('status', { count: 'exact', head: false }),
      sb.from('ingest_logs').select('*').order('ran_at', { ascending: false }).limit(10),
    ])
    const total = statsRes.data?.length ?? 0
    const active = statsRes.data?.filter((s) => s.status === 'active').length ?? 0
    return {
      pendingNews: newsRes.data ?? [],
      pendingJobs: jobsRes.data ?? [],
      stats: { total, active, pending: total - active },
      logs: logsRes.data ?? [],
    }
  } catch {
    return { pendingNews: [], pendingJobs: [], stats: null, logs: [] }
  }
}

export default async function AdminPage() {
  const data = await getData()
  const isConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: 96 }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">관리자 대시보드</h1>
        <p className="text-sm text-muted-foreground">
          {isConfigured ? 'Supabase 연동됨' : 'Supabase 미연동 — .env.local 설정 필요'}
        </p>
      </div>
      <AdminDashboard {...data} isConfigured={isConfigured} />
    </main>
  )
}
