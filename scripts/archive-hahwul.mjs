import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { sanitizeSensitiveHtml } from './sanitize-sensitive-html.mjs';

const SOURCE_ORIGIN = 'https://www.hahwul.com';
const args = parseArgs(process.argv.slice(2));
const outputRoot = path.resolve(args.output ?? '.mirror-source');
const concurrency = Number(args.concurrency ?? 18);

const fixedResources = [
  '/',
  '/404.html',
  '/robots.txt',
  '/sitemap.xml',
  '/rss.xml',
  '/ko/rss.xml',
  '/search_index.json',
  '/icons/site.webmanifest',
];

// Redirect aliases still linked by legacy articles but intentionally omitted from
// both the current sitemap and the search index.
const legacyRedirectPaths = [
  '/2016/06/30/web-hacking-putdelete-csrfcross-site/',
  '/2017/05/24/web-hacking-parameter-padding-for/',
  '/2017/05/27/web-hacking-ooxml-xxe/',
  '/2017/11/06/exploit-java-se-web-start-jnlp-xxe-cve/',
  '/2017/12/06/hacking-documentbuilderfactory-xxe/',
  '/2018/01/21/hacking-documentbuilderfactory-xxe-feat/',
  '/2018/07/13/Security-testing-SAML-SSO-vulnerability-and-pentest/',
  '/2018/07/31/crystal-fast-c-slick-as-ruby/',
  '/2018/08/12/attack-json-csrf-with-swfactionscript/',
  '/2018/08/18/edge-side-include-injection-web-attack/',
  '/2019/09/28/oxml-xxe-payload-inject-tool-docem/',
  '/2019/10/11/bypass-referer-check-logic-for-csrf/',
  '/2020/01/18/samesite-lax/',
  '/2020/03/24/ways-to-xss-without-parentheses/',
  '/2021/06/16/go-get-in-github-enterprise/',
  '/2021/08/15/goroutine-and-sync/',
  '/2021/09/05/testing-access-control-with-zap/',
  '/2021/09/07/authentication-spidering-in-zap/',
  '/2021/09/17/zap-script-base-authentication/',
  '/2022/02/06/u+2029-xss/',
  '/2022/09/02/ruby-concurrency/',
  '/2022/10/19/the-csrf-is-dying/',
  '/2023/01/19/hello-caido/',
  '/cullinan/cookie-bomb-attack/',
  '/cullinan/xss/',
];

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

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function toLocalFile(url, isPage = false) {
  const pathname = decodeURIComponent(url.pathname);
  if (isPage && pathname.endsWith('/')) {
    return path.join(outputRoot, pathname.slice(1), 'index.html');
  }
  if (pathname === '/') return path.join(outputRoot, 'index.html');
  return path.join(outputRoot, pathname.slice(1));
}

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'PIXN authorized site migration/1.0' },
        redirect: 'follow',
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
    }
  }
  throw lastError;
}

async function mapPool(items, limit, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(limit, queue.length || 1) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

function normalizeInternalUrl(raw, baseUrl = SOURCE_ORIGIN) {
  if (!raw) return null;
  const cleaned = decodeXml(raw.trim()).replace(/[),.;]+$/, '');
  if (/^(?:data|mailto|tel|javascript):/i.test(cleaned) || cleaned.startsWith('#')) return null;
  try {
    const url = new URL(cleaned, baseUrl);
    if (url.origin !== SOURCE_ORIGIN) return null;
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

const assetExtension = /\.(?:avif|css|csv|gif|ico|jpe?g|js|json|map|mp3|mp4|pdf|png|svg|webmanifest|webp|woff2?|ttf|xml)$/i;
const assetPrefix = /^\/(?:assets|fonts|icons|images|og-images)\//;

function collectAssetUrls(text, baseUrl) {
  const discovered = new Set();
  const candidates = [];
  for (const match of text.matchAll(/(?:src|href|content|poster|data-src|data-search-index)\s*=\s*["']([^"']+)["']/gi)) {
    candidates.push(match[1]);
  }
  for (const match of text.matchAll(/(?:srcset)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',')) candidates.push(part.trim().split(/\s+/)[0]);
  }
  for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) candidates.push(match[1]);
  for (const candidate of candidates) {
    const url = normalizeInternalUrl(candidate, baseUrl);
    if (!url) continue;
    if (assetPrefix.test(url.pathname) || assetExtension.test(url.pathname)) discovered.add(url.href);
  }
  return discovered;
}

