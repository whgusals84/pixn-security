import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { getPublishedContent, renderMarkdown } from '@/lib/content-db';

export const dynamic = 'force-dynamic';

export default async function ManagedEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item) notFound();

  return (
    <>
      <SiteHeader />
      <main className="article-page">
        <header className="article-hero">
          <p>{item.content_type.toUpperCase()}{item.topic ? ` · ${item.topic.toUpperCase()}` : ''}</p>
          <h1>{item.title}</h1>
          <span>{item.summary}</span>
        </header>
        <article className="article-body managed-markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(item.body) }} />
        <nav className="article-next" aria-label="글 탐색">
          <span>BACK TO WRITING</span>
          <a href="/journal/">Latest field notes →</a>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

