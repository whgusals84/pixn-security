import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

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
}

const searchDocuments = JSON.parse(await readFile(path.join(publicRoot, 'search_index.json'), 'utf8'));
if (!Array.isArray(searchDocuments) || searchDocuments.length !== 1078) {
  errors.push(`search index document count is ${searchDocuments?.length ?? 'invalid'}`);
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
