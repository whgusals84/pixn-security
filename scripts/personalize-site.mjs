import { access, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DERIVED_EMPTY_ROUTES, PERSONAL_ONLY_ROUTES, REMOVED_DISCOVERY_ROUTES } from './personal-content-policy.mjs';

const args = parseArgs(process.argv.slice(2));
const publicRoot = path.resolve(args.public ?? 'public');
const targetOrigin = new URL(args.origin ?? 'https://pixn-analytics-portfolio.forhm0220.chatgpt.site').origin;
const previewOnly = Boolean(args.preview);

const removedDiscoveryRoutes = REMOVED_DISCOVERY_ROUTES;
const removedDiscoveryRouteSet = new Set(REMOVED_DISCOVERY_ROUTES);
const siteDescription = 'Practical web security knowledge, secure engineering references, and open-source tools.';
const koSiteDescription = '웹 보안 학습 자료와 안전한 개발 지침, 오픈소스 도구를 정리한 지식 아카이브입니다.';

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (next && !next.startsWith('--')) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function relativeFileToRoute(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -'index.html'.length)}`;
  return `/${normalized}`;
}

function pathFromAbsoluteUrl(value) {
  try {
    return new URL(value, targetOrigin).pathname;
  } catch {
    return value;
  }
}

function isPersonalUrl(value) {
  return removedDiscoveryRouteSet.has(pathFromAbsoluteUrl(value));
}

function replaceMain(html, main) {
  return html.replace(/<main\b[^>]*id=["']main-content["'][^>]*>[\s\S]*?<\/main>/i, main);
}

function neutralFooter() {
  return `<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <span class="hw-mark footer-mark" aria-hidden="true"></span>
            <nav class="footer-menu" aria-label="Footer">
                <a href="/sec/">SECURITY</a>
                <a href="/tags/">TAGS</a>
                <a href="/projects/">TOOLS</a>
                <a href="/feeds/">FEEDS</a>
                <a href="/privacy/">PRIVACY</a>
            </nav>
            <p>PIXN<br />Security Knowledge Archive.</p>
        </div>
    </div>
</footer>`;
}

function homeMain() {
  return `<main id="main-content">
    <div class="container">
        <section class="gallery-hero exhibit is-lit" aria-label="PIXN Security Knowledge Archive">
            <p class="hero-inscription"><span class="hw-mark" role="img" aria-label="PIXN"></span></p>
            <h1 class="hero-statement">Web Security Knowledge Base, Tools and Field Notes.</h1>
            <p class="hero-intro">Practical references for web security testing, secure engineering, and open-source security tooling.</p>
            <p class="hero-doors"><a class="hero-archive-link" href="/sec/">Explore security guides</a></p>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-start">
            <header class="plate-row">
                <h2 class="plate" id="plate-start">Start learning</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/tags/">Browse all topics</a>
            </header>
            <ul class="home-ledger">
                <li><a class="ledger-row" href="/sec/web-security/"><span class="ledger-key">01</span><span class="ledger-body"><span class="ledger-title">Web Security</span><span class="ledger-desc">Browser, protocol, and application security fundamentals</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/sec/secure-sdlc/"><span class="ledger-key">02</span><span class="ledger-body"><span class="ledger-title">Secure SDLC</span><span class="ledger-desc">Threat modeling, DevSecOps, and secure delivery practices</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/sec/how-to-hack/"><span class="ledger-key">03</span><span class="ledger-body"><span class="ledger-title">Security Testing</span><span class="ledger-desc">Defensive testing methods for web, mobile, and software</span></span><span aria-hidden="true">↗</span></a></li>
            </ul>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-resources">
            <header class="plate-row">
                <h2 class="plate" id="plate-resources">Reference library</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/projects/">All tools</a>
            </header>
            <ul class="home-ledger">
                <li><a class="ledger-row" href="/cullinan/attack/"><span class="ledger-key">A–Z</span><span class="ledger-body"><span class="ledger-title">Attack references</span><span class="ledger-desc">Techniques organized for study and defensive verification</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/cullinan/tool/"><span class="ledger-key">TOOLS</span><span class="ledger-body"><span class="ledger-title">Security tool catalog</span><span class="ledger-desc">Testing utilities, scanners, and supporting workflows</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/archive/"><span class="ledger-key">2014—</span><span class="ledger-body"><span class="ledger-title">Technical archive</span><span class="ledger-desc">Historical security and development notes</span></span><span aria-hidden="true">↗</span></a></li>
            </ul>
        </section>
    </div>
