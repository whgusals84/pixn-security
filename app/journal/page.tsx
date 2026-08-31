import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { listPublishedContent } from '@/lib/content-db';

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  const items = await listPublishedContent();
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <header className="archive-heading">
          <p>MANAGED WRITING</p>
          <h1>Latest field notes.</h1>
          <span>관리 화면에서 직접 작성하고 공개한 글입니다.</span>
        </header>
        <section className="archive-list" aria-label="공개 글 목록">
          {items.length === 0 ? (
            <p className="managed-empty">아직 공개한 글이 없습니다.</p>
          ) : items.map((item) => (
            <a className="archive-row" href={`/entry/${item.slug}/`} key={item.id}>
              <time>{(item.published_at || item.updated_at).slice(0, 10)}</time>
              <div>
                <span>{item.content_type.toUpperCase()}{item.topic ? ` · ${item.topic.toUpperCase()}` : ''}</span>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </div>
              <span>READ ↗</span>
            </a>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

