# 아름 카고 — UX 핵심 시나리오 (User Workflow)

> 기반 문서: `arum-aviation-hub/docs/prd/` (PRD v0.3) · ADR-009 (페르소나 재정렬)

---

## 페르소나 요약

| ID | 이름 | 상태 | 핵심 목표 |
|---|---|---|---|
| **A1** | 정하늘 | 항공물류 4학년 취준생 | 카고 직군 공식 채용 확인 + 업계 감 습득 |
| **C1** | 이지훈 | 3년차 콘솔사 영업·오퍼 | 출근길 5분 뉴스 다이제스트 |
| **C2** | 박서연 | 1년차 카고 신입 | 업계 용어·맥락 학습 |

---

## Workflow 1: 취준생의 채용 탐색 (A1 정하늘 — Primary)

```
[랜딩 /] → Bento Grid Job-Spotlight 눈에 띔
    ↓
[채용 /jobs] 진입
    ↓
필터 설정: 직군(영업·오퍼) + 경력(신입) + 근무지(ICN)
    ↓
JobCard 목록 → D-day 배지 확인 → "공고 보기" 클릭
    ↓
[외부 채용 원문] 이동
    ↓
(재방문 유도) "구독하기" CTA → Subscribe Modal
    ↓
이메일 입력 → 더블 옵트인 → /subscribe/verify 안내
    ↓
인증 메일 클릭 → 구독 완료
```

**핵심 UX 요구사항**
- `/jobs` 링크가 Hero 첫 화면에서 즉시 보여야 함 (Job-Spotlight Bento 셀)
- 카고 직군 필터가 전면에 노출 (승무원·정비사 필터 없음)
- D-3 이하 배지는 red pulse로 긴박감 전달

---

## Workflow 2: 현직자의 아침 뉴스 루틴 (C1 이지훈 — Secondary)

```
[이메일 다이제스트 수신] 07:00 KST
    ↓
에디터 Pick 제목 + 코멘트 확인 → 관심 기사 링크 클릭
    ↓
[뉴스 /news] 진입 (또는 원문 바로 이동)
    ↓
카테고리 필터 "운임·시황" 선택
    ↓
NewsCard 요약 2~3문장 읽기 → AviationTerm 툴팁 hover
    ↓
"원문 보기" 클릭 → 외부 원문
    ↓
(선택) 구독 설정 /subscribe/settings 에서 카테고리 변경
```

**핵심 UX 요구사항**
- 에디터 Pick 코멘트 ≤ 140자, 톤 라벨 명확 ("관찰" / "액션" / "배경")
- 뉴스 요약은 2~3문장으로 제한 (스크롤 최소화)
- 출처 미디어명 반드시 노출 (신뢰성)

---

## Workflow 3: 구독 + 이메일 수신 흐름

```
[구독하기 CTA 클릭] (어느 페이지에서든)
    ↓
Subscribe Modal / Bottom Sheet 열림
    ↓
이메일 입력 + 카테고리 체크 (선택)
    ↓
"구독하기" 제출
    ↓
[/subscribe/verify] 인증 대기 안내
    ↓
이메일 수신 → 인증 링크 클릭
    ↓
구독 완료 Toast: "구독 신청 완료! 인증 메일을 확인해 주세요."
    ↓
[매일 07:00 KST] 다이제스트 이메일 수신 (Loops.so)
    ↓
수신거부 원할 시: 이메일 하단 링크 → [/unsubscribe/:token]
    ↓
원클릭 수신 거부 완료
```

**법적 요구사항 (정보통신망법 제50조)**
- 더블 옵트인 필수 (인증 메일 클릭 전까지 발송 불가)
- 이메일 제목 "(광고)" 접두어 필수
- 야간 21:00~08:00 KST 발송 금지

---

## Workflow 4: 관리자 콘텐츠 승인

```
[/admin] Magic Link 이메일 입력
    ↓
관리자 인증 완료 → [/admin/dashboard] KPI 8카드 확인
    ↓
[/admin/news] 뉴스 승인 큐
    ↓
기사 선택 → 요약 확인 → 승인 또는 반려
    ↓
에디터 Pick 지정 시: 톤 선택 + 코멘트 작성 (≤140자)
    ↓
[/admin/jobs] 채용 승인 큐
    ↓
공고 확인 → 승인 (비카고 직군 시스템 자동 차단)
```

---

## 화면별 진입점 맵

```
/ (랜딩)
├── /news          (뉴스 피드)
│   └── /news/:slug (뉴스 상세, 미구현 Phase 3)
├── /jobs          (채용 피드)
│   └── /jobs/:slug (채용 상세, 미구현 Phase 3)
├── /about         (소개)
├── /subscribe/verify
├── /subscribe/settings/:token
├── /unsubscribe/:token
├── /privacy
├── /terms
└── /admin         (관리자, Magic Link 보호)
    ├── /admin/dashboard
    ├── /admin/news
    └── /admin/jobs
```
