'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { content, projects, pad2, t, type ProjectColors } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { posterStops } from '@/lib/colors';
import { stackContainerTight, stackItemTight } from '@/lib/motion';

/** Folder silhouette in a 100×76 viewBox: rounded body with a ~40%-wide tab
 *  protruding flush on the top-left, merging into the body with a smooth
 *  fillet (Finder / iOS folder icon). */
const FOLDER_PATH =
  'M6,0 L36,0 Q42,0 42,6 L42,8 Q42,15 49,15 L91,15 Q100,15 100,24 ' +
  'L100,67 Q100,76 91,76 L9,76 Q0,76 0,67 L0,6 Q0,0 6,0 Z';

/**
 * Liquid-glass "My Projects" shelf overlapping the hero bottom: one frosted
 * glass window with a mac-style header over a dark panel holding filter chips
 * and a wrapping row of macOS-style FOLDER icons (enabled projects only). Each
 * folder is a flat gradient shape in the project's own accent; its title and a
 * muted number·tag line sit below it. The whole folder links to the project.
 */
export function GlassShelf() {
  const { lang } = useLanguage();
  const h = content.hero;

  // Filters: "All" + each project's first tag (deduped, in order).
  const filters = useMemo(() => {
    const seen = new Set<string>();
    const out: { key: string; label: string }[] = [];
    for (const p of projects) {
      const first = p.tags[0];
      const key = typeof first === 'string' ? first : first.en;
      if (!seen.has(key)) {
        seen.add(key);
        out.push({ key, label: t(first, lang) });
      }
    }
    return out;
  }, [lang]);

  const [filter, setFilter] = useState<string>('all');
  const visible = projects.filter((p) => {
    if (filter === 'all') return true;
    const first = p.tags[0];
    const key = typeof first === 'string' ? first : first.en;
    return key === filter;
  });

  return (
    <div className="glass mx-auto max-w-[1060px] rounded-[28px] p-2.5">
      {/* mac-window header */}
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex flex-1 items-center justify-center gap-2 text-[0.82rem] font-medium text-white/90">
          <FolderIcon />
          {t(h.shelfTitle, lang)}
        </div>
        <span className="tnum text-[0.78rem] text-white/60">9:41</span>
      </div>

      {/* dark panel */}
      <div className="rounded-[20px] p-4" style={{ background: 'rgba(10,10,14,0.9)' }}>
        {/* filter chips */}
        <div className="no-scrollbar mb-4 flex flex-nowrap gap-2 overflow-x-auto">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')} label={t(h.shelfFilterAll, lang)} />
          {filters.map((f) => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)} label={f.label} />
          ))}
        </div>

        {/* folder row — 5 across on desktop, wraps to a grid on tablet/mobile */}
        <motion.div
          variants={stackContainerTight}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-3 gap-y-6 pt-1"
        >
          {visible.map((p) => {
            const first = p.tags[0];
            return (
              <motion.div key={p.id} variants={stackItemTight}>
                <Link
                  href={`/project/${p.id}`}
                  aria-label={t(p.title, lang)}
                  className="group flex w-[188px] flex-col items-center rounded-2xl p-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {/* a. TITLE above — reserved 2-line height so every folder
                      starts at the same y; wraps, never truncates */}
                  <div className="mb-2.5 flex h-[46px] w-full items-end justify-center">
                    <p className="line-clamp-2 text-[16px] font-semibold leading-[1.2] text-white">
                      {t(p.title, lang).split('—')[0].trim()}
                    </p>
                  </div>

                  {/* b. the folder shape */}
                  <Folder id={p.id} colors={p.colors} />

                  {/* c. TAG line below — reserved 2-line height, muted */}
                  <div className="mt-2.5 flex h-[34px] w-full items-start justify-center">
                    <p className="line-clamp-2 text-[13px] font-medium leading-[1.2] text-white/55">
                      {pad2(projects.indexOf(p) + 1)} · {t(first, lang)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

/** A single flat-gradient folder shape filled with the project's accent. */
function Folder({ id, colors }: { id: string; colors: ProjectColors }) {
  const { deep, mid, airy } = posterStops(colors.accent);
  const gid = `folder-fill-${id}`;
  const hid = `folder-hl-${id}`;
  return (
    <svg
      viewBox="0 0 100 76"
      aria-hidden
      className="block h-auto w-full drop-shadow-[0_10px_22px_rgba(0,0,0,0.38)] transition-all duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_16px_30px_rgba(0,0,0,0.46)]"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={deep} />
          <stop offset="52%" stopColor={mid} />
          <stop offset="100%" stopColor={airy} />
        </linearGradient>
        <radialGradient id={hid} cx="0.18" cy="0.04" r="0.7">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={FOLDER_PATH} fill={`url(#${gid})`} />
      <path d={FOLDER_PATH} fill={`url(#${hid})`} />
    </svg>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-3 py-1 text-[0.76rem] font-medium transition-colors ${
        active ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#4f9dff]">
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.7c.5 0 1 .2 1.4.6l1 1c.3.3.8.5 1.3.5H18.5A2.5 2.5 0 0 1 21 8.6V17.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
        fill="currentColor"
      />
    </svg>
  );
}
