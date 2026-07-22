'use client';

import Link from 'next/link';
import {
  Sparkles,
  GraduationCap,
  PenLine,
  MessageCircle,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react';
import type { Project } from '@/lib/content';
import { t } from '@/lib/content';
import { blockSurface } from '@/lib/colors';
import { useLanguage } from '@/components/LanguageProvider';

/** Maps a project's `icon` name (content.json) to its glyph. Unknown/missing
 *  names fall back to Sparkles rather than rendering nothing. */
const PROJECT_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  GraduationCap,
  PenLine,
  MessageCircle,
  FolderOpen,
};

/**
 * Home project block: a frosted-glass card (translucent white + backdrop blur)
 * with two soft accent glows in diagonally-opposite corners (top-left +
 * bottom-right), both contained inside the card so the center stays clean and
 * nothing bleeds past the rounded border. Text-only (title/short/tags) with a
 * small decorative icon badge in the bottom-right corner — no cover thumbnail.
 * Entrance unfold + focus scaling are applied by the parent (ProjectList).
 */
export function ProjectBlock({ project }: { project: Project }) {
  const { lang } = useLanguage();
  const { colors } = project;
  const title = t(project.title, lang);
  const heading = title.split('—')[0].trim();
  // Same-hue surfaces as the shelf card above, derived from the one accent.
  const surface = blockSurface(colors.accent);
  const Icon = (project.icon && PROJECT_ICONS[project.icon]) || Sparkles;

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

      <div className="relative max-w-[640px] pr-14 sm:pr-20">
        <h2
          className="mb-4 text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
          style={{ color: colors.fg }}
        >
          {heading}
        </h2>
        <p className="mb-7 text-[1.02rem] leading-relaxed text-[#4a4a4f]">
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

      {/* decorative icon badge, bottom-right corner */}
      <span
        aria-hidden
        className="absolute bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-md transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 sm:bottom-8 sm:right-8"
      >
        <Icon size={20} strokeWidth={1.75} style={{ color: colors.fg }} />
      </span>
    </Link>
  );
}
