'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import type { Project } from '@/lib/content';
import { content, enabledSections, enabledGroups, t } from '@/lib/content';
import { headerGradient } from '@/lib/colors';
import { useLanguage } from '@/components/LanguageProvider';
import { GroupPanel } from '@/components/GroupPanel';
import { FreeChannelGroupPanel } from '@/components/FreeChannelGroupPanel';
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
export function ProjectDetail({ project: p }: { project: Project }) {
  const { lang } = useLanguage();
  const reduce = useReducedMotion();
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
      {/* lit-glass hero band — gradient bg→deeper + soft radial light spot */}
      <header
        className="rounded-b-[36px] px-6 pb-20 pt-10 sm:pt-12"
        style={{ background: headerGradient(colors.bg), color: colors.fg }}
      >
        <div className="mx-auto max-w-wrap">
          {/* iOS-26 liquid-glass round back button (icon inherits header fg) */}
          <Link
            href="/"
            aria-label={t(content.ui.backToProjects, lang)}
            className="group mb-10 inline-flex rounded-full outline-none"
          >
            <motion.span
              whileHover={reduce ? undefined : { scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={tabSpring}
              className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/70 group-focus-visible:ring-2 group-focus-visible:ring-white/60"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden />
            </motion.span>
          </Link>
          <h1 className="mb-5 max-w-[840px] text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.02em] [text-shadow:0_1px_2px_rgba(0,0,0,0.05)]">
            {t(p.title, lang)}
          </h1>
          <p className="mb-8 max-w-[640px] text-[1.1875rem] leading-[1.6] opacity-80">
            {t(p.short, lang)}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {p.tags.map((tag) => (
              <span
                key={t(tag, lang)}
                className="rounded-full border border-white/50 bg-white/40 px-[14px] py-[6px] text-[0.8rem] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md"
              >
                {t(tag, lang)}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* sticky liquid-glass pill tab bar — only this bar sticks on scroll */}
      <div className="sticky top-3 z-40 py-5">
        <div className="mx-auto max-w-wrap px-6">
          <motion.div
            role="tablist"
            aria-label="Project sections"
            onKeyDown={onKeyDown}
            variants={stackContainerTight}
            initial="hidden"
            animate="visible"
            className="liquid-glass no-scrollbar mx-auto flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-full p-2"
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
                  whileHover={isActive ? undefined : { y: -2 }}
                  transition={tabSpring}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(s.id)}
                  className="relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors"
                  style={{ color: isActive ? tabText : 'rgba(29,29,31,0.55)' }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={tabSpring}
                      className="absolute inset-0 -z-10 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_8px_rgba(0,0,0,0.12)]"
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
      <div className="mx-auto max-w-wrap px-6 pb-28 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?.id}
            variants={tabPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="tabpanel"
          >
            {active?.eyebrow && (
              <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--pc,theme(colors.accent))]">
                {t(active.eyebrow, lang)}
              </p>
            )}
            {groups.map((g, i) => {
              const isKtechFree = p.id === 'k-tech' && active?.id === 'free';
              const isToolsOnlyGroup = g.blocks.length === 1 && g.blocks[0].type === 'tools';
              if (isKtechFree && !isToolsOnlyGroup) {
                return <FreeChannelGroupPanel key={i} group={g} lang={lang} />;
              }
              return (
                <GroupPanel
                  key={i}
                  group={g}
                  lang={lang}
                  spacious={active?.id === 'landing-page'}
                  masonry={active?.id === 'gallery'}
                  flatText={p.id === 'k-tech'}
                  wideIntro={p.id === 'k-tech' && active?.id === 'overview'}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--pc)]"
        >
          {lang === 'vi' ? '← Quay lại tất cả dự án' : '← Back to all projects'}
        </Link>
      </div>
    </main>
  );
}
