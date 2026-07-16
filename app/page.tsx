import { Hero } from '@/components/Hero';
import { ProjectBlock } from '@/components/ProjectBlock';
import { projects } from '@/lib/content';

export default function Home() {
  return (
    <main>
      <Hero />
      {/* Only enabled projects are in `projects`; numbering (01, 02…) follows
          their order, so disabling one closes the gap automatically. */}
      <div id="projects">
        {projects.map((project, i) => (
          <ProjectBlock key={project.id} project={project} num={i + 1} />
        ))}
      </div>
    </main>
  );
}
