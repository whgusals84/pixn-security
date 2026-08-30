export const writings = [
  {
    slug: 'measurement-questions',
    date: 'AUG 24, 2026',
    title: 'GA4에서 정말 봐야 하는 지표들',
    description: '숫자를 모으는 것과 의사결정을 만드는 것의 차이',
    category: 'ANALYTICS',
  },
  {
    slug: 'event-design',
    date: 'JUL 12, 2026',
    title: '좋은 이벤트 설계의 시작',
    description: '팀이 함께 쓰는 측정 계획을 만드는 방법',
    category: 'MEASUREMENT',
  },
  {
    slug: 'lighter-dashboards',
    date: 'MAY 30, 2026',
    title: '대시보드를 가볍게 유지하는 법',
    description: '보고서보다 질문을 먼저 설계하기',
    category: 'REPORTING',
  },
  {
    slug: 'utm-governance',
    date: 'APR 18, 2026',
    title: '흐트러지지 않는 UTM 운영 규칙',
    description: '작은 팀에서도 캠페인 데이터를 깨끗하게 유지하는 방법',
    category: 'OPERATIONS',
  },
];

export const notes = [
  {
    slug: 'utm-rules',
    category: 'MEASUREMENT',
    title: 'UTM 규칙을 팀 전체가 지키게 만드는 작은 장치',
    description: '문서보다 입력 도구와 검증 장치가 더 오래 살아남습니다.',
  },
  {
    slug: 'debug-view',
    category: 'GA4',
    title: 'DebugView에서 이벤트가 보이지 않을 때 확인할 것',
    description: '수집부터 필터까지 빠르게 점검하는 순서입니다.',
  },
  {
    slug: 'consent-mode',
    category: 'PRIVACY',
    title: 'Consent Mode를 적용하기 전 정리할 질문',
    description: '구현보다 먼저 합의해야 할 데이터 흐름을 기록했습니다.',
  },
];

export const projects = [
  {
    slug: 'signal-map',
    name: 'Signal Map',
    description: '사용자 여정을 한눈에 보는 이벤트 설계 도구',
    stat: '24 EVENTS',
    featured: true,
  },
  {
    slug: 'funnel-lab',
    name: 'Funnel Lab',
    description: '전환 흐름을 빠르게 탐색하는 분석 워크벤치',
    stat: '8 FLOWS',
  },
  {
    slug: 'data-layer-kit',
    name: 'Data Layer Kit',
    description: '일관된 수집을 위한 데이터 레이어 템플릿',
    stat: '32 SCHEMAS',
  },
  {
    slug: 'insight-notes',
    name: 'Insight Notes',
    description: '분석과 실험의 맥락을 쌓는 노트 시스템',
    stat: 'OPEN',
  },
];

export const searchItems = [
  ...writings.map((item, index) => ({
    label: item.title,
    description: item.description,
    type: 'Writing',
    href: index === 0 ? `/posts/${item.slug}` : '/posts',
  })),
  ...notes.map((item) => ({
    label: item.title,
    description: item.description,
    type: 'Note',
    href: '/notes',
  })),
  ...projects.map((item, index) => ({
    label: item.name,
    description: item.description,
    type: 'Project',
    href: index === 0 ? `/projects/${item.slug}` : '/projects',
  })),
  {
    label: 'About PIXN',
    description: '분석과 개발을 연결하는 작업 방식',
    type: 'Page',
    href: '/about',
  },
];
