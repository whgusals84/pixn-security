(() => {
  const analyticsMeasurementId = 'G-V2QQ024NEN';
  const analyticsConsentKey = 'pixn-analytics-consent';
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
          <span class="pixn-mark brand-mark" aria-hidden="true"></span>
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
    footer.innerHTML = `<span>© ${new Date().getFullYear()} PIXN</span><span>Built as I learn.</span><a href="${to('privacy/')}">Privacy</a><button class="footer-preferences" type="button" data-analytics-preferences>Analytics preferences</button>`;
  }

  const readAnalyticsConsent = () => {
    try {
      return localStorage.getItem(analyticsConsentKey);
    } catch {
      return null;
    }
  };

  const writeAnalyticsConsent = (value) => {
    try {
      localStorage.setItem(analyticsConsentKey, value);
    } catch {
      // The notice remains available when storage is disabled.
    }
  };

  const revokeAnalyticsCookies = () => {
    const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax';
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (name === '_ga' || name.startsWith('_ga_')) document.cookie = `${name}=; ${expiry}`;
    }
  };

  const updateAnalyticsConsent = (value) => {
    window.gtag?.('consent', 'update', {
      analytics_storage: value,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  const loadAnalytics = () => {
    if (document.querySelector('[data-pixn-analytics]')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args) {
      window.dataLayer.push(args);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', analyticsMeasurementId, { anonymize_ip: true });

    const tag = document.createElement('script');
    tag.async = true;
    tag.dataset.pixnAnalytics = 'true';
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsMeasurementId)}`;
    document.head.append(tag);
  };

  const removeAnalyticsNotice = () => document.querySelector('[data-analytics-consent]')?.remove();

  const showAnalyticsNotice = (force = false) => {
    if (document.querySelector('[data-analytics-consent]')) return;

    const consent = readAnalyticsConsent();
    if (!force && consent === 'granted') {
      loadAnalytics();
      return;
    }
    if (!force && consent === 'denied') return;

    const notice = document.createElement('section');
    notice.className = 'analytics-consent';
    notice.dataset.analyticsConsent = 'true';
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-label', 'Analytics cookie choice');
    notice.innerHTML = `
      <p>PIXN uses optional analytics cookies to understand site traffic. <a href="${to('privacy/')}">Learn more</a></p>
      <div class="analytics-consent-actions">
        <button type="button" data-analytics-reject>Reject</button>
        <button type="button" data-analytics-accept>Accept analytics</button>
      </div>`;

    notice.querySelector('[data-analytics-reject]').addEventListener('click', () => {
      writeAnalyticsConsent('denied');
      updateAnalyticsConsent('denied');
      revokeAnalyticsCookies();
      removeAnalyticsNotice();
    });
    notice.querySelector('[data-analytics-accept]').addEventListener('click', () => {
      writeAnalyticsConsent('granted');
      loadAnalytics();
      removeAnalyticsNotice();
    });
    document.body.append(notice);
  };

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-analytics-preferences]')) return;
    event.preventDefault();
    showAnalyticsNotice(true);
  });

  showAnalyticsNotice();
})();
