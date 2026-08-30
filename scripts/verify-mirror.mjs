import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { PERSONAL_ONLY_ROUTES, REMOVED_DISCOVERY_ROUTES } from './personal-content-policy.mjs';

const args = parseArgs(process.argv.slice(2));
const publicRoot = path.resolve(args.public ?? 'public');
const expectedOrigin = new URL(args.origin ?? 'https://pixn-analytics-portfolio.forhm0220.chatgpt.site').origin;

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
    } else parsed[key] = true;
  }
  return parsed;
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

function routeToFile(route) {
  if (route === '/') return path.join(publicRoot, 'index.html');
  const pathname = decodeURIComponent(route).replace(/^\//, '');
  return route.endsWith('/') ? path.join(publicRoot, pathname, 'index.html') : path.join(publicRoot, pathname);
}

const errors = [];
const manifest = JSON.parse(await readFile(path.join(publicRoot, 'mirror-manifest.json'), 'utf8'));
const routes = new Set(manifest.routes);
if (manifest.routeCount !== routes.size) errors.push(`manifest routeCount ${manifest.routeCount} != unique routes ${routes.size}`);
if (manifest.successfulRouteCount !== manifest.routeCount) errors.push('one or more source routes failed to archive');
if (manifest.targetOrigin !== expectedOrigin) errors.push(`target origin is ${manifest.targetOrigin}`);
if ('sourceOrigin' in manifest || 'failures' in manifest) errors.push('public manifest exposes source-only metadata');
const removedDiscoveryRoutes = REMOVED_DISCOVERY_ROUTES;
for (const route of removedDiscoveryRoutes) {
  if (routes.has(route)) errors.push(`personal-only route remains discoverable: ${route}`);
}

for (const route of routes) {
  try {
    await access(routeToFile(route));
  } catch {
    errors.push(`missing route file: ${route}`);
  }
}

const files = await walk(publicRoot);
const htmlFiles = files.filter((file) => path.extname(file).toLowerCase() === '.html');
let brandedPageCount = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (/nav-wordmark[^>]*>HAHWUL</i.test(html)) errors.push(`old nav wordmark: ${path.relative(publicRoot, file)}`);
  if (/nav-wordmark[^>]*>PIXN</i.test(html)) brandedPageCount += 1;
  if (html.includes('/images/h.png')) errors.push(`old logo reference: ${path.relative(publicRoot, file)}`);
  if (html.includes('https://www.hahwul.com') || html.includes('http://www.hahwul.com')) {
    errors.push(`old internal origin: ${path.relative(publicRoot, file)}`);
  }
  if (/Lee Hwan|이환|hahwul@gmail\.com|https:\/\/x\.com\/hahwul|https:\/\/www\.instagram\.com\/hahwul_|Developed and Designed by Me/i.test(html)) {
    errors.push(`prior-publisher identity remains: ${path.relative(publicRoot, file)}`);
  }
  if (/<title>[\s\S]*?\|\s*HAHWUL<\/title>|"name":"HAHWUL"/i.test(html)) {
    errors.push(`old site identity metadata: ${path.relative(publicRoot, file)}`);
  }
}

const searchDocuments = JSON.parse(await readFile(path.join(publicRoot, 'search_index.json'), 'utf8'));
const expectedSearchDocumentCount = 1078 - PERSONAL_ONLY_ROUTES.length;
if (!Array.isArray(searchDocuments) || searchDocuments.length !== expectedSearchDocumentCount) {
  errors.push(`search index document count is ${searchDocuments?.length ?? 'invalid'}, expected ${expectedSearchDocumentCount}`);
}
for (const route of PERSONAL_ONLY_ROUTES) {
  if (searchDocuments.some((document) => document.url === route)) errors.push(`personal-only search document remains: ${route}`);
}

const sitemap = await readFile(path.join(publicRoot, 'sitemap.xml'), 'utf8');
const rss = `${await readFile(path.join(publicRoot, 'rss.xml'), 'utf8')}\n${await readFile(path.join(publicRoot, 'ko', 'rss.xml'), 'utf8')}`;
for (const route of removedDiscoveryRoutes) {
  if (sitemap.includes(route)) errors.push(`personal-only sitemap URL remains: ${route}`);
  if (rss.includes(route)) errors.push(`personal-only RSS item remains: ${route}`);
  const tombstone = await readFile(routeToFile(route), 'utf8');
  if (!/noindex, nofollow/i.test(tombstone) || !/Content removed|콘텐츠가 정리되었습니다/i.test(tombstone)) {
    errors.push(`personal-only route is not a noindex tombstone: ${route}`);
  }
}

const homepage = await readFile(path.join(publicRoot, 'index.html'), 'utf8');
if (!homepage.includes('Web Security Knowledge Base, Tools and Field Notes.')) errors.push('homepage was not personalized');
const aboutPage = await readFile(path.join(publicRoot, 'about', 'index.html'), 'utf8');
if (!aboutPage.includes('About PIXN') || /Lee Hwan|HAHWUL/i.test(aboutPage)) errors.push('about page was not neutralized');

const sensitivePage = await readFile(
  path.join(publicRoot, 'blog', '2015', 'metasploit-metasploit-generate-payload', 'index.html'),
  'utf8',
);
if (!sensitivePage.includes('endpoint protection classified it as a critical Metasploit payload')) {
  errors.push('security-sensitive legacy page was not sanitized');
}

for (const relativePath of [
  'assets/main.8885b746.css',
  'assets/app.1881a2e0.js',
  'assets/js/vendor/mermaid.min.js',
  'fonts/pretendard/pretendardvariable-dynamic-subset.css',
  'images/pixn-mark.svg',
  'icons/site.webmanifest',
  'sitemap.xml',
  'rss.xml',
  'ko/rss.xml',
  'robots.txt',
  '404.html',
]) {
  try {
    await access(path.join(publicRoot, relativePath));
  } catch {
    errors.push(`missing supporting file: ${relativePath}`);
  }
}

const ogFiles = files.filter((file) => file.startsWith(path.join(publicRoot, 'og-images') + path.sep) && file.endsWith('.png'));
const ogHashes = new Set();
for (const file of ogFiles) {
  const data = await readFile(file);
  ogHashes.add(createHash('sha256').update(data).digest('hex'));
}
if (ogFiles.length !== 736 || ogHashes.size !== 1) {
  errors.push(`brand-safe OG assets: ${ogFiles.length} files, ${ogHashes.size} distinct hashes`);
}

const summary = {
  routes: routes.size,
  htmlFiles: htmlFiles.length,
  brandedPages: brandedPageCount,
  searchDocuments: searchDocuments.length,
  supportingFiles: files.length - htmlFiles.length,
  ogAssets: ogFiles.length,
  errors,
};
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
if (errors.length) process.exitCode = 1;
