'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Newspaper, Briefcase, Clock, Loader2, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const BENEFITS = [
  { icon: Newspaper, text: '카고 뉴스 5건 큐레이션' },
  { icon: Briefcase, text: '화물 직군 채용 공고' },
  { icon: Clock,     text: '매일 07:00 KST 발송' },
]

/* 레이더 장식 — 오른쪽 하단 */
function RadarDecor() {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{ right: -60, bottom: -60, width: 420, height: 420, opacity: 0.1 }}
      aria-hidden
    >
      {[1, 0.72, 0.46, 0.24].map((s, i) => (
        <div key={i} className="absolute rounded-full border border-[var(--arum-sky)]"
          style={{ width: `${s*100}%`, height: `${s*100}%`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      ))}
      <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-[var(--arum-sky)]" /></div>
      <div className="absolute inset-0 flex justify-center"><div className="w-px h-full bg-[var(--arum-sky)]" /></div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(30,144,255,0.65) 10%, rgba(30,144,255,0.1) 20%, transparent 21%)' }}
      />
    </div>
  )
}

export function HeroSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message ?? '구독 신청 완료!')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error ?? '오류가 발생했습니다. 다시 시도해주세요.')
      }
    } catch {
      setStatus('error')
      setMessage('네트워크 오류가 발생했습니다.')
    }
  }

  return (
    <section
      className="relative overflow-hidden bg-[var(--arum-ink)]"
      style={{ paddingTop: 64 /* fixed header */ }}
    >
      {/* Scan lines */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.016) 3px, rgba(255,255,255,0.016) 4px)' }}
        aria-hidden />

      {/* Tech grid — right half only */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 50%, black 0%, transparent 60%)',
        }}
        aria-hidden />

      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="arum-blob absolute -top-20 -left-10 h-[400px] w-[400px] rounded-full bg-[var(--arum-blob-sky)] opacity-[0.13] blur-[100px]" />
        <div className="arum-blob absolute top-0 right-0 h-[350px] w-[350px] rounded-full bg-[var(--arum-blob-blue)] opacity-[0.08] blur-[90px]" style={{ animationDelay: '4s' }} />
      </div>

      <RadarDecor />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-14 pb-16 flex flex-col items-center text-center">

        {/* Persona badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4, ease: 'easeOut' as const }}
          className="inline-flex items-center gap-2 mb-5 rounded-sm border border-white/15 bg-white/5 px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/70">
            똑똑한 카고인들의 업계 정보 모으는 방법
          </span>
        </motion.div>

        {/* Headline — one line */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' as const }}
          className="font-bold leading-[1.15] text-white mb-4 text-[2.2rem] sm:text-[3rem] lg:text-[3.8rem]"
        >
          <span className="block">카고 업계 주도하는 사람들의</span>
          <span className="block text-[var(--arum-sky)]">공통된 아침 5분 루틴</span>
        </motion.h1>

        {/* One-liner */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease: 'easeOut' as const }}
          className="text-lg text-white/55 mb-8 max-w-xl"
        >
          현직자가 직접 고른 뉴스 5건과 채용 공고를 매일 07:00에 보내드립니다.
        </motion.p>

        {/* What's inside */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5, ease: 'easeOut' as const }}
          className="flex items-center justify-center gap-8 mb-9"
        >
          {BENEFITS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-base text-white/55">
              <Icon className="h-4 w-4 text-[var(--arum-sky)] flex-shrink-0" />
              {text}
            </div>
          ))}
        </motion.div>

        {/* Subscribe form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.5, ease: 'easeOut' as const }}
          className="w-full max-w-xl"
        >
          <form id="subscribe" onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
              placeholder="이메일 주소를 입력하세요"
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 rounded-md border border-white/15 px-5 py-4 text-base text-white placeholder:text-white/35 outline-none transition-all disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.07)', fontSize: 16 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1E90FF'; e.currentTarget.style.boxShadow = '0 0 14px rgba(30,144,255,0.25)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="group relative overflow-hidden rounded-md px-8 py-4 text-base font-semibold text-white whitespace-nowrap transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: status === 'success' ? '#10b981' : '#1E90FF' }}
              onMouseEnter={e => { if (status !== 'loading' && status !== 'success') (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(30,144,255,0.45)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <span className="absolute inset-0 translate-y-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative flex items-center gap-2">
                {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === 'success' && <CheckCircle2 className="h-4 w-4" />}
                {status === 'loading' ? '처리 중...' : status === 'success' ? '구독 완료!' : '무료 구독하기'}
              </span>
            </button>
          </form>

          {/* 상태 메시지 */}
          {message && (
            <p className={`text-sm mb-3 text-center ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-sm text-white/30">482명 구독 중 · 무료 · 언제든 수신거부</span>
            <Link href="/news" className="text-sm text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
              뉴스 먼저 보기 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
