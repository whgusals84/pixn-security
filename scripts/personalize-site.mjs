import { access, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { DERIVED_EMPTY_ROUTES, PERSONAL_ONLY_ROUTES, REMOVED_DISCOVERY_ROUTES } from './personal-content-policy.mjs';

const args = parseArgs(process.argv.slice(2));
const publicRoot = path.resolve(args.public ?? 'public');
const targetOrigin = new URL(args.origin ?? 'https://pixn-analytics-portfolio.forhm0220.chatgpt.site').origin;
const previewOnly = Boolean(args.preview);

const removedDiscoveryRoutes = REMOVED_DISCOVERY_ROUTES;
const removedDiscoveryRouteSet = new Set(REMOVED_DISCOVERY_ROUTES);
const siteDescription = 'Field notes from PIXN, a student exploring web security, applied cryptography, secure systems, and open-source tooling.';
const koSiteDescription = '웹 보안, 응용 암호학, 안전한 시스템과 오픈소스 도구를 공부하는 학생 PIXN의 기술 노트입니다.';
const priorPublisherSocialUrlSource = String.raw`https?:\/\/(?:www\.)?(?:x\.com\/(?:hahwul|hahwul_)|twitter\.com\/(?:hahwul|hahwul_)|instagram\.com\/(?:hahwul|hahwul_)|linkedin\.com\/(?:in\/)?(?:hahwul|hahwul_))(?:\/[^\s"'<>]*)?`;
const priorPublisherSocialUrlPattern = new RegExp(`^${priorPublisherSocialUrlSource}$`, 'i');
const learningPages = [
  { route: '/writing/', relativePath: 'writing/index.html', title: 'Writing', description: 'Technical posts, study notes, and the preserved security knowledge library in one place.' },
  { route: '/reference/', relativePath: 'reference/index.html', title: 'Reference', description: 'Topic indexes, attack references, security tools, and the technical archive in one place.' },
  { route: '/labs/', relativePath: 'labs/index.html', title: 'Security Labs', description: 'Authorized challenge write-ups, experiments, and lessons from hands-on security practice.' },
  { route: '/labs/dreamhack/', relativePath: 'labs/dreamhack/index.html', title: 'Dreamhack Write-ups', description: 'Study notes and solution approaches from authorized Dreamhack challenges.' },
  { route: '/labs/web/', relativePath: 'labs/web/index.html', title: 'Web Wargame Notes', description: 'Web security challenge notes covering browsers, authentication, injection, and application logic.' },
  { route: '/labs/crypto/', relativePath: 'labs/crypto/index.html', title: 'Cryptography Challenges', description: 'Challenge notes on cryptographic primitives, protocols, encodings, and implementation mistakes.' },
  { route: '/labs/system/', relativePath: 'labs/system/index.html', title: 'System & Pwn Challenges', description: 'Authorized binary, debugging, memory-safety, and exploitation lab notes.' },
];
const learningPageByRoute = new Map(learningPages.map((page) => [page.route, page]));
const learningRouteSet = new Set(learningPages.map((page) => page.route));

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

function personalizeHomeMetadata(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '<title>PIXN — Web Security &amp; Applied Cryptography</title>')
    .replace(
      /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,
      `<meta name="description" content="${siteDescription}">`,
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i,
      '<meta property="og:title" content="PIXN — Web Security &amp; Applied Cryptography">',
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i,
      `<meta property="og:description" content="${siteDescription}">`,
    )
    .replace(
      /<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*>/i,
      '<meta name="twitter:title" content="PIXN — Web Security &amp; Applied Cryptography">',
    )
    .replace(
      /<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*>/i,
      `<meta name="twitter:description" content="${siteDescription}">`,
    );
}

function neutralFooter() {
  return `<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <span class="hw-mark footer-mark" aria-hidden="true"></span>
            <nav class="footer-menu" aria-label="Footer">
                <a href="/writing/">WRITING</a>
                <a href="/sec/">SECURITY</a>
                <a href="/labs/">LABS</a>
                <a href="/reference/">REFERENCE</a>
                <a href="/tags/">TAGS</a>
                <a href="/projects/">TOOLS</a>
                <a href="/feeds/">FEEDS</a>
                <a href="/about/">ABOUT</a>
                <a href="/privacy/">PRIVACY</a>
            </nav>
            <p>PIXN<br />Web Security &amp; Applied Cryptography.</p>
        </div>
    </div>
</footer>`;
}

