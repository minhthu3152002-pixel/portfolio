'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { CometCard } from '@/components/ui/comet-card';
import { reveal, stackContainer, viewportOnce } from '@/lib/motion';

/**
 * "About me" section between the hero shelf and the project blocks. Two equal-
 * height columns on desktop (items-stretch): LEFT = a photo profile card that
 * fills its height + a summary card below; RIGHT = stacked frosted panels
 * (experience / skills / tools / languages) that grow evenly to match the left.
 * On mobile it collapses to one column (photo -> summary -> panels).
 *
 * Entrance: shared blur-to-sharp reveal — the left card first, then the right
 * panels cascade (the grid staggers its two children; the right column is a
 * nested stagger container for its panels).
 */
export function AboutMe() {
  const { lang } = useLanguage();
  const a = content.about;

  return (
    <section id="about" className="wrap scroll-mt-24 py-12 sm:py-16">
      <p className="eyebrow">{lang === 'vi' ? 'Về tôi' : 'About me'}</p>

      <motion.div
        variants={stackContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid items-stretch gap-10 md:grid-cols-[380px_1fr]"
      >
        {/* LEFT — profile card (fills height) + summary card */}
        <motion.div variants={reveal} className="flex flex-col gap-5">
          {/* profile card wrapped in the Comet Card 3D tilt + glare (static on
              touch / reduced-motion). Inner card keeps its radius/shadow. */}
          <CometCard className="flex-1">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
              <Image
                src={a.avatar}
                alt={a.name}
                fill
                sizes="(max-width: 767px) 100vw, 380px"
                className="object-cover"
              />
              {/* frosted trait chips along the top edge */}
              <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
                {a.traits.map((tr) => (
                  <span
                    key={t(tr, lang)}
                    className="rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[0.72rem] font-medium text-white backdrop-blur-md"
                  >
                    {t(tr, lang)}
                  </span>
                ))}
              </div>
              {/* frosted glass strip at the bottom */}
              <div className="absolute inset-x-0 bottom-0 border-t border-white/25 bg-white/10 px-5 py-4 backdrop-blur-md">
                <p className="text-[1.15rem] font-bold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
                  {a.name}
                </p>
                <p className="mt-0.5 text-[0.85rem] font-medium text-white/80">
                  {t(a.role, lang)}
                </p>
              </div>
            </div>
          </CometCard>

          {/* summary card */}
          <div className="rounded-[20px] border border-white/70 bg-white/60 p-5 backdrop-blur-[20px]">
            <p className="text-sm leading-relaxed text-muted">{t(a.summary, lang)}</p>
          </div>
        </motion.div>

        {/* RIGHT — stacked frosted panels (nested stagger) */}
        <motion.div variants={stackContainer} className="flex flex-col gap-4">
          {/* Experience */}
          <Panel title={lang === 'vi' ? 'Kinh nghiệm' : 'Experience'}>
            <ul className="flex flex-col gap-4">
              {a.experience.map((e, i) => (
                <li key={i} className="grid grid-cols-[92px_1fr] gap-3">
                  <span className="tnum pt-0.5 text-xs font-medium text-accent">
                    {t(e.period, lang)}
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-bold text-text">
                      {t(e.title, lang)}
                    </span>
                    <span className="block text-[0.85rem] text-muted">{e.org}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Skills */}
          <Panel title={lang === 'vi' ? 'Kỹ năng' : 'Skills'}>
            <div className="flex flex-wrap gap-2">
              {a.skills.map((s) => (
                <span key={t(s, lang)} className="chip">
                  {t(s, lang)}
                </span>
              ))}
            </div>
          </Panel>

          {/* Tools — same pills, slightly smaller */}
          <Panel title={lang === 'vi' ? 'Công cụ' : 'Tools'}>
            <div className="flex flex-wrap gap-2">
              {a.tools.map((tool) => (
                <span
                  key={t(tool, lang)}
                  className="rounded-full border border-line bg-white px-3 py-[5px] text-[0.75rem] font-medium text-text"
                >
                  {t(tool, lang)}
                </span>
              ))}
            </div>
          </Panel>

          {/* Languages — name + subtle level bar */}
          <Panel title={lang === 'vi' ? 'Ngôn ngữ' : 'Languages'}>
            <ul className="flex flex-col gap-3">
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
          </Panel>
        </motion.div>
      </motion.div>
    </section>
  );
}

/** A frosted panel with a small uppercase title + accent dot. Grows evenly
 *  (flex-1) so the four panels together match the left column's height. */
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={reveal}
      className="flex flex-1 flex-col rounded-[20px] border border-white/70 bg-white/60 p-5 backdrop-blur-[20px] sm:p-6"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {title}
        </h3>
      </div>
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
