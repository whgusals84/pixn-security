import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(projectRoot, 'public');
const outputRoot = path.join(projectRoot, 'dist', 'github-pages');
const projectPath = '/pixn-security';
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
    .replace(/(\b[a-zA-Z][\w:-]*\s*=\s*["'])\/(?!\/|pixn-security(?:\/|["']))/g, `$1${projectPath}/`)
    .replace(/(\bsrcset\s*=\s*["'][^"']*)(?<![\w:])\/(?!\/|pixn-security\/)/g, `$1${projectPath}/`)
    .replace(/url\((['"]?)\/(?!\/|pixn-security\/)/g, `url($1${projectPath}/`);
}

function prefixCssPaths(css) {
  return css
    .replace(/url\((['"]?)\/(?!\/|pixn-security\/)/g, `url($1${projectPath}/`);
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(path.dirname(outputRoot), { recursive: true });
await cp(sourceRoot, outputRoot, { recursive: true });

const files = await walk(outputRoot);
for (const filePath of files) {
  const relativePath = path.relative(outputRoot, filePath).replaceAll('\\', '/');
  const extension = path.extname(filePath).toLowerCase();
  if (!textExtensions.has(extension)) continue;

  const original = await readFile(filePath, 'utf8');
  let transformed = original.replaceAll('https://pixn-analytics-portfolio.forhm0220.chatgpt.site/', `${githubSiteOrigin}/`);
  if (extension === '.html') transformed = prefixHtmlPaths(original);
  if (extension === '.css') transformed = prefixCssPaths(original);
  if (transformed !== original) await writeFile(filePath, transformed, 'utf8');
}

await writeFile(path.join(outputRoot, '.nojekyll'), '', 'utf8');
console.log(`GitHub Pages output ready: ${outputRoot}`);
