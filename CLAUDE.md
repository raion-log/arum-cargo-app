# 아름 카고 App (`arum-cargo-app`) — 구현 레포

> SW 구현 전용 레포. 기획·전략·wiki는 `arum-aviation-hub` 참조.
> **Workbase**: `/Users/raion/Downloads/dev/arum-aviation-hub/`

## 스택

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (`arum.*` 토큰) + shadcn/ui
- Framer Motion + tailwindcss-animate + react-intersection-observer
- Supabase (DB + Auth), Loops.so (이메일), Vercel (배포)

## 폴더 구조

```
src/
  app/           # Next.js App Router 페이지
    news/        # 뉴스 피드
    jobs/        # 채용 공고
    admin/       # 관리자 대시보드 (Magic Link 보호)
    about/
    privacy/
    terms/
  components/
    ui/          # shadcn/ui 컴포넌트
    layout/      # Header, Footer 등 레이아웃
    news/        # 뉴스 관련 컴포넌트
    jobs/        # 채용 관련 컴포넌트
    admin/       # 관리자 전용 컴포넌트
  lib/
    api/         # 외부 API 클라이언트 (서버사이드 전용)
    utils/       # 공용 유틸리티
```

## 네이밍 규칙

- 파일명: `kebab-case.tsx`
- 컴포넌트 export: `PascalCase`
- 외부 API는 반드시 `src/lib/api/` 또는 `src/app/api/`에서만 호출 (클라이언트 직접 fetch 금지)
- 관리자 라우트: `/admin/*`, 미들웨어로 보호

## Tailwind 토큰

- `arum.navy` — 메인 다크 배경
- `arum.sky` — 주요 액션 색상
- `arum.cargo` — 강조 오렌지
- `arum.slate` — 보조 텍스트
- `arum.mist` — 라이트 배경
- `raion.*` 토큰 사용 금지 (v0.2 잔재)

## 보안 규칙

- API 키 커밋 금지 (`.env.local`만 사용)
- 관리자 라우트: Magic Link + `admin_users` 화이트리스트
- 뉴스 원문 저장/재배포 금지 (제목 + 요약 + 링크만)
