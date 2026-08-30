import { SiteSearch } from '@/components/site-search';

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label="PIXN 홈">
        <span className="brand-mark">PX</span>
        <span>PIXN</span>
      </a>
      <nav className="main-nav" aria-label="주요 메뉴">
        <a href="/posts">WRITING</a>
        <a href="/notes">NOTES</a>
        <a href="/projects">PROJECTS</a>
        <a href="/about">ABOUT</a>
      </nav>
      <SiteSearch />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-mark">PX</div>
      <nav aria-label="하단 메뉴">
        <a href="/posts">WRITING</a>
        <a href="/projects">PROJECTS</a>
        <a href="mailto:hello@example.com">CONTACT</a>
        <a href="/about">ABOUT</a>
      </nav>
      <div className="social-row" aria-label="소셜 링크">
        <a href="/" aria-label="GitHub">GH</a>
        <a href="/" aria-label="LinkedIn">IN</a>
        <a href="/" aria-label="Instagram">IG</a>
      </div>
      <p>DESIGNED &amp; BUILT WITH INTENTION</p>
      <p>© 2026 PIXN.</p>
    </footer>
  );
}
