import type { Variants, Transition } from 'framer-motion';

/**
 * Centralized motion config — one place to tune the whole site's motion
 * signature. Framer honors prefers-reduced-motion via the <MotionConfig
 * reducedMotion="user"> provider (Providers.tsx), which neutralizes transforms.
 */

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fade + rise on scroll (16px, .6s ease-out) — default section reveal. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

/** Shared viewport config for whileInView reveals. */
export const viewportOnce = { once: true, amount: 0.2 } as const;

/** Subtle Apple-like hover scale for cards (non-bouncy). */
export const hoverScale: Transition = { duration: 0.3, ease: easeOut };

/** Spring used by the sliding active-tab pill (layoutId), ~0.35s settle. */
export const tabSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
};

/* ---- Cascading "stack" signature ------------------------------------- */

/** Home project list: children fan in from the top, one after another. */
export const stackContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/**
 * Home block "unfold / drop-down": each block drops in from slightly above,
 * unfolding from its top edge (scaleY). Pair with `transformOrigin: 'top'` on
 * the element so the unfold hinges at the top.
 */
export const stackItem: Variants = {
  hidden: { opacity: 0, y: -24, scaleY: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { type: 'spring', stiffness: 130, damping: 20 },
  },
};

/** Smaller cascade for shelf cards + tab-bar pills (same signature, tighter). */
export const stackContainerTight: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export const stackItemTight: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 140, damping: 18 },
  },
};

/** Tab panel swap (AnimatePresence) — fade + slight slide. */
export const tabPanel: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: easeOut } },
};

/**
 * Wheel-picker focus scaling (desktop only, driven by an rAF/scroll loop in
 * ProjectList). Tweak the feel here in one place.
 */
export const FOCUS = {
  minScale: 0.96,
  minOpacity: 0.75,
  hoverScale: 1.01,
  /** px past which an item reaches minScale/minOpacity (half viewport-ish). */
  falloff: 520,
} as const;
