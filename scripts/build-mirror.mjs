import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
if (!args.source || !args.destination || !args.origin) {
  throw new Error('Usage: node scripts/build-mirror.mjs --source DIR --destination DIR --origin URL [--preview]');
}

const sourceRoot = path.resolve(args.source);
const destinationRoot = path.resolve(args.destination);
const targetOrigin = new URL(args.origin).origin;
const previewOnly = Boolean(args.preview);
const sourceOrigin = 'https://www.hahwul.com';
const textExtensions = new Set(['.css', '.js', '.json', '.txt', '.webmanifest', '.xml']);

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

function rewriteOrigin(text) {
  return text
    .replaceAll('https://www.hahwul.com', targetOrigin)
    .replaceAll('http://www.hahwul.com', targetOrigin)
    .replaceAll('//www.hahwul.com', targetOrigin);
}

function transformHtml(input) {
  let html = rewriteOrigin(input);
  html = html
    .replaceAll('/images/h.png', '/images/pixn-mark.svg')
    .replace(/(<span\b[^>]*class=["'][^"']*\bnav-wordmark\b[^"']*["'][^>]*>)[\s\S]*?(<\/span>)/gi, '$1PIXN$2')
    .replaceAll('aria-label="HAHWUL, home"', 'aria-label="PIXN, home"')
    .replaceAll("aria-label='HAHWUL, home'", "aria-label='PIXN, home'")
    .replaceAll('aria-label="HAHWUL"', 'aria-label="PIXN"')
    .replaceAll("aria-label='HAHWUL'", "aria-label='PIXN'")
    .replace(/(<meta\b[^>]*property=["']og:site_name["'][^>]*content=["'])HAHWUL(["'][^>]*>)/gi, '$1PIXN$2')
    .replace(/(<meta\b[^>]*name=["']apple-mobile-web-app-title["'][^>]*content=["'])HAHWUL(["'][^>]*>)/gi, '$1PIXN$2')
    .replace(/(<meta\b[^>]*(?:property=["']og:image["']|name=["']twitter:image["'])[^>]*content=["'])[^"']*(["'][^>]*>)/gi, `$1${targetOrigin}/og.png$2`)
    .replaceAll('/icons/favicon.svg', '/favicon.svg')
    .replaceAll('/icons/favicon-96x96.png', '/favicon.svg')
    .replaceAll('/icons/favicon.ico', '/favicon.svg')
    .replaceAll('/icons/apple-touch-icon.png', '/favicon.svg')
    .replaceAll('/icons/web-app-manifest-192x192.png', '/favicon.svg')
    .replaceAll('/icons/web-app-manifest-512x512.png', '/favicon.svg');
  return html;
}

function transformText(relativePath, input) {
  const extension = path.extname(relativePath).toLowerCase();
  let text = rewriteOrigin(input);
  if (extension === '.css') text = text.replaceAll('/images/h.png', '/images/pixn-mark.svg');
  return text;
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

await stat(sourceRoot);
await mkdir(destinationRoot, { recursive: true });

const allFiles = await walk(sourceRoot);
let htmlCount = 0;
let assetCount = 0;
for (const sourceFile of allFiles) {
  const relativePath = path.relative(sourceRoot, sourceFile);
  if (relativePath === '.mirror-manifest.json') continue;
  const extension = path.extname(relativePath).toLowerCase();
  if (extension === '.html') {
    const isHomepage = relativePath === 'index.html';
    if (previewOnly && !isHomepage) continue;
    const destinationFile = previewOnly
      ? path.join(destinationRoot, 'preview', 'index.html')
      : path.join(destinationRoot, relativePath);
    await mkdir(path.dirname(destinationFile), { recursive: true });
    const html = await readFile(sourceFile, 'utf8');
    await writeFile(destinationFile, transformHtml(html));
    htmlCount += 1;
    continue;
  }
  if (previewOnly && !/^(?:assets|fonts|images|icons|og-images)[\\/]/.test(relativePath)) continue;
  const destinationFile = path.join(destinationRoot, relativePath);
  await mkdir(path.dirname(destinationFile), { recursive: true });
  if (textExtensions.has(extension)) {
    const text = await readFile(sourceFile, 'utf8');
    await writeFile(destinationFile, transformText(relativePath, text));
  } else {
    await copyFile(sourceFile, destinationFile);
  }
  assetCount += 1;
}

await mkdir(path.join(destinationRoot, 'images'), { recursive: true });
await mkdir(path.join(destinationRoot, 'icons'), { recursive: true });
await copyFile(path.resolve('branding/pixn-mark.svg'), path.join(destinationRoot, 'images', 'pixn-mark.svg'));
await copyFile(path.join(destinationRoot, 'favicon.svg'), path.join(destinationRoot, 'icons', 'favicon.svg'));
await writeFile(
  path.join(destinationRoot, 'icons', 'site.webmanifest'),
  `${JSON.stringify(
    {
      name: 'PIXN',
      short_name: 'PIXN',
      icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      theme_color: '#040405',
      background_color: '#040405',
      display: 'standalone',
    },
    null,
    2,
  )}\n`,
);

const sourceManifestPath = path.join(sourceRoot, '.mirror-manifest.json');
try {
  const manifest = JSON.parse(await readFile(sourceManifestPath, 'utf8'));
  const outputManifest = {
    ...manifest,
    targetOrigin,
    builtAt: new Date().toISOString(),
    branding: { mark: 'PIXN', bodyContentPreserved: true },
  };
  await writeFile(path.join(destinationRoot, 'mirror-manifest.json'), `${JSON.stringify(outputManifest, null, 2)}\n`);
} catch {
  // A representative preview can be built before the archive manifest is complete.
}

process.stdout.write(`mirror build complete: ${htmlCount} HTML pages, ${assetCount} supporting files\n`);
