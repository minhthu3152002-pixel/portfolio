'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/lib/content';
import { enabledSections, enabledGroups, pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { Blocks } from '@/components/Blocks';
import {
  tabSpring,
  tabPanel,
  stackContainerTight,
  stackItemTight,
} from '@/lib/motion';

/** Pick black/white text for readability on a hex background. */
function readableOn(hex: string): string {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 150 ? '#1d1d1f' : '#ffffff';
}

/**
 * Project detail: pastel hero band + sticky glass pill tab bar (sliding active
 * pill via layoutId, hash-synced, arrow-key navigable) + animated tab panels
 * whose enabled groups render as sub-headings with text/stats/gallery blocks.
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
  const tabText = readableOn(colors.accent);

  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Read the URL hash on load (deep-link into a tab).
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.some((s) => s.id === hash)) setActiveId(hash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectTab = (id: string, focus = false) => {
    setActiveId(id);
    history.replaceState(null, '', `#${id}`);
    if (focus) {
      const idx = sections.findIndex((s) => s.id === id);
      btnRefs.current[idx]?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = sections.findIndex((s) => s.id === activeId);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      selectTab(sections[(idx + 1) % sections.length].id, true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      selectTab(sections[(idx - 1 + sections.length) % sections.length].id, true);
    }
  };

  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  const groups = active ? enabledGroups(active) : [];

  return (
    <main style={{ ['--pc' as string]: colors.accent }}>
      {/* pastel hero band */}
      <header
        className="rounded-b-[40px] px-6 pb-16 pt-32"
        style={{ background: colors.bg, color: colors.fg }}
      >
        <div className="mx-auto max-w-wrap">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-[0.9rem] font-medium opacity-70 transition-opacity hover:opacity-100"
          >
            {lang === 'vi' ? '← Quay lại dự án' : '← Back to projects'}
          </Link>
          <p className="mb-4 text-[0.78rem] font-semibold tracking-[0.16em] opacity-60">
            {pad2(num)} / {lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}
          </p>
          <h1 className="mb-4 max-w-[840px] text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
            {t(p.title, lang)}
          </h1>
          <p className="mb-6 max-w-[640px] text-[1.05rem] leading-relaxed opacity-80">
            {t(p.short, lang)}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((tag) => (
              <span
                key={t(tag, lang)}
                className="rounded-full border border-black/10 bg-white/50 px-[14px] py-[6px] text-[0.8rem] font-medium"
              >
                {t(tag, lang)}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* sticky glass pill tab bar */}
      <div className="sticky top-20 z-40 py-4">
        <div className="mx-auto max-w-wrap px-6">
          <motion.div
            role="tablist"
            aria-label="Project sections"
            onKeyDown={onKeyDown}
            variants={stackContainerTight}
            initial="hidden"
            animate="visible"
            className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-full border border-line bg-white/70 p-1.5 backdrop-blur-xl"
          >
            {sections.map((s, i) => {
              const isActive = s.id === active?.id;
              return (
                <motion.button
                  key={s.id}
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  variants={stackItemTight}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(s.id)}
                  className="relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors"
                  style={{ color: isActive ? tabText : '#6e6e73' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={tabSpring}
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ background: colors.accent }}
                    />
                  )}
                  {t(s.label, lang)}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* animated tab panel */}
      <div className="mx-auto max-w-wrap px-6 pb-24 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            variants={tabPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="tabpanel"
          >
            {groups.map((g, i) => (
              <section key={i} className="mb-14 last:mb-0">
                {g.title && (
                  <h3 className="mb-5 text-[1.4rem] font-bold tracking-[-0.01em]">
                    {t(g.title, lang)}
                  </h3>
                )}
                <Blocks blocks={g.blocks} lang={lang} />
              </section>
            ))}
          </motion.div>
        </AnimatePresence>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--pc)]"
        >
          {lang === 'vi' ? '← Quay lại tất cả dự án' : '← Back to all projects'}
        </Link>
      </div>
    </main>
  );
}
