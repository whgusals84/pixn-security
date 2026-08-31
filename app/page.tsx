import { SiteFooter, SiteHeader } from '@/components/site-chrome';

function SectionTitle({ title, hrefLabel, href }: { title: string; hrefLabel: string; href: string }) {
  return (
    <div className="section-title">
      <span>{title}</span>
      <span className="section-rule" />
      <a href={href}>{hrefLabel}</a>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="hero" id="about" aria-labelledby="hero-title">
          <div className="hero-mark" aria-hidden="true">PX</div>
          <p className="eyebrow">PIXN · WEB SECURITY &amp; APPLIED CRYPTOGRAPHY</p>
          <h1 id="hero-title">
            Web Security.
            <br />
            Applied Cryptography.
            <br />
            Built to Understand.
          </h1>
          <p className="hero-copy">
            Field notes from PIXN, a student exploring web vulnerabilities,
            <br className="desktop-break" /> secure systems, cryptographic protocols, and open-source tooling.
          </p>
          <a className="text-link" href="/sec/">EXPLORE THE FIELD NOTES</a>
        </section>

        <section className="featured" aria-label="추천 글">
          <div className="featured-art" role="img" aria-label="데이터 흐름을 표현한 추상적인 선과 점 그래픽">
            <span className="orb orb-one" />
            <span className="orb orb-two" />
            <span className="orb orb-three" />
            <span className="signal-line line-one" />
            <span className="signal-line line-two" />
            <span className="signal-line line-three" />
          </div>
          <div className="featured-copy">
            <time>START HERE</time>
            <h2>웹 보안을 주제별로 탐색하세요</h2>
            <p>브라우저 보안, OWASP Top 10, Secure SDLC와 보안 테스트 자료를 한곳에서 찾을 수 있습니다.</p>
            <a className="text-link" href="/sec/web-security/">OPEN FIELD GUIDE</a>
          </div>
        </section>

        <section className="content-section" id="learning">
          <SectionTitle title="START LEARNING" hrefLabel="ALL TOPICS" href="/tags/" />
          <div className="writing-list">
            {[
              ['01', 'Web Security', '브라우저·프로토콜·애플리케이션 보안의 핵심 원리', '/sec/web-security/'],
              ['02', 'Secure SDLC', '위협 모델링과 DevSecOps 기반의 안전한 개발 흐름', '/sec/secure-sdlc/'],
              ['03', 'Security Testing', '허가된 환경에서 사용하는 방어 목적의 테스트 방법', '/sec/how-to-hack/'],
            ].map(([index, title, description, href]) => (
              <a className="writing-row" href={href} key={title}>
                <time>{index}</time>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="content-section" id="archive">
          <SectionTitle title="REFERENCE LIBRARY" hrefLabel="OPEN ARCHIVE" href="/archive/" />
          <article className="note-card">
            <div>
              <span>2014—2026</span>
              <h3>보안 연구와 개발 기록을 정리한 기술 아카이브</h3>
            </div>
            <span aria-hidden="true">↗</span>
          </article>
        </section>

        <section className="content-section project-section" id="projects">
          <SectionTitle title="TOOLS &amp; PROJECTS" hrefLabel="BROWSE ALL" href="/projects/" />
          <div className="project-grid">
            {[
              ['Attack references', '공격 기법을 방어와 검증 관점에서 정리한 참고 자료', '/cullinan/attack/'],
              ['Security tool catalog', '스캐너와 테스트 도구, 관련 워크플로우 문서', '/cullinan/tool/'],
              ['Open-source projects', '보안과 개발 분야의 프로젝트 및 도구 모음', '/projects/'],
            ].map(([name, description, href]) => (
              <a className="project-card" href={href} key={name}>
                <div className="project-copy">
                  <h3>{name}</h3>
                  <p>{description}</p>
                  <span className="project-stat">EXPLORE ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
