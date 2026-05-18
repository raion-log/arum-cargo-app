import { NewsFilterList } from '@/components/news/news-filter-list'
import type { NewsArticle } from '@/components/news/news-card'

const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: '인천공항 화물 처리량, 1분기 전년 대비 12% 증가…항공사 화물기 증편 검토',
    summaryKo:
      '인천국제공항공사가 발표한 2026년 1분기 화물 통계에 따르면 총 처리량이 전년 동기 대비 12.3% 증가한 것으로 나타났다. 대한항공과 아시아나항공은 추가 화물기 노선 증편을 검토 중이며, 이커머스 물량 급증이 주요 원인으로 분석됐다.',
    sourceName: '항공화물신문',
    sourceUrl: '#',
    category: 'freight_market',
    publishedAt: '2026-04-24T07:00:00Z',
    isEditorPick: true,
    editorComment: '이커머스 수요가 화물 처리량을 끌어올리고 있다. 항공사 증편은 단기 운임 상승 압력으로 이어질 가능성이 높다.',
    editorTone: 'observation',
  },
  {
    id: '2',
    title: 'TAC Index 상하이발 유럽 노선 운임 3주 연속 상승세',
    summaryKo:
      'Baltic Air Freight Index 기준 상하이~유럽 구간 항공 운임이 3주 연속 오름세를 기록했다. 전자제품·반도체 물량 증가와 맞물려 Belly 공간 확보 경쟁이 심화되고 있다.',
    sourceName: 'The Loadstar',
    sourceUrl: '#',
    category: 'freight_market',
    publishedAt: '2026-04-24T05:30:00Z',
  },
  {
    id: '3',
    title: '대한항공, 인천~LA 화물 전용 노선 주 4회로 증편',
    summaryKo:
      '대한항공 카고는 오는 6월부터 인천~로스앤젤레스 B747F 운항 편수를 주 2회에서 4회로 늘린다고 밝혔다. 북미향 IT 부품 및 소비재 물량 증가가 배경이다.',
    sourceName: '항공뉴스',
    sourceUrl: '#',
    category: 'airline',
    publishedAt: '2026-04-23T09:00:00Z',
  },
  {
    id: '4',
    title: '관세청, 특송화물 전자상거래 목록통관 한도 상향 검토',
    summaryKo:
      '관세청이 현행 미화 150달러인 특송화물 목록통관 면세 한도를 200달러로 상향하는 방안을 검토 중이다. 이 경우 국내 포워더·콘솔사의 소량 화물 통관 처리 물량이 늘어날 전망이다.',
    sourceName: '세관뉴스',
    sourceUrl: '#',
    category: 'regulation',
    publishedAt: '2026-04-23T06:00:00Z',
  },
  {
    id: '5',
    title: '카타르항공 카고, 인천 취항 편수 확대…주 7회 운항',
    summaryKo:
      '카타르항공 카고가 인천국제공항 취항 편수를 기존 주 5회에서 7회로 확대한다고 발표했다. 중동발 유럽·미주 환적 물량 수요 대응이 주된 목적이다.',
    sourceName: 'Air Cargo News',
    sourceUrl: '#',
    category: 'airline',
    publishedAt: '2026-04-22T10:00:00Z',
  },
  {
    id: '6',
    title: '인천공항 3단계 화물터미널 2027년 완공 목표 재확인',
    summaryKo:
      '인천국제공항공사가 3단계 화물터미널 건설 공정률이 68%에 달했으며 2027년 하반기 완공 목표를 재확인했다. 완공 시 연간 화물 처리 능력이 630만 톤으로 늘어난다.',
    sourceName: '공항신문',
    sourceUrl: '#',
    category: 'airport_infra',
    publishedAt: '2026-04-22T07:00:00Z',
  },
]

async function getArticles(): Promise<NewsArticle[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return MOCK_ARTICLES
  }
  try {
    const { createServerClient } = await import('@/lib/supabase')
    const supabase = createServerClient()
    const { data } = await supabase
      .from('news_articles')
      .select('id,title,summary_ko,source_name,source_url,category,published_at,is_editor_pick,editor_comment,editor_tone')
      .eq('is_approved', true)
      .order('published_at', { ascending: false })
      .limit(30)
    if (!data?.length) return MOCK_ARTICLES
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      summaryKo: r.summary_ko ?? '',
      sourceName: r.source_name,
      sourceUrl: r.source_url,
      category: r.category,
      publishedAt: r.published_at,
      isEditorPick: r.is_editor_pick,
      editorComment: r.editor_comment ?? undefined,
      editorTone: r.editor_tone ?? undefined,
    }))
  } catch {
    return MOCK_ARTICLES
  }
}

export default async function NewsPage() {
  const articles = await getArticles()

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-10" style={{ paddingTop: 96 }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">항공 화물 뉴스</h1>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
      </div>
      <NewsFilterList articles={articles} />
    </main>
  )
}
