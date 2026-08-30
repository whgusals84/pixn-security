import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { notes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Notes — PIXN',
  description: '분석 실무에서 발견한 짧은 메모',
};

export default function NotesPage() {
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <header className="archive-heading">
          <p>NOTES · 03</p>
          <h1>작지만 바로 쓰이는<br />실무의 단서들.</h1>
          <span>수집, 태깅, 개인정보 보호에 관한 짧은 기록</span>
        </header>
        <div className="notes-grid">
          {notes.map((note) => (
            <article className="archive-note" key={note.slug}>
              <span>{note.category}</span>
              <h2>{note.title}</h2>
              <p>{note.description}</p>
              <span aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
