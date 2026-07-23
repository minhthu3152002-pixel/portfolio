'use client';

import { motion } from 'framer-motion';
import { t, type Lang, type Stat } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/** Big stat numbers in "liquid glass" cards. Number color = project accent
 *  (--pc). Values are language-independent; labels localized. Hover gives a
 *  gentle spring lift (reuses tabSpring) — never an instant change. */
export function Stats({ items, lang }: { items: Stat[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:flex sm:flex-nowrap sm:gap-4">
      {items.map(([value, label], i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4 }}
          transition={tabSpring}
          className="liquid-glass min-w-0 rounded-[24px] p-6 sm:flex-1"
        >
          <b className="block text-[2rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-[var(--pc,theme(colors.accent))]">
            {value}
          </b>
          <small className="mt-2.5 block text-[0.95rem] leading-snug text-[#1d1d1f]/55">
            {t(label, lang)}
          </small>
        </motion.div>
      ))}
    </div>
  );
}
