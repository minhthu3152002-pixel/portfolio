'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, projects, pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { stackContainerTight, stackItemTight } from '@/lib/motion';

/** Hex -> HSL ({ h: 0-360, s/l: 0-1 }). */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

/** HSL -> #rrggbb. */
function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const hex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Soft pastel "poster" gradient from a project accent — same hue as the home
 * block below, just lower saturation / higher lightness (deep top-left -> airy
 * bottom-right). The deep top stop stays dark enough to keep white text
 * readable even on light accents (e.g. amber).
 */
function poster(accent: string): string {
  const { h, s } = hexToHsl(accent);
  const deep = hslToHex(h, Math.min(0.62, Math.max(0.4, s)), 0.3);
  const mid = hslToHex(h, s * 0.58, 0.56);
  const airy = hslToHex(h, s * 0.5, 0.74);
  return `radial-gradient(78% 60% at 15% 0%, rgba(255,255,255,0.16), transparent 55%), linear-gradient(140deg, ${deep} 0%, ${mid} 52%, ${airy} 100%)`;
}

/**
 * Liquid-glass "My Projects" shelf overlapping the hero bottom: one frosted
 * glass window with a mac-style header (traffic lights · centered title · time)
 * over a dark panel holding filter chips and a drag-to-scroll row of accent
 * "gradient poster" project cards (enabled projects only).
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

  // Drag-to-scroll
  const rowRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = rowRef.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = rowRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  // Swallow the click that ends a drag so cards don't navigate on drag-release.
  const onCardClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  return (
    <div className="glass mx-auto max-w-[1000px] rounded-[28px] p-2.5">
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

        {/* card row */}
        <motion.div
          ref={rowRef}
          variants={stackContainerTight}
          initial="hidden"
          animate="visible"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          // Internal breathing room so the hover lift/shadow never clip against
          // the scroll container's bounds; negative margins keep spacing tight.
          className="no-scrollbar -mx-2 -mb-2 -mt-3 flex cursor-grab snap-x snap-mandatory gap-3.5 overflow-x-auto px-2 pb-5 pt-3 active:cursor-grabbing"
        >
          {visible.map((p) => {
            const first = p.tags[0];
            return (
              <motion.div key={p.id} variants={stackItemTight} className="snap-start">
                <Link
                  href={`/project/${p.id}`}
                  onClick={onCardClick}
                  draggable={false}
                  aria-label={t(p.title, lang)}
                  className="group relative flex h-[240px] w-[210px] shrink-0 select-none flex-col justify-between overflow-hidden rounded-[20px] border border-white/20 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  style={{ background: poster(p.colors.accent) }}
                >
                  {/* hover brighten */}
                  <div className="pointer-events-none absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/5" />

                  {/* title + meta */}
                  <div className="relative">
                    <p className="line-clamp-2 text-[1.02rem] font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
                      {t(p.title, lang).split('—')[0].trim()}
                    </p>
                    <p className="mt-1 text-[0.75rem] font-medium text-white/70">
                      {pad2(projects.indexOf(p) + 1)} · {t(first, lang)}
                    </p>
                  </div>

                  {/* small secondary thumbnail at the bottom */}
                  <div className="relative overflow-hidden rounded-lg border border-white/20 shadow-[0_6px_16px_rgba(0,0,0,0.25)]">
                    <div className="relative aspect-video w-full">
                      <Image
                        src={p.cover}
                        alt={t(p.title, lang)}
                        fill
                        sizes="180px"
                        draggable={false}
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
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
