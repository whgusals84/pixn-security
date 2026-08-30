import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'About — PIXN',
  description: 'PIXN의 분석과 개발 작업 방식',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <header className="about-intro">
          <p>ABOUT PIXN</p>
          <h1>데이터와 사람 사이의<br />간격을 줄입니다.</h1>
        </header>
        <div className="about-grid">
          <div className="about-portrait" aria-hidden="true">
            <span>PX</span>
          </div>
          <div className="about-copy">
            <p className="about-lead">분석은 도구를 잘 다루는 일보다, 팀이 같은 질문을 바라보게 만드는 일에 가깝다고 믿습니다.</p>
            <p>GA4와 태그 관리, 데이터 시각화, 가벼운 웹 개발을 연결해 수집부터 의사결정까지 끊기지 않는 흐름을 설계합니다. 복잡한 보고서보다 명료한 질문을, 많은 지표보다 행동으로 이어지는 신호를 선호합니다.</p>
            <dl>
              <div><dt>FOCUS</dt><dd>Analytics · Measurement · Growth</dd></div>
              <div><dt>BASED IN</dt><dd>Seoul, South Korea</dd></div>
              <div><dt>CONTACT</dt><dd><a href="mailto:hello@example.com">hello@example.com</a></dd></div>
            </dl>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
