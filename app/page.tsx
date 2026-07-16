import { Hero } from '@/components/Hero';
import { AboutMe } from '@/components/AboutMe';
import { ProjectList } from '@/components/ProjectList';

export default function Home() {
  return (
    <main>
      <Hero />
      {/* About me — between the hero shelf and the project blocks. */}
      <AboutMe />
      {/* Numbered project blocks — only enabled projects, numbered by order. */}
      <section id="projects" className="wrap scroll-mt-24 py-12 sm:py-16">
        <ProjectList />
      </section>
    </main>
  );
}
