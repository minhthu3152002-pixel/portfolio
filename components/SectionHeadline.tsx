'use client';

import { motion } from 'framer-motion';
import { t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { reveal, viewportOnce } from '@/lib/motion';

/** A section heading field: localizable text + an optional `enabled` flag. */
export type SectionHeading = { enabled?: boolean; en: string; vi?: string };

/**
 * Large left-aligned section headline in the hero's Playfair-italic treatment
 * (same font/style as the hero italic line) but dark (#1d1d1f) for the light
 * background. Hidden when `enabled` is false or the field is absent. The size
 * lives on the h2 so `.accent-italic`'s relative 1.05em scales up from it.
 */
export function SectionHeadline({ heading }: { heading?: SectionHeading }) {
  const { lang } = useLanguage();
  if (!heading || heading.enabled === false) return null;
  return (
    <motion.h2
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-8 text-[clamp(1.9rem,4.6vw,2.8rem)] leading-[1.15] text-[#1d1d1f]"
    >
      <span className="accent-italic">{t(heading, lang)}</span>
    </motion.h2>
  );
}
