(() => {
  const scriptUrl = new URL(document.currentScript.src);
  const basePath = scriptUrl.pathname.replace(/assets\/site\.js$/, '');
  const to = (path) => `${basePath}${path}`;
  const active = document.querySelector('[data-site-header]')?.dataset.active || 'home';
  const links = [
    ['learn', 'learn/', 'Learn'],
    ['writing', 'writing/', 'Writing'],
    ['labs', 'labs/', 'Labs'],
    ['projects', 'projects/', 'Projects'],
    ['reference', 'reference/', 'Reference'],
    ['about', 'about/', 'About'],
  ];

  const header = document.querySelector('[data-site-header]');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="nav-shell">
        <a class="brand" href="${to('')}" aria-label="PIXN home">
          <span class="brand-mark" aria-hidden="true">Px</span>
          <span class="brand-name">PIXN</span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><span></span></button>
        <nav class="site-nav" aria-label="Primary navigation">
          ${links.map(([key, path, label]) => `<a href="${to(path)}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        </nav>
      </div>`;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.dataset.open = String(open);
    });
  }

  const footer = document.querySelector('[data-site-footer]');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `<span>© ${new Date().getFullYear()} PIXN</span><span>Built as I learn.</span>`;
  }
})();