function homeMain() {
  return `<main id="main-content">
    <div class="container">
        <section class="gallery-hero exhibit is-lit" aria-label="PIXN Web Security and Applied Cryptography">
            <p class="hero-inscription"><span class="hw-mark" role="img" aria-label="PIXN"></span></p>
            <h1 class="hero-statement">Web Security. Applied Cryptography. Built to Understand.</h1>
            <p class="hero-intro">Field notes from PIXN, a student exploring web vulnerabilities, secure systems, cryptographic protocols, and open-source tooling.</p>
            <p class="hero-doors"><a class="hero-archive-link" href="/sec/">Explore the field notes</a></p>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-start">
            <header class="plate-row">
                <h2 class="plate" id="plate-start">Start learning</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/tags/">Browse all topics</a>
            </header>
            <ul class="home-ledger">
                <li><a class="ledger-row" href="/sec/web-security/"><span class="ledger-key">01</span><span class="ledger-body"><span class="ledger-title">Web Security</span><span class="ledger-desc">Browser, protocol, and application security fundamentals</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/sec/cryptography/"><span class="ledger-key">02</span><span class="ledger-body"><span class="ledger-title">Cryptography</span><span class="ledger-desc">Cryptographic primitives, protocols, and implementation risks</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/sec/secure-sdlc/"><span class="ledger-key">03</span><span class="ledger-body"><span class="ledger-title">Secure SDLC</span><span class="ledger-desc">Threat modeling, DevSecOps, and secure delivery practices</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/sec/how-to-hack/"><span class="ledger-key">04</span><span class="ledger-body"><span class="ledger-title">Security Testing</span><span class="ledger-desc">Defensive testing methods for web, mobile, and software</span></span><span aria-hidden="true">↗</span></a></li>
            </ul>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-writing">
            <header class="plate-row">
                <h2 class="plate" id="plate-writing">Writing &amp; notes</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/writing/">All writing</a>
            </header>
            <ul class="home-ledger">
                <li><a class="ledger-row" href="/posts/"><span class="ledger-key">POSTS</span><span class="ledger-body"><span class="ledger-title">Technical Posts</span><span class="ledger-desc">Finished articles and longer technical explanations</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/notes/"><span class="ledger-key">NOTES</span><span class="ledger-body"><span class="ledger-title">Study Notes</span><span class="ledger-desc">Short observations, commands, and ideas recorded while learning</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/blog/"><span class="ledger-key">LIB</span><span class="ledger-body"><span class="ledger-title">Technical Library</span><span class="ledger-desc">The preserved collection of security and development references</span></span><span aria-hidden="true">↗</span></a></li>
            </ul>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-practice">
            <header class="plate-row">
                <h2 class="plate" id="plate-practice">Practice &amp; write-ups</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/labs/">All labs</a>
            </header>
            <ul class="home-ledger">
                <li><a class="ledger-row" href="/labs/dreamhack/"><span class="ledger-key">DH</span><span class="ledger-body"><span class="ledger-title">Dreamhack Write-ups</span><span class="ledger-desc">Challenge approaches, mistakes, and lessons from authorized practice</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/labs/web/"><span class="ledger-key">WEB</span><span class="ledger-body"><span class="ledger-title">Web Wargame Notes</span><span class="ledger-desc">Browser, authentication, injection, and application-logic challenges</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/labs/crypto/"><span class="ledger-key">CRYP</span><span class="ledger-body"><span class="ledger-title">Cryptography Challenges</span><span class="ledger-desc">Protocols, primitives, encodings, and implementation mistakes</span></span><span aria-hidden="true">↗</span></a></li>
                <li><a class="ledger-row" href="/labs/system/"><span class="ledger-key">PWN</span><span class="ledger-body"><span class="ledger-title">System &amp; Pwn Challenges</span><span class="ledger-desc">Binary analysis, debugging, and memory-safety practice</span></span><span aria-hidden="true">↗</span></a></li>
            </ul>
        </section>

        <section class="home-room exhibit" aria-labelledby="plate-resources">
            <header class="plate-row">
                <h2 class="plate" id="plate-resources">Reference library</h2>
                <span class="plate-rule" aria-hidden="true"></span>
                <a class="plate-link" href="/reference/">All references</a>
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

function labsMain() {
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">Security Labs</h1><p class="page-description">Practice, verify, document.</p></header>
            <div class="post-body">
                <p>Hands-on notes from authorized security challenges and isolated lab environments. Each write-up focuses on the reasoning process, failed attempts, and the defensive lesson—not only the final answer.</p>
                <p>Challenge flags, private credentials, and solutions restricted by a platform's rules are not published.</p>
                <ul class="home-ledger">
                    <li><a class="ledger-row" href="/labs/dreamhack/"><span class="ledger-key">DH</span><span class="ledger-body"><span class="ledger-title">Dreamhack Write-ups</span><span class="ledger-desc">Web, crypto, reversing, and pwn challenge notes</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/labs/web/"><span class="ledger-key">WEB</span><span class="ledger-body"><span class="ledger-title">Web Wargame Notes</span><span class="ledger-desc">Browser and application-security practice</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/labs/crypto/"><span class="ledger-key">CRYP</span><span class="ledger-body"><span class="ledger-title">Cryptography Challenges</span><span class="ledger-desc">Protocols, primitives, and implementation mistakes</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/labs/system/"><span class="ledger-key">PWN</span><span class="ledger-body"><span class="ledger-title">System &amp; Pwn Challenges</span><span class="ledger-desc">Binaries, debugging, and memory-safety labs</span></span><span aria-hidden="true">↗</span></a></li>
                </ul>
            </div>
        </article></div>
    </div>
</main>`;
}

function writingMain() {
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">Writing</h1><p class="page-description">Posts, notes, and technical references—kept distinct, found together.</p></header>
            <div class="post-body">
                <p>Choose the format that fits what you want to read. Original paths remain unchanged, so existing links continue to work.</p>
                <ul class="home-ledger">
                    <li><a class="ledger-row" href="/posts/"><span class="ledger-key">POSTS</span><span class="ledger-body"><span class="ledger-title">Technical Posts</span><span class="ledger-desc">Finished articles and longer technical explanations</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/notes/"><span class="ledger-key">NOTES</span><span class="ledger-body"><span class="ledger-title">Study Notes</span><span class="ledger-desc">Short observations, commands, and learning records</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/blog/"><span class="ledger-key">LIB</span><span class="ledger-body"><span class="ledger-title">Technical Library</span><span class="ledger-desc">Preserved web security, software, and tooling references</span></span><span aria-hidden="true">↗</span></a></li>
                </ul>
            </div>
        </article></div>
    </div>
</main>`;
}

function securityMain() {
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">Security Learning</h1><p class="page-description">Foundations, testing methods, and practical security tooling.</p></header>
            <div class="post-body">
                <h2>Core subjects</h2>
                <ul class="home-ledger">
                    <li><a class="ledger-row" href="/sec/web-security/"><span class="ledger-key">01</span><span class="ledger-body"><span class="ledger-title">Web Security</span><span class="ledger-desc">Browsers, protocols, headers, and application security</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/cryptography/"><span class="ledger-key">02</span><span class="ledger-body"><span class="ledger-title">Cryptography</span><span class="ledger-desc">Primitives, protocols, and implementation risks</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/secure-sdlc/"><span class="ledger-key">03</span><span class="ledger-body"><span class="ledger-title">Secure SDLC</span><span class="ledger-desc">Threat modeling, DevSecOps, and secure delivery</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/how-to-hack/"><span class="ledger-key">04</span><span class="ledger-body"><span class="ledger-title">Security Testing</span><span class="ledger-desc">Authorized testing methods for web, software, and platforms</span></span><span aria-hidden="true">↗</span></a></li>
                </ul>
                <h2>Specialized guides</h2>
                <ul class="home-ledger">
                    <li><a class="ledger-row" href="/sec/web-hacking/"><span class="ledger-key">WEB</span><span class="ledger-body"><span class="ledger-title">Web Hacking</span><span class="ledger-desc">Applied web testing and out-of-band techniques</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/mobile-hacking/"><span class="ledger-key">MOB</span><span class="ledger-body"><span class="ledger-title">Mobile Security</span><span class="ledger-desc">Mobile application testing references</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/caido/"><span class="ledger-key">CAIDO</span><span class="ledger-body"><span class="ledger-title">Caido</span><span class="ledger-desc">Web security proxy setup and workflows</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/zap/"><span class="ledger-key">ZAP</span><span class="ledger-body"><span class="ledger-title">OWASP ZAP</span><span class="ledger-desc">Scanning, scripting, and automation guides</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/metasploit/"><span class="ledger-key">MSF</span><span class="ledger-body"><span class="ledger-title">Metasploit</span><span class="ledger-desc">Framework references for authorized labs</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/sec/flipper/"><span class="ledger-key">FLIP</span><span class="ledger-body"><span class="ledger-title">Flipper</span><span class="ledger-desc">Hardware security study notes</span></span><span aria-hidden="true">↗</span></a></li>
                </ul>
            </div>
        </article></div>
    </div>
</main>`;
}

