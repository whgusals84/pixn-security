import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(projectRoot, 'public');
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolutePath));
    else files.push(absolutePath);
  }
  return files;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function routeTarget(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, '');
  if (!relative) return path.join(publicRoot, 'index.html');
  if (path.extname(relative)) return path.join(publicRoot, ...relative.split('/'));
  return path.join(publicRoot, ...relative.split('/').filter(Boolean), 'index.html');
}

const files = await walk(publicRoot);
const htmlFiles = files.filter((filePath) => filePath.endsWith('.html'));
const requiredRoutes = ['/', '/learn/', '/writing/', '/labs/', '/projects/', '/reference/', '/about/'];

for (const route of requiredRoutes) {
  const target = routeTarget(route);
  if (!await exists(target)) failures.push(`Required route is missing: ${route}`);
}

for (const filePath of htmlFiles) {
  const relativePath = path.relative(publicRoot, filePath).replaceAll('\\', '/');
  const html = await readFile(filePath, 'utf8');

  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${relativePath}: missing title`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) failures.push(`${relativePath}: missing meta description`);

  const siteScriptCount = (html.match(/<script\b[^>]*src="\/assets\/site\.js"/gi) ?? []).length;
  if (siteScriptCount !== 1) failures.push(`${relativePath}: expected one shared site script, found ${siteScriptCount}`);

  if (/<(?:iframe|object|embed|form)\b/i.test(html)) failures.push(`${relativePath}: unsafe embedded markup`);
  if (/\b(?:href|src)\s*=\s*["']javascript:/i.test(html)) failures.push(`${relativePath}: javascript URL`);

  if (relativePath.startsWith('learn/') && /\b(?:dreamhack|dream\s+hack|wargame|ctf\s+write-?up|capture\s+the\s+flag)\b/i.test(html)) {
    failures.push(`${relativePath}: forbidden wargame or CTF content in learning library`);
  }

  if (/class="page article-page"/.test(html) && (!/Republished with permission/.test(html) || !/Original source/.test(html))) {
    failures.push(`${relativePath}: imported article is missing attribution`);
  }

  const hrefs = [...html.matchAll(/\bhref=(?:"([^"]+)"|'([^']+)')/gi)].map((match) => match[1] ?? match[2]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const pathname = href.split('#')[0].split('?')[0];
    if (!pathname) continue;
    const target = routeTarget(pathname);
    if (!await exists(target)) failures.push(`${relativePath}: broken internal link ${href}`);
  }
}

if (failures.length) {
  console.error(`Site verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site verification passed: ${htmlFiles.length} HTML pages checked.`);

