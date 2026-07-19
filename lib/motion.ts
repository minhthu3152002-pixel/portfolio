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

/** Per-letter fade-in on the two hero headline lines: seconds between
 *  consecutive letters (~35ms). The bold line runs first, then the italic. */
export const HERO_LETTER_STAGGER = 0.035;
/** How long a single letter takes to fade from 0 → full opacity. */
export const HERO_LETTER_DURATION = 0.5;
/** Pause after one hero line finishes its per-letter fade before the next
 *  line (or the subtitle) begins. */
export const HERO_LINE_DELAY = 0.2;

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
 * CTA → reassurance → shelf).
 */
export const heroReveal: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: (i: number = 0) => ({
    ...REVEAL_SHOWN,
    transition: { ...REVEAL_T, delay: HERO_INITIAL_DELAY + i * HERO_STAGGER },
  }),
};

/**
 * Same blur-to-sharp reveal, but the delay is passed directly (in seconds) as
 * the `custom` value instead of being derived from an index. Lets the hero
 * chain the subtitle/CTA/shelf onto the exact moment the per-letter headline
 * finishes. */
export const heroFadeAt: Variants = {
  hidden: REVEAL_HIDDEN,
  visible: (delay: number = 0) => ({
    ...REVEAL_SHOWN,
    transition: { ...REVEAL_T, delay },
  }),
};

/**
 * One letter of a hero headline line: opacity-only fade (no transform) so the
 * split spans stay `inline` and the line can still wrap + `text-wrap: balance`.
 * Composed under a `staggerChildren` container (see heroLine). */
export const heroLetter: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: HERO_LETTER_DURATION, ease: easeOut },
  },
};

/**
 * Container for one hero headline line: staggers its letter children. `custom`
 * is the absolute delay (seconds) before this line's first letter fades in, so
 * the italic line can start exactly when the bold line finishes. */
export const heroLine: Variants = {
  hidden: {},
  visible: (delay: number = 0) => ({
    transition: { delayChildren: delay, staggerChildren: HERO_LETTER_STAGGER },
  }),
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