function webSecurityMain() {
  const topics = [
    ['/sec/web-security/graphql/', 'GraphQL', 'Query design and API security'],
    ['/sec/web-security/csp/', 'Content Security Policy', 'Browser-enforced content restrictions'],
    ['/sec/web-security/owasp-top-10/', 'OWASP Top 10', 'Common web application security risks'],
    ['/sec/web-security/websocket/', 'WebSocket', 'Persistent connection security'],
    ['/sec/web-security/cookies/', 'Cookies', 'Session state and browser cookie controls'],
    ['/sec/web-security/sri/', 'Subresource Integrity', 'Integrity checks for external resources'],
    ['/sec/web-security/sse/', 'Server-Sent Events', 'One-way event stream security'],
    ['/sec/web-security/coop/', 'Cross-Origin Opener Policy', 'Browsing-context isolation'],
  ];
  return collectionMain('Web Security', 'Browser, protocol, and application security topics.', topics);
}

function postsMain() {
  const topics = [
    ['/posts/2026/', '2026 Posts', 'Browse the current year archive'],
    ['/posts/2026/rust-and-crystal/', 'Rust and Crystal: My Two Main Languages', 'Programming language notes'],
    ['/posts/2026/traveling-with-hermes-in-japan/', 'Traveling with Hermes in Japan', 'Remote AI workflow notes'],
    ['/posts/2026/building-ai-friendly-clis/', 'Building AI-Friendly CLIs', 'JSON-first command-line design'],
  ];
  return collectionMain('Posts', 'Finished articles and longer technical explanations.', topics);
}

function notesMain() {
  const topics = [
    ['/notes/claude-code/', 'Claude Code', 'Claude Code workflow notes'],
    ['/notes/claude-code/remove-co-authored-by/', 'Remove co-authored-by when committing', 'A focused Git configuration note'],
    ['/notes/grok-build/', 'Grok Build', 'Reserved topic for future notes'],
    ['/notes/hhkb/', 'HHKB', 'Keyboard documentation and references'],
  ];
  return collectionMain('Notes', 'Quick notes, tips, and references recorded while learning.', topics);
}

function blogMain() {
  const counts = { 2014: 1, 2015: 66, 2016: 63, 2017: 91, 2018: 128, 2019: 132, 2020: 65, 2021: 117, 2022: 64, 2023: 32, 2024: 15, 2025: 11 };
  const topics = Object.entries(counts).reverse().map(([year, count]) => [`/blog/${year}/`, year, `${count} technical ${count === 1 ? 'article' : 'articles'}`]);
  return collectionMain('Technical Library', 'Preserved security, software, and tooling references organized by year.', topics);
}

function collectionMain(title, description, topics) {
  const rows = topics.map(([href, label, detail], index) => `<li><a class="ledger-row" href="${href}"><span class="ledger-key">${String(index + 1).padStart(2, '0')}</span><span class="ledger-body"><span class="ledger-title">${label}</span><span class="ledger-desc">${detail}</span></span><span aria-hidden="true">↗</span></a></li>`).join('');
  return `<main id="main-content"><div class="container"><div class="post-wrapper"><article class="post-content"><header class="page-header"><h1 class="page-title">${title}</h1><p class="page-description">${description}</p></header><div class="post-body"><ul class="home-ledger">${rows}</ul></div></article></div></div></main>`;
}

function referenceMain() {
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><h1 class="page-title">Reference</h1><p class="page-description">Indexes and technical references for finding the right material quickly.</p></header>
            <div class="post-body">
                <p>Browse the preserved knowledge base by topic, technique, tool, or publication period.</p>
                <ul class="home-ledger">
                    <li><a class="ledger-row" href="/tags/"><span class="ledger-key">A–Z</span><span class="ledger-body"><span class="ledger-title">Topic Index</span><span class="ledger-desc">Browse security, development, and tooling notes by tag</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/cullinan/attack/"><span class="ledger-key">ATK</span><span class="ledger-body"><span class="ledger-title">Attack References</span><span class="ledger-desc">Techniques organized for study and defensive verification</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/cullinan/tool/"><span class="ledger-key">TOOLS</span><span class="ledger-body"><span class="ledger-title">Security Tool Catalog</span><span class="ledger-desc">Testing utilities, scanners, and supporting workflows</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/cullinan/develop/"><span class="ledger-key">DEV</span><span class="ledger-body"><span class="ledger-title">Development References</span><span class="ledger-desc">Implementation and engineering references</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/cullinan/security/"><span class="ledger-key">SEC</span><span class="ledger-body"><span class="ledger-title">Security References</span><span class="ledger-desc">General defensive security reference material</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/dev/"><span class="ledger-key">CODE</span><span class="ledger-body"><span class="ledger-title">Development Notes</span><span class="ledger-desc">Software development notes preserved in the library</span></span><span aria-hidden="true">↗</span></a></li>
                    <li><a class="ledger-row" href="/archive/"><span class="ledger-key">2014—</span><span class="ledger-body"><span class="ledger-title">Technical Archive</span><span class="ledger-desc">Historical security and development notes</span></span><span aria-hidden="true">↗</span></a></li>
                </ul>
            </div>
        </article></div>
    </div>
</main>`;
}

function labCategoryMain(page) {
  const categoryCopy = {
    '/labs/dreamhack/': ['Dreamhack', 'Web, crypto, reversing, and pwn challenges solved in an authorized learning environment.'],
    '/labs/web/': ['Web', 'Notes on XSS, injection, authentication, browser behavior, and application logic.'],
    '/labs/crypto/': ['Crypto', 'Notes on cryptographic primitives, protocols, encodings, and implementation pitfalls.'],
    '/labs/system/': ['System · Pwn', 'Notes on binaries, debugging, memory safety, and exploitation inside authorized labs.'],
  };
  const [label, introduction] = categoryCopy[page.route];
  return `<main id="main-content">
    <div class="container">
        <div class="post-wrapper"><article class="post-content">
            <header class="page-header"><p class="post-meta">LABS / ${label}</p><h1 class="page-title">${page.title}</h1><p class="page-description">${page.description}</p></header>
            <div class="post-body">
                <p>${introduction}</p>
                <h2>Write-up format</h2>
                <ol><li>Challenge and learning objective</li><li>What I observed and tried</li><li>Why the approach worked or failed</li><li>Secure implementation and key lesson</li></ol>
                <h2>Write-ups</h2>
                <p>Write-ups will appear here as challenges are completed and reviewed.</p>
                <p><a href="/labs/">← Back to Security Labs</a></p>
            </div>
        </article></div>
    </div>
</main>`;
}

function personalizePageMetadata(html, page) {
  const absoluteUrl = `${targetOrigin}${page.route}`;
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title} | PIXN</title>`)
    .replace(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i, `<meta name="description" content="${page.description}">`)
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/i, `<meta property="og:title" content="${page.title}">`)
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/i, `<meta property="og:url" content="${absoluteUrl}">`)
    .replace(/<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*>/i, `<meta property="og:description" content="${page.description}">`)
    .replace(/<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*>/i, `<meta name="twitter:title" content="${page.title}">`)
    .replace(/<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*>/i, `<meta name="twitter:description" content="${page.description}">`)
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, `<link rel="canonical" href="${absoluteUrl}">`)
    .replace(/\s*<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=)[^>]*>/gi, '')
    .replace(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"Article"[\s\S]*?<\/script>/i, `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${page.title}","url":"${absoluteUrl}","description":"${page.description}","image":"${targetOrigin}/og-pixn-field-notes.png"}</script>`);
}

