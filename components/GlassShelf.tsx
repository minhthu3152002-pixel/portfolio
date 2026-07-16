'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, projects, pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { stackContainerTight, stackItemTight } from '@/lib/motion';

/** Frosted glass wing (with an opaque fallback when backdrop-filter is absent). */
const WING =
  'border border-white/50 bg-[rgba(60,64,80,0.5)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] supports-[backdrop-filter]:bg-white/30 supports-[backdrop-filter]:backdrop-blur-[24px] [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]';

const DARK = 'rgba(8,8,12,0.92)';

/**
 * Liquid-glass "notch" shelf: a 3-column row — [glass wing][dark panel][glass
 * wing]. The dark panel holds the whole UI (header, chips, cards); its height
 * follows its content and it sits ~14px taller than the wings so it protrudes
 * like a hardware notch. Under 768px the wings are hidden and the panel goes
 * full width.
 */
export function GlassShelf() {
  return (
    <div className="mx-auto max-w-[1000px]">
      {/* Desktop: two tall glass slabs flanking a slim dark panel that pokes
          up ~14px above them and bridges the middle near the top. */}
      <div className="hidden items-start gap-2.5 md:flex">
        <div
          className={`${WING} mt-[14px] flex h-[500px] w-[220px] items-start rounded-[28px] px-4 pt-4`}
        >
          <Identity />
        </div>

        <DarkPanel className="relative z-10 flex-1 rounded-[24px]" />

        <div
          className={`${WING} mt-[14px] flex h-[500px] w-[220px] items-start justify-end rounded-[28px] px-4 pt-4`}
        >
          <WifiTime />
        </div>
      </div>

      {/* Mobile: dark panel only, full width */}
      <div className="md:hidden">
        <DarkPanel className="rounded-[22px]" />
      </div>
    </div>
  );
}

/** The dark panel: header (title + tools) · filter chips · drag-scroll cards.
 *  Height is dictated by its content — no fixed height. */
function DarkPanel({ className = '' }: { className?: string }) {
  const { lang } = useLanguage();
  const h = content.hero;

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
  const onCardClick = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  return (
    <div className={`p-4 ${className}`} style={{ background: DARK }}>
      {/* compact header row: title left · tool buttons right */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 whitespace-nowrap text-base font-semibold text-white">
          <FolderIcon />
          {t(h.shelfTitle, lang)}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          <ToolButton>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </ToolButton>
          <ToolButton>
            <rect x="4" y="4" width="7" height="7" rx="1.5" />
            <rect x="13" y="4" width="7" height="7" rx="1.5" />
            <rect x="4" y="13" width="7" height="7" rx="1.5" />
            <rect x="13" y="13" width="7" height="7" rx="1.5" />
          </ToolButton>
        </div>
      </div>

      {/* single filter-chips row — scrolls horizontally, never wraps */}
      <div className="no-scrollbar mb-3 flex flex-nowrap gap-2 overflow-x-auto">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')} label={t(h.shelfFilterAll, lang)} />
        {filters.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)} label={f.label} />
        ))}
      </div>

      {/* one row of small cards — animate on mount so cards always render */}
      <motion.div
        ref={rowRef}
        variants={stackContainerTight}
        initial="hidden"
        animate="visible"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto pb-0.5 active:cursor-grabbing"
      >
        {visible.map((p) => {
          const first = p.tags[0];
          return (
            <motion.div key={p.id} variants={stackItemTight} className="snap-start">
              <Link
                href={`/project/${p.id}`}
                onClick={onCardClick}
                draggable={false}
                className="group block w-[190px] shrink-0 select-none rounded-xl bg-white/5 p-1.5 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={p.cover} alt={t(p.title, lang)} fill sizes="190px" draggable={false} className="object-cover" />
                </div>
                <div className="px-0.5 pb-0.5 pt-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {t(p.title, lang).split('—')[0].trim()}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-white/55">
                    {pad2(projects.indexOf(p) + 1)} · {t(first, lang)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1 text-[0.76rem] font-medium transition-colors ${
        active ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function ToolButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-white/70">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        {children}
      </svg>
    </span>
  );
}

/** Small identity label (logo mark + name) for the left wing. */
function Identity() {
  const { logoText } = content.site;
  const dot = logoText.indexOf('.');
  const head = dot === -1 ? logoText : logoText.slice(0, dot);
  const tail = dot === -1 ? '' : logoText.slice(dot);
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap text-[0.82rem] font-semibold text-white">
      <span className="h-4 w-4 rounded-[5px] bg-gradient-to-br from-[#4f9dff] to-[#c98bff]" />
      {head}
      <span className="text-white/60">{tail}</span>
    </span>
  );
}

/** Fake wifi + time for the right wing. */
function WifiTime() {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap text-white/85">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 18.5a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z" fill="currentColor" />
        <path d="M5.5 12.5a9 9 0 0 1 13 0M8.3 15.3a5 5 0 0 1 7.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
      <span className="tnum text-[0.8rem]">9:41</span>
    </span>
  );
}

function FolderIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#4f9dff]">
      <path
        d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.7c.5 0 1 .2 1.4.6l1 1c.3.3.8.5 1.3.5H18.5A2.5 2.5 0 0 1 21 8.6V17.5A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
        fill="currentColor"
      />
    </svg>
  );
}
