'use client';

import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/motion';

/**
 * Fade-up-on-scroll wrapper. Uses the shared `fadeUp` variant so the reveal
 * animation can be tuned from lib/motion.ts. Honors reduced-motion via the
 * MotionConfig provider in Providers.tsx.
 */
export function Reveal({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
}) {
  const Comp = as === 'section' ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {children}
    </Comp>
  );
}
