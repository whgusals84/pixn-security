export default function HomePage() {
  return (
    <main className="page" id="main">
      <section className="hero gallery-hero">
        <span className="pixn-mark hero-mark" role="img" aria-label="PIXN" />
        <h1>Security, code, study, and everything worth remembering.</h1>
        <p className="hero-copy">
          A personal blog about security, code, study, and the things worth remembering.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/writing/">Explore writing</a>
        </div>
      </section>
    </main>
  );
}
