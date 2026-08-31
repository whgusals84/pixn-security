(() => {
  const routeFilters = {
    '/writing/': {},
    '/posts/': { type: 'post' },
    '/notes/': { type: 'note' },
    '/labs/': { type: 'lab' },
    '/labs/dreamhack/': { type: 'lab', topic: 'dreamhack' },
    '/labs/web/': { type: 'lab', topic: 'web' },
    '/labs/crypto/': { type: 'lab', topic: 'crypto' },
    '/labs/system/': { type: 'lab', topic: 'system' },
  };

  const route = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
  const filter = routeFilters[route];
  if (!filter) return;

  const query = new URLSearchParams(filter).toString();
  fetch(`/api/content${query ? `?${query}` : ''}`, { headers: { accept: 'application/json' } })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('content unavailable')))
    .then(({ items = [] }) => {
      if (!items.length) return;
      const host = document.querySelector('.post-body') || document.querySelector('main .container');
      if (!host || document.querySelector('[data-managed-content]')) return;

      const section = document.createElement('section');
      section.dataset.managedContent = '';
      section.style.marginTop = '4.5rem';

      const heading = document.createElement('h2');
      heading.textContent = 'Latest from PIXN';
      section.appendChild(heading);

      const description = document.createElement('p');
      description.textContent = '관리 화면에서 직접 작성하고 공개한 최신 글입니다.';
      section.appendChild(description);

      const list = document.createElement('ul');
      list.className = 'home-ledger';
      items.forEach((item) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.className = 'ledger-row';
        link.href = `/entry/${encodeURIComponent(item.slug)}/`;

        const key = document.createElement('span');
        key.className = 'ledger-key';
        key.textContent = item.topic || item.content_type;

        const body = document.createElement('span');
        body.className = 'ledger-body';
        const title = document.createElement('span');
        title.className = 'ledger-title';
        title.textContent = item.title;
        const summary = document.createElement('span');
        summary.className = 'ledger-desc';
        summary.textContent = item.summary || '새로 공개한 글';
        body.append(title, summary);

        const arrow = document.createElement('span');
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗';
        link.append(key, body, arrow);
        li.appendChild(link);
        list.appendChild(li);
      });
      section.appendChild(list);

      const allLink = document.createElement('p');
      const anchor = document.createElement('a');
      anchor.href = '/journal/';
      anchor.textContent = '모든 새 글 보기 →';
      allLink.appendChild(anchor);
      section.appendChild(allLink);
      host.appendChild(section);
    })
    .catch(() => {});
})();
