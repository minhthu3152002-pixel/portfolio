'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Gallery } from '@/components/Gallery';
import { Reveal } from '@/components/Reveal';
import { pageTransition } from '@/lib/motion';

/** Project detail view: colored hero band, Skills sidebar and content sections. */
export function ProjectDetail({ project: p }: { project: Project }) {
  const { colors } = p;

  return (
    <motion.main
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      // `--pc` drives accent bullets, stat numbers and links across this page.
      style={{ ['--pc' as string]: colors.accent }}
    >
      <header
        className="rounded-b-[40px] pb-[70px] pt-20"
        style={{ background: colors.bg, color: colors.fg }}
      >
        <div className="wrap">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-[0.9rem] font-medium opacity-85 transition-opacity hover:opacity-100"
          >
            ← Back to projects
          </Link>
          <div>
            <span className="mb-[22px] inline-block rounded-full bg-black/40 px-5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
              {p.num} PROJECT
            </span>
          </div>
          <h1 className="mb-5 max-w-[840px] text-[clamp(2.1rem,5vw,3.5rem)] font-extrabold uppercase tracking-[-0.01em]">
            {p.title}
          </h1>
          <p className="mb-7 max-w-[640px] opacity-90">{p.short}</p>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap grid grid-cols-[250px_1fr] gap-[60px] py-20 max-[820px]:grid-cols-1 max-[820px]:gap-[30px]">
        <aside>
          <h4 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Skills
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((t) => (
              <span key={t} className="tag !border-line !text-text">
                {t}
              </span>
            ))}
          </div>
        </aside>

        <div>
          <Section title="Overview">
            <RichList items={p.overview} />
          </Section>
          <Section title="Challenge">
            <RichList items={p.challenge} />
          </Section>
          <Section title="Solution">
            <RichList items={p.solution} />
          </Section>
          <Section title="Result">
            <div className="mt-2 flex flex-wrap gap-10">
              {p.stats.map(([value, label], i) => (
                <div key={i}>
                  <b className="block font-display text-[2.2rem] font-extrabold text-[var(--pc)]">
                    {value}
                  </b>
                  <small className="text-muted">{label}</small>
                </div>
              ))}
            </div>
            <RichList items={p.results} className="mt-7" />
          </Section>
          <Section title="Gallery">
            <Gallery items={p.gallery} />
          </Section>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--pc)]"
          >
            ← Back to all projects
          </Link>
        </div>
      </div>
    </motion.main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="mb-16">
      <h3 className="mb-[22px] text-[1.45rem] font-extrabold uppercase tracking-[0.04em]">
        {title}
      </h3>
      {children}
    </Reveal>
  );
}
