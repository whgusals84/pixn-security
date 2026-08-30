import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { projects, writings } from '@/lib/content';

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
          <p className="eyebrow">DIGITAL ANALYTICS · SEOUL</p>
          <h1 id="hero-title">
            Digital Analytics,
            <br />
            Growth Strategy and
            <br />
            Better Decisions.
          </h1>
          <p className="hero-copy">
            안녕하세요. 데이터를 더 나은 질문과 실행으로 연결하는
            <br className="desktop-break" /> 디지털 분석가이자 개발자입니다.
          </p>
          <a className="text-link" href="/projects">VIEW MY WORK</a>
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
            <time dateTime="2026-08-28">AUGUST 28, 2026</time>
            <h2>측정은 숫자보다 질문에서 시작됩니다</h2>
            <p>좋은 분석 환경을 만드는 네 가지 원칙</p>
            <a className="text-link" href="/posts/measurement-questions">READ STORY</a>
          </div>
        </section>

        <section className="content-section" id="writing">
          <SectionTitle title="WRITING" hrefLabel="ALL POSTS" href="/posts" />
          <div className="writing-list">
            {writings.map((item) => (
              <article className="writing-row" key={item.title}>
                <time>{item.date}</time>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section" id="notes">
          <SectionTitle title="NOTES" hrefLabel="ALL NOTES" href="/notes" />
          <article className="note-card">
            <div>
              <span>MEASUREMENT</span>
              <h3>UTM 규칙을 팀 전체가 지키게 만드는 작은 장치</h3>
            </div>
            <span aria-hidden="true">↗</span>
          </article>
        </section>

        <section className="content-section project-section" id="projects">
          <SectionTitle title="PROJECTS" hrefLabel="ALL PROJECTS" href="/projects" />
          <div className="project-grid">
            {projects.map((project) => (
              <article className={`project-card ${project.featured ? 'project-featured' : ''}`} key={project.name}>
                {project.featured && (
                  <div className="project-visual" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                <div className="project-copy">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="project-stat">✦ {project.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
