-- ============================================================
-- 아름 카고 (Arum Cargo) — Phase 5 MVP 초기 스키마
-- 기반: arum-aviation-hub/docs/prd/03-data-model.md v0.3
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- 한글 전문 검색

-- ─── Enums ──────────────────────────────────────────────────
create type subscription_status as enum (
  'pending_verification', 'active', 'unsubscribed', 'bounced'
);

create type news_category as enum (
  'freight_market',   -- 운임·시황
  'airline',          -- 항공사
  'airport_infra',    -- 공항·인프라
  'regulation',       -- 규제·정책
  'global',           -- 글로벌
  'uncategorized'
);

create type editor_pick_tone as enum (
  'observation',  -- 관찰
  'action',       -- 액션
  'background'    -- 배경
);

create type cargo_job_category as enum (
  'sales_offer',      -- 영업·오퍼
  'customs',          -- 통관·수출입
  'intl_logistics',   -- 국제물류
  'airport_resident', -- 공항상주
  'other_cargo'       -- 기타카고
);

create type employment_type as enum (
  'full_time', 'contract', 'intern', 'part_time'
);

create type job_source_type as enum (
  'worknet', 'saramin', 'manual', 'partner'
);

create type news_source_type as enum (
  'naver_news', 'rss', 'manual'
);

-- ─── Tables ─────────────────────────────────────────────────

