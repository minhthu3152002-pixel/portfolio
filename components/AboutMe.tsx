'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { CometCard } from '@/components/ui/comet-card';
import { ToolLogo } from '@/components/ui/tool-icon';
import { FlipLine } from '@/components/ui/flip-line';
import { SectionHeadline } from '@/components/SectionHeadline';
import { reveal, stackContainer, viewportOnce } from '@/lib/motion';

/** Shared frosted-glass panel surface: visibly glassy, not flat white. */
const GLASS =
  'rounded-[24px] border border-white/70 bg-white/55 shadow-[0_12px_32px_rgba(0,0,0,0.06)] backdrop-blur-[20px]';

/**
 * "About me" — two columns balanced to roughly equal height:
 *   LEFT  = Comet-Card profile photo card (capped 4/5 aspect) + summary card
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
      <SectionHeadline heading={a.heading} />

      <motion.div
        variants={stackContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid items-stretch gap-8 md:grid-cols-[440px_1fr]"
      >
        {/* LEFT — profile card (capped height) + summary + flip line (bottom) */}
        <motion.div variants={reveal} className="flex flex-col gap-4">
          <CometCard className="w-full">
            <div className="relative aspect-[4/5] max-h-[560px] w-full overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.16)]">
              <Image
                src={a.avatar}
                alt={a.name}
                fill
                sizes="(max-width: 767px) 100vw, 380px"
                className="object-cover object-[center_-20px]"
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

          {/* flip line — bottom band of the left column, horizontally aligned to
              the summary card's content box and vertically centered against the
              Languages panel on the right. Size is locked to the longest variant. */}
          {a.flipLine?.enabled !== false && a.flipLine && (
            <FlipLine
              prefix={a.flipLine.prefix}
              words={a.flipLine.words}
              suffix={a.flipLine.suffix}
              className="mt-auto flex min-h-[104px] items-center px-5"
            />
          )}
        </motion.div>

        {/* RIGHT — stacked panels (nested stagger) */}
        <motion.div variants={stackContainer} className="flex flex-col gap-3">
          {/* Experience — the single DARK panel, with an Education sub-block */}
          <motion.div
            id="about-experience"
            variants={reveal}
            className="scroll-mt-24 rounded-[24px] border border-white/10 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.18)]"
            style={{ background: 'rgba(12,12,16,0.92)' }}
          >
            <PanelHeading title={lang === 'vi' ? 'Kinh nghiệm' : 'Experience'} tone="dark" />
            <ul className="flex flex-col gap-2.5">
              {a.experience.map((e, i) => (
                <TimelineRow
                  key={i}
                  title={t(e.title, lang)}
                  sub={e.org}
                  meta={t(e.period, lang)}
                />
              ))}
            </ul>

            {/* Education sub-block */}
            <div id="about-education" className="mt-4 scroll-mt-24 border-t border-white/10 pt-3">
              <h4 className="mb-2.5 text-[15px] font-bold tracking-[-0.02em] text-white/80">
                {lang === 'vi' ? 'Học vấn' : 'Education'}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {a.education.map((ed, i) => (
                  <TimelineRow
                    key={i}
                    title={ed.school}
                    sub={`${t(ed.degree, lang)}${ed.gpa ? ` · GPA ${ed.gpa}` : ''}`}
                    meta={ed.year}
                  />
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
          <Panel id="about-tools" title={lang === 'vi' ? 'Công cụ' : 'Tools'}>
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

          {/* Languages — two side-by-side columns */}
          <Panel title={lang === 'vi' ? 'Ngôn ngữ' : 'Languages'}>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3">
              {a.languages.map((l, i) => (
                <li key={i}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-[14px] font-semibold text-text">
                      {t(l.name, lang)}
                    </span>
                    <span className="shrink-0 text-[11px] text-muted">
                      {t(l.level, lang)}
                    </span>
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

/**
 * One timeline row: title (bold) + sub (secondary) stacked on the left, and a
 * right-aligned single-line meta (date / year) that never wraps.
 */
function TimelineRow({
  title,
  sub,
  meta,
}: {
  title: string;
  sub: string;
  meta: string;
}) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="min-w-0">
        <span className="block text-[15px] font-bold tracking-[-0.02em] text-white">
          {title}
        </span>
        <span className="block text-[13px] text-white/60">{sub}</span>
      </span>
      <span className="tnum shrink-0 whitespace-nowrap pt-0.5 text-right text-[12px] font-semibold text-accent">
        {meta}
      </span>
    </li>
  );
}

/**
 * Panel title in the hero-headline treatment: Inter extrabold, tight tracking,
 * sentence case (no micro-label uppercase, no accent dot). `tone` swaps color
 * for the dark panel.
 */
function PanelHeading({ title, tone = 'light' }: { title: string; tone?: 'light' | 'dark' }) {
  return (
    <h3
      className={`mb-3 text-[17px] font-extrabold tracking-[-0.02em] ${
        tone === 'dark' ? 'text-white' : 'text-text'
      }`}
    >
      {title}
    </h3>
  );
}

/** Frosted light-glass panel. */
function Panel({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.div id={id} variants={reveal} className={`${GLASS} scroll-mt-24 p-5`}>
      <PanelHeading title={title} />
      {children}
    </motion.div>
  );
}
