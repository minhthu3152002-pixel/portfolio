'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Project } from '@/lib/content';
import { pad2, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { fadeUp, hoverLift, coverTilt, viewportOnce } from '@/lib/motion';

/**
 * Full-width numbered project block on the home page: own color scheme,
 * tags, tilted cover image and a hover lift. Clicking routes to /project/[id].
 * `num` is the project's position among enabled projects.
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mx-3 my-[18px]"
    >
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={hoverLift}
        className="relative cursor-pointer overflow-hidden rounded-[36px] py-[88px] max-[820px]:py-[60px]"
        style={{ background: colors.bg, color: colors.fg }}
      >
        <Link
          href={`/project/${project.id}`}
          aria-label={title}
          className="block"
        >
          <div className="wrap grid grid-cols-[1.05fr_0.95fr] items-center gap-14 max-[820px]:grid-cols-1 max-[820px]:gap-[34px]">
            <div>
              <p className="mb-[26px] text-[0.78rem] font-medium tracking-[0.22em] opacity-85">
                {pad2(num)} / {lang === 'vi' ? 'DỰ ÁN' : 'PROJECT'}
              </p>
              <h2 className="mb-5 text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold uppercase tracking-[-0.01em]">
                {heading}
              </h2>
              <p className="mb-[30px] max-w-[520px] text-base opacity-90">
                {t(project.short, lang)}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {project.tags.map((tag) => (
                  <span key={t(tag, lang)} className="tag">
                    {t(tag, lang)}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div
                variants={coverTilt}
                className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              >
                <Image
                  src={project.cover}
                  alt={title}
                  fill
                  sizes="(max-width: 820px) 100vw, 45vw"
                  className="object-cover"
                />
              </motion.div>
              <div
                className="absolute bottom-3.5 right-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-black/55 text-[1.2rem]"
                style={{ color: colors.fg }}
              >
                ↗
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
