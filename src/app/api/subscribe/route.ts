import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const raw = String(body?.email ?? '').trim().toLowerCase()

  if (!raw || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return NextResponse.json({ error: '유효한 이메일 주소를 입력해주세요.' }, { status: 400 })
  }

  // ── 1. Loops.so 컨택트 추가 ───────────────────────────────
  const loopsKey = process.env.LOOPS_API_KEY
  if (loopsKey) {
    const loopsRes = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${loopsKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: raw, source: 'web', subscribed: true }),
    })
    // 409 = 이미 존재 → 성공으로 처리
    if (!loopsRes.ok && loopsRes.status !== 409) {
      return NextResponse.json(
        { error: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 },
      )
    }
  }

  // ── 2. Supabase 저장 (키가 설정된 경우에만) ──────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient()
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const unsubscribeToken = crypto.randomBytes(32).toString('hex')

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, status')
      .eq('email', raw)
      .single()

    if (!existing) {
      await supabase.from('subscribers').insert({
        email: raw,
        status: 'pending_verification',
        verification_token: verificationToken,
        unsubscribe_token: unsubscribeToken,
      })
      await supabase.from('subscription_events').insert({
        email: raw,
        event_type: 'subscribed',
        metadata: { source: 'web' },
      })
    }
  }

  return NextResponse.json({
    success: true,
    message: '구독 신청 완료! 확인 이메일을 보내드렸습니다.',
  })
}
