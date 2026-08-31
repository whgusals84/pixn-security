export default function HomePage() {
  return (
    <main className="page" id="main">
      <section className="hero gallery-hero">
        <p className="hero-mark" aria-label="PIXN">Px</p>
        <h1>Security, code, study, and everything worth remembering.</h1>
        <p className="hero-copy">
          보안과 개발을 공부하면서 직접 이해한 것, 만든 것, 그리고 오래 남기고 싶은 생각을 기록하는 PIXN의 개인 블로그입니다.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/writing/">Explore writing</a>
        </div>
      </section>
    </main>
  );
}
