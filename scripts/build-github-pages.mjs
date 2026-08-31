import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'public');
const outputRoot = path.join(projectRoot, 'dist', 'github-pages');
const projectPath = '/pixn-security';
const oldOrigin = 'https://pixn-analytics-portfolio.forhm0220.chatgpt.site';
const githubOrigin = 'https://whgusals84.github.io';
const githubSiteOrigin = `${githubOrigin}${projectPath}`;

const textExtensions = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.webmanifest']);

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

function prefixHtmlPaths(html) {
  return html
    .replaceAll(`${oldOrigin}/`, `${githubSiteOrigin}/`)
    .replace(/(\b[a-zA-Z][\w:-]*\s*=\s*["'])\/(?!\/|pixn-security(?:\/|["']))/g, `$1${projectPath}/`)
    .replace(/(\bsrcset\s*=\s*["'][^"']*)(?<![\w:])\/(?!\/|pixn-security\/)/g, `$1${projectPath}/`)
    .replace(/url\((['"]?)\/(?!\/|pixn-security\/)/g, `url($1${projectPath}/`);
}

function prefixAppPaths(javascript) {
  return javascript
    .replaceAll(`${oldOrigin}/`, `${githubSiteOrigin}/`)
    .replaceAll('"/search_index.json"', `"${projectPath}/search_index.json"`)
    .replaceAll('startsWith("/ko/")', `startsWith("${projectPath}/ko/")`)
    .replaceAll('"/assets/js/vendor/mermaid.min.js"', `"${projectPath}/assets/js/vendor/mermaid.min.js"`);
}

function prefixCssPaths(css) {
  return css
    .replaceAll(`${oldOrigin}/`, `${githubSiteOrigin}/`)
    .replace(/url\((['"]?)\/(?!\/|pixn-security\/)/g, `url($1${projectPath}/`);
}

async function transformSearchIndex(filePath) {
  const documents = JSON.parse(await readFile(filePath, 'utf8'));
  for (const document of documents) {
    if (typeof document.url === 'string' && document.url.startsWith('/')) {
      document.url = `${projectPath}${document.url}`;
    }
  }
  await writeFile(filePath, `${JSON.stringify(documents)}\n`, 'utf8');
}

async function transformWebManifest(filePath) {
  const manifest = JSON.parse(await readFile(filePath, 'utf8'));
  if (Array.isArray(manifest.icons)) {
    for (const icon of manifest.icons) {
      if (typeof icon.src === 'string' && icon.src.startsWith('/')) icon.src = `${projectPath}${icon.src}`;
    }
  }
  manifest.start_url = `${projectPath}/`;
  manifest.scope = `${projectPath}/`;
  await writeFile(filePath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(path.dirname(outputRoot), { recursive: true });
await cp(sourceRoot, outputRoot, { recursive: true });

const files = await walk(outputRoot);
for (const filePath of files) {
  const relativePath = path.relative(outputRoot, filePath).replaceAll('\\', '/');
  if (relativePath === 'search_index.json') {
    await transformSearchIndex(filePath);
    continue;
  }
  if (relativePath === 'icons/site.webmanifest') {
    await transformWebManifest(filePath);
    continue;
  }

  const extension = path.extname(filePath).toLowerCase();
  if (!textExtensions.has(extension)) continue;

  const original = await readFile(filePath, 'utf8');
  let transformed = original.replaceAll(`${oldOrigin}/`, `${githubSiteOrigin}/`);
  if (extension === '.html') transformed = prefixHtmlPaths(original);
  if (extension === '.css') transformed = prefixCssPaths(original);
  if (relativePath === 'assets/app.1881a2e0.js') transformed = prefixAppPaths(original);
  if (transformed !== original) await writeFile(filePath, transformed, 'utf8');
}

await writeFile(path.join(outputRoot, '.nojekyll'), '', 'utf8');
console.log(`GitHub Pages output ready: ${outputRoot}`);
