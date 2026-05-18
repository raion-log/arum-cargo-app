import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase'

// Loops.so webhook: https://loops.so/docs/api-reference/webhooks
export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // 서명 검증 (LOOPS_WEBHOOK_SECRET 설정 시)
  const secret = process.env.LOOPS_WEBHOOK_SECRET
  if (secret) {
    const sig = req.headers.get('x-loops-signature') ?? ''
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (sig !== expected) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  const event = JSON.parse(rawBody)
  const email: string = event?.contact?.email ?? event?.data?.email ?? ''
  const type: string = event?.type ?? ''

  if (!email || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true })
  }

  const supabase = createServerClient()

  if (type === 'contactVerified') {
    await supabase
      .from('subscribers')
      .update({ status: 'active', verified_at: new Date().toISOString() })
      .eq('email', email)
    await supabase.from('subscription_events').insert({ email, event_type: 'verified' })
  }

  if (type === 'contactUnsubscribed') {
    await supabase
      .from('subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email)
    await supabase.from('subscription_events').insert({ email, event_type: 'unsubscribed' })
  }

  if (type === 'contactBounced') {
    await supabase
      .from('subscribers')
      .update({ status: 'bounced' })
      .eq('email', email)
    await supabase.from('subscription_events').insert({ email, event_type: 'bounced' })
  }

  return NextResponse.json({ ok: true })
}
