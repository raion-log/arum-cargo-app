'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Bell, Eye, Briefcase, TrendingUp, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const CARD_W = 256
const CARD_H = 272

interface Card {
  id: number
  icon: LucideIcon
  tag: string
  title: string
  desc: string
  accent: string
}

const CARDS: Card[] = [
  {
    id: 1, icon: Bell, tag: 'DAILY BRIEF',
    title: '매일 아침 5분 브리핑',
    desc: '출근 전 오전 7시, 오늘 알아야 할 항공 화물 뉴스 5건이 도착합니다.',
    accent: '#1E90FF',
  },
  {
    id: 2, icon: Eye, tag: 'CURATED',
    title: '11년차 현직자의 시선',
    desc: '단순 스크랩이 아닌, 현장을 아는 에디터가 맥락과 함께 해설합니다.',
    accent: '#38BDF8',
  },
  {
    id: 3, icon: Briefcase, tag: 'CARGO JOBS',
    title: '화물 직군 채용만 선별',
    desc: '영업·오퍼·통관·공항상주. 카고 직군만 모아서 매주 업데이트합니다.',
    accent: '#818CF8',
  },
  {
    id: 4, icon: TrendingUp, tag: 'MARKET PULSE',
    title: '운임·물동량 주간 트렌드',
    desc: 'TAC Index 기반 운임 동향과 주간 물동량 요약을 한눈에.',
    accent: '#34D399',
  },
  {
    id: 5, icon: Building2, tag: 'NETWORK',
    title: '14개사 카고 파트너',
    desc: '판토스·DHL·대한항공 카고 등 국내 주요 화물사 채용을 직접 연결합니다.',
    accent: '#FBBF24',
  },
]

const N = CARDS.length

function wrappedOffset(i: number, active: number) {
  let off = i - active
  if (off > Math.floor(N / 2)) off -= N
  if (off < -Math.floor(N / 2)) off += N
  return off
}

export function FeatureCarousel() {
  const [active, setActive] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  function resetTimer() {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => setActive(p => (p + 1) % N), 3800)
  }

  useEffect(() => {
    resetTimer()
    return () => { if (timer.current) clearInterval(timer.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goPrev = () => { setActive(p => (p - 1 + N) % N); resetTimer() }
  const goNext = () => { setActive(p => (p + 1) % N); resetTimer() }

  return (
    <section className="bg-[var(--arum-ink)] py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[var(--arum-sky)] uppercase mb-3">
            What We Do
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            아름 카고가 하는 일
          </h2>
        </div>

        {/* 3D Stage — perspective wrapper */}
        <div
          className="relative"
          style={{
            perspective: '1200px',
            height: `${CARD_H + 40}px`,
          }}
        >
          {CARDS.map((card, i) => {
            const off = wrappedOffset(i, active)
            const abs = Math.abs(off)
            if (abs > 2) return null

            const isCenter = off === 0
            const x = off * 295
            const rotateY = off * -46
            const scale = 1 - abs * 0.16
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.66 : 0.32
            const zIndex = 20 - abs * 5

            return (
              <motion.div
                key={card.id}
                initial={false}
                animate={{ x, rotateY, scale, opacity }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => { if (!isCenter) { setActive(i); resetTimer() } }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: `${-CARD_W / 2}px`,
                  marginTop: `${-CARD_H / 2}px`,
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  zIndex,
                  cursor: isCenter ? 'default' : 'pointer',
                  userSelect: 'none',
                }}
              >
                <div
                  className="rounded-2xl p-6 h-full flex flex-col justify-between"
                  style={{
                    background: isCenter
                      ? `linear-gradient(145deg, ${card.accent}1a 0%, rgba(255,255,255,0.06) 100%)`
                      : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
                    border: `1px solid ${isCenter ? `${card.accent}55` : 'rgba(255,255,255,0.10)'}`,
                    boxShadow: isCenter
                      ? `0 0 80px ${card.accent}2a, 0 24px 64px rgba(0,0,0,0.55)`
                      : '0 8px 32px rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {/* Top row: tag + icon */}
                  <div className="flex items-start justify-between">
                    <span
                      className="text-[10px] font-bold tracking-[0.18em] mt-0.5"
                      style={{ color: card.accent }}
                    >
                      {card.tag}
                    </span>
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.accent}22` }}
                    >
                      <card.icon className="h-4 w-4" style={{ color: card.accent }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-white font-semibold text-[15px] leading-snug mb-2">
                      {card.title}
                    </h3>
                    <p className="text-white/45 text-xs leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="h-0.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${card.accent}cc, transparent)`,
                      opacity: isCenter ? 1 : 0.35,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goPrev}
            className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); resetTimer() }}
                aria-label={`${i + 1}번`}
                className="rounded-full transition-all duration-300"
                style={{
                  height: '4px',
                  width: i === active ? '22px' : '4px',
                  background: i === active ? 'var(--arum-sky)' : 'rgba(255,255,255,0.22)',
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </section>
  )
}
