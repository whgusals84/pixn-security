import type { Metadata } from 'next';
import { SiteFooter, SiteHeader } from '@/components/site-chrome';
import { projects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects — PIXN',
  description: '측정과 분석을 더 명료하게 만드는 프로젝트',
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main className="archive-page">
        <header className="archive-heading">
          <p>PROJECTS · 04</p>
          <h1>복잡한 데이터를<br />쓸 수 있는 도구로.</h1>
          <span>측정과 분석을 더 명료하게 만드는 개인 프로젝트</span>
        </header>
        <div className="archive-projects">
          {projects.map((project, index) => (
            <a className="archive-project" href={index === 0 ? `/projects/${project.slug}` : '/projects'} key={project.slug}>
              <div className="project-index">0{index + 1}</div>
              <div>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
              </div>
              <span>{project.stat}</span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
