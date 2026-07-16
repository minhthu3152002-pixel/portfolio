'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { GlassShelf } from '@/components/GlassShelf';
import { heroReveal } from '@/lib/motion';

/**
 * Hero over a full-bleed wallpaper (desktop/mobile variants), with a two-line
 * headline (bold Inter + Playfair italic), CTA and reassurance row — then the
 * liquid-glass project shelf overlapping the hero's bottom edge.
 */
export function Hero() {
  const { lang } = useLanguage();
  const h = content.hero;

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

        <div className="wrap relative pb-[210px] pt-36 text-white sm:pt-40">
          <motion.span
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-6 inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.78rem] font-medium backdrop-blur-md"
          >
            {t(h.badge, lang)}
          </motion.span>
          <h1 className="mb-6 max-w-[900px] text-[clamp(2.4rem,6vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] drop-shadow-sm">
            <motion.span
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              custom={1}
              className="block"
            >
              {t(h.headline, lang)}
            </motion.span>
            <motion.span
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              custom={2}
              className="accent-italic block font-normal tracking-[-0.01em]"
            >
              {t(h.headlineItalic, lang)}
            </motion.span>
          </h1>
          <motion.p
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mb-8 max-w-[560px] text-[1.05rem] leading-relaxed text-white/85"
          >
            {t(h.subtitle, lang)}
          </motion.p>
          <motion.div
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <Link
              href={h.cta.href}
              className="inline-block rounded-2xl bg-black px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
            >
              {t(h.cta.label, lang)}
            </Link>
          </motion.div>
          <motion.p
            variants={heroReveal}
            initial="hidden"
            animate="visible"
            custom={5}
            className="mt-6 text-[0.82rem] text-white/70"
          >
            {t(h.reassurance, lang)}
          </motion.p>
        </div>
      </section>

      {/* Glass shelf overlapping the hero bottom */}
      <motion.div
        variants={heroReveal}
        initial="hidden"
        animate="visible"
        custom={6}
        className="wrap relative z-10 -mt-[170px] mb-4"
      >
        <GlassShelf />
      </motion.div>
    </>
  );
}
