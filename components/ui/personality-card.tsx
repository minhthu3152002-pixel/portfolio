'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  BrainCircuit,
  HeartHandshake,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';
import { t, type Lang, type Personality } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/**
 * Maps the content `icon` string → a lucide glyph. lucide's thin rounded line
 * style is the closest web-licensed match to SF Symbols. Swap any icon here in
 * one place; an unknown key simply renders no icon.
 */
const ICONS: Record<string, LucideIcon> = {
  zodiac: Sparkles,
  mbti: BrainCircuit,
  eq: HeartHandshake,
  iq: Lightbulb,
};

/**
 * "Personality card" popover, anchored below the About avatar. Opens/closes with
 * the same glass + motion as the navbar dropdown (tabSpring; reduced-motion →
 * fade only). While open it closes on Esc / outside click and traps focus on the
 * panel (it has no focusable children). Positioned absolutely, so its parent
 * must be `relative`.
 */
export function PersonalityCard({
  open,
  onClose,
  personality,
  lang,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  personality: Personality;
  lang: Lang;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        triggerRef.current?.focus();
      } else if (e.key === 'Tab') {
        // No focusable children → keep focus trapped on the panel.
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) {
          e.preventDefault();
          panelRef.current?.focus();
        }
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      const panel = panelRef.current;
      const trigger = triggerRef.current;
      if (panel && !panel.contains(target) && trigger && !trigger.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label={t(personality.title, lang)}
          tabIndex={-1}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
          transition={reduce ? { duration: 0.15 } : tabSpring}
          className="absolute left-0 top-full z-40 mt-3 w-[280px] max-w-[calc(100vw-2.5rem)] origin-top overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.08)] outline-none backdrop-blur-[20px]"
        >
          <div className="p-4">
            <p className="mb-3 text-[0.9rem] font-semibold tracking-[-0.01em] text-[#1d1d1f]">
              {t(personality.title, lang)}
            </p>
            <ul className="flex flex-col gap-2.5">
              {personality.items.map((item, i) => {
                const Icon = ICONS[item.icon];
                return (
                  <li key={i} className="flex items-center gap-3">
                    {Icon && (
                      <Icon size={16} strokeWidth={1.75} className="shrink-0 text-text" aria-hidden />
                    )}
                    <span className="flex-1 text-[0.85rem] text-muted">
                      {t(item.label, lang)}
                    </span>
                    <span className="text-[0.9rem] font-semibold text-text">
                      {t(item.value, lang)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
