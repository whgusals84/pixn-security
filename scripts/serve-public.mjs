import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(projectRoot, 'public');
const port = Number(process.env.PIXN_TEST_PORT ?? 4173);
const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
]);

function resolveRequestPath(requestUrl = '/') {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relative = pathname.replace(/^\/+/, '');
  const candidate = path.resolve(publicRoot, relative || 'index.html');
  if (!candidate.startsWith(`${publicRoot}${path.sep}`) && candidate !== publicRoot) return null;
  return path.extname(candidate) ? candidate : path.join(candidate, 'index.html');
}

createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url);
  if (!filePath) {
    response.writeHead(400).end('Bad request');
    return;
  }

  try {
    const details = await stat(filePath);
    if (!details.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'content-type': mimeTypes.get(path.extname(filePath)) ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    createReadStream(path.join(publicRoot, '404.html')).pipe(response);
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`PIXN test server listening on http://127.0.0.1:${port}`);
});
