'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Plane } from 'lucide-react'

const navLinks = [
  { href: '/news', label: '뉴스' },
  { href: '/jobs', label: '채용' },
  { href: '/about', label: '소개' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: 'background 0.3s, border-color 0.3s',
          background: (!isHome || scrolled) ? 'rgba(10,22,40,0.97)' : 'transparent',
          backdropFilter: (!isHome || scrolled) ? 'blur(12px)' : 'none',
          borderBottom: (!isHome || scrolled) ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <Plane style={{ width: 20, height: 20, color: '#1E90FF' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>Arum</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: '#1E90FF', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Cargo</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = 'white')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.72)')}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <Link
                href="#subscribe"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#1E90FF', color: 'white',
                  padding: '8px 20px', borderRadius: 6,
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}
              >
                구독하기
              </Link>
              <button
                style={{ display: 'none', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 8 }}
                onClick={() => setOpen(true)}
                aria-label="메뉴"
              >
                <Menu style={{ width: 20, height: 20 }} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 260, background: '#0A1628', padding: 24 }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <X style={{ width: 20, height: 20 }} />
            </button>
            <nav style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
