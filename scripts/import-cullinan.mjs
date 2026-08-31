import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const referenceRoot = path.join(projectRoot, 'public', 'reference');
const sourceOrigin = 'https://www.hahwul.com';
const githubOrigin = 'https://whgusals84.github.io/pixn-security';
let legacyRouteBySlug = new Map();
const categoryMeta = {
  attack: {
    title: 'Web Security',
    key: 'SEC',
    description: 'Vulnerabilities, attack surfaces, and defensive verification notes.',
  },
  tool: {
    title: 'Security Tools',
    key: 'TOOL',
    description: 'Working notes and command references for security tooling.',
  },
  develop: {
    title: 'Development',
    key: 'DEV',
    description: 'Language, workflow, and software development references.',
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

const pageShell = ({ title, description, active = 'reference', lang = 'en', body }) => `<!doctype html>
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
  <header data-site-header data-active="${active}"></header>
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
    .replace(/href=("|')https:\/\/www\.hahwul\.com\/cullinan\/(attack|tool|develop)\/([^"']+)\1/gi, 'href=$1/reference/$2/$3$1')
    .replace(/href=("|')\/cullinan\/(attack|tool|develop)\/([^"']+)\1/gi, 'href=$1/reference/$2/$3$1')
    .replace(/href=("|')(?:https:\/\/www\.hahwul\.com)?\/cullinan\/([^\/"'#?]+)\/?([^"']*)\1/gi, (match, quote, slug, suffix) => {
      const route = legacyRouteBySlug.get(slug.toLowerCase());
      return route ? `href=${quote}/reference/${route}${suffix}${quote}` : match;
    })
    .replace(/(src|poster)=("|')\/(?!\/)/gi, `$1=$2${sourceOrigin}/`)
    .replace(/srcset=("|')\/(?!\/)/gi, `srcset=$1${sourceOrigin}/`)
    .replace(/href=("|')\/(?!\/|reference\/)/gi, `href=$1${sourceOrigin}/`);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'PIXN reference importer (authorized republication)' },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

const listingUrls = [
  `${sourceOrigin}/cullinan/`,
  ...Array.from({ length: 10 }, (_, index) => `${sourceOrigin}/cullinan/page/${index + 2}/`),
];
const listingHtml = await Promise.all(listingUrls.map(fetchText));
const entryMap = new Map();

for (const html of listingHtml) {
  const linkPattern = /href=("|')([^"']*\/cullinan\/(attack|tool|develop)\/([^"'?#/]+)\/)(?:[^"']*)\1/gi;
  for (const match of html.matchAll(linkPattern)) {
    const [, , foundUrl, category, slug] = match;
    entryMap.set(`${category}/${slug}`, {
      category,
      slug,
      sourceUrl: new URL(foundUrl, sourceOrigin).href,
    });
  }
}

const entries = [...entryMap.values()];
legacyRouteBySlug = new Map(entries.map((entry) => [entry.slug.toLowerCase(), `${entry.category}/${entry.slug}/`]));
for (const [alias, target] of Object.entries({
  'http-request-smuggling': 'attack/http_smuggling/',
  'csd-attack': 'attack/client-side-desync-attack/',
  'h2c-smuggling': 'attack/h2c_smuggling/',
  'http-parameter-pollution': 'attack/hpp/',
})) legacyRouteBySlug.set(alias, target);
let cursor = 0;
const imported = [];
const skipped = [];

async function worker() {
  while (cursor < entries.length) {
    const entry = entries[cursor++];
    try {
      const html = await fetchText(entry.sourceUrl);
      const titleMatch = html.match(/<h1 class="page-title">([\s\S]*?)<\/h1>/i);
      const bodyMatch = html.match(/<div class="post-body">([\s\S]*?)<\/div>\s*<div class="footnotes-area">/i);
      if (!titleMatch || !bodyMatch) throw new Error('article body not found');
      const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"[^>]*>([\s\S]*?)<\/time>/i);
      const title = decodeHtml(titleMatch[1].replace(/<[^>]+>/g, '').trim());
      imported.push({
        ...entry,
        title,
        date: dateMatch ? dateMatch[1] : '',
        dateLabel: dateMatch ? dateMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '',
        content: sanitizeBody(bodyMatch[1].trim()),
        lang: /[가-힣]/.test(bodyMatch[1]) ? 'ko' : 'en',
      });
    } catch (error) {
      skipped.push({ ...entry, reason: error.message });
    }
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
imported.sort((a, b) => a.title.localeCompare(b.title));

await rm(referenceRoot, { recursive: true, force: true });
await mkdir(referenceRoot, { recursive: true });

for (const entry of imported) {
  const category = categoryMeta[entry.category];
  const body = `<main class="page article-page" id="main">
    <header class="article-heading">
      <p class="eyebrow"><a href="/reference/">Reference</a> / <a href="/reference/${entry.category}/">${category.title}</a></p>
      <h1>${escapeHtml(entry.title)}</h1>
      ${entry.date ? `<time datetime="${escapeHtml(entry.date)}">${escapeHtml(entry.dateLabel)}</time>` : ''}
    </header>
    <article class="article-body">${entry.content}</article>
    <footer class="article-source"><span>Republished with permission</span><a href="${escapeHtml(entry.sourceUrl)}" rel="noopener noreferrer">Original source ↗</a></footer>
  </main>`;
  const outputDirectory = path.join(referenceRoot, entry.category, entry.slug);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'index.html'), pageShell({
    title: entry.title,
    description: `${entry.title} — ${category.description}`,
    lang: entry.lang,
    body,
  }), 'utf8');
}

for (const [categoryKey, category] of Object.entries(categoryMeta)) {
  const categoryEntries = imported.filter((entry) => entry.category === categoryKey);
  const rows = categoryEntries.map((entry, index) => `<li><a class="ledger-row" href="/reference/${entry.category}/${entry.slug}/"><span class="ledger-key">${String(index + 1).padStart(2, '0')}</span><span class="ledger-body"><span class="ledger-title">${escapeHtml(entry.title)}</span><span class="ledger-desc">${entry.dateLabel ? escapeHtml(entry.dateLabel) : category.description}</span></span><span aria-hidden="true">↗</span></a></li>`).join('');
  const body = `<main class="page" id="main">
    <header class="page-heading"><p class="eyebrow">Reference / ${category.key}</p><h1>${category.title}</h1><p>${category.description}</p></header>
    <section class="section"><div class="plate-row"><h2>All references</h2><span class="plate-rule" aria-hidden="true"></span><span class="plate-link">${categoryEntries.length} entries</span></div><ul class="home-ledger">${rows}</ul></section>
  </main>`;
  const outputDirectory = path.join(referenceRoot, categoryKey);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'index.html'), pageShell({
    title: category.title,
    description: category.description,
    body,
  }), 'utf8');
}

const categoryRows = Object.entries(categoryMeta).map(([categoryKey, category]) => {
  const count = imported.filter((entry) => entry.category === categoryKey).length;
  return `<li><a class="ledger-row" href="/reference/${categoryKey}/"><span class="ledger-key">${category.key}</span><span class="ledger-body"><span class="ledger-title">${category.title}</span><span class="ledger-desc">${category.description}</span></span><span class="reference-count">${count}</span></a></li>`;
}).join('');

const referenceBody = `<main class="page" id="main">
    <header class="page-heading"><p class="eyebrow">Reference</p><h1>A technical library, kept useful.</h1><p>Security, tooling, and development material organized as a compact working reference. Use these notes only on systems you own or are authorized to test.</p></header>
    <section class="section"><div class="plate-row"><h2>Browse by subject</h2><span class="plate-rule" aria-hidden="true"></span><span class="plate-link">${imported.length} entries</span></div><ul class="home-ledger">${categoryRows}</ul></section>
  </main>`;
await writeFile(path.join(referenceRoot, 'index.html'), pageShell({
  title: 'Reference',
  description: 'PIXN technical references for web security, tools, and development.',
  body: referenceBody,
}), 'utf8');

const pageRoutes = ['/', '/blog/', '/writing/', '/learn/', '/notes/', '/labs/', '/projects/', '/reference/', '/about/'];
const referenceRoutes = [
  ...Object.keys(categoryMeta).map((category) => `/reference/${category}/`),
  ...imported.map((entry) => `/reference/${entry.category}/${entry.slug}/`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageRoutes, ...referenceRoutes].map((route) => `  <url><loc>${githubOrigin}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(projectRoot, 'public', 'sitemap.xml'), sitemap, 'utf8');

console.log(`Imported ${imported.length} reference pages; skipped ${skipped.length}.`);
for (const item of skipped) console.log(`Skipped ${item.sourceUrl}: ${item.reason}`);
