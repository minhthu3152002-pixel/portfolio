'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/content';
import { pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Home project block: a large card in the project's pastel tint with a huge
 * title, gray subtitle, white pill chips and the cover in a device-like frame.
 * Entrance cascade + focus scaling are applied by the parent (ProjectList).
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
    <Link
      href={`/project/${project.id}`}
      aria-label={title}
      className="group block rounded-[30px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.14)] sm:p-12"
      style={{ background: colors.bg, color: colors.fg }}
    >
      <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-12 max-[820px]:grid-cols-1 max-[820px]:gap-8">
        <div>
          <p className="mb-5 text-[0.78rem] font-semibold tracking-[0.16em] opacity-60">
            {pad2(num)} / {lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}
          </p>
          <h2 className="mb-4 text-[clamp(1.9rem,4.4vw,3.1rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
            {heading}
          </h2>
          <p className="mb-7 max-w-[520px] text-[1.02rem] leading-relaxed text-[#6e6e73]">
            {t(project.short, lang)}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {project.tags.map((tag) => (
              <span key={t(tag, lang)} className="chip">
                {t(tag, lang)}
              </span>
            ))}
          </div>
        </div>

        {/* device-like frame */}
        <div className="relative rounded-xl border border-black/10 bg-white/40 p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
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
