'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { GlassShelf } from '@/components/GlassShelf';
import { SplitText, splitTextEnd } from '@/components/ui/split-text';
import {
  heroFadeAt,
  HERO_INITIAL_DELAY,
  HERO_LINE_DELAY,
  HERO_STAGGER,
} from '@/lib/motion';

/**
 * Hero over a full-bleed wallpaper (desktop/mobile variants), with a two-line
 * headline (bold Inter + Playfair italic), CTA and reassurance row — then the
 * liquid-glass project shelf overlapping the hero's bottom edge.
 */
export function Hero() {
  const { lang } = useLanguage();
  const h = content.hero;

  // Sequence the two headline lines letter-by-letter, then chain the subtitle
  // → CTA → reassurance → shelf onto the exact moment the italic line finishes.
  const boldText = t(h.headline, lang);
  const italicText = t(h.headlineItalic, lang);
  const boldStart = HERO_INITIAL_DELAY;
  const italicStart = splitTextEnd(boldText, boldStart) + HERO_LINE_DELAY;
  const restStart = splitTextEnd(italicText, italicStart) + HERO_LINE_DELAY;

  return (
    <>
      <section className="relative overflow-hidden">
        {/* wallpaper */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-center md:block"
          />
          <Image
            src="/assets/hero-bg-mobile.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />
          {/* top gradient for navbar readability */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
          {/* bottom fade into the page */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#f5f5f7]" />
        </div>

        <div className="wrap relative flex flex-col items-center pb-[210px] pt-36 text-center text-white sm:pt-40">
          <h1 className="mb-6 max-w-[900px] text-balance text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] drop-shadow-sm">
            <SplitText
              text={boldText}
              delay={boldStart}
              className="block"
            />
            {/* Italic line: constrained max-width + balance so both EN and VI
                break into two roughly-equal lines above. */}
            <SplitText
              text={italicText}
              delay={italicStart}
              className="accent-italic mx-auto block max-w-[15em] text-balance tracking-[-0.01em]"
            />
          </h1>
          <motion.p
            variants={heroFadeAt}
            initial="hidden"
            animate="visible"
            custom={restStart}
            className="mb-8 max-w-[640px] text-[1.05rem] leading-relaxed text-white/85"
          >
            {t(h.subtitle, lang)}
          </motion.p>
          <motion.div
            variants={heroFadeAt}
            initial="hidden"
            animate="visible"
            custom={restStart + HERO_STAGGER}
          >
            <Link
              href={h.cta.href}
              className="inline-block rounded-2xl bg-black px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t(h.cta.label, lang)}
            </Link>
          </motion.div>
          <motion.p
            variants={heroFadeAt}
            initial="hidden"
            animate="visible"
            custom={restStart + 2 * HERO_STAGGER}
            className="mt-6 text-[0.82rem] text-white/70"
          >
            {t(h.reassurance, lang)}
          </motion.p>
        </div>
      </section>

      {/* Glass shelf overlapping the hero bottom */}
      <motion.div
        variants={heroFadeAt}
        initial="hidden"
        animate="visible"
        custom={restStart + 3 * HERO_STAGGER}
        className="wrap relative z-10 -mt-[170px] mb-4"
      >
        <GlassShelf />
      </motion.div>
    </>
  );
}
