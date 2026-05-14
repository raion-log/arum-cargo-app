export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 pt-[88px] pb-20">
      <h1 className="text-3xl font-bold mb-2">이용약관</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 5월</p>
      <div className="space-y-6 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">제1조 (목적)</h2>
          <p>본 약관은 아름 카고(이하 &ldquo;서비스&rdquo;)가 제공하는 뉴스레터 및 채용 정보 서비스 이용에 관한 조건을 규정합니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">제2조 (서비스 내용)</h2>
          <p>서비스는 항공 화물 업계 뉴스 큐레이션 및 채용 공고를 무료로 제공합니다. 뉴스 원문 저작권은 각 언론사에 있으며, 서비스는 제목·요약·링크만 제공합니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">제3조 (이용자의 의무)</h2>
          <p>이용자는 타인의 이메일로 구독 신청을 하거나 서비스를 영리 목적으로 무단 재배포할 수 없습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">제4조 (면책)</h2>
          <p>서비스가 제공하는 정보는 참고용이며, 채용·투자 결정에 대한 책임은 이용자 본인에게 있습니다.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">제5조 (문의)</h2>
          <p><a href="mailto:raion.log@gmail.com" className="text-[var(--arum-sky)] hover:underline">raion.log@gmail.com</a></p>
        </section>
      </div>
    </main>
  )
}
