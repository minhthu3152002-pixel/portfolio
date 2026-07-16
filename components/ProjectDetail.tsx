'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content';
import { enabledSections, enabledGroups, pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { Blocks } from '@/components/Blocks';
import { pageTransition, fadeUp } from '@/lib/motion';

/**
 * Project detail view: colored hero band, Skills sidebar and a set of pill
 * TABS (sections). Each active tab shows its enabled groups, and each group is
 * an optional sub-heading followed by its content blocks.
 */
export function ProjectDetail({
  project: p,
  num,
}: {
  project: Project;
  num: number;
}) {
  const { lang } = useLanguage();
  const { colors } = p;
  const sections = enabledSections(p);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const groups = active ? enabledGroups(active) : [];

  return (
    <motion.main
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      // `--pc` drives accent bullets, stat numbers, tabs and links across this page.
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
            {lang === 'vi' ? '← Quay lại dự án' : '← Back to projects'}
          </Link>
          <div>
            <span className="mb-[22px] inline-block rounded-full bg-black/40 px-5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em]">
              {pad2(num)} / {lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}
            </span>
          </div>
          <h1 className="mb-5 max-w-[840px] text-[clamp(2.1rem,5vw,3.5rem)] font-extrabold uppercase tracking-[-0.01em]">
            {t(p.title, lang)}
          </h1>
          <p className="mb-7 max-w-[640px] opacity-90">{t(p.short, lang)}</p>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((tag) => (
              <span key={t(tag, lang)} className="tag">
                {t(tag, lang)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap grid grid-cols-[250px_1fr] gap-[60px] py-20 max-[820px]:grid-cols-1 max-[820px]:gap-[30px]">
        <aside>
          <h4 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-muted">
            {lang === 'vi' ? 'Kỹ năng' : 'Skills'}
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((tag) => (
              <span key={t(tag, lang)} className="tag !border-line !text-text">
                {t(tag, lang)}
              </span>
            ))}
          </div>
        </aside>

        <div>
          {/* Tab bar — one pill per enabled section */}
          <div
            role="tablist"
            aria-label="Project sections"
            className="mb-10 flex flex-wrap gap-2.5 border-b border-line pb-6"
          >
            {sections.map((s) => {
              const isActive = s.id === active?.id;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(s.id)}
                  className={`rounded-full border px-[18px] py-[7px] text-[0.83rem] font-medium transition-colors ${
                    isActive
                      ? 'border-transparent bg-[var(--pc)] text-bg'
                      : 'border-line text-muted hover:text-text'
                  }`}
                >
                  {t(s.label, lang)}
                </button>
              );
            })}
          </div>

          {/* Active tab panel — groups render as sub-headings + blocks */}
          <motion.div
            key={active?.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            role="tabpanel"
          >
            {groups.map((g, i) => (
              <section key={i} className="mb-12 last:mb-0">
                {g.title && (
                  <h3 className="mb-5 text-[1.2rem] font-extrabold uppercase tracking-[0.04em]">
                    {t(g.title, lang)}
                  </h3>
                )}
                <Blocks blocks={g.blocks} lang={lang} />
              </section>
            ))}
          </motion.div>

          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--pc)]"
          >
            {lang === 'vi' ? '← Quay lại tất cả dự án' : '← Back to all projects'}
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
