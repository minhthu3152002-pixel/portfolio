'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { content, t, type Lang, type Localized } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/** True below 768px (client-only; false on server to avoid hydration drift). */
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

type Pill = {
  label: Localized;
  sub?: string;
  href: string;
  external?: boolean;
  rot: number;
  dx: number;
  dy: number;
  dur: number;
  pos: string; // desktop absolute position classes
};

/** Contact section: heading/intro on the left, four slow-floating pill bubbles
 *  on the right (real links from content.json). */
export function Contact() {
  const { lang } = useLanguage();
  const c = content.contact;
  const reduce = useReducedMotion();
  const mobile = useIsMobile();

  const pills: Pill[] = [
    {
      label: { en: 'LinkedIn', vi: 'LinkedIn' },
      href: c.socials[0]?.href ?? '#',
      external: (c.socials[0]?.href ?? '#').startsWith('http'),
      rot: -6, dx: 10, dy: -9, dur: 6,
      pos: 'md:absolute md:left-2 md:top-2',
    },
    {
      label: { en: 'Resume', vi: 'CV' },
      href: '#',
      rot: 5, dx: -8, dy: 10, dur: 7.5,
      pos: 'md:absolute md:right-4 md:top-16',
    },
    {
      label: { en: 'Email', vi: 'Email' },
      sub: c.email,
      href: `mailto:${c.email}`,
      rot: -4, dx: 9, dy: 8, dur: 5.5,
      pos: 'md:absolute md:left-10 md:top-40',
    },
    {
      label: { en: 'Phone', vi: 'Điện thoại' },
      sub: c.phone,
      href: `tel:${c.phone.replace(/\s+/g, '')}`,
      rot: 6, dx: -10, dy: -10, dur: 8,
      pos: 'md:absolute md:bottom-2 md:right-2',
    },
  ];

  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-gradient-to-b from-[#e9eefb] to-[#f5f5f7] px-6 py-24"
    >
      <div className="mx-auto grid max-w-wrap items-center gap-12 md:grid-cols-2">
        {/* left: heading + intro */}
        <div>
          <p className="eyebrow">{t(c.eyebrow, lang)}</p>
          <h2 className="mb-4 text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em]">
            {t(c.heading, lang)}
          </h2>
          <p className="max-w-[440px] text-[1.05rem] leading-relaxed text-muted">
            {t(c.subtitle, lang)}
          </p>
          <p className="mt-8 text-[0.85rem] text-muted">{t(c.location, lang)}</p>
        </div>

        {/* right: floating pill bubbles */}
        <div className="relative grid grid-cols-2 gap-3 md:block md:h-[360px]">
          {pills.map((p, i) => (
            <FloatingPill
              key={i}
              pill={p}
              lang={lang}
              reduce={!!reduce}
              mobile={mobile}
            />
          ))}
        </div>
      </div>

      <p className="mt-16 text-center text-[0.8rem] text-[#a1a1a6]">
        {t(c.copyright, lang)}
      </p>
    </footer>
  );
}

function FloatingPill({
  pill,
  lang,
  reduce,
  mobile,
}: {
  pill: Pill;
  lang: Lang;
  reduce: boolean;
  mobile: boolean;
}) {
  const [active, setActive] = useState(false);
  const amp = mobile ? 0.5 : 1;

  // Drift target (idle) vs paused/hover/reduced state.
  const animate =
    reduce
      ? { x: 0, y: 0, rotate: pill.rot, scale: 1 }
      : active
        ? { x: 0, y: 0, rotate: pill.rot, scale: 1.04 }
        : { x: pill.dx * amp, y: pill.dy * amp, rotate: pill.rot + 2, scale: 1 };

  const transition =
    reduce || active
      ? { duration: 0.3, ease: 'easeOut' as const }
      : {
          duration: pill.dur,
          repeat: Infinity,
          repeatType: 'mirror' as const,
          ease: 'easeInOut' as const,
        };

  return (
    <motion.a
      href={pill.href}
      target={pill.external ? '_blank' : undefined}
      rel={pill.external ? 'noopener noreferrer' : undefined}
      initial={{ x: 0, y: 0, rotate: pill.rot, scale: 1 }}
      animate={animate}
      transition={transition}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={{ willChange: 'transform' }}
      className={`flex flex-col items-center justify-center rounded-full border border-white/70 bg-white/90 px-7 py-5 text-center shadow-[0_16px_40px_rgba(0,0,0,0.10)] backdrop-blur-sm outline-none ring-accent/50 focus-visible:ring-2 ${pill.pos}`}
    >
      <span className="text-[1.15rem] font-extrabold uppercase tracking-tight text-text">
        {t(pill.label, lang)}
      </span>
      {pill.sub && (
        <span className="mt-0.5 text-[0.8rem] font-medium text-muted">
          {pill.sub}
        </span>
      )}
    </motion.a>
  );
}