await mkdir(outputRoot, { recursive: true });

const [searchResponse, sitemapResponse] = await Promise.all([
  fetchWithRetry(`${SOURCE_ORIGIN}/search_index.json`),
  fetchWithRetry(`${SOURCE_ORIGIN}/sitemap.xml`),
]);
const searchText = await searchResponse.text();
const sitemapText = await sitemapResponse.text();
const searchDocuments = JSON.parse(searchText);

const pageUrls = new Set([`${SOURCE_ORIGIN}/`]);
for (const redirectPath of legacyRedirectPaths) pageUrls.add(new URL(redirectPath, SOURCE_ORIGIN).href);
for (const document of searchDocuments) {
  const url = normalizeInternalUrl(document.url);
  if (url) pageUrls.add(url.href);
}
for (const match of sitemapText.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) {
  const url = normalizeInternalUrl(match[1]);
  if (url) pageUrls.add(url.href);
}

const pageBodies = new Map();
const failures = [];
let completedPages = 0;
await mapPool([...pageUrls].sort(), concurrency, async (href) => {
  try {
    const response = await fetchWithRetry(href);
    const rawBody = await response.text();
    const body = sanitizeSensitiveHtml(new URL(href).pathname, rawBody);
    const finalUrl = new URL(response.url);
    const file = toLocalFile(new URL(href), true);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
    pageBodies.set(href, { body, baseUrl: finalUrl.href });
  } catch (error) {
    failures.push({ type: 'page', url: href, error: String(error) });
  } finally {
    completedPages += 1;
    if (completedPages % 100 === 0 || completedPages === pageUrls.size) {
      process.stdout.write(`pages ${completedPages}/${pageUrls.size}\n`);
    }
  }
});

await writeFile(path.join(outputRoot, 'search_index.json'), searchText);
await writeFile(path.join(outputRoot, 'sitemap.xml'), sitemapText);

const assetQueue = new Set(fixedResources.map((resource) => new URL(resource, SOURCE_ORIGIN).href));
for (const [href, page] of pageBodies) {
  for (const assetHref of collectAssetUrls(page.body, page.baseUrl || href)) assetQueue.add(assetHref);
}

let assetPass = 0;
const fetchedAssets = new Set();
while (true) {
  const pending = [...assetQueue].filter((href) => !fetchedAssets.has(href));
  if (!pending.length) break;
  assetPass += 1;
  await mapPool(pending, concurrency, async (href) => {
    fetchedAssets.add(href);
    const url = new URL(href);
    try {
      const response = await fetchWithRetry(href);
      const contentType = response.headers.get('content-type') || '';
      const buffer = Buffer.from(await response.arrayBuffer());
      const isText = /(?:text|css|javascript|json|xml|svg|webmanifest)/i.test(contentType) || /\.(?:css|js|json|svg|webmanifest|xml)$/i.test(url.pathname);
      const body = isText ? buffer.toString('utf8') : null;
      const file = toLocalFile(url, url.pathname.endsWith('/'));
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(file, buffer);
      if (body) {
        for (const discovered of collectAssetUrls(body, response.url)) assetQueue.add(discovered);
      }
    } catch (error) {
      failures.push({ type: 'asset', url: href, error: String(error) });
    }
  });
  process.stdout.write(`assets pass ${assetPass}: ${fetchedAssets.size}/${assetQueue.size}\n`);
}

const manifest = {
  sourceOrigin: SOURCE_ORIGIN,
  capturedAt: new Date().toISOString(),
  routeCount: pageUrls.size,
  successfulRouteCount: pageBodies.size,
  assetCount: fetchedAssets.size,
  routes: [...pageUrls].map((href) => new URL(href).pathname).sort(),
  failures,
};
await writeFile(path.join(outputRoot, '.mirror-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

process.stdout.write(
  `archive complete: ${manifest.successfulRouteCount}/${manifest.routeCount} routes, ${manifest.assetCount} assets, ${failures.length} failures\n`,
);
if (failures.some((failure) => failure.type === 'page')) process.exitCode = 1;
