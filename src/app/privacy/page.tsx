export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 pt-[88px] pb-20">
      <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 5월</p>
      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. 수집하는 개인정보 항목</h2>
          <p>뉴스레터 구독 시 이메일 주소를 수집합니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. 개인정보 이용 목적</h2>
          <p>수집한 이메일 주소는 뉴스레터 발송 목적으로만 사용됩니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. 보유 및 이용 기간</h2>
          <p>구독 해지 요청 시 즉시 삭제합니다. 구독 이벤트 기록은 13개월 보관 후 삭제합니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. 수신거부</h2>
          <p>매 이메일 하단의 수신거부 링크를 클릭하거나 <a href="mailto:raion.log@gmail.com" className="text-[var(--arum-sky)] hover:underline">raion.log@gmail.com</a>으로 요청하시면 즉시 처리됩니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">5. 문의</h2>
          <p><a href="mailto:raion.log@gmail.com" className="text-[var(--arum-sky)] hover:underline">raion.log@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}
