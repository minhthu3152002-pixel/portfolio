import { Hero } from '@/components/Hero';
import { ProjectBlock } from '@/components/ProjectBlock';
import { projects } from '@/lib/content';

export default function Home() {
  return (
    <main>
      <Hero />
      <div id="projects">
        {projects.map((project) => (
          <ProjectBlock key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}
