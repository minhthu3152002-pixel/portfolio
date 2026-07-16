import { Hero } from '@/components/Hero';
import { AboutMe } from '@/components/AboutMe';
import { ProjectList } from '@/components/ProjectList';
import { SectionHeadline } from '@/components/SectionHeadline';
import { content } from '@/lib/content';

export default function Home() {
  return (
    <main>
      <Hero />
      {/* About me — between the hero shelf and the project blocks. */}
      <AboutMe />
      {/* Numbered project blocks — only enabled projects, numbered by order. */}
      <section id="projects" className="wrap scroll-mt-24 py-12 sm:py-16">
        <SectionHeadline heading={content.projectsHeading} />
        <ProjectList />
      </section>
    </main>
  );
}
