import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'GA4에서 정말 봐야 하는 지표들 — PIXN',
  description: '숫자를 모으는 것과 의사결정을 만드는 것의 차이',
  openGraph: {
    title: 'GA4에서 정말 봐야 하는 지표들',
    description: '숫자를 모으는 것과 의사결정을 만드는 것의 차이',
    images: [],
  },
  twitter: { card: 'summary', images: [] },
};

export default function ArticlePage() {
  return (
    <>
      <SiteHeader />
      <main className="article-page">
        <header className="article-hero">
          <p>ANALYTICS · AUG 24, 2026</p>
          <h1>GA4에서 정말 봐야 하는 지표들</h1>
          <span>숫자를 모으는 것과 의사결정을 만드는 것의 차이</span>
        </header>
        <div className="article-cover" aria-hidden="true">
          <span>QUESTION</span><span>SIGNAL</span><span>DECISION</span>
        </div>
        <article className="article-body">
          <p className="article-lead">좋은 분석은 대시보드의 숫자가 아니라, 그 숫자 앞에서 팀이 어떤 질문을 하는지로 판단할 수 있습니다.</p>
          <h2>지표보다 먼저 질문을 적습니다</h2>
          <p>페이지 조회수나 사용자 수는 상태를 설명하지만, 다음 행동을 알려주지는 않습니다. 어떤 사용자가 어느 순간에 멈추는지, 성공한 사용자는 무엇을 다르게 했는지처럼 행동으로 연결되는 질문부터 정리해야 합니다.</p>
          <blockquote>측정 계획은 수집할 데이터 목록이 아니라, 답해야 할 질문의 지도입니다.</blockquote>
          <h2>세 가지 층으로 나눠 봅니다</h2>
          <p>사업의 결과를 보여주는 성과 지표, 결과로 이어지는 행동 지표, 그리고 데이터의 신뢰도를 확인하는 품질 지표를 분리합니다. 이 세 층이 함께 있을 때 숫자는 설명력을 갖습니다.</p>
          <div className="article-callout">
            <span>01</span><p>성과: 가입, 구매, 재방문</p>
            <span>02</span><p>행동: 탐색, 비교, 핵심 기능 사용</p>
            <span>03</span><p>품질: 누락, 중복, 동의 상태</p>
          </div>
          <h2>작게 시작하고 자주 검증합니다</h2>
          <p>모든 이벤트를 한 번에 설계하기보다 중요한 사용자 여정 하나를 선택합니다. 구현 후 DebugView와 원시 데이터를 함께 확인하고, 실제 의사결정에 사용되지 않는 이벤트는 과감히 줄입니다.</p>
        </article>
        <nav className="article-next" aria-label="다음 글">
          <span>NEXT WRITING</span>
          <a href="/posts">좋은 이벤트 설계의 시작 →</a>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
