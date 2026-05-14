export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 pt-[88px] pb-20">
      <h1 className="text-3xl font-bold mb-4">아름 카고 소개</h1>
      <p className="text-muted-foreground leading-relaxed mb-6">
        아름 카고는 항공 화물 업계 현직자가 직접 운영하는 뉴스레터 & 채용 허브입니다.
      </p>
      <div className="space-y-6 text-base text-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">만든 이유</h2>
          <p className="text-muted-foreground">
            11년간 항공 화물 업계에서 일하면서 취업·이직·업계 흐름 파악이 얼마나 어려운지 직접 경험했습니다.
            흩어진 정보를 매일 아침 5분으로 정리해 드립니다.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">무엇을 드리나요</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>현직자가 직접 고른 카고 뉴스 5건 (매일 07:00 KST)</li>
            <li>항공 화물 직군 채용 공고만 모아서</li>
            <li>무료 · 언제든 수신거부 가능</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">연락처</h2>
          <p className="text-muted-foreground">
            문의: <a href="mailto:uvengersuvengers@gmail.com" className="text-[var(--arum-sky)] hover:underline">uvengersuvengers@gmail.com</a>
          </p>
        </section>
      </div>
    </main>
  )
}