</main>`;
}

function aboutMain(language) {
  const korean = language === 'ko';
  const title = korean ? 'PIXN 소개' : 'About PIXN';
  const description = korean ? koSiteDescription : siteDescription;
  const paragraphs = korean
    ? `<p>PIXN은 웹 보안과 안전한 소프트웨어 개발을 위한 학습 자료를 주제별로 정리한 지식 아카이브입니다.</p>
       <p>취약점의 원리, 방어 관점의 테스트 방법, Secure SDLC, 개발 언어와 보안 도구 문서를 검색하고 연결해서 볼 수 있습니다.</p>
       <p>오래된 자료는 역사적 참고 자료로 제공되며, 실제 시스템에서는 반드시 최신 공식 문서와 안전한 실습 환경을 함께 사용해야 합니다.</p>`
    : `<p>PIXN is a topic-driven knowledge archive for web security and secure software engineering.</p>
       <p>It connects vulnerability concepts, defensive testing methods, Secure SDLC guidance, programming references, and open-source security tools.</p>
       <p>Older material is retained as historical reference. Always verify current official guidance and use an authorized lab environment before testing.</p>`;
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">${title}</h1><p class="page-description">${description}</p></header>
            <div class="post-body">${paragraphs}
                <h2>${korean ? '둘러보기' : 'Explore'}</h2>
                <ul><li><a href="/sec/">${korean ? '보안 학습 자료' : 'Security guides'}</a></li><li><a href="/projects/">${korean ? '도구와 프로젝트' : 'Tools and projects'}</a></li><li><a href="/tags/">${korean ? '주제별 탐색' : 'Browse by topic'}</a></li></ul>
            </div>
        </article></div>
    </div>
</main>`;
}

