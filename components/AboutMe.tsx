'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { CometCard } from '@/components/ui/comet-card';
import { ToolLogo } from '@/components/ui/tool-icon';
import { reveal, stackContainer, viewportOnce } from '@/lib/motion';

/** Shared frosted-glass panel surface: visibly glassy, not flat white. */
const GLASS =
  'rounded-[24px] border border-white/70 bg-white/55 shadow-[0_12px_32px_rgba(0,0,0,0.06)] backdrop-blur-[20px]';

/**
 * "About me" — two equal-height columns (items-stretch):
 *   LEFT  = Comet-Card profile photo card + summary card below
 *   RIGHT = stacked panels: Experience (the single DARK panel, with an
 *           Education sub-block) / Skills / Tools / Languages
 * On mobile it collapses to one column. All content is bilingual from
 * content.about. Entrance: blur-to-sharp — left card first, right panels
 * cascade.
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
          <CometCard className="flex-1">
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
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
                <p className="text-[1.15rem] font-bold leading-tight tracking-[-0.02em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">
                  {a.name}
                </p>
                <p className="mt-0.5 text-[0.85rem] font-medium text-white/80">
                  {t(a.role, lang)}
                </p>
              </div>
            </div>
          </CometCard>

          {/* summary card */}
          <div className={`${GLASS} p-5`}>
            <p className="text-[15px] leading-relaxed text-muted">
              {t(a.summary, lang)}
            </p>
          </div>
        </motion.div>

        {/* RIGHT — stacked panels (nested stagger) */}
        <motion.div variants={stackContainer} className="flex flex-col gap-4">
          {/* Experience — the single DARK panel, with an Education sub-block */}
          <motion.div
            variants={reveal}
            className="flex flex-1 flex-col rounded-[24px] border border-white/10 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] sm:p-6"
            style={{ background: 'rgba(12,12,16,0.92)' }}
          >
            <PanelHeading
              title={lang === 'vi' ? 'Kinh nghiệm' : 'Experience'}
              tone="dark"
            />
            <ul className="flex flex-col gap-4">
              {a.experience.map((e, i) => (
                <li key={i} className="grid grid-cols-[104px_1fr] gap-3">
                  <span className="tnum pt-0.5 text-xs font-semibold text-accent">
                    {t(e.period, lang)}
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold tracking-[-0.02em] text-white">
                      {t(e.title, lang)}
                    </span>
                    <span className="block text-[13px] text-white/60">{e.org}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/* Education sub-block */}
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
                {lang === 'vi' ? 'Học vấn' : 'Education'}
              </p>
              <ul className="flex flex-col gap-4">
                {a.education.map((ed, i) => (
                  <li key={i} className="grid grid-cols-[104px_1fr] gap-3">
                    <span className="tnum pt-0.5 text-xs font-semibold text-accent">
                      {ed.year}
                    </span>
                    <span>
                      <span className="block text-[15px] font-bold tracking-[-0.02em] text-white">
                        {ed.school}
                      </span>
                      <span className="block text-[13px] text-white/60">
                        {t(ed.degree, lang)}
                        {ed.gpa ? ` · GPA ${ed.gpa}` : ''}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

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

          {/* Tools — pills with a monochrome brand logo (when available) */}
          <Panel title={lang === 'vi' ? 'Công cụ' : 'Tools'}>
            <div className="flex flex-wrap gap-2">
              {a.tools.map((tool) => {
                const name = t(tool, lang);
                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-[5px] text-[0.75rem] font-medium text-text"
                  >
                    <ToolLogo name={name} className="shrink-0 text-muted" />
                    {name}
                  </span>
                );
              })}
            </div>
          </Panel>

          {/* Languages — name + subtle level bar */}
          <Panel title={lang === 'vi' ? 'Ngôn ngữ' : 'Languages'}>
            <ul className="flex flex-col gap-3">
              {a.languages.map((l, i) => (
                <li key={i}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-[15px] font-semibold text-text">
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

/** Small uppercase panel title with an accent dot. `tone` swaps text color for
 *  the dark panel. */
function PanelHeading({ title, tone = 'light' }: { title: string; tone?: 'light' | 'dark' }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <h3
        className={`text-xs font-semibold uppercase tracking-[0.12em] ${
          tone === 'dark' ? 'text-white/60' : 'text-muted'
        }`}
      >
        {title}
      </h3>
    </div>
  );
}

/** Frosted light-glass panel that grows evenly to match the left column. */
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={reveal} className={`${GLASS} flex flex-1 flex-col p-5 sm:p-6`}>
      <PanelHeading title={title} />
      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
