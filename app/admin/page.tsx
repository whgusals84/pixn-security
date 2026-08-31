import { AdminContentManager } from '@/components/admin-content-manager';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <>
      <SiteHeader />
      <main className="admin-page">
        <header className="admin-heading">
          <p>PIXN CONTENT STUDIO</p>
          <h1>Write. Save.<br />Publish.</h1>
          <span>코덱스 없이 이 화면에서 새 글을 관리할 수 있습니다.</span>
        </header>
        <AdminContentManager />
      </main>
      <SiteFooter />
    </>
  );
}

