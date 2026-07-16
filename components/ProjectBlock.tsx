'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/content';
import { pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Home project block: a frosted-glass card (translucent white + backdrop blur)
 * floating over a soft radial glow of the project's accent, so the color shows
 * THROUGH the frost. Cover sits in a device-like frame. Entrance unfold +
 * focus scaling are applied by the parent (ProjectList).
 */
export function ProjectBlock({
  project,
  num,
}: {
  project: Project;
  num: number;
}) {
  const { lang } = useLanguage();
  const { colors } = project;
  const title = t(project.title, lang);
  const heading = title.split('—')[0].trim();

  return (
    <div className="relative">
      {/* soft colored glow behind the frosted card */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[48px] opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 30% 30%, ${colors.accent}, transparent 70%)`,
        }}
      />

      <Link
        href={`/project/${project.id}`}
        aria-label={title}
        className="group block rounded-[28px] border border-white/70 bg-white/55 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(0,0,0,0.14)] sm:p-12"
      >
        <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-12 max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <div>
            <p
              className="mb-5 text-[0.78rem] font-semibold tracking-[0.16em] opacity-70"
              style={{ color: colors.fg }}
            >
              {pad2(num)} / {lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}
            </p>
            <h2
              className="mb-4 text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
              style={{ color: colors.fg }}
            >
              {heading}
            </h2>
            <p className="mb-7 max-w-[520px] text-[1.02rem] leading-relaxed text-[#4a4a4f]">
              {t(project.short, lang)}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={t(tag, lang)}
                  className="rounded-full border border-white/70 bg-white/70 px-[14px] py-[6px] text-[0.8rem] font-medium text-text backdrop-blur-sm"
                >
                  {t(tag, lang)}
                </span>
              ))}
            </div>
          </div>

          {/* device-like frame with faint white inner border */}
          <div className="relative rounded-xl border border-black/10 bg-white/50 p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/60">
              <Image
                src={project.cover}
                alt={title}
                fill
                sizes="(max-width: 820px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
