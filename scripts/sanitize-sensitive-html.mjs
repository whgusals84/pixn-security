const sensitiveRoute = '/blog/2015/metasploit-metasploit-generate-payload/';

function isSensitivePath(value) {
  const rawPath = value.replaceAll('\\', '/');
  const normalized = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return normalized === sensitiveRoute || normalized.endsWith(`${sensitiveRoute}index.html`);
}

export function sanitizeSensitiveHtml(pathname, html) {
  if (!isSensitivePath(pathname)) return html;
  return html.replace(
    /<main\b[^>]*id=["']main-content["'][^>]*>[\s\S]*?<\/main>/i,
    `<main id="main-content">
      <div class="container">
        <article class="post-content">
          <header class="post-header">
            <h1>Metasploit — Generate Payload</h1>
          </header>
          <div class="post-body">
            <p>The executable exploit example on this single legacy page was omitted because endpoint protection classified it as a critical Metasploit payload.</p>
          </div>
        </article>
      </div>
    </main>`,
  );
}

if (process.argv.includes('--stdin')) {
  const pathIndex = process.argv.indexOf('--path');
  const pathname = pathIndex >= 0 ? process.argv[pathIndex + 1] : '';
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(sanitizeSensitiveHtml(pathname, input));
}
