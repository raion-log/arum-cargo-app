# 아름 카고 (Arum Cargo) — SW 구현 레포

> 항공 화물 업계 현직자가 매일 아침 정리해주는 업계 뉴스 + 채용 허브  
> UI 프로토타이핑 기반 문서: `arum-aviation-hub/ui-proto-plan/arum-cargo-ui-proto-v0.2.md`  
> 기획·전략·SRS: [arum-aviation-hub](https://github.com/raion-log/arum-cargo)

---

## 기술 스택

| 레이어 | 선택 |
|---|---|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 스타일 | Tailwind CSS (`arum.*` 토큰) + shadcn/ui |
| 폰트 | Space Grotesk (헤드라인) + JetBrains Mono (코드·AWB) |
| 모션 | Framer Motion + tailwindcss-animate + react-intersection-observer |
| 아이콘 | lucide-react |
| 날짜 | date-fns |
| DB + Auth | Supabase (Magic Link + admin_users 화이트리스트) |
| 이메일 | Loops.so (MVP 무료 티어) |
| 번역 | Gemini 1.5 Flash (Provider-Agnostic facade) |
| 배포 | Vercel Hobby (`arumcargo.vercel.app`) |

---

## 프로젝트 구조

```
src/
  app/              # Next.js App Router 페이지
  components/
    layout/         # SiteHeader, SiteFooter, MobileDrawer
    news/           # NewsCard, EditorPickBanner, AviationTerm
    jobs/           # JobCard, JobFilters, DeadlineBadge
    admin/          # AdminMetricCard, 승인 큐
    ui/             # shadcn/ui 컴포넌트
  lib/
    api/            # 외부 API 클라이언트 (서버사이드 전용)
    supabase/       # Supabase 클라이언트
    utils/          # 공용 유틸리티
supabase/
  migrations/       # DB 스키마 마이그레이션 SQL
docs/
  USER_WORKFLOW.md      # UX 핵심 시나리오
  COMPONENT_STRUCTURE.md # 컴포넌트 계층 구조 + 분석
  CODE_QUALITY.md        # 코드 품질 기준 + 평가
```

---

## 로컬 개발 시작

```bash
npm install
cp .env.example .env.local
# .env.local에 키 입력 후:
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

---

## DB 스키마 적용 (Supabase)

Supabase 프로젝트 생성 후:

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

또는 Supabase 대시보드 SQL Editor에서 직접 실행:
`supabase/migrations/001_initial_schema.sql`

---

## 환경 변수

`.env.example` 참조. **`.env.local`은 절대 커밋 금지.**

---

## 개발 문서

| 문서 | 내용 |
|---|---|
| [docs/USER_WORKFLOW.md](docs/USER_WORKFLOW.md) | UX 핵심 시나리오 (A1 정하늘·C1 이지훈) |
| [docs/COMPONENT_STRUCTURE.md](docs/COMPONENT_STRUCTURE.md) | 컴포넌트 계층 Mermaid 차트 + 구현 순서 |
| [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md) | 코드 품질 기준 + 현재 상태 평가 |
| [CLAUDE.md](CLAUDE.md) | AI 에이전트 작업 규칙 |

---

## 현재 단계

- [x] Phase 2: Next.js 셋업 — shadcn/ui + `arum.*` 토큰 + 폴더 구조 + DB 스키마
- [ ] Phase 3: UI (Mock 데이터) — Bento + Parallax Hero + 뉴스/채용 피드
- [ ] Phase 4: 외부 API 연동 — 카고 뉴스·채용 ingest
- [ ] Phase 5: Supabase + Loops.so + 관리자 대시보드 🏁 MVP

---

## 타겟 사용자

- **A1 정하늘** — 항공물류 취준생: 카고 직군 공식 채용 + 업계 감 습득
- **C1 이지훈** — 3년차 콘솔사 영업: 출근길 5분 뉴스 다이제스트
