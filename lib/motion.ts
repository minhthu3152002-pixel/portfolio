import type { Variants } from 'framer-motion';

/**
 * Centralized motion config.
 * Swap the values here to restyle every animation across the site at once.
 * Framer Motion automatically respects `prefers-reduced-motion` when variants
 * are wrapped with the <MotionConfig reducedMotion="user"> provider used in
 * app/layout — reduced-motion users get instant, non-animated transitions.
 */

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fade + rise used by sections revealing on scroll. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

/** Stagger container so children fade-up in sequence. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

/** Hover lift for cards / project blocks. */
export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: 0.3, ease: easeOut } },
};

/** Tilt-to-straighten for cover images inside a hovered card. */
export const coverTilt = {
  rest: { rotate: 2.5, scale: 1 },
  hover: { rotate: 0, scale: 1.02, transition: { duration: 0.4, ease: easeOut } },
};

/** Page transition applied to project routes. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: easeOut } },
};

/** Shared viewport config for whileInView reveals. */
export const viewportOnce = { once: true, amount: 0.12 } as const;
