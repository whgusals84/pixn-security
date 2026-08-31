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

      <section className="section" aria-labelledby="learning-title">
        <div className="plate-row">
          <h2 id="learning-title">Currently exploring</h2>
          <span className="plate-rule" aria-hidden="true" />
          <a className="plate-link" href="/learn/">See the learning map</a>
        </div>
        <ul className="home-ledger">
          <li><a className="ledger-row" href="/learn/security/"><span className="ledger-key">01</span><span className="ledger-body"><span className="ledger-title">Web &amp; Trust</span><span className="ledger-desc">How browsers, identity, and broken assumptions shape security</span></span><span aria-hidden="true">↗</span></a></li>
          <li><a className="ledger-row" href="/learn/security/cryptography/"><span className="ledger-key">02</span><span className="ledger-body"><span className="ledger-title">Codes &amp; Ciphers</span><span className="ledger-desc">The ideas behind cryptography and the mistakes that weaken it</span></span><span aria-hidden="true">↗</span></a></li>
          <li><a className="ledger-row" href="/learn/development/"><span className="ledger-key">03</span><span className="ledger-body"><span className="ledger-title">Building Better</span><span className="ledger-desc">Small programs, tools, and experiments made to learn by doing</span></span><span aria-hidden="true">↗</span></a></li>
        </ul>
      </section>

      <section className="section" aria-labelledby="notebook-title">
        <div className="plate-row">
          <h2 id="notebook-title">The notebook</h2>
          <span className="plate-rule" aria-hidden="true" />
          <a className="plate-link" href="/writing/">Read the writing</a>
        </div>
        <ul className="home-ledger">
          <li><a className="ledger-row" href="/writing/"><span className="ledger-key">NOTE</span><span className="ledger-body"><span className="ledger-title">Field Notes</span><span className="ledger-desc">Ideas and observations that deserve more than a bookmark</span></span><span aria-hidden="true">↗</span></a></li>
          <li><a className="ledger-row" href="/labs/"><span className="ledger-key">LAB</span><span className="ledger-body"><span className="ledger-title">Breakdowns</span><span className="ledger-desc">What worked, what failed, and what each challenge taught me</span></span><span aria-hidden="true">↗</span></a></li>
          <li><a className="ledger-row" href="/about/"><span className="ledger-key">NOW</span><span className="ledger-body"><span className="ledger-title">About PIXN</span><span className="ledger-desc">A student building a point of view through code and curiosity</span></span><span aria-hidden="true">↗</span></a></li>
        </ul>
      </section>
    </main>
  );
}
