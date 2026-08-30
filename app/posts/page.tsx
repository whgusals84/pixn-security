import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { writings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing — PIXN',
  description: '디지털 분석과 측정 설계에 관한 글',
};

export default function PostsPage() {
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <header className="archive-heading">
          <p>WRITING · 04</p>
          <h1>관찰하고, 질문하고,<br />기록합니다.</h1>
          <span>디지털 분석과 측정 설계에 관한 긴 글</span>
        </header>
        <div className="archive-list">
          {writings.map((post, index) => (
            <a className="archive-row" href={index === 0 ? `/posts/${post.slug}` : '/posts'} key={post.slug}>
              <time>{post.date}</time>
              <div>
                <span>{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
              </div>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
