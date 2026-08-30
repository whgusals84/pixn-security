import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Signal Map — PIXN',
  description: '사용자 여정을 한눈에 보는 이벤트 설계 도구',
  openGraph: {
    title: 'Signal Map',
    description: '사용자 여정을 한눈에 보는 이벤트 설계 도구',
    images: [],
  },
  twitter: { card: 'summary', images: [] },
};

export default function SignalMapPage() {
  return (
    <>
      <SiteHeader />
      <main className="case-page">
        <header className="case-heading">
          <p>FEATURED PROJECT · 2026</p>
          <h1>Signal Map</h1>
          <span>사용자 여정을 한눈에 보는 이벤트 설계 도구</span>
        </header>
        <div className="case-visual" aria-label="Signal Map 인터페이스 미리보기">
          <aside><span>JOURNEY</span><b>Discover</b><b>Compare</b><b>Convert</b></aside>
          <div className="case-canvas">
            <span className="case-node node-a">page_view</span>
            <span className="case-node node-b">view_item</span>
            <span className="case-node node-c">purchase</span>
            <i className="case-path path-a" /><i className="case-path path-b" />
          </div>
        </div>
        <section className="case-summary">
          <h2>이벤트 목록을<br />사용자 여정으로 바꾸기.</h2>
          <div>
            <p>Signal Map은 기획자, 분석가, 개발자가 같은 화면에서 사용자 행동과 수집 이벤트를 설계하도록 돕는 가벼운 워크벤치입니다.</p>
            <dl>
              <div><dt>ROLE</dt><dd>Product Design · Development</dd></div>
              <div><dt>STACK</dt><dd>React · TypeScript · GA4</dd></div>
              <div><dt>STATUS</dt><dd>Prototype</dd></div>
            </dl>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
