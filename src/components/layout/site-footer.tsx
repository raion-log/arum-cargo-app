import Link from 'next/link'
import { Plane } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[var(--arum-ink)] text-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-4 w-4 text-[var(--arum-sky)]" />
              <span className="font-display font-semibold text-white">아름 카고</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              본 서비스의 뉴스 요약은 원문 링크를 제공하며<br />
              원문 전재·재배포를 하지 않습니다.<br />
              작성자: 11년차 항공 화물 현직자 (익명)
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <Link href="/unsubscribe" className="hover:text-white transition-colors">수신거부</Link>
          </nav>
        </div>

        <p className="mt-8 text-xs text-white/40">
          © 2026 아름 카고. 본 서비스는 정보 제공 목적으로만 운영됩니다.
        </p>
      </div>
    </footer>
  )
}
