export default function HomePage() {
  return (
    <main className="page" id="main">
      <section className="hero">
        <p className="eyebrow">Personal blog · learning in public</p>
        <h1>Notes from the things I actually learn.</h1>
        <p className="hero-copy">
          보안과 개발을 공부하면서 직접 이해한 것, 만든 것, 그리고 오래 남기고 싶은 생각을 기록합니다.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/blog/">Read the blog</a>
          <a className="button" href="/about/">About PIXN</a>
        </div>
      </section>
    </main>
  );
}
