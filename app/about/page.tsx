import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'About — PIXN',
  description: '웹 보안과 응용 암호학을 공부하는 학생 PIXN 소개',
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="about-page">
        <header className="about-intro">
          <p>ABOUT PIXN</p>
          <h1>보안의 원리를 배우고<br />직접 확인합니다.</h1>
        </header>
        <div className="about-grid">
          <div className="about-portrait" aria-hidden="true">
            <span>PX</span>
          </div>
          <div className="about-copy">
            <p className="about-lead">PIXN은 웹 보안, 응용 암호학, 안전한 시스템을 공부하며 보안 엔지니어를 목표로 하는 학생입니다.</p>
            <p>이 웹사이트에는 취약점의 원리, 방어 목적의 보안 테스트, 암호 프로토콜, Secure SDLC와 오픈소스 보안 도구를 공부하며 남긴 기술 노트를 정리합니다.</p>
            <dl>
              <div><dt>STATUS</dt><dd>Student · Aspiring Security Engineer</dd></div>
              <div><dt>FOCUS</dt><dd>Web Security · Applied Cryptography</dd></div>
              <div><dt>NOTES</dt><dd>Secure Systems · Open-source Tooling</dd></div>
            </dl>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
