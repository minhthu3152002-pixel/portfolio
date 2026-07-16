'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { content, t, type AboutStat, type Lang } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { CometCard } from '@/components/ui/comet-card';
import { reveal, stackContainer, viewportOnce } from '@/lib/motion';

/**
 * About section as a BENTO DASHBOARD: one big rounded container (soft white →
 * light-accent wash) holding a header row (greeting + 3 count-up stats) and a
 * bento widget grid — profile photo, summary, skills/tools, a single dark
 * "experience" contrast panel, and a wide languages widget.
 *
 * Grid (lg, 4 cols × 2 rows, no holes):
 *   r1: PROFILE | SUMMARY   | SKILLS/TOOLS | DARK-EXPERIENCE
 *   r2: PROFILE | LANGUAGES(span 2)        | DARK-EXPERIENCE
 * Tablet (sm) → 2 cols; mobile → 1 col in order profile → summary → experience
 * → skills/tools → languages. Everything is bilingual from content.about.
 */
export function AboutMe() {
  const { lang } = useLanguage();
  const a = content.about;
  const shortName = a.name.split(' ').slice(-2).join(' ');

  return (
    <section id="about" className="wrap scroll-mt-24 py-12 sm:py-16">
      <motion.div
        variants={stackContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="rounded-[32px] border border-line/70 p-7 shadow-[0_30px_80px_-40px_rgba(0,60,150,0.28)] sm:p-9"
        style={{
          background:
            'linear-gradient(140deg, #ffffff 0%, #f4f8fe 45%, #e9f1fd 100%)',
        }}
      >
        {/* ROW 1 — greeting + big stat counters */}
        <motion.div
          variants={reveal}
          className="mb-6 flex flex-wrap items-start justify-between gap-6"
        >
          <div>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.5rem)] font-extrabold tracking-[-0.02em]">
              {lang === 'vi' ? 'Về tôi' : 'About me'}
              <span className="text-accent"> — {shortName}</span>
            </h2>
            <p className="mt-1 text-[0.98rem] font-medium text-muted">
              {t(a.role, lang)}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {a.stats.map((s, i) => (
              <StatCounter key={i} stat={s} lang={lang} />
            ))}
          </div>
        </motion.div>

        {/* ROW 2 — bento widget grid */}
        <motion.div
          variants={stackContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* PROFILE (tall) */}
          <motion.div
            variants={reveal}
            className="h-full sm:col-span-1 lg:col-start-1 lg:row-start-1 lg:row-span-2"
          >
            <CometCard className="h-full">
              <div className="relative h-full min-h-[340px] overflow-hidden rounded-[22px] border border-line shadow-[0_18px_44px_rgba(0,0,0,0.12)]">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
                {/* frosted trait chips along the top edge */}
                <div className="absolute inset-x-3 top-3 flex flex-wrap gap-1.5">
                  {a.traits.map((tr) => (
                    <span
                      key={t(tr, lang)}
                      className="rounded-full border border-white/40 bg-white/15 px-2.5 py-0.5 text-[0.68rem] font-medium text-white backdrop-blur-md"
                    >
                      {t(tr, lang)}
                    </span>
                  ))}
                </div>
                {/* name + role glass strip */}
                <div className="absolute inset-x-0 bottom-0 border-t border-white/25 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-[1.05rem] font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
                    {a.name}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] font-medium text-white/80">
                    {t(a.role, lang)}
                  </p>
                </div>
              </div>
            </CometCard>
          </motion.div>

          {/* SUMMARY */}
          <motion.div
            variants={reveal}
            className="lg:col-start-2 lg:row-start-1"
          >
            <Widget title={lang === 'vi' ? 'Giới thiệu' : 'Summary'}>
              <p className="text-sm leading-relaxed text-muted">
                {t(a.summary, lang)}
              </p>
            </Widget>
          </motion.div>

          {/* DARK EXPERIENCE (tall, the single contrast panel) — placed 3rd in
              DOM so mobile order is profile → summary → experience → skills. */}
          <motion.div
            variants={reveal}
            className="h-full lg:col-start-4 lg:row-start-1 lg:row-span-2"
          >
            <div className="flex h-full min-h-[200px] flex-col rounded-[22px] border border-[#23252b] bg-[#111318] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/60">
                  {lang === 'vi' ? 'Kinh nghiệm' : 'Experience'}
                </h3>
              </div>
              <ul className="flex flex-1 flex-col gap-5">
                {a.experience.map((e, i) => (
                  <li key={i} className="border-l border-white/15 pl-3.5">
                    <span className="tnum block text-xs font-semibold text-accent">
                      {t(e.period, lang)}
                    </span>
                    <span className="mt-0.5 block text-[0.98rem] font-bold text-white">
                      {t(e.title, lang)}
                    </span>
                    <span className="block text-[0.85rem] text-white/60">
                      {e.org}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* SKILLS + TOOLS */}
          <motion.div
            variants={reveal}
            className="lg:col-start-3 lg:row-start-1"
          >
            <Widget title={lang === 'vi' ? 'Kỹ năng & Công cụ' : 'Skills & Tools'}>
              <div className="space-y-3">
                <div>
                  <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted/80">
                    {lang === 'vi' ? 'Kỹ năng' : 'Skills'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.skills.map((s) => (
                      <span key={t(s, lang)} className="chip !py-[4px] !text-[0.72rem]">
                        {t(s, lang)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted/80">
                    {lang === 'vi' ? 'Công cụ' : 'Tools'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.tools.map((tool) => (
                      <span
                        key={t(tool, lang)}
                        className="rounded-full border border-line bg-white px-2.5 py-[3px] text-[0.68rem] font-medium text-text"
                      >
                        {t(tool, lang)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Widget>
          </motion.div>

          {/* LANGUAGES (wide) */}
          <motion.div
            variants={reveal}
            className="sm:col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-2"
          >
            <Widget title={lang === 'vi' ? 'Ngôn ngữ' : 'Languages'}>
              <ul className="grid gap-4 sm:grid-cols-2">
                {a.languages.map((l, i) => (
                  <li key={i}>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-[0.9rem] font-semibold text-text">
                        {t(l.name, lang)}
                      </span>
                      <span className="text-xs text-muted">{t(l.level, lang)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${Math.max(0, Math.min(100, l.value))}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Widget>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** Frosted white bento widget: small uppercase title + accent dot, then body.
 *  Fills its grid cell (h-full) so rows stay flush. */
function Widget({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-[22px] border border-line bg-white/70 p-5 shadow-[0_14px_36px_rgba(0,0,0,0.06)] backdrop-blur-[20px] sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/** A big count-up stat. Animates the leading number 0 → target on first view,
 *  keeping any suffix (M, K+, …). Static on reduced-motion. */
function StatCounter({ stat, lang }: { stat: AboutStat; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  const m = stat.value.match(/^([\d.]+)(.*)$/);
  const target = m ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : stat.value;
  const decimals = m && m[1].includes('.') ? m[1].split('.')[1].length : 0;

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce || !m) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, m]);

  return (
    <div ref={ref} className="min-w-[70px]">
      <div className="text-[clamp(1.7rem,3.2vw,2.4rem)] font-extrabold leading-none tracking-[-0.02em] text-text">
        {m ? display.toFixed(decimals) : ''}
        <span className="text-accent">{suffix}</span>
      </div>
      <div className="mt-1 text-[0.78rem] text-muted">{t(stat.label, lang)}</div>
    </div>
  );
}
