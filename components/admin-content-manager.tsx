'use client';

import { useEffect, useMemo, useState } from 'react';

type ContentType = 'post' | 'note' | 'lab';
type ContentStatus = 'draft' | 'published';

type Entry = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content_type: ContentType;
  topic: string;
  body: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type FormState = Pick<Entry, 'id' | 'slug' | 'title' | 'summary' | 'content_type' | 'topic' | 'body' | 'status'>;

const emptyForm: FormState = {
  id: '',
  slug: '',
  title: '',
  summary: '',
  content_type: 'post',
  topic: '',
  body: '',
  status: 'draft',
};

function makeSlug(title: string) {
  const ascii = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return ascii || `note-${new Date().toISOString().slice(0, 10)}`;
}

export function AdminContentManager() {
  const [items, setItems] = useState<Entry[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [message, setMessage] = useState('불러오는 중…');
  const [busy, setBusy] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  const isEditing = Boolean(form.id);
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [items],
  );

  async function loadItems() {
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      if (response.status === 401) {
        setAuthRequired(true);
        setMessage('로그인 후 관리할 수 있습니다.');
        return;
      }
      const data = (await response.json()) as { items?: Entry[]; ownerEmail?: string; error?: string };
      if (!response.ok) throw new Error(data.error || '목록을 불러오지 못했습니다.');
      setItems(data.items ?? []);
      setOwnerEmail(data.ownerEmail ?? '');
      setMessage('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '목록을 불러오지 못했습니다.');
    }
  }

  useEffect(() => {
    void loadItems();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectItem(item: Entry) {
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      content_type: item.content_type,
      topic: item.topic,
      body: item.body,
      status: item.status,
    });
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startNew() {
    setForm(emptyForm);
    setMessage('새 글을 작성합니다.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveEntry(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('저장 중…');
    const payload = { ...form, slug: form.slug || makeSlug(form.title) };
    try {
      const response = await fetch('/api/admin/content', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { item?: Entry; error?: string };
      if (!response.ok) throw new Error(data.error || '저장하지 못했습니다.');
      setForm(emptyForm);
      await loadItems();
      setMessage(payload.status === 'published' ? '저장하고 공개했습니다.' : '임시 저장했습니다.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '저장하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteEntry() {
    if (!form.id || !window.confirm(`“${form.title}” 글을 완전히 삭제할까요?`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/content?id=${encodeURIComponent(form.id)}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || '삭제하지 못했습니다.');
      setForm(emptyForm);
      await loadItems();
      setMessage('글을 삭제했습니다.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '삭제하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  }

  if (authRequired) {
    return (
      <section className="admin-auth-card">
        <p>관리 화면은 사이트 소유자만 사용할 수 있습니다.</p>
        <a href="/signin-with-chatgpt?return_to=/admin/" target="_top">CHATGPT로 로그인</a>
      </section>
    );
  }

  return (
    <div className="admin-layout">
      <section className="admin-editor" aria-labelledby="editor-title">
        <div className="admin-section-head">
          <div>
            <span>{isEditing ? 'EDIT ENTRY' : 'NEW ENTRY'}</span>
            <h2 id="editor-title">{isEditing ? form.title || '글 수정' : '새 글 작성'}</h2>
          </div>
          {isEditing && <button className="admin-quiet-button" type="button" onClick={startNew}>새 글</button>}
        </div>

        <form onSubmit={saveEntry}>
          <div className="admin-field-row">
            <label>
              <span>종류</span>
              <select value={form.content_type} onChange={(event) => update('content_type', event.target.value as ContentType)}>
                <option value="post">Post · 긴 기술 글</option>
                <option value="note">Note · 짧은 공부 노트</option>
                <option value="lab">Lab · 문제 풀이·실습</option>
              </select>
            </label>
            <label>
              <span>상태</span>
              <select value={form.status} onChange={(event) => update('status', event.target.value as ContentStatus)}>
                <option value="draft">임시 저장</option>
                <option value="published">공개</option>
              </select>
            </label>
          </div>

          <label>
            <span>제목</span>
            <input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="예: SameSite Cookie 동작 정리" required />
          </label>

          <label>
            <span>영문 주소</span>
            <div className="admin-slug-field">
              <code>/entry/</code>
              <input value={form.slug} onChange={(event) => update('slug', event.target.value)} placeholder="samesite-cookie-notes" />
            </div>
            <small>비워두면 제목을 바탕으로 만들며, 한글 제목이면 날짜형 주소가 사용됩니다.</small>
          </label>

          <label>
            <span>분류</span>
            <input value={form.topic} onChange={(event) => update('topic', event.target.value)} placeholder="예: dreamhack, web, crypto, system" />
          </label>

          <label>
            <span>한 줄 설명</span>
            <textarea className="admin-summary" value={form.summary} onChange={(event) => update('summary', event.target.value)} placeholder="목록에 표시할 짧은 설명" />
          </label>

          <label>
            <span>본문 · Markdown</span>
            <textarea className="admin-body" value={form.body} onChange={(event) => update('body', event.target.value)} placeholder={'## 배운 점\n\n본문을 작성하세요.\n\n- 목록\n- **강조**\n- `코드`'} required />
          </label>

          <div className="admin-actions">
            <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? '처리 중…' : isEditing ? '변경 저장' : '글 저장'}</button>
            {isEditing && <button className="admin-danger-button" type="button" onClick={deleteEntry} disabled={busy}>삭제</button>}
            <p role="status">{message}</p>
          </div>
        </form>
      </section>

      <aside className="admin-library" aria-labelledby="library-title">
        <div className="admin-section-head">
          <div>
            <span>CONTENT LIBRARY</span>
            <h2 id="library-title">내가 작성한 글</h2>
          </div>
          <span className="admin-count">{items.length}</span>
        </div>
        {ownerEmail && <p className="admin-owner">관리자 · {ownerEmail}</p>}
        {sortedItems.length === 0 ? (
          <div className="admin-empty">아직 작성한 글이 없습니다.<br />왼쪽에서 첫 글을 작성해 보세요.</div>
        ) : (
          <div className="admin-entry-list">
            {sortedItems.map((item) => (
              <article key={item.id} className={form.id === item.id ? 'is-active' : ''}>
                <button type="button" onClick={() => selectItem(item)}>
                  <span>{item.content_type.toUpperCase()} · {item.status === 'published' ? 'PUBLIC' : 'DRAFT'}</span>
                  <strong>{item.title}</strong>
                  <small>{new Date(item.updated_at).toLocaleDateString('ko-KR')}</small>
                </button>
                {item.status === 'published' && <a href={`/entry/${item.slug}/`} target="_blank" rel="noreferrer">보기 ↗</a>}
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}

