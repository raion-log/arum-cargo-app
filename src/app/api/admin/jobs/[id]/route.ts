import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }
  const { action } = await req.json()
  const supabase = createServerClient()

  if (action === 'approve') {
    await supabase.from('job_posts').update({ is_approved: true }).eq('id', params.id)
  } else if (action === 'archive') {
    await supabase.from('job_posts').update({ is_archived: true }).eq('id', params.id)
  }

  return NextResponse.json({ ok: true })
}
