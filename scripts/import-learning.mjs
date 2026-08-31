import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const learnRoot = path.join(projectRoot, 'public', 'learn');
const sourceOrigin = 'https://www.hahwul.com';
const githubOrigin = 'https://whgusals84.github.io/pixn-security';
const categoryMeta = {
  security: {
    sourcePrefix: '/sec/',
    title: 'Security Learning',
    key: 'SEC',
    description: 'Web security, testing methods, secure development, and defensive concepts.',
  },
  development: {
    sourcePrefix: '/dev/',
    title: 'Development Guides',
    key: 'DEV',
    description: 'Practical guides for languages, tools, and software workflows.',
  },
};

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const decodeHtml = (value) => value
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#39;', "'")
  .replaceAll('&#x27;', "'")
  .replaceAll('&#x2F;', '/');

const pageShell = ({ title, description, lang = 'en', body }) => `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — PIXN</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)} — PIXN"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="https://whgusals84.github.io/pixn-security/og.png"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
  <header data-site-header data-active="learn"></header>
  ${body}
  <footer data-site-footer></footer><script src="/assets/site.js"></script>
</body>
</html>
`;

function sanitizeBody(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/(href|src)\s*=\s*("|')javascript:[\s\S]*?\2/gi, '$1="#"')
    .replace(/href=("|')https:\/\/www\.hahwul\.com\/sec\/([^"']+)\1/gi, 'href=$1/learn/security/$2$1')
    .replace(/href=("|')\/sec\/([^"']+)\1/gi, 'href=$1/learn/security/$2$1')
    .replace(/href=("|')https:\/\/www\.hahwul\.com\/dev\/([^"']+)\1/gi, 'href=$1/learn/development/$2$1')
    .replace(/href=("|')\/dev\/([^"']+)\1/gi, 'href=$1/learn/development/$2$1')
    .replace(/href=("|')https:\/\/www\.hahwul\.com\/cullinan\/(attack|tool|develop)\/([^"']+)\1/gi, 'href=$1/reference/$2/$3$1')
    .replace(/href=("|')\/cullinan\/(attack|tool|develop)\/([^"']+)\1/gi, 'href=$1/reference/$2/$3$1')
    .replace(/(src|poster)=("|')\/(?!\/)/gi, `$1=$2${sourceOrigin}/`)
    .replace(/srcset=("|')\/(?!\/)/gi, `srcset=$1${sourceOrigin}/`)
    .replace(/href=("|')\/(?!\/|learn\/|reference\/)/gi, `href=$1${sourceOrigin}/`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'PIXN learning importer (authorized republication)' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

const sitemap = await fetchText(`${sourceOrigin}/sitemap.xml`);
const sourceUrls = [...new Set(
  [...sitemap.matchAll(/https:\/\/www\.hahwul\.com\/(?:sec|dev)\/[^"<\s]*/g)]
    .map((match) => match[0].split('#')[0].split('?')[0])
    .map((url) => url.endsWith('/') ? url : `${url}/`),
)];

let cursor = 0;
const imported = [];
const skipped = [];

async function worker() {
  while (cursor < sourceUrls.length) {
    const sourceUrl = sourceUrls[cursor++];
    try {
      const url = new URL(sourceUrl);
      const categoryKey = url.pathname.startsWith('/sec/') ? 'security' : 'development';
      const sourcePrefix = categoryMeta[categoryKey].sourcePrefix;
      const relativePath = url.pathname.slice(sourcePrefix.length).replace(/^\/+|\/+$/g, '');
      if (!relativePath) throw new Error('section index');
      const html = await fetchText(sourceUrl);
      const titleMatch = html.match(/<h1 class="page-title">([\s\S]*?)<\/h1>/i);
      const bodyMatch = html.match(/<div class="post-body">([\s\S]*?)<\/div>\s*<div class="footnotes-area">/i);
      if (!titleMatch || !bodyMatch) throw new Error('listing page');
      const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/i);
      const title = decodeHtml(titleMatch[1].replace(/<[^>]+>/g, '').trim());
      imported.push({
        categoryKey,
        relativePath,
        sourceUrl,
        title,
        date: dateMatch ? dateMatch[1] : '',
        dateLabel: dateMatch ? dateMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '',
        content: sanitizeBody(bodyMatch[1].trim()),
        lang: /[가-힣]/.test(bodyMatch[1]) ? 'ko' : 'en',
      });
    } catch (error) {
      skipped.push({ sourceUrl, reason: error.message });
    }
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
imported.sort((a, b) => a.title.localeCompare(b.title));

for (const categoryKey of Object.keys(categoryMeta)) {
  await rm(path.join(learnRoot, categoryKey), { recursive: true, force: true });
}
await mkdir(learnRoot, { recursive: true });

for (const entry of imported) {
  const category = categoryMeta[entry.categoryKey];
  const body = `<main class="page article-page" id="main">
    <header class="article-heading">
      <p class="eyebrow"><a href="/learn/">Learn</a> / <a href="/learn/${entry.categoryKey}/">${category.title}</a></p>
      <h1>${escapeHtml(entry.title)}</h1>
      ${entry.date ? `<time datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.dateLabel)}</time>` : ''}
    </header>
    <article class="article-body">${entry.content}</article>
    <footer class="article-source"><span>Republished with permission</span><a href="${escapeHtml(entry.sourceUrl)}" rel="noopener noreferrer">Original source ↗</a></footer>
  </main>`;
  const outputDirectory = path.join(learnRoot, entry.categoryKey, ...entry.relativePath.split('/'));
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'index.html'), pageShell({
    title: entry.title,
    description: `${entry.title} — ${category.description}`,
    lang: entry.lang,
    body,
  }), 'utf8');
}

for (const [categoryKey, category] of Object.entries(categoryMeta)) {
  const categoryEntries = imported.filter((entry) => entry.categoryKey === categoryKey);
  const rows = categoryEntries.map((entry, index) => `<li><a class="ledger-row" href="/learn/${categoryKey}/${entry.relativePath}/"><span class="ledger-key">${String(index + 1).padStart(2, '0')}</span><span class="ledger-body"><span class="ledger-title">${escapeHtml(entry.title)}</span><span class="ledger-desc">${entry.dateLabel ? escapeHtml(entry.dateLabel) : category.description}</span></span><span aria-hidden="true">↗</span></a></li>`).join('');
  const body = `<main class="page" id="main">
    <header class="page-heading"><p class="eyebrow">Learn / ${category.key}</p><h1>${category.title}</h1><p>${category.description}</p></header>
    <section class="section"><div class="plate-row"><h2>Study guides</h2><span class="plate-rule" aria-hidden="true"></span><span class="plate-link">${categoryEntries.length} entries</span></div><ul class="home-ledger">${rows}</ul></section>
  </main>`;
  const outputDirectory = path.join(learnRoot, categoryKey);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'index.html'), pageShell({
    title: category.title,
    description: category.description,
    body,
  }), 'utf8');
}

const cryptographyBody = `<main class="page" id="main">
    <header class="page-heading"><p class="eyebrow">Learn / SEC / CRYPTO</p><h1>Cryptography</h1><p>A focused shelf for cryptographic ideas, protocols, and implementation risks.</p></header>
    <section class="section"><div class="plate-row"><h2>Study notes</h2><span class="plate-rule" aria-hidden="true"></span><span class="plate-link">Growing</span></div><div class="empty-state"><p>The source archive does not contain standalone cryptography guides to republish yet. New notes can be added here as the study continues.</p></div></section>
  </main>`;
const cryptographyDirectory = path.join(learnRoot, 'security', 'cryptography');
await mkdir(cryptographyDirectory, { recursive: true });
await writeFile(path.join(cryptographyDirectory, 'index.html'), pageShell({
  title: 'Cryptography',
  description: 'Cryptographic ideas, protocols, and implementation risks studied by PIXN.',
  body: cryptographyBody,
}), 'utf8');

const counts = Object.fromEntries(Object.keys(categoryMeta).map((key) => [key, imported.filter((entry) => entry.categoryKey === key).length]));
const learnBody = `<main class="page" id="main">
    <header class="page-heading"><p class="eyebrow">Learn</p><h1>A map for learning by doing.</h1><p>Selected technical guides for studying security and development without the personal archive around them.</p></header>
    <section class="section"><div class="plate-row"><h2>Learning paths</h2><span class="plate-rule" aria-hidden="true"></span><span class="plate-link">Curated</span></div><ul class="home-ledger">
      <li><a class="ledger-row" href="/learn/security/"><span class="ledger-key">SEC</span><span class="ledger-body"><span class="ledger-title">Security Learning</span><span class="ledger-desc">${categoryMeta.security.description}</span></span><span class="reference-count">${counts.security}</span></a></li>
      <li><a class="ledger-row" href="/learn/development/"><span class="ledger-key">DEV</span><span class="ledger-body"><span class="ledger-title">Development Guides</span><span class="ledger-desc">${categoryMeta.development.description}</span></span><span class="reference-count">${counts.development}</span></a></li>
      <li><a class="ledger-row" href="/reference/"><span class="ledger-key">REF</span><span class="ledger-body"><span class="ledger-title">Technical Reference</span><span class="ledger-desc">Cheat sheets, vulnerabilities, and tool notes for quick lookup.</span></span><span class="reference-count">73</span></a></li>
    </ul></section>
  </main>`;
await writeFile(path.join(learnRoot, 'index.html'), pageShell({
  title: 'Learn',
  description: 'Curated security and development learning paths for PIXN.',
  body: learnBody,
}), 'utf8');

const existingSitemap = await fetchText(`${githubOrigin}/sitemap.xml`).catch(() => '');
const fixedRoutes = ['/', '/blog/', '/writing/', '/learn/', '/notes/', '/labs/', '/projects/', '/reference/', '/about/'];
const referenceRoutes = [...existingSitemap.matchAll(/<loc>https:\/\/whgusals84\.github\.io\/pixn-security(\/reference\/[^<]*)<\/loc>/g)].map((match) => match[1]);
const learningRoutes = [
  ...Object.keys(categoryMeta).map((category) => `/learn/${category}/`),
  '/learn/security/cryptography/',
  ...imported.map((entry) => `/learn/${entry.categoryKey}/${entry.relativePath}/`),
];
const routes = [...new Set([...fixedRoutes, ...referenceRoutes, ...learningRoutes])];
const outputSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${githubOrigin}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(projectRoot, 'public', 'sitemap.xml'), outputSitemap, 'utf8');

console.log(`Imported ${imported.length} learning pages; skipped ${skipped.length} listing pages.`);
for (const item of skipped) console.log(`Skipped ${item.sourceUrl}: ${item.reason}`);
