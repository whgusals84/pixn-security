import { SiteSearch } from '@/components/site-search';

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="/" aria-label="PIXN 홈">
        <span className="brand-mark">PX</span>
        <span>PIXN</span>
      </a>
      <nav className="main-nav" aria-label="주요 메뉴">
        <a href="/sec/">SECURITY</a>
        <a href="/tags/">TOPICS</a>
        <a href="/projects/">TOOLS</a>
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
        <a href="/sec/">SECURITY</a>
        <a href="/projects/">TOOLS</a>
        <a href="/archive/">ARCHIVE</a>
        <a href="/about">ABOUT</a>
      </nav>
      <p>SECURITY KNOWLEDGE ARCHIVE</p>
      <p>© 2026 PIXN.</p>
    </footer>
  );
}
