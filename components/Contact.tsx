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
  anchor: string; // absolute anchor position classes
  z: number;
  dur: number; // wander loop seconds
  kx: number[]; // x waypoint offsets (px)
  ky: number[]; // y waypoint offsets (px)
  kr: number[]; // rotate waypoints (deg)
};

/** Contact section: heading/intro on the left, four large pill "bubbles" on the
 *  right that slowly wander along their own randomized waypoint paths (they may
 *  overlap). Real links from content.json; hover/focus scales + pauses drift. */
export function Contact() {
  const { lang } = useLanguage();
  const c = content.contact;
  const reduce = useReducedMotion();
  const mobile = useIsMobile();

  const linkedin = c.socials[0]?.href ?? '#';
  const pills: Pill[] = [
    {
      label: { en: 'LinkedIn', vi: 'LinkedIn' },
      href: linkedin,
      external: linkedin.startsWith('http'),
      anchor: 'left-[6%] top-[5%]',
      z: 40,
      dur: 18,
      kx: [0, -70, 55, -40, 80],
      ky: [0, 65, -75, 50, -60],
      kr: [-5, 4, -7, 3, -6],
    },
    {
      label: { en: 'Resume', vi: 'CV' },
      href: '#',
      anchor: 'right-[6%] top-[22%]',
      z: 20,
      dur: 15,
      kx: [0, 80, -65, 50, -85],
      ky: [0, -70, 60, -85, 70],
      kr: [5, -6, 7, -4, 6],
    },
    {
      label: { en: 'Email', vi: 'Email' },
      sub: c.email,
      href: `mailto:${c.email}`,
      anchor: 'left-[16%] top-[48%]',
      z: 30,
      dur: 21,
      kx: [0, -60, 90, -75, 55],
      ky: [0, 75, -55, 65, -80],
      kr: [-4, 6, -5, 7, -3],
    },
    {
      label: { en: 'Phone', vi: 'Điện thoại' },
      sub: c.phone,
      href: `tel:${c.phone.replace(/\s+/g, '')}`,
      anchor: 'right-[8%] top-[66%]',
      z: 10,
      dur: 17,
      kx: [0, 70, -85, 60, -55],
      ky: [0, -65, 80, -60, 85],
      kr: [6, -4, 5, -7, 4],
    },
  ];

  return (
    <footer
      id="contact"
      className="scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#e9eefb] to-[#f5f5f7] px-6 py-24"
    >
      <div className="mx-auto grid max-w-wrap items-center gap-10 md:grid-cols-2">
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

        {/* right: wandering pill bubbles */}
        <div className="relative h-[380px] w-full overflow-hidden md:h-[480px]">
          {pills.map((p) => (
            <FloatingPill
              key={p.label.toString() + p.href}
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
  const amp = mobile ? 0.28 : 1; // mobile: ~±25px vs desktop ±60-90px

  const animate = reduce
    ? { x: 0, y: 0, rotate: 0, scale: 1 }
    : active
      ? { x: 0, y: 0, rotate: pill.kr[0], scale: 1.05 }
      : {
          x: pill.kx.map((v) => v * amp),
          y: pill.ky.map((v) => v * amp),
          rotate: pill.kr,
          scale: 1,
        };

  const transition = reduce
    ? { duration: 0 }
    : active
      ? { duration: 0.4, ease: 'easeOut' as const }
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
      initial={{ x: 0, y: 0, rotate: pill.kr[0], scale: 1 }}
      animate={animate}
      transition={transition}
      onHoverStart={() => setActive(true)}
      onHoverEnd={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      style={{ zIndex: pill.z, willChange: 'transform' }}
      className={`absolute ${pill.anchor} flex flex-col items-center justify-center rounded-full border border-white/70 bg-white/90 px-8 py-5 text-center shadow-[0_18px_44px_rgba(0,0,0,0.14)] backdrop-blur-sm outline-none ring-accent/50 focus-visible:ring-2`}
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
