import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { content, projects, getProject, projectNumber, t } from '@/lib/content';
import { ProjectDetail } from '@/components/ProjectDetail';

export function generateStaticParams() {
  // Only enabled projects get routes.
  return projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const project = getProject(params.id);
  if (!project) return {};
  return {
    title: `${t(project.title, 'en')} — ${t(content.site.title, 'en')}`,
    description: t(project.short, 'en'),
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProject(params.id);
  if (!project) notFound();
  return <ProjectDetail project={project} num={projectNumber(project.id)} />;
}
