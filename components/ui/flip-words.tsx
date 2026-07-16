'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FLIP_WORD_INTERVAL } from '@/lib/motion';

/**
 * Flip Words — a light adaptation of the Aceternity UI "Flip Words" pattern:
 * one word in a static sentence flips to the next on a loop. Not a typewriter,
 * not text-generate — the surrounding text never changes, only this word.
 *
 * - `words`: the rotating list (already resolved to the active language).
 * - Reserves a fixed line height; the word animates its width via layout so
 *   the following text never jumps.
 * - Pauses while off-screen (IntersectionObserver).
 * - prefers-reduced-motion: shows the first word statically, no flipping.
 */
export function FlipWords({
  words,
  interval = FLIP_WORD_INTERVAL,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Pause the loop when the line scrolls out of view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !visible || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [reduce, visible, words.length, interval]);

  // Keep the index valid if the word list shrinks (content edit).
  const safeIndex = index % Math.max(1, words.length);
  const word = words[safeIndex] ?? words[0] ?? '';

  if (reduce) {
    return <span className={className}>{words[0] ?? ''}</span>;
  }

  return (
    <span ref={ref} className="relative inline-flex items-baseline align-baseline">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={safeIndex}
          layout
          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className={`inline-block whitespace-nowrap ${className ?? ''}`}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
