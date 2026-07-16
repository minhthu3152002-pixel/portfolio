'use client';

import { MotionConfig } from 'framer-motion';

/**
 * Client boundary for Framer Motion.
 * `reducedMotion="user"` makes every motion component honor the visitor's
 * prefers-reduced-motion setting automatically.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
