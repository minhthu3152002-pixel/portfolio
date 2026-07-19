import type { Variants, Transition } from 'framer-motion';

/**
 * Centralized motion config — one place to tune the whole site's motion
 * signature. Framer honors prefers-reduced-motion via the <MotionConfig
 * reducedMotion="user"> provider (Providers.tsx), which neutralizes transforms.
 */

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ⬇️ chỉnh 2 số này để tăng/giảm tốc độ toàn bộ hiệu ứng xuất hiện.
//    (Adjust these two numbers to speed up / slow down every entrance reveal.)
/** Độ dài mỗi hiệu ứng xuất hiện, tính bằng giây. */
export const REVEAL_DURATION = 1.2;
/** Khoảng cách xuất hiện giữa các phần tử anh em, tính bằng giây. */
export const REVEAL_STAGGER = 0.15;

/** Tighter stagger for containers with MANY children (card rows, tab groups)
 *  so long lists still finish revealing promptly. */
export const REVEAL_STAGGER_TIGHT = 0.1;

/** Hero on-load sequence: line 1 → line 2 → subtitle → CTA. Slightly
 *  wider stagger, plus a small initial delay so the wallpaper paints first. */
export const HERO_STAGGER = 0.24;
export const HERO_INITIAL_DELAY = 0.15;

/**
 * Contact "glass bubble" drift speed range, in px/s. Each pill picks a random
 * speed in [MIN, MAX] (so they never sync); the shared rAF loop and wall
 * bounces are unchanged. Bump BOTH numbers by the same factor to make every
 * pill faster/slower in one place (mobile still runs at half speed;
 * prefers-reduced-motion stays fully static).
 */
export const PILL_SPEED_MIN = 18;
export const PILL_SPEED_MAX = 38;

/** How long each word in the About "flip words" line stays before flipping to
 *  the next, in milliseconds (~2.5s). Change this one number to speed up /
 *  slow down the whole flip loop. */
export const FLIP_WORD_INTERVAL = 1700;

/** Shared entrance: blur-to-sharp reveal + rise. */
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
const REVEAL_T: Transition = { duration: REVEAL_DURATION, ease: easeOut };

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
 * Same reveal but delayed by an initial beat + its `custom` index * HERO_STAGGER
 * — used on page load for the hero sequence (line 1 → line 2 → subtitle →
 * CTA → shelf).
 */
export const heroReveal: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: (i: number = 0) => ({
    ...REVEAL_SHOWN,
    transition: { ...REVEAL_T, delay: HERO_INITIAL_DELAY + i * HERO_STAGGER },
  }),
};

/* ── Homepage hero blur-to-sharp entrance ─────────────────────────────────────
 * Each element starts blurred + faded and resolves to sharp + full opacity,
 * sequenced one after another with a small overlap. Order:
 *   bold line → italic line → subtitle → CTA → navbar (last).
 * The three knobs below are the only numbers to tune. prefers-reduced-motion is
 * handled in the components (plain fade of everything together — see heroFade).
 */
/** Blur applied to the two headline lines at the start of their entrance (px). */
export const HERO_BLUR = 16;
/** Lighter blur for the subtitle (px). */
export const HERO_BLUR_SOFT = 8;
/** Duration of each hero element's entrance (seconds). */
export const HERO_ELEMENT_DURATION = 0.7;
/** Delay between the start of one hero element and the next — the overlap (seconds). */
export const HERO_STEP_DELAY = 0.25;

/** Absolute start delay for hero step `n` (0 = bold line). Shared by the Hero
 *  component and the Nav so the navbar can time itself as the last step. */
export const heroStepDelay = (step: number): number =>
  HERO_INITIAL_DELAY + step * HERO_STEP_DELAY;

/** Step index of the navbar in the hero sequence (it goes last). */
export const HERO_NAV_STEP = 4;

/** Whole-element blur-to-sharp entrance (NOT per-letter). custom: `{ delay, blur }`. */
export const heroBlurIn: Variants = {
  hidden: (c: { blur?: number } = {}) => ({
    opacity: 0,
    y: 8,
    filter: `blur(${c.blur ?? HERO_BLUR}px)`,
  }),
  visible: (c: { delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: HERO_ELEMENT_DURATION, ease: easeOut, delay: c.delay ?? 0 },
  }),
};

/** CTA entrance: fade + slight scale-in, no blur. custom: `{ delay }`. */
export const heroPopIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (c: { delay?: number } = {}) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: HERO_ELEMENT_DURATION, ease: easeOut, delay: c.delay ?? 0 },
  }),
};

/** Navbar entrance: fade + small slide-down from the top, no blur. custom: `{ delay }`. */
export const heroNavIn: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: (c: { delay?: number } = {}) => ({
    opacity: 1,
    y: 0,
    transition: { duration: HERO_ELEMENT_DURATION, ease: easeOut, delay: c.delay ?? 0 },
  }),
};

/** prefers-reduced-motion hero entrance: plain fade, no blur/movement, all at once. */
export const heroFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: easeOut } },
};

/** Aliases so existing consumers keep working with the new signature. */
export const fadeUp = reveal;
export const stackItem = reveal;
export const stackItemTight = reveal;

/** Stagger container so children reveal in sequence (default cadence). */
export const stackContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: REVEAL_STAGGER } },
};

/** Stagger container for MANY-child rows — capped, tighter cadence. */
export const stackContainerTight: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: REVEAL_STAGGER_TIGHT } },
};

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

/**
 * Tab panel swap (AnimatePresence). This is an INTERACTION, not an entrance
 * reveal, so it keeps a snappy ~0.45s in / quick blur out rather than the
 * slower REVEAL_DURATION — a 0.9s tab switch would feel laggy.
 */
export const tabPanel: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: { ...REVEAL_SHOWN, transition: { duration: 0.45, ease: easeOut } },
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