function privacyMain() {
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">Privacy Policy</h1><p class="page-description">Privacy information for the PIXN knowledge archive.</p></header>
            <div class="post-body">
                <p><strong>Last updated:</strong> August 2026</p>
                <p>PIXN currently provides public, read-only reference pages and does not offer visitor accounts or contact forms.</p>
                <h2>Hosting</h2><p>The hosting provider may process basic request information, such as IP addresses and browser details, to deliver and protect the site.</p>
                <h2>Analytics</h2><p>No analytics policy is declared here until an analytics service is enabled. This notice must be updated before any optional analytics or advertising technology is introduced.</p>
                <h2>External links</h2><p>External services have their own privacy practices. Review their policies before providing personal information.</p>
            </div>
        </article></div>
    </div>
</main>`;
}

function removedPage(language) {
  const korean = language === 'ko';
  const title = korean ? '콘텐츠가 정리되었습니다' : 'Content removed';
  const message = korean
    ? '이 경로에는 이전 발행자의 개인 소개, 연락처, 경력 또는 행사 기록이 있어 PIXN 학습 아카이브에서 제외했습니다.'
    : 'This route contained personal profile, contact, career, or event material from the previous publication and is not part of the PIXN learning archive.';
  return `<!DOCTYPE html>
<html lang="${korean ? 'ko' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#040405">
    <meta name="robots" content="noindex, nofollow">
    <title>${title} | PIXN</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/fonts/pretendard/pretendardvariable-dynamic-subset.css">
    <link rel="stylesheet" href="${targetOrigin}/assets/main.8885b746.css">
</head>
<body>
    <a class="skip-link sr-only" href="#main-content">${korean ? '본문으로 이동' : 'Skip to content'}</a>
    <div class="site-wrapper">
        <header class="site-header"><div class="header-content"><nav class="main-nav">
            <div class="nav-logo"><a href="/" aria-label="PIXN, home"><span class="hw-mark" aria-hidden="true"></span><span class="nav-wordmark" aria-hidden="true">PIXN</span></a></div>
            <div class="nav-menu" id="nav-menu"><a href="/posts/">Posts</a><a href="/sec/">Security</a><a href="/projects/">Projects</a><a href="/about/">About</a></div>
        </nav></div></header>
        <main id="main-content"><div class="container"><div class="post-wrapper"><article class="post-content"><header class="page-header"><h1 class="page-title">${title}</h1></header><div class="post-body"><p>${message}</p><p><a href="/sec/">${korean ? '보안 학습 자료 보기' : 'Browse security guides'}</a></p></div></article></div></div></main>
        ${neutralFooter()}
    </div>
</body>
</html>`;
}

function removePersonalRouteLinks(html) {
  let output = html;
  for (const route of removedDiscoveryRoutes) {
    const escaped = escapeRegExp(route);
    output = output.replace(new RegExp(`<a\\b(?=[^>]*href=["'][^"']*${escaped})[^>]*>[\\s\\S]*?<\\/a>`, 'gi'), '');
  }
  return output.replace(/<li\b[^>]*>\s*<\/li>/gi, '');
}

function cleanChrome(html) {
  let output = html
    .replace(/(<title>[\s\S]*?)\s*\|\s*HAHWUL(<\/title>)/gi, '$1 | PIXN$2')
    .replace(/title=["']HAHWUL(?: \(KO\)| \(한국어\))?["']/gi, 'title="PIXN"')
    .replaceAll('Offensive Security Engineer, Developer and H4cker.', siteDescription)
    .replace(/"name":"HAHWUL"/g, '"name":"PIXN"')
    .replace(/"name":"HAHWUL \(KO\)"/g, '"name":"PIXN"')
    .replace(/<a href="\/about\/">About<\/a>/g, '<a href="/sec/">Security</a>')
    .replace(/<footer\b[^>]*class=["'][^"']*\bsite-footer\b[^"']*["'][^>]*>[\s\S]*?<\/footer>/gi, neutralFooter());

  output = output
    .replace(/<li\b[^>]*>[\s\S]*?<a\b[^>]*href=["']https:\/\/x\.com\/hahwul[^"']*["'][^>]*>[\s\S]*?<\/a>[\s\S]*?<\/li>/gi, '')
    .replace(/<a\b[^>]*href=["']https:\/\/x\.com\/hahwul[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/https:\/\/x\.com\/hahwul\/status\/\d+/gi, '[original announcement removed]')
    .replaceAll('@hahwul', 'archived author')
    .replaceAll('HAHWUL', 'PIXN')
    .replaceAll(
      'A collection of my writings on various topics - from technical deep-dives to personal reflections, all in one place.',
      'A technical archive of security research, development notes, and practical references.',
    )
    .replace(
      /<p>NoDecaf is a personal productivity app developed by PIXN\. I respect your privacy and am fully committed to transparency\. This policy explains how NoDecaf handles your information\.<\/p>/i,
      '<p>NoDecaf is a local productivity app. This archived policy explains how the application handles information.</p>',
    )
    .replace(
      /<p>TextNova is a personal productivity app developed by PIXN\. I respect your privacy and am fully committed to transparency\. This policy explains how TextNova handles your information\.<\/p>/i,
      '<p>TextNova is a local productivity app. This archived policy explains how the application handles information.</p>',
    )
    .replaceAll(
      'I may update this privacy policy occasionally. Any changes will appear here with a new &quot;Last updated&quot; date.',
      'This privacy policy may be updated occasionally. Any changes will appear here with a new &quot;Last updated&quot; date.',
    );

  output = output.replace(
    /<a\b[^>]*href=["']mailto:hahwul@gmail\.com["'][^>]*>[\s\S]*?<\/a>/gi,
    '<span>Contact information is not published.</span>',
  );
  output = output.replaceAll('hahwul@gmail.com', 'contact information is not published');
  return removePersonalRouteLinks(output);
}

function transformHtml(relativePath, html) {
  const route = relativeFileToRoute(relativePath);
  const language = route.startsWith('/ko/') ? 'ko' : 'en';
  if (removedDiscoveryRouteSet.has(route)) return removedPage(language);

  let output = html;
  if (route === '/') output = replaceMain(output, homeMain());
  if (route === '/about/') output = replaceMain(output, aboutMain('en'));
  if (route === '/ko/about/') output = replaceMain(output, aboutMain('ko'));
  if (route === '/privacy/') output = replaceMain(output, privacyMain());
  output = cleanChrome(output);

  if (route === '/archive/projects/') {
    output = output.replace(
      /<div class="post-body">[\s\S]*?<\/div>\s*<div class="footnotes-area">/i,
      '<div class="post-body"><p>A catalog of security tools and other projects included in this archive. Repository links point to their respective maintainers.</p></div><div class="footnotes-area">',
    );
  }
  if (route === '/ko/archive/projects/') {
    output = output.replace(
      /<div class="post-body">[\s\S]*?<\/div>\s*<div class="footnotes-area">/i,
      '<div class="post-body"><p>이 아카이브에 포함된 보안 도구와 프로젝트를 정리한 목록입니다. 저장소 링크는 각 프로젝트의 실제 관리자를 가리킵니다.</p></div><div class="footnotes-area">',
    );
  }
  if (route === '/projects/nodecaf/support/' || route === '/projects/textnova/support/') {
    output = output.replace(
      /<h2 id="contact-support">[\s\S]*?(?=<\/div>\s*<div class="footnotes-area">)/i,
      '<h2 id="contact-support">Contact &amp; Support</h2><p>Direct support contact is not published on this archive. Use the project repository linked from the project page to check current support options.</p>\n',
    );
  }

  if (route === '/blog/2021/what-is-wellknown-directory/') {
    output = output.replaceAll('contact information is not published', 'security@example.com');
  }
  return output;
}

function transformSearchIndex(text) {
  const documents = JSON.parse(text)
    .filter((document) => !isPersonalUrl(document.url))
    .map((document) => {
      const updated = { ...document };
      for (const key of ['title', 'content', 'description']) {
        if (typeof updated[key] === 'string') {
          updated[key] = updated[key]
            .replaceAll('hahwul@gmail.com', 'security@example.com')
            .replace(/https:\/\/x\.com\/hahwul\/status\/\d+/gi, '[original announcement removed]')
            .replaceAll('@hahwul', 'archived author')
            .replaceAll('HAHWUL', 'PIXN');
        }
      }
      if (updated.url === '/about/') {
        updated.title = 'About PIXN';
        updated.description = siteDescription;
        updated.content = 'PIXN is a topic-driven knowledge archive for web security, secure software engineering, and open-source security tools.';
      }
      if (updated.url === '/ko/about/') {
        updated.title = 'PIXN 소개';
        updated.description = koSiteDescription;
        updated.content = 'PIXN은 웹 보안과 안전한 소프트웨어 개발을 위한 학습 자료를 주제별로 정리한 지식 아카이브입니다.';
      }
      if (updated.url === '/privacy/') {
        updated.description = 'Privacy information for the PIXN knowledge archive.';
        updated.content = 'PIXN provides public, read-only reference pages without visitor accounts or contact forms. The hosting provider may process basic request information to deliver and protect the site. This notice must be updated before optional analytics or advertising technology is introduced.';
      }
      if (updated.url === '/blog/' || updated.url === '/ko/blog/') {
        updated.content = 'A technical archive of security research, development notes, and practical references.';
        updated.description = updated.url.startsWith('/ko/') ? '보안 연구와 개발 기록을 정리한 기술 아카이브' : 'Security research and development archive';
      }
      return updated;
    });
  return `${JSON.stringify(documents)}\n`;
}

function transformSitemap(text) {
  return text.replace(/\s*<url>[\s\S]*?<\/url>/gi, (block) => {
    const locations = [...block.matchAll(/<(?:loc|xhtml:link)\b[^>]*(?:href=["']([^"']+)["'])?[^>]*>([^<]*)/gi)]
      .flatMap((match) => [match[1], match[2]])
      .filter(Boolean);
    return locations.some(isPersonalUrl) ? '' : block;
  });
}

function transformRss(text) {
  return text
    .replace(/\s*<item>[\s\S]*?<\/item>/gi, (block) => {
      const links = [...block.matchAll(/<(?:link|guid)>\s*([^<]+)\s*<\/(?:link|guid)>/gi)].map((match) => match[1]);
      return links.some(isPersonalUrl) ? '' : block;
    })
    .replace(/<title>HAHWUL(?: \(한국어\))?<\/title>/i, (match) => (match.includes('한국어') ? '<title>PIXN (한국어)</title>' : '<title>PIXN</title>'))
    .replaceAll('Offensive Security Engineer, Developer and H4cker.', siteDescription)
    .replaceAll('hahwul@gmail.com', 'security@example.com')
    .replace(/https:\/\/x\.com\/hahwul\/status\/\d+/gi, '[original announcement removed]')
    .replaceAll('@hahwul', 'archived author')
    .replaceAll('HAHWUL', 'PIXN');
}

function transformManifest(text) {
  const manifest = JSON.parse(text);
  const publicManifest = { ...manifest };
  delete publicManifest.sourceOrigin;
  delete publicManifest.failures;
  const sourceRouteCount = manifest.sourceRouteCount ?? manifest.routeCount;
  const routes = manifest.routes.filter((route) => !removedDiscoveryRouteSet.has(route));
  return `${JSON.stringify(
    {
      ...publicManifest,
      provenance: 'Authorized source archive',
      sourceRouteCount,
      routeCount: routes.length,
      successfulRouteCount: routes.length,
      routes,
      branding: {
        mark: 'PIXN',
        learningContentPreserved: true,
        personalOnlyContentRemoved: true,
      },
      personalization: {
        removedFromDiscovery: PERSONAL_ONLY_ROUTES,
        derivedEmptyRoutes: DERIVED_EMPTY_ROUTES,
        policy: 'Keep educational and technical material; remove prior-publisher-only profile, contact, career, award, and event content.',
      },
    },
    null,
    2,
  )}\n`;
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

async function writeIfChanged(file, next) {
  const current = await readFile(file, 'utf8');
  if (current !== next) await writeFile(file, next);
  return current !== next;
}

async function removePersonalAssets() {
  const exactAssets = [
    path.join(publicRoot, 'images', 'about', 'h.webp'),
    path.join(publicRoot, 'images', 'about', 'hhkb.webp'),
  ];
  for (const asset of exactAssets) await rm(asset, { force: true });

  for (const route of removedDiscoveryRoutes) {
    const directory = path.join(publicRoot, route.replace(/^\//, ''));
    try {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        if (entry.isFile() && entry.name === 'index.html') continue;
        await rm(path.join(directory, entry.name), { recursive: true, force: true });
      }
    } catch {
      // A route with no local directory needs no cleanup.
    }
  }
}

await access(publicRoot);
let changed = 0;
if (previewOnly) {
  const home = path.join(publicRoot, 'index.html');
  const html = await readFile(home, 'utf8');
  if (await writeIfChanged(home, transformHtml('index.html', html))) changed += 1;
} else {
  const files = await walk(publicRoot);
  for (const file of files) {
    const relativePath = path.relative(publicRoot, file).replaceAll('\\', '/');
    const extension = path.extname(relativePath).toLowerCase();
    if (extension === '.html') {
      const html = await readFile(file, 'utf8');
      if (await writeIfChanged(file, transformHtml(relativePath, html))) changed += 1;
      continue;
    }
    if (relativePath === 'search_index.json') {
      const text = await readFile(file, 'utf8');
      if (await writeIfChanged(file, transformSearchIndex(text))) changed += 1;
      continue;
    }
    if (relativePath === 'sitemap.xml') {
      const text = await readFile(file, 'utf8');
      if (await writeIfChanged(file, transformSitemap(text))) changed += 1;
      continue;
    }
    if (relativePath === 'rss.xml' || relativePath === 'ko/rss.xml') {
      const text = await readFile(file, 'utf8');
      if (await writeIfChanged(file, transformRss(text))) changed += 1;
      continue;
    }
    if (relativePath === 'mirror-manifest.json') {
      const text = await readFile(file, 'utf8');
      if (await writeIfChanged(file, transformManifest(text))) changed += 1;
    }
  }
  await removePersonalAssets();
}

process.stdout.write(`PIXN personalization complete: ${changed} files updated${previewOnly ? ' (homepage preview)' : ''}\n`);
