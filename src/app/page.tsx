import { HeroSection } from '@/components/landing/hero-section'
import { BriefingSection } from '@/components/landing/briefing-section'
import { JobsPreviewSection } from '@/components/landing/jobs-preview-section'
import { WhyArumSection } from '@/components/landing/why-arum-section'
import { WorkflowSection } from '@/components/landing/workflow-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'

/* 섹션 배경색 (globals.css 토큰에서 추출) */
const INK  = '#0A1628'  /* --arum-ink  */
const MIST = '#F0F4F8'  /* --background */
const PALE = 'hsl(210,20%,91%)' /* bg-muted/30 영역 근사값 */

function SectionDivider({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden
      style={{ height: 80, background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  )
}

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      {/* dark → light */}
      <SectionDivider from={INK} to={MIST} />
      <BriefingSection />
      {/* light → light (mist ≈ pale, subtle) */}
      <JobsPreviewSection />
      {/* light → dark */}
      <SectionDivider from={PALE} to={INK} />
      <WhyArumSection />
      <WorkflowSection />
      {/* dark → light */}
      <SectionDivider from={INK} to={MIST} />
      <SocialProofSection />
    </main>
  )
}
