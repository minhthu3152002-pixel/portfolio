'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
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

/** Show/hide grace period (ms) so moving between avatar and panel never flickers. */
const HOVER_DELAY = 120;
/** How far down-right of the pointer the panel sits, so it's never under the cursor. */
const CURSOR_OFFSET = 16;
/** Panel width (keep in sync with the w-[280px] class) + viewport safe-margin. */
const PANEL_W = 280;
const VIEWPORT_MARGIN = 12;

type Pos = { left: number; top: number };

/**
 * "Personality card" popover shown from the About avatar. Two interaction modes,
 * chosen by a `(hover: hover) and (pointer: fine)` media query (not user-agent):
 *
 *  • Hover devices — appears on mouseenter and follows the cursor (offset
 *    down-right, clamped to the viewport); stays open while the pointer is over
 *    the avatar OR the panel; hides ~120ms after leaving both. Keyboard focus
 *    opens it anchored below the card. No click needed.
 *  • Touch devices — tap the avatar to open, tap outside (or Esc) to close.
 *
 * Glass + motion match the navbar dropdown (tabSpring; reduced-motion → fade
 * only). Controlled via `open` / `onOpenChange`.
 */
export function PersonalityCard({
  open,
  onOpenChange,
  personality,
  lang,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  personality: Personality;
  lang: Lang;
  triggerRef: RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const openRef = useRef(open);
  openRef.current = open;

  // `pos` set → follow-cursor (fixed) placement; `null` → anchored below (used
  // on touch and for keyboard-focus opens where there is no pointer).
  const [pos, setPos] = useState<Pos | null>(null);
  const [hoverMode, setHoverMode] = useState(false);

  const clearTimer = () => {
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };
  // Cancel a pending hide (pointer re-entered the avatar or panel).
  const cancelClose = () => clearTimer();
  // Hide after the grace period (pointer left the avatar or panel).
  const deferClose = () => {
    clearTimer();
    timer.current = window.setTimeout(() => onOpenChange(false), HOVER_DELAY);
  };

  // Clamp a follow-cursor position to stay fully inside the viewport.
  const positionAt = (clientX: number, clientY: number): Pos => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const h = panelRef.current?.offsetHeight ?? 220;
    let left = clientX + CURSOR_OFFSET;
    let top = clientY + CURSOR_OFFSET;
    // Flip to the left of the cursor if it would run off the right edge.
    if (left + PANEL_W + VIEWPORT_MARGIN > vw) left = clientX - PANEL_W - CURSOR_OFFSET;
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - PANEL_W - VIEWPORT_MARGIN));
    if (top + h + VIEWPORT_MARGIN > vh) top = vh - h - VIEWPORT_MARGIN;
    top = Math.max(VIEWPORT_MARGIN, top);
    return { left, top };
  };

  // Detect hover capability (re-evaluates if the input device changes).
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setHoverMode(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Wire the avatar (and document) listeners for the active mode.
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    if (hoverMode) {
      let raf = 0;
      const move = (clientX: number, clientY: number) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          setPos(positionAt(clientX, clientY));
        });
      };
      const onEnter = (e: MouseEvent) => {
        clearTimer();
        setPos(positionAt(e.clientX, e.clientY));
        timer.current = window.setTimeout(() => onOpenChange(true), HOVER_DELAY);
      };
      const onMove = (e: MouseEvent) => move(e.clientX, e.clientY);
      const onLeave = () => deferClose();
      const onFocus = () => {
        clearTimer();
        setPos(null); // no pointer → anchor below the card
        onOpenChange(true);
      };
      const onBlur = () => deferClose();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          clearTimer();
          onOpenChange(false);
        }
      };

      trigger.addEventListener('mouseenter', onEnter);
      trigger.addEventListener('mousemove', onMove);
      trigger.addEventListener('mouseleave', onLeave);
      trigger.addEventListener('focus', onFocus);
      trigger.addEventListener('blur', onBlur);
      document.addEventListener('keydown', onKey);
      return () => {
        clearTimer();
        if (raf) cancelAnimationFrame(raf);
        trigger.removeEventListener('mouseenter', onEnter);
        trigger.removeEventListener('mousemove', onMove);
        trigger.removeEventListener('mouseleave', onLeave);
        trigger.removeEventListener('focus', onFocus);
        trigger.removeEventListener('blur', onBlur);
        document.removeEventListener('keydown', onKey);
      };
    }

    // Touch / no-hover: tap to toggle, tap-outside or Esc to close.
    setPos(null);
    const toggle = () => onOpenChange(!openRef.current);
    const onClick = () => toggle();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    };
    const onDocPointer = (e: PointerEvent) => {
      if (!openRef.current) return;
      const target = e.target as Node;
      const panel = panelRef.current;
      if (panel && !panel.contains(target) && !trigger.contains(target)) {
        onOpenChange(false);
      }
    };
    const onDocKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    trigger.addEventListener('click', onClick);
    trigger.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onDocPointer, true);
    document.addEventListener('keydown', onDocKey, true);
    return () => {
      trigger.removeEventListener('click', onClick);
      trigger.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onDocPointer, true);
      document.removeEventListener('keydown', onDocKey, true);
    };
    // onOpenChange is stable (useCallback in the parent); positionAt closes over
    // only refs/window, so it's safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverMode, triggerRef, onOpenChange]);

  const anchored = pos == null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-label={t(personality.title, lang)}
          tabIndex={-1}
          onMouseEnter={hoverMode ? cancelClose : undefined}
          onMouseLeave={hoverMode ? deferClose : undefined}
          style={anchored ? undefined : { left: pos.left, top: pos.top }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 6 }}
          transition={reduce ? { duration: 0.15 } : tabSpring}
          className={`z-50 w-[280px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[24px] border border-white/60 bg-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.16)] outline-none backdrop-blur-[20px] ${
            anchored
              ? 'absolute left-0 top-full mt-3 origin-top'
              : 'fixed origin-top-left'
          }`}
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
