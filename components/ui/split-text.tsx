'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  heroLine,
  heroLetter,
  HERO_LETTER_STAGGER,
  HERO_LETTER_DURATION,
} from '@/lib/motion';

/**
 * Split a string into visual characters (grapheme clusters), NOT raw code
 * units — so Vietnamese combining diacritics (e.g. the parts of "ệ", "ấ") stay
 * attached to their base letter instead of animating as separate marks. Uses
 * Intl.Segmenter where available, falling back to code-point iteration.
 */
function splitGraphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter })
    .Segmenter;
  if (typeof Seg === 'function') {
    const seg = new Seg(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

/**
 * Renders `text` with a per-letter fade-in: each grapheme fades 0 → full
 * opacity in sequence (opacity only — no transform — so the line still wraps
 * naturally and `text-wrap: balance` keeps working). `delay` is the absolute
 * time (seconds) before the first letter starts, letting the caller chain one
 * line after another finishes.
 *
 * Under prefers-reduced-motion the whole string fades in at once (no per-letter
 * sequence). Letters are `aria-hidden`; the container carries an `aria-label`
 * so assistive tech reads the intact word.
 */
export function SplitText({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay }}
      >
        {text}
      </motion.span>
    );
  }

  const graphemes = splitGraphemes(text);

  return (
    <motion.span
      className={className}
      variants={heroLine}
      custom={delay}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {graphemes.map((g, i) => (
        <motion.span key={i} variants={heroLetter} aria-hidden>
          {g}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * When one SplitText line finishes so the next can begin: the absolute delay of
 * the line's start plus the time its last letter needs to fully fade in.
 */
export function splitTextEnd(text: string, startDelay: number): number {
  const count = splitGraphemes(text).length;
  const lastLetterStart =
    startDelay + Math.max(0, count - 1) * HERO_LETTER_STAGGER;
  return lastLetterStart + HERO_LETTER_DURATION;
}
