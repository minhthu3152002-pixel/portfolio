'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { GlassShelf } from '@/components/GlassShelf';
import {
  heroReveal,
  heroBlurIn,
  heroPopIn,
  heroFade,
  heroStepDelay,
  HERO_BLUR,
  HERO_BLUR_SOFT,
} from '@/lib/motion';

/**
 * Hero over a full-bleed wallpaper (desktop/mobile variants), with a two-line
 * headline (bold Inter + Playfair italic) and CTA — then the
 * liquid-glass project shelf overlapping the hero's bottom edge.
 *
 * On-load entrance: each whole element (never per-letter) blurs from soft →
 * sharp in sequence — bold line → italic line → subtitle → CTA — with the
 * navbar settling in last (handled in Nav). prefers-reduced-motion collapses
 * this to a plain fade of everything together.
 */
export function Hero() {
  const { lang } = useLanguage();
  const h = content.hero;
  const reduce = useReducedMotion();

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

        <div className="wrap relative flex flex-col items-center pb-[230px] pt-36 text-center text-white sm:pb-[250px] sm:pt-40">
          <h1 className="mb-6 max-w-[900px] text-balance text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] drop-shadow-sm">
            <motion.span
              variants={reduce ? heroFade : heroBlurIn}
              initial="hidden"
              animate="visible"
              custom={reduce ? undefined : { delay: heroStepDelay(0), blur: HERO_BLUR }}
              className="block"
            >
              {t(h.headline, lang)}
            </motion.span>
            <motion.span
              variants={reduce ? heroFade : heroBlurIn}
              initial="hidden"
              animate="visible"
              custom={reduce ? undefined : { delay: heroStepDelay(1), blur: HERO_BLUR }}
              className="accent-italic block font-normal tracking-[-0.01em]"
            >
              {t(h.headlineItalic, lang)}
            </motion.span>
          </h1>
          <motion.p
            variants={reduce ? heroFade : heroBlurIn}
            initial="hidden"
            animate="visible"
            custom={reduce ? undefined : { delay: heroStepDelay(2), blur: HERO_BLUR_SOFT }}
            className="mb-8 max-w-[640px] text-[1.05rem] leading-relaxed text-white/85"
          >
            {t(h.subtitle, lang)}
          </motion.p>
          <motion.div
            variants={reduce ? heroFade : heroPopIn}
            initial="hidden"
            animate="visible"
            custom={reduce ? undefined : { delay: heroStepDelay(3) }}
          >
            <Link
              href={h.cta.href}
              className="inline-block rounded-2xl bg-black px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t(h.cta.label, lang)}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Glass shelf overlapping the hero bottom */}
      <motion.div
        variants={reduce ? heroFade : heroReveal}
        initial="hidden"
        animate="visible"
        custom={reduce ? undefined : 4}
        className="wrap relative z-10 -mt-[170px] mb-4"
      >
        <GlassShelf />
      </motion.div>
    </>
  );
}
