import type { Variants, Transition } from 'framer-motion';

/**
 * Centralized motion config — one place to tune the whole site's motion
 * signature. Framer honors prefers-reduced-motion via the <MotionConfig
 * reducedMotion="user"> provider (Providers.tsx), which neutralizes transforms.
 */

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Shared entrance: fast blur-to-sharp reveal (Supaste feel). */
const REVEAL_HIDDEN = {
  opacity: 0,
  y: 22,
  scale: 0.99,
  filter: 'blur(10px)',
};
const REVEAL_SHOWN = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: 'blur(0px)',
};
const REVEAL_T: Transition = { duration: 0.5, ease: easeOut };

/**
 * Blur-to-sharp reveal item. Plain (no self delay) so it composes with a
 * `staggerChildren` container — used for sections, project blocks, shelf cards
 * and tab items.
 */
export const reveal: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: { ...REVEAL_SHOWN, transition: REVEAL_T },
};

/**
 * Same reveal but delayed by its `custom` index * 0.08s — used on page load for
 * the hero sequence (badge → line 1 → line 2 → subtitle → CTA → shelf).
 */
export const heroReveal: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: (i: number = 0) => ({
    ...REVEAL_SHOWN,
    transition: { ...REVEAL_T, delay: i * 0.08 },
  }),
};

/** Aliases so existing consumers keep working with the new signature. */
export const fadeUp = reveal;
export const stackItem = reveal;
export const stackItemTight = reveal;

/** Stagger container: children reveal 0.06s apart. */
export const stackContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
export const stackContainerTight = stackContainer;

/** Shared viewport config for whileInView reveals — fire once, slightly early. */
export const viewportOnce = { once: true, margin: '-60px' } as const;

/** Subtle Apple-like hover scale for cards (non-bouncy). */
export const hoverScale: Transition = { duration: 0.3, ease: easeOut };

/** Spring used by the sliding active-tab pill (layoutId), ~0.35s settle. */
export const tabSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
};

/** Tab panel swap (AnimatePresence) — blur-to-sharp in, quick blur out. */
export const tabPanel: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: { ...REVEAL_SHOWN, transition: REVEAL_T },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(6px)',
    transition: { duration: 0.25, ease: easeOut },
  },
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
