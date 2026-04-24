# 아름 카고 — 코드 품질 기준 및 평가

> 이 문서는 코드 작성 기준과 AI 생성 코드 품질 평가 기준을 정의한다.

---

## 1. 품질 평가 기준

| 항목 | 기준 | 예시 |
|---|---|---|
| **가독성** | 구조·이름 규칙·들여쓰기 | `data1` → `newsArticle` |
| **재사용성** | 중복 제거, 컴포넌트화 | `<Card />` 공통화 |
| **유지보수성** | 변경 영향 최소화 | props 타입 체계화 |
| **일관성** | CSS·네이밍 규칙 통일 | `kebab-case.tsx` 파일명 |
| **성능** | 불필요한 렌더링 최소화 | `React.memo`, `useMemo` |

---

## 2. 네이밍 규칙

```
파일명:         kebab-case.tsx         (news-card.tsx)
컴포넌트 export: PascalCase             (NewsCard)
훅:             use + PascalCase       (useNewsFilter)
API 클라이언트: camelCase              (naverNewsClient)
상수:           UPPER_SNAKE_CASE       (CARGO_EXCLUDE_RE)
타입/인터페이스: PascalCase            (NewsArticle, JobPost)
CSS 변수:       --arum-{name}         (--arum-navy)
```

---

## 3. 컴포넌트 작성 규칙

### Server vs Client
```typescript
// Server Component (기본 — 'use client' 없이)
// 데이터 fetch, 정적 렌더에 사용
export default async function NewsPage() { ... }

// Client Component ('use client' 필수 — 상태/이벤트 필요 시만)
'use client'
export function SubscribeModal() { ... }
```

### Props 타입 명시 필수
```typescript
// ❌ 금지
function JobCard({ job }: any) { ... }

// ✅ 권장
interface JobCardProps {
  job: JobPost
  className?: string
}
function JobCard({ job, className }: JobCardProps) { ... }
```

### 외부 API 호출 위치
```
✅ src/lib/api/        — 외부 API 클라이언트 (서버사이드 only)
✅ src/app/api/        — Next.js API Route
❌ src/components/     — 클라이언트에서 직접 fetch 금지
❌ src/app/(pages)/    — 페이지 컴포넌트에서 직접 fetch 금지 (API Route 경유)
```

---

## 4. Tailwind CSS 규칙

```
토큰 사용:      arum.* 토큰 우선 (bg-arum-navy, text-arum-sky-500)
raion.* 금지:   v0.2 잔재 — 신규 코드 사용 금지
임의 값 제한:   [#hex] 직접 입력 금지, 토큰 미정의 시 tailwind.config에 추가
cn() 사용:      조건부 클래스는 반드시 cn() 유틸리티 경유
```

---

## 5. 현재 코드 평가 (Phase 2 셋업 완료 시점)

### `src/lib/utils.ts`
```
가독성:   ★★★★★  — cn() 단일 함수, 명확
재사용성: ★★★★★  — 전역 공유
유지보수: ★★★★★  — 변경 불필요
```

### `src/components/ui/button.tsx`
```
가독성:   ★★★★☆  — cva 패턴 명확, variant 정의 길지만 구조적
재사용성: ★★★★★  — variant/size props 체계 완비
유지보수: ★★★☆☆  — @base-ui/react 의존성 비표준 (shadcn 기본은 @radix-ui)
일관성:   ★★★☆☆  — 다른 shadcn 컴포넌트와 기반 라이브러리 불일치 가능성
개선안:   Phase 3 전 npx shadcn@latest add button 으로 재생성 권장
```

### `src/app/layout.tsx`
```
가독성:   ★★★★★  — 수정 후 불필요한 중복 폰트 제거됨
유지보수: ★★★★★  — 메타데이터 한국어 + lang=ko 설정 완료
```

### `tailwind.config.ts`
```
가독성:   ★★★★★  — arum.* 토큰 명확히 정의
일관성:   ★★★★☆  — shadcn CSS 변수(background/foreground)와 arum.* 토큰 공존
개선안:   globals.css에서 arum.* CSS 변수를 shadcn 변수에 매핑 필요
```

---

## 6. 리팩토링 체크리스트 (Phase 3 시작 전)

- [ ] `globals.css` — Geist 기본 변수 제거, `arum.*` CSS 변수 완성
- [ ] `button.tsx` — shadcn 표준(`@radix-ui`)으로 재생성
- [ ] `app/page.tsx` — Next.js 기본 템플릿 제거, LandingPage 교체
- [ ] shadcn 컴포넌트 추가: `input`, `dialog`, `sheet`, `toast`, `badge`, `tooltip`, `card`

---

## 7. AI 생성 코드 평가 프롬프트 (참고)

Firebase Studio / Cursor 등으로 생성된 코드 평가 시 사용:

```
Evaluate the code quality based on readability, reusability, and maintainability.
Focus on: naming conventions, component hierarchy, prop types, server/client boundary.
```

컴포넌트 트리 시각화:
```
Draw me a component tree of this project. Use mermaid chart.
```

중복 제거:
```
Find repetitive patterns and suggest reusable component patterns.
```
