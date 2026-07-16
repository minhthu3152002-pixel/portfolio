'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/content';
import { pad2, t } from '@/lib/content';
import { blockSurface } from '@/lib/colors';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Home project block: a frosted-glass card (translucent white + backdrop blur)
 * with two soft accent glows in diagonally-opposite corners (top-left +
 * bottom-right), both contained inside the card so the center stays clean and
 * nothing bleeds past the rounded border. Cover sits in a device-like frame.
 * Entrance unfold + focus scaling are applied by the parent (ProjectList).
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
  // Same-hue surfaces as the shelf card above, derived from the one accent.
  const surface = blockSurface(colors.accent);

  return (
    <Link
      href={`/project/${project.id}`}
      aria-label={title}
      className="group relative block overflow-hidden rounded-[28px] border border-white/70 border-t-white/60 p-8 shadow-[0_-18px_40px_rgba(0,0,0,0.14),0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_-18px_40px_rgba(0,0,0,0.14),0_28px_64px_rgba(0,0,0,0.14)] sm:p-12"
      style={{ backgroundColor: surface.base }}
    >
      {/* uniform hue wash so the whole block reads clearly as its accent color,
          then two richer glows on opposite corners for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={surface.wash} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={surface.glowTL} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={surface.glowBR} />

      <div className="relative grid grid-cols-[1.05fr_0.95fr] items-center gap-12 max-[820px]:grid-cols-1 max-[820px]:gap-8">
          <div>
            <p
              className="mb-5 text-[0.78rem] font-bold tracking-[0.16em]"
              style={{ color: colors.accent }}
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

          {/* device-like frame; border subtly picks up the project accent */}
          <div
            className="relative rounded-xl border bg-white/50 p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
            style={{ borderColor: `${colors.accent}55` }}
          >
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
  );
}