function studentNav(route) {
  const links = [['/sec/', 'Learn'], ['/writing/', 'Writing'], ['/labs/', 'Labs'], ['/projects/', 'Projects'], ['/reference/', 'Reference'], ['/about/', 'About']];
  const topLevel = route === '/' ? '' : `/${route.split('/').filter(Boolean)[0]}/`;
  const activeHref = ['/writing/', '/posts/', '/notes/', '/blog/'].includes(topLevel)
    ? '/writing/'
    : ['/reference/', '/tags/', '/cullinan/', '/archive/'].includes(topLevel)
      ? '/reference/'
      : topLevel;
  return `<div class="nav-menu" id="nav-menu">${links.map(([href, label]) => `<a href="${href}"${activeHref === href ? ' class="active"' : ''}>${label}</a>`).join('')}</div>`;
}

function aboutMain(language) {
  const korean = language === 'ko';
  const title = korean ? 'PIXN 소개' : 'About PIXN';
  const description = korean ? koSiteDescription : siteDescription;
  const paragraphs = korean
    ? `<p>PIXN은 웹 보안, 응용 암호학, 안전한 시스템을 공부하며 보안 엔지니어를 목표로 하는 학생입니다.</p>
       <p>이 웹사이트에는 취약점의 원리, 방어 관점의 테스트 방법, 암호 프로토콜, Secure SDLC와 오픈소스 보안 도구를 공부하며 정리한 내용을 기록합니다.</p>
       <p>오래된 자료는 역사적 참고 자료로 제공되며, 실제 시스템에서는 반드시 최신 공식 문서와 안전한 실습 환경을 함께 사용해야 합니다.</p>`
    : `<p>PIXN is a student studying web security, applied cryptography, and secure systems while working toward becoming a security engineer.</p>
       <p>This website is where PIXN organizes field notes on vulnerability research, defensive testing, cryptographic protocols, Secure SDLC guidance, and open-source security tooling.</p>
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
            <header class="page-header"><h1 class="page-title">Privacy Policy</h1><p class="page-description">Privacy information for this personal website.</p></header>
            <div class="post-body">
                <p><strong>Last updated:</strong> August 2026</p>
                <p>This website currently provides public, read-only reference pages and does not offer visitor accounts or contact forms.</p>
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
    ? '이 경로에는 이전 발행자의 개인 소개, 연락처, 경력 또는 행사 기록이 있어 이 사이트의 학습 자료에서 제외했습니다.'
    : 'This route contained personal profile, contact, career, or event material from the previous publication and is not part of this site’s learning materials.';
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
            ${studentNav('/')}
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

function neutralizePriorPublisherSocialReferences(value) {
  let output = value
    .replace(
      new RegExp(`<p\\b[^>]*>\\s*(?:<a\\b(?=[^>]*href=["']${priorPublisherSocialUrlSource}["'])[^>]*>(?:(?!<\\/a>)[\\s\\S])*?<\\/a>|${priorPublisherSocialUrlSource})\\s*<\\/p>\\s*`, 'gi'),
      '',
    )
    .replace(
      new RegExp(`<li\\b[^>]*>(?:(?!<\\/li>)[\\s\\S])*?${priorPublisherSocialUrlSource}(?:(?!<\\/li>)[\\s\\S])*?<\\/li>\\s*`, 'gi'),
      '',
    )
    .replace(
      new RegExp(`<a\\b(?=[^>]*href=["']${priorPublisherSocialUrlSource}["'])[^>]*>([\\s\\S]*?)<\\/a>`, 'gi'),
      (_match, label) => {
        const plainLabel = label.replace(/<[^>]+>/g, '').trim();
        return priorPublisherSocialUrlPattern.test(plainLabel) ? '' : label;
      },
    )
    .replace(new RegExp(priorPublisherSocialUrlSource, 'gi'), '');

  output = output
    .replace(/웹에서도 비슷합니다\.\s*제\s*트윗\s*하나를 참고해주세요!/g, '웹에서도 같은 원리를 적용할 수 있습니다.')
    .replace(/저 또한 dalfox에 바로 반영하고 관련\s*트윗을 공유했습니다\./gi, 'Dalfox에도 같은 변경이 반영되었습니다.')
    .replace(/제가 최근\s*트윗\s*엔\s*/g, '다음은 ')
    .replace(/As I told you on\s*,\s*/gi, 'In this context, ')
    .replace(/개인적으로 광고\s*이슈때문에 좋아하지 않기 때문에/g, '광고 문제를 피하고자')
    .replace(/가볍게\s*리트윗했더니/g, '관련 변경을 확인해보니')
    .replace(/Read the tweet above to create a list of http services based on multiple targets through the pipeline\./gi, 'Create a list of HTTP services based on multiple targets through the pipeline.');
  return output;
}

function neutralizeTechnicalIdentifiers(value) {
  return value
    .replace(/\/Users\/(?:hahwul|hawul)\b/gi, '/Users/researcher')
    .replace(/\/home\/(?:hahwul|hawul)\b/gi, '/home/researcher')
    .replace(/C:\\Users\\(?:hahwul|hawul)\b/gi, 'C:\\Users\\researcher')
    .replace(/https?:\/\/(?:www\.)?hahwul\.com(?=\/|[?;#\\]|["'&<\s]|$)/gi, 'https://target.example')
    .replace(/\bwww\.hahwul\.com\b/gi, 'target.example')
    .replace(/(?<![A-Za-z0-9_.@-])hahwul\.com\b/gi, 'example.com')
    .replace(/https-hahwulcom/gi, 'https-targetexample')
    .replace(/https-www-hahwul-com/gi, 'https-target-example')
    .replace(/Author:\s*hahwul\b/gi, 'Author: Example Contributor')
    .replace(/Committer:\s*hahwul\b/gi, 'Committer: Example Contributor')
    .replace(/Signed-off-by:\s*hahwul\s*&lt;[^&]*&gt;/gi, 'Signed-off-by: Example Contributor &lt;contributor@example.com&gt;')
    .replace(/Signed-off-by:\s*hahwul\s*<[^>]*>/gi, 'Signed-off-by: Example Contributor <contributor@example.com>')
    .replace(/Twitter:\s*hahwul\b/gi, 'Team: Security Engineering')
    .replace(/Hi,? I am hahwul\b/gi, 'Hi, I am Alex')
    .replace(/Sample Login page - by hahwul/gi, 'Sample Login page')
    .replace(/codeblack\.net by hahwul/gi, 'example.com demo')
    .replace(/Comment=HaHwul Burp/gi, 'Comment=Burp Suite launcher')
    .replace(/hahwul@gail\.com/gi, 'alice@example.com')
    .replace(/contact information is not published/gi, 'security@example.com')
    .replace(/(["']author["']\s*:\s*(?:\[\s*)?)["']hahwul["']/gi, '$1"example-author"')
    .replace(/(\bauthor\s*:\s*(?:-\s*)?)["']hahwul["']/gi, '$1"example-author"')
    .replace(/\bauthors\s*=\s*\["hahwul"\]/gi, 'authors = ["Example Author"]')
    .replace(/s\.authors\s*=\s*\[&quot;hahwul&quot;\]/gi, 's.authors     = [&quot;Example Author&quot;]')
    .replace(/s\.authors\s*=\s*\["hahwul"\]/gi, 's.authors = ["Example Author"]')
    .replace(/This script crafted by hahwul/gi, 'Custom header script example')
    .replace(/<cite>hahwul<\/cite>/gi, '<cite>PIXN editorial note</cite>');
}

function neutralizeSearchNarrative(route, value) {
  let output = value;
  if (route === '/blog/2020/find-s3-vulnerability-widh-pipelinging/') {
    output = output
      .replace(
        /Hi hackers![\s\S]*?pipelining을 이용하여 쉽게 찾는 방법들에 대해 이야기하려고 합니다\./i,
        'This guide shows how to connect S3 bucket takeover and misconfiguration checks into a repeatable pipeline. 이 문서에서는 S3 Bucket takeover와 Misconfiguration 점검을 파이프라인으로 연결하는 방법을 설명합니다.',
      )
      .replace(
        /저의 경우엔[\s\S]*?등등\.\.\./i,
        '서브도메인 탐색, HTTP 서비스 식별, S3 점검 도구를 파이프라인으로 연결할 수 있습니다. 관련 배경은 서브도메인 테이크오버 탐색 문서에서 확인할 수 있습니다.',
      )
      .replace(
        /First, create a host file\.[\s\S]*?http 서비스의 리스트를 만들 수 있습니다\./i,
        'First, create a host file and build a list of reachable HTTP services from multiple targets using the pipeline described above. 먼저 hosts 파일을 만들고, 위 파이프라인으로 여러 대상의 HTTP 서비스 목록을 생성합니다.',
      );
  }
  if (route === '/blog/2021/developer-certificate-of-origin-and-github/') {
    output = output
      .replace(
        /어제 밤에 ZAP쪽에 Pull Request를 날렸다가[\s\S]*?간략하게 글로 작성해봅니다\./i,
        '오픈소스 프로젝트에서 DCO 검사를 사용하는 경우 sign-off가 없는 커밋은 CI에서 거부될 수 있습니다. 아래에서는 DCO의 의미, sign-off 커밋 방법, 누락된 서명을 보완하는 절차를 정리합니다.',
      )
      .replace(
        /sign-off commit은 예전에 어느\(쿠팡인가\.\.\) 개발자분이 쓰신 글을 보고[\s\S]*?오픈소스를 지원하는 개발자에겐 매력적인 방법이 아닐까 싶습니다\./i,
        'DCO sign-off는 오픈소스 기여의 출처와 제출 권한을 명확히 기록하는 실용적인 방법입니다. 프로젝트 정책을 확인하고 필요한 경우 커밋에 sign-off를 포함하세요.',
      );
  }
  if (route === '/blog/2021/what-is-wellknown-directory/') {
    output = output
      .replace(
        /간혹 웹 페이지를 들여다보면 \.well-known 디렉토리를 만나게됩니다\.[\s\S]*?조금더 살펴볼까 합니다\./i,
        '.well-known 디렉터리는 사이트가 보안 연락처와 운영 정보를 표준 경로로 제공할 때 사용됩니다. 여기서는 주요 파일과 안전한 작성 방법을 살펴봅니다.',
      )
      .replace(
        /이참에 humans\.txt도 작성해봅시다\.[\s\S]*?정해진 포맷이 있는건 아닌 것 같습니다\.\)/i,
        'humans.txt는 서비스를 운영하는 팀과 사이트 정보를 공개하는 선택적 문서입니다. 꼭 필요한 정보만 기재하고 개인 연락처는 노출하지 않는 편이 안전합니다.',
      )
      .replace(
        /security\.txt for me # If you find any security issues on this site, please contact me![\s\S]*?Preferred-Languages: en, ko/i,
        'security.txt example # Report security issues through the published security contact. Contact: mailto:security@example.com Canonical: https://example.com/.well-known/security.txt Preferred-Languages: en, ko',
      )
      .replace(
        /물론 humans\.txt 에서 예시를 보면[\s\S]*?전 생략했습니다\./i,
        'humans.txt에는 서비스 정보도 포함할 수 있지만, 보안 관점에서는 꼭 필요한 정보만 공개하는 편이 안전합니다.',
      );
  }
  return output;
}

function neutralizePriorPublisherArticle(route, html) {
  let output = html;
  if (route === '/blog/2019/bypass-host-validation-technique-in-android/') {
    output = output.replace(
      /<p>웹에서도 비슷합니다\. 제 <a\b[^>]*href=["']https?:\/\/twitter\.com\/hahwul\/status\/1110580091266826241["'][^>]*>트윗<\/a> 하나를 참고해주세요!<\/p>/i,
      '<p>웹 환경에서도 같은 호스트 검증 우회 원리를 확인할 수 있습니다.</p>',
    );
  }
  if (route === '/blog/2020/jekyll-utterances/') {
    output = output.replace(
      /<p>최근에 블로그를 blogger에서 github page로 옮기면서[\s\S]*?<a href=["']https:\/\/utteranc\.es\/["']>Utterances<\/a>를 알게 되었습니다\.<\/p>\s*<p>그래서 현재 블로그에 Utterances를 적용하면서 방법 정리할겸 글로 남겨둡니다\.<\/p>/i,
      '<p>Jekyll 사이트에서 광고 없이 GitHub Issues 기반 댓글을 제공하려면 <a href="https://utteranc.es/">Utterances</a>를 사용할 수 있습니다. 아래에서 적용 방법을 정리합니다.</p>',
    );
  }
  if (route === '/blog/2020/find-s3-vulnerability-widh-pipelinging/') {
    output = output
      .replace(
        /<p>저의 경우엔[\s\S]*?<\/p>\s*<p>제 트윗을 보면[\s\S]*?<a href=["']https:\/\/pixn-analytics-portfolio\.forhm0220\.chatgpt\.site\/2019\/10\/find-subdomain-takeover-with-amass-and-subjack\.html["'][^>]*>[\s\S]*?<\/a><\/p>/i,
        '<p>서브도메인 탐색, HTTP 서비스 식별, S3 점검 도구를 파이프라인으로 연결할 수 있습니다. 관련 배경은 <a href="https://pixn-analytics-portfolio.forhm0220.chatgpt.site/2019/10/find-subdomain-takeover-with-amass-and-subjack.html">서브도메인 테이크오버 탐색 문서</a>에서 확인할 수 있습니다.</p>',
      )
      .replace(
        /<p><a\b[^>]*href=["']https:\/\/twitter\.com\/hahwul\/status\/1236334555000274944["'][^>]*>[\s\S]*?<\/a>\s*First, create a host file\.[\s\S]*?http 서비스의 리스트를 만들 수 있습니다\.<\/p>/i,
        '<p>First, create a host file and build a list of reachable HTTP services from multiple targets using the pipeline described above.<br>먼저 hosts 파일을 만들고, 위 파이프라인으로 여러 대상의 HTTP 서비스 목록을 생성합니다.</p>',
      )
      .replace(/<p>naabu \+ httprobe \+ meg\s*<\/p>\s*<p>등등\.\.\.<\/p>/i, '');
  }
  if (route === '/blog/2020/using-flat-darcula-theme-in-ZAP/') {
    output = output.replace(
      /<p>트위터를 보던 중 사이먼의 어마어마한 <a\b[^>]*href=["']https:\/\/twitter\.com\/psiinon\/status\/1232299460019052546["'][^>]*>트윗<\/a>을 보게되었습니다\.[\s\S]*?그래서 아직 Weekly 버전에도 반영되지 않았지만, 미리 체험해보기로 하겠습니다\.<\/p>/i,
      '<p><a href="https://twitter.com/psiinon/status/1232299460019052546">Simon Bennetts의 안내</a>에 따르면 ZAP 다크 모드 변경은 이미 커밋되어 Weekly 반영 전에도 직접 시험할 수 있었습니다.</p>',
    );
  }
  if (route === '/blog/2021/owasp-zap-oast/') {
    output = output.replace(
      /<p>Hi hackers and geeks! Today, ZAP OAST was released as Alpha version\. \(As I told you on <a\b[^>]*href=["']https:\/\/twitter\.com\/hahwul\/status\/1415710990608461827["'][^>]*>[\s\S]*?<\/a>, OAST is a tool for identifying out-of-band, similar to callback, which is very useful for SSRF, RCE, etc\.\)<\/p>/i,
      '<p>ZAP OAST identifies out-of-band interactions and is useful when testing SSRF, RCE, and similar callback-based behavior.</p>',
    );
  }
  if (route === '/blog/2021/zap-automation-gui/') {
    output = output.replace(
      /<p>최근에 ZAP Automation framework가 0\.4 버전으로 업데이트 됬습니다\.[\s\S]*?0\.4 버전대 기능이라고 합니다\.<\/p>\s*<p><a\b[^>]*href=["']https:\/\/twitter\.com\/hahwul\/status\/1423145897232265220["'][^>]*>[\s\S]*?<\/a><\/p>\s*<p>오늘은 Automation Framework에 새로 추가된 GUI 부분에 대해서 살펴보려고 합니다\.<\/p>/i,
      '<p>ZAP Automation Framework 0.4에는 Automation Framework를 UI에서 제어하는 기능이 추가되었습니다. 아래에서 새 GUI를 살펴봅니다.</p>',
    );
  }
  if (route === '/blog/2022/oast-power-up/') {
    output = output.replace(
      /<p>제가 최근 <a\b[^>]*href=["']https:\/\/twitter\.com\/hahwul\/status\/1569476833619619840["'][^>]*>트윗<\/a>엔 <a href=["']https:\/\/github\.com\/knassar702\/lorsrf["']>lorsrf<\/a> 도구에 대한 내용이 있습니다\. 이 도구는 OAST 테스팅 시 정보를 쉽게 수집할 수 있도록 HOST, PARAM 등의 정보를 OAST 주소에 붙여서 만들어줍니다\.<\/p>/i,
      '<p><a href="https://github.com/knassar702/lorsrf">lorsrf</a>는 OAST URL에 HOST, PARAM 등의 메타데이터를 붙여 콜백 정보를 더 쉽게 분류할 수 있게 합니다.</p>',
    );
  }
  if (route === '/blog/2021/developer-certificate-of-origin-and-github/') {
    output = output
      .replace(
        /<p>어제 밤에 ZAP쪽에 Pull Request를 날렸다가[\s\S]*?<p>저에게 한번 더 확인할 기회를 준 sign-off 관련 내용은 DCO\(Developer Certificate of Origin\)에 관한 내용이였고 오늘은 이러한 DCO가 뭔지, 어떻게 commit 해야하는지, 실수했을 땐 어떻게 해야하는지 간략하게 글로 작성해봅니다\.<\/p>/i,
        '<p>오픈소스 프로젝트에서 DCO 검사를 사용하는 경우 sign-off가 없는 커밋은 CI에서 거부될 수 있습니다.</p><pre><code>Commit sha: example,\nAuthor: Example Contributor,\nCommitter: Example Contributor;\n\nThe sign-off is missing.\n</code></pre><p>아래에서는 DCO의 의미, sign-off 커밋 방법, 누락된 서명을 보완하는 절차를 정리합니다.</p>',
      )
      .replace(
        /<p>sign-off commit은 예전에 어느\(쿠팡인가\.\.\) 개발자분이 쓰신 글을 보고[\s\S]*?오픈소스를 지원하는 개발자에겐 매력적인 방법이 아닐까 싶습니다\.<\/p>/i,
        '<p>DCO sign-off는 오픈소스 기여의 출처와 제출 권한을 명확히 기록하는 실용적인 방법입니다. 프로젝트 정책을 확인하고 필요한 경우 커밋에 sign-off를 포함하세요.</p>',
      );
  }
  if (route === '/blog/2021/what-is-wellknown-directory/') {
    output = output
      .replace(
        /<p>간혹 웹 페이지를 들여다보면[\s\S]*?조금더 살펴볼까 합니다\.<\/p>/i,
        '<p>.well-known 디렉터리는 사이트가 보안 연락처와 운영 정보를 표준 경로로 제공할 때 사용됩니다. 여기서는 주요 파일과 안전한 작성 방법을 살펴봅니다.</p>',
      )
      .replace(
        /<p>이참에 humans\.txt도 작성해봅시다\.[\s\S]*?정해진 포맷이 있는건 아닌 것 같습니다\.\)<\/p>/i,
        '<p>humans.txt는 서비스를 운영하는 팀과 사이트 정보를 공개하는 선택적 문서입니다. 꼭 필요한 정보만 기재하고 개인 연락처는 노출하지 않는 편이 안전합니다.</p>',
      )
      .replace(
        /<pre><code>PIXN\s*Site: https:\/\/pixn-analytics-portfolio\.forhm0220\.chatgpt\.site\s*Twitter: hahwul\s*<\/code><\/pre>/i,
        '<pre><code>Team: Security Engineering\nSite: https://example.com\n</code></pre>',
      )
      .replace(
        /<h3 id="securitytxt-for-me">security\.txt for me<\/h3>\s*<pre><code>[\s\S]*?Preferred-Languages: en, ko\s*<\/code><\/pre>/i,
        '<h3 id="securitytxt-example">security.txt example</h3><pre><code># Report security issues through the published security contact.\nContact: mailto:security@example.com\nCanonical: https://example.com/.well-known/security.txt\nPreferred-Languages: en, ko\n</code></pre>',
      )
      .replace(
        /<p>물론 humans\.txt 에서 <a href="http:\/\/humanstxt\.org\/Standard\.html">예시<\/a>를 보면[\s\S]*?전 생략했습니다\.<\/p>/i,
        '<p><a href="http://humanstxt.org/Standard.html">humans.txt 예시</a>에는 서비스 정보도 포함할 수 있지만, 보안 관점에서는 꼭 필요한 정보만 공개하는 편이 안전합니다.</p>',
      )
      .replace(/Contact: https:\/\/github\.com\/hahwul\/assets\.hahwul\.com\/discussions/gi, 'Contact: mailto:security@example.com');
  }
  if (route === '/blog/2018/Security-testing-SAML-SSO-vulnerability-and-pentest/') {
    output = output
      .replace(/hahwul@gail\.com/gi, 'alice@example.com')
      .replace(/contact information is not published/gi, 'alice@example.com');
  }
  if (
    route === '/blog/2024/passivescan-in-owasp-noir/' ||
    route === '/cullinan/attack/dependency-confusion/' ||
    route === '/dev/ruby/ruby-cheatsheet/' ||
    route === '/ko/dev/ruby/ruby-cheatsheet/'
  ) {
    output = output.replace(/&quot;hahwul&quot;/gi, '&quot;Example Author&quot;');
  }
  return output;
}

function cleanChrome(html, route) {
  let output = html
    .replace(/(<title>[\s\S]*?)\s*\|\s*HAHWUL(<\/title>)/gi, '$1 | PIXN$2')
    .replace(/title=["']HAHWUL(?: \(KO\)| \(한국어\))?["']/gi, 'title="PIXN"')
    .replaceAll('Offensive Security Engineer, Developer and H4cker.', siteDescription)
    .replace(/"name":"HAHWUL"/g, '"name":"PIXN"')
    .replace(/"name":"HAHWUL \(KO\)"/g, '"name":"PIXN"')
    .replace(/<div\b[^>]*class=["'][^"']*\bnav-menu\b[^"']*["'][^>]*id=["']nav-menu["'][^>]*>[\s\S]*?<\/div>/i, studentNav(route))
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
  return neutralizeTechnicalIdentifiers(neutralizePriorPublisherSocialReferences(removePersonalRouteLinks(output)));
}

function localizeRuntimeAssets(html) {
  return html
    .replaceAll(`${targetOrigin}/assets/`, '/assets/')
    .replaceAll(`${targetOrigin}/search_index.json`, '/search_index.json')
    .replaceAll(`${targetOrigin}/og.png`, `${targetOrigin}/og-pixn-field-notes.png`)
    .replace(
      new RegExp(`${escapeRegExp(targetOrigin)}/og-images/[^"'<>\\s]+\\.png`, 'g'),
      `${targetOrigin}/og-pixn-field-notes.png`,
    );
}

function transformHtml(relativePath, html) {
  const route = relativeFileToRoute(relativePath);
  const language = route.startsWith('/ko/') ? 'ko' : 'en';
  if (removedDiscoveryRouteSet.has(route)) return localizeRuntimeAssets(removedPage(language));

  let output = html;
  if (route === '/') output = personalizeHomeMetadata(replaceMain(output, homeMain()));
  if (route === '/sec/') output = replaceMain(output, securityMain());
  if (route === '/sec/web-security/') output = replaceMain(output, webSecurityMain());
  if (route === '/posts/') output = replaceMain(output, postsMain());
  if (route === '/notes/') output = replaceMain(output, notesMain());
  if (route === '/blog/') output = replaceMain(output, blogMain());
  if (route === '/about/') output = replaceMain(output, aboutMain('en'));
  if (route === '/ko/about/') output = replaceMain(output, aboutMain('ko'));
  if (route === '/privacy/') output = replaceMain(output, privacyMain());
  const learningPage = learningPageByRoute.get(route);
  if (learningPage) {
    output = personalizePageMetadata(output, learningPage);
    output = replaceMain(output, route === '/writing/' ? writingMain() : route === '/reference/' ? referenceMain() : route === '/labs/' ? labsMain() : labCategoryMain(learningPage));
  }
  output = neutralizePriorPublisherArticle(route, output);
  output = cleanChrome(output, route);
  if (route === '/blog/2018/Security-testing-SAML-SSO-vulnerability-and-pentest/') {
    output = output.replaceAll('security@example.com', 'alice@example.com');
  }

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
  return localizeRuntimeAssets(output);
}

function transformSearchIndex(text) {
  const documents = JSON.parse(text)
    .filter((document) => !isPersonalUrl(document.url) && !learningRouteSet.has(document.url))
    .map((document) => {
      const updated = { ...document };
      for (const key of ['title', 'content', 'description']) {
        if (typeof updated[key] === 'string') {
          updated[key] = neutralizeTechnicalIdentifiers(neutralizePriorPublisherSocialReferences(updated[key]))
            .replaceAll('hahwul@gmail.com', 'security@example.com')
            .replace(/https:\/\/x\.com\/hahwul\/status\/\d+/gi, '[original announcement removed]')
            .replaceAll('@hahwul', 'archived author')
            .replaceAll('HAHWUL', 'PIXN');
        }
      }
      if (typeof updated.content === 'string') updated.content = neutralizeSearchNarrative(updated.url, updated.content);
      if (updated.url === '/about/') {
        updated.title = 'About PIXN';
        updated.description = siteDescription;
        updated.content = 'PIXN is a student studying web security, applied cryptography, and secure systems. This website organizes PIXN’s field notes on secure software engineering and open-source security tools.';
      }
      if (updated.url === '/ko/about/') {
        updated.title = 'PIXN 소개';
        updated.description = koSiteDescription;
        updated.content = 'PIXN은 웹 보안, 응용 암호학, 안전한 시스템을 공부하는 학생입니다. 이 웹사이트에는 공부한 보안 지식과 오픈소스 도구 관련 기술 노트를 정리합니다.';
      }
      if (updated.url === '/privacy/') {
        updated.description = 'Privacy information for this personal website.';
        updated.content = 'This website provides public, read-only reference pages without visitor accounts or contact forms. The hosting provider may process basic request information to deliver and protect the site. This notice must be updated before optional analytics or advertising technology is introduced.';
      }
      if (updated.url === '/blog/' || updated.url === '/ko/blog/') {
        updated.content = 'A technical archive of security research, development notes, and practical references.';
        updated.description = updated.url.startsWith('/ko/') ? '보안 연구와 개발 기록을 정리한 기술 아카이브' : 'Security research and development archive';
      }
      return updated;
    });
  for (const page of learningPages) {
    const writing = page.route === '/writing/';
    const reference = page.route === '/reference/';
    documents.push({
      title: page.title,
      content: writing
        ? 'A single writing hub for technical posts, short study notes, and the preserved security knowledge library. Original Posts, Notes, and Blog paths remain available.'
        : reference
          ? 'A single reference hub for the topic index, attack techniques, security tool catalog, and historical technical archive.'
        : page.route === '/labs/'
        ? 'Authorized security challenge write-ups and isolated lab notes covering Dreamhack, web security, cryptography, systems, and pwn. Each note records observations, attempts, failures, and defensive lessons.'
        : `${page.description} Write-ups document the learning objective, observations, attempted approaches, why they worked or failed, and the secure implementation lesson.`,
      tags: writing ? ['writing', 'posts', 'notes'] : reference ? ['reference', 'tags', 'archive'] : ['security-labs', page.route.split('/').filter(Boolean).at(-1)],
      url: page.route,
      section: writing ? 'writing' : reference ? 'reference' : 'labs',
      description: page.description,
      lang: 'en',
    });
  }
  return `${JSON.stringify(documents)}\n`;
}

function transformSitemap(text) {
  let output = text.replace(/\s*<url>[\s\S]*?<\/url>/gi, (block) => {
    const locations = [...block.matchAll(/<(?:loc|xhtml:link)\b[^>]*(?:href=["']([^"']+)["'])?[^>]*>([^<]*)/gi)]
      .flatMap((match) => [match[1], match[2]])
      .filter(Boolean);
    return locations.some(isPersonalUrl) || locations.some((value) => learningRouteSet.has(pathFromAbsoluteUrl(value))) ? '' : block;
  });
  const entries = learningPages.map((page) => `  <url>\n    <loc>${targetOrigin}${page.route}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${['/labs/', '/writing/', '/reference/'].includes(page.route) ? '0.8' : '0.7'}</priority>\n  </url>`).join('\n');
  output = output.replace(/\s*<\/urlset>\s*$/i, `\n${entries}\n</urlset>\n`);
  return output;
}

function transformRss(text) {
  return neutralizeTechnicalIdentifiers(neutralizePriorPublisherSocialReferences(text))
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
  const routes = [...new Set([...manifest.routes.filter((route) => !removedDiscoveryRouteSet.has(route)), ...learningPages.map((page) => page.route)])].sort();
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

async function ensureLearningPages() {
  const seed = await readFile(path.join(publicRoot, 'about', 'index.html'), 'utf8');
  for (const page of learningPages) {
    const target = path.join(publicRoot, page.relativePath);
    try {
      await access(target);
    } catch {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, seed);
    }
  }
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
  await ensureLearningPages();
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
