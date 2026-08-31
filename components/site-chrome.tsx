import { SiteSearch } from '@/components/site-search';

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label="PIXN 홈">
        <span className="brand-mark">PX</span>
        <span>PIXN</span>
      </a>
      <nav className="main-nav" aria-label="주요 메뉴">
        <a href="/sec/">LEARN</a>
        <a href="/writing/">WRITING</a>
        <a href="/labs/">LABS</a>
        <a href="/projects/">PROJECTS</a>
        <a href="/reference/">REFERENCE</a>
        <a href="/about/">ABOUT</a>
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
        <a href="/journal/">LATEST</a>
        <a href="/writing/">WRITING</a>
        <a href="/labs/">LABS</a>
        <a href="/projects/">PROJECTS</a>
      </nav>
      <p>WEB SECURITY · APPLIED CRYPTOGRAPHY</p>
      <p>© 2026 PIXN.</p>
    </footer>
  );
}
