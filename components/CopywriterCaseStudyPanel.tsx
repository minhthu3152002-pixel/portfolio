'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  t,
  type Group,
  type Lang,
  type TextBlock,
  type FrameworkBlock,
  type SideImageBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { reveal, viewportOnce } from '@/lib/motion';

function FrameworkSection({ block, lang }: { block: FrameworkBlock; lang: Lang }) {
  return (
    <div className="flex flex-col gap-3">
      {block.items.map((step, i) => (
        <div key={i} className="liquid-glass rounded-[18px] p-4">
          <p className="mb-1 text-[0.85rem] font-bold text-[var(--pc,theme(colors.accent))]">
            {t(step.label, lang)}
          </p>
          <p className="text-sm leading-relaxed text-muted">{t(step.text, lang)}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Copywriter project case-study tabs (imoo, FROMCAUDAT): a fixed text/image
 * split — left column stacks the intro, a boxed "My Responsibilities" list
 * and a 3-step messaging framework; right column holds one side image,
 * vertically centered against the (usually taller) text column. Mobile
 * stacks text above image via normal source order (no reordering needed).
 * Bypasses the generic GroupPanel because that layout always stacks the
 * preview grid above the features, full width — it can't put an image
 * side-by-side with text.
 */
export function CopywriterCaseStudyPanel({ group, lang }: { group: Group; lang: Lang }) {
  const textBlocks = group.blocks.filter((b): b is TextBlock => b.type === 'text');
  const intro = textBlocks.find((b) => !b.title);
  const responsibilities = textBlocks.find((b) => !!b.title);
  const framework = group.blocks.find((b): b is FrameworkBlock => b.type === 'framework');
  const sideImage = group.blocks.find((b): b is SideImageBlock => b.type === 'sideImage');

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      {group.title && (
        <h3 className="mb-8 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">{t(group.title, lang)}</h3>
      )}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="flex flex-col gap-8">
          {intro && (
            <p
              className="rich text-base leading-relaxed text-[#3a3a3c]"
              dangerouslySetInnerHTML={{ __html: t(intro.items[0], lang) }}
            />
          )}
          {responsibilities && (
            <div className="liquid-glass rounded-[24px] p-6">
              {responsibilities.title && (
                <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
                  {t(responsibilities.title, lang)}
                </h4>
              )}
              <RichList items={responsibilities.items} lang={lang} />
            </div>
          )}
          {framework && <FrameworkSection block={framework} lang={lang} />}
        </div>

        {sideImage && (
          <div className="liquid-glass rounded-[28px] p-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
              <Image
                src={sideImage.src}
                alt={sideImage.alt ? t(sideImage.alt, lang) : ''}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