-- 구독자
create table subscribers (
  id                uuid primary key default uuid_generate_v4(),
  email             text not null unique,
  status            subscription_status not null default 'pending_verification',
  verification_token text unique,
  verified_at       timestamptz,
  unsubscribe_token text unique default encode(gen_random_bytes(32), 'hex'),
  categories        news_category[] not null default array['freight_market','airline','airport_infra','regulation','global','uncategorized']::news_category[],
  last_active_at    timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 구독 이벤트 로그 (13개월 보존 — 정보통신망법)
create table subscription_events (
  id          uuid primary key default uuid_generate_v4(),
  subscriber_id uuid references subscribers(id) on delete set null,
  email       text not null,
  event_type  text not null, -- subscribed, verified, unsubscribed, bounced, resubscribed
  metadata    jsonb,
  occurred_at timestamptz not null default now()
);

-- 뉴스 기사
create table news_articles (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title           text not null,
  summary_ko      text,           -- 한글 요약 2~3문장
  source_name     text not null,
  source_url      text not null,
  source_type     news_source_type not null default 'naver_news',
  category        news_category not null default 'uncategorized',
  published_at    timestamptz not null,
  is_approved     boolean not null default false,
  is_editor_pick  boolean not null default false,
  editor_comment  text check (char_length(editor_comment) <= 140),
  editor_tone     editor_pick_tone,
  ingest_hash     text unique,    -- 중복 방지
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 뉴스 클릭 이벤트
create table news_clicks (
  id          uuid primary key default uuid_generate_v4(),
  article_id  uuid not null references news_articles(id) on delete cascade,
  referrer    text,
  clicked_at  timestamptz not null default now()
);

-- 채용 공고
create table job_posts (
  id              uuid primary key default uuid_generate_v4(),
  slug            text not null unique,
  title           text not null,
  company_name    text not null,
  company_logo_url text,
  description_summary text,
  source_url      text not null,
  source_type     job_source_type not null default 'worknet',
  job_category    cargo_job_category not null default 'other_cargo',
  employment_type employment_type not null default 'full_time',
  location        text,
  career_min_years int,
  career_max_years int,
  deadline_at     timestamptz,
  trust_score     int check (trust_score between 1 and 5),
  is_approved     boolean not null default false,
  is_archived     boolean not null default false,
  ingest_hash     text unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 채용 클릭 이벤트
create table job_clicks (
  id        uuid primary key default uuid_generate_v4(),
  job_id    uuid not null references job_posts(id) on delete cascade,
  referrer  text,
  clicked_at timestamptz not null default now()
);

-- 주요 화물사 공식 채용 딥링크 (14개사 시드 데이터)
create table cargo_career_links (
  id          uuid primary key default uuid_generate_v4(),
  company_name text not null,
  career_url  text not null,
  logo_url    text,
  display_order int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- 항공 화물 용어 사전
create table aviation_glossary (
  id          uuid primary key default uuid_generate_v4(),
  term        text not null unique,  -- AWB, ULD 등
  full_name   text not null,         -- Air Waybill
  definition_ko text not null,       -- 한글 정의
  example_ko  text,                  -- 사용 예시
  created_at  timestamptz not null default now()
);

-- 일일 다이제스트
create table daily_digests (
  id              uuid primary key default uuid_generate_v4(),
  digest_date     date not null unique,
  article_ids     uuid[] not null default '{}',
  job_ids         uuid[] not null default '{}',
  editor_pick_id  uuid references news_articles(id),
  sent_at         timestamptz,
  recipient_count int,
  open_count      int,
  click_count     int,
  created_at      timestamptz not null default now()
);

-- 이메일 이벤트 (Loops.so webhook)
create table email_events (
  id              uuid primary key default uuid_generate_v4(),
  subscriber_id   uuid references subscribers(id) on delete set null,
  email           text not null,
  event_type      text not null, -- sent, opened, clicked, bounced, unsubscribed
  digest_id       uuid references daily_digests(id),
  metadata        jsonb,
  occurred_at     timestamptz not null default now()
);

-- ingest 로그
create table ingest_logs (
  id          uuid primary key default uuid_generate_v4(),
  source_type text not null,
  keyword     text,
  fetched     int not null default 0,
  inserted    int not null default 0,
  skipped     int not null default 0,
  errors      int not null default 0,
  error_detail jsonb,
  ran_at      timestamptz not null default now()
);

-- 관리자 (Magic Link 화이트리스트)
create table admin_users (
  id      uuid primary key default uuid_generate_v4(),
  email   text not null unique,
  role    text not null default 'editor', -- editor | super_admin
  created_at timestamptz not null default now()
);

-- ─── Indexes ────────────────────────────────────────────────
create index idx_news_articles_published_at on news_articles(published_at desc);
create index idx_news_articles_category on news_articles(category);
create index idx_news_articles_is_approved on news_articles(is_approved);
create index idx_news_articles_is_editor_pick on news_articles(is_editor_pick);
create index idx_job_posts_deadline on job_posts(deadline_at);
create index idx_job_posts_category on job_posts(job_category);
create index idx_job_posts_is_approved on job_posts(is_approved);
create index idx_subscribers_email on subscribers(email);
create index idx_subscribers_status on subscribers(status);
create index idx_subscription_events_occurred on subscription_events(occurred_at);

-- ─── Triggers ───────────────────────────────────────────────

-- updated_at 자동 갱신
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_subscribers_updated_at
  before update on subscribers
  for each row execute function set_updated_at();

create trigger trg_news_articles_updated_at
  before update on news_articles
  for each row execute function set_updated_at();

create trigger trg_job_posts_updated_at
  before update on job_posts
  for each row execute function set_updated_at();

-- 마감 지난 채용 공고 자동 아카이브
create or replace function auto_archive_expired_jobs()
returns trigger language plpgsql as $$
begin
  if new.deadline_at is not null and new.deadline_at < now() then
    new.is_archived = true;
  end if;
  return new;
end;
$$;

create trigger trg_job_auto_archive
  before insert or update on job_posts
  for each row execute function auto_archive_expired_jobs();

-- 비카고 직군 공고 차단 (DB 레벨 이중 방어)
create or replace function block_non_cargo_titles()
returns trigger language plpgsql as $$
begin
  if new.title ~* '승무원|객실|조종사|부기장|항공정비|정비사|기장' then
    raise exception 'Non-cargo job title blocked: %', new.title;
  end if;
  return new;
end;
$$;

create trigger trg_block_non_cargo
  before insert or update on job_posts
  for each row execute function block_non_cargo_titles();

-- ─── RLS ────────────────────────────────────────────────────
alter table subscribers enable row level security;
alter table subscription_events enable row level security;
alter table news_articles enable row level security;
alter table news_clicks enable row level security;
alter table job_posts enable row level security;
alter table job_clicks enable row level security;
alter table cargo_career_links enable row level security;
alter table aviation_glossary enable row level security;
alter table daily_digests enable row level security;
alter table email_events enable row level security;
alter table ingest_logs enable row level security;
alter table admin_users enable row level security;

-- 공개 읽기 (승인된 기사·공고·용어·딥링크)
create policy "public_read_approved_news" on news_articles
  for select using (is_approved = true);

create policy "public_read_approved_jobs" on job_posts
  for select using (is_approved = true and is_archived = false);

create policy "public_read_glossary" on aviation_glossary
  for select using (true);

create policy "public_read_cargo_links" on cargo_career_links
  for select using (is_active = true);

-- 서비스 롤(service_role)만 전체 접근 (API Route에서 사용)
create policy "service_role_all_subscribers" on subscribers
  for all using (auth.role() = 'service_role');

create policy "service_role_all_events" on subscription_events
  for all using (auth.role() = 'service_role');

create policy "service_role_all_news" on news_articles
  for all using (auth.role() = 'service_role');

create policy "service_role_all_jobs" on job_posts
  for all using (auth.role() = 'service_role');

create policy "service_role_all_digests" on daily_digests
  for all using (auth.role() = 'service_role');

create policy "service_role_all_ingest" on ingest_logs
  for all using (auth.role() = 'service_role');

create policy "service_role_all_admin" on admin_users
  for all using (auth.role() = 'service_role');

-- ─── Seed Data ──────────────────────────────────────────────

-- 주요 화물사 공식 채용 딥링크 14개사
insert into cargo_career_links (company_name, career_url, display_order) values
  ('대한항공 카고',   'https://recruit.koreanair.com',       1),
  ('아시아나카고',   'https://recruit.flyasiana.com',        2),
  ('에어인천',       'https://recruit.airincheon.com',       3),
  ('제주항공',       'https://recruit.jejuair.net',          4),
  ('진에어',         'https://recruit.jinair.com',           5),
  ('팬택스',         'https://www.pantos.com/kr/careers',    6),
  ('CJ대한통운',     'https://recruit.cjlogistics.com',      7),
  ('현대글로비스',   'https://recruit.hyundai-glovis.net',   8),
  ('롯데글로벌로지스', 'https://recruit.lotteglogis.com',    9),
  ('한진',           'https://recruit.hanjin.co.kr',        10),
  ('삼성SDS',        'https://sds.samsung.com/global/recruit', 11),
  ('SK네트웍스',     'https://www.sknetworks.co.kr/recruit', 12),
  ('인터지스',       'https://www.intergis.co.kr/careers',  13),
  ('세방',           'https://www.sebang.com/recruit',       14);

-- 항공 화물 기초 용어 (주요 10개)
insert into aviation_glossary (term, full_name, definition_ko, example_ko) values
  ('AWB',  'Air Waybill',              '항공화물운송장. 화물 운송 계약서이자 영수증.',        'AWB 번호로 화물 추적이 가능하다.'),
  ('ULD',  'Unit Load Device',         '단위 적재용기. 항공기 내부에 맞게 설계된 컨테이너·팔레트.', 'ULD 1개에 최대 1,600kg을 적재한다.'),
  ('MAWB', 'Master Air Waybill',       '콘솔사가 항공사에 발행하는 마스터 운송장.',          'MAWB 하나에 다수의 HAWB가 포함된다.'),
  ('HAWB', 'House Air Waybill',        '포워더가 화주에게 발행하는 하우스 운송장.',           'HAWB로 개별 화주의 화물을 추적한다.'),
  ('TAC',  'The Air Cargo Tariff',     'IATA 기준 항공 화물 운임 지수.',                    'TAC Index가 상승하면 운임이 오른다.'),
  ('Belly', 'Belly Cargo',             '여객기 하부 화물칸(Lower Deck)을 활용한 화물 운송.',  'Belly로 소형 전자제품을 운송했다.'),
  ('Freighter', 'All-Cargo Aircraft',  '화물 전용 항공기.',                                 'B747F 프리이터가 인천에 착륙했다.'),
  ('Consolidator', 'Cargo Consolidator', '여러 화주 화물을 모아 ULD 단위로 혼재하는 업체(콘솔사).', '콘솔사를 통해 운임을 절약했다.'),
  ('Forwarder', 'Freight Forwarder',   '화주와 항공사 사이에서 운송을 주선하는 업체(포워더).', '포워더가 통관 서류를 준비했다.'),
  ('DG',   'Dangerous Goods',          '위험물. IATA DGR 규정에 따라 별도 신고 및 포장 필요.', 'DG 화물은 전용 ULD에 적재해야 한다.');
