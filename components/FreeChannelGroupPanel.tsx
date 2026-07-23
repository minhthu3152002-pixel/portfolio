'use client';

import { motion } from 'framer-motion';
import {
  t,
  type Group,
  type Lang,
  type TextBlock,
  type GalleryBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { DonutChart } from '@/components/ui/donut-chart';
import { Funnel } from '@/components/ui/funnel';
import { FreeChannelImageCarousel } from '@/components/ui/free-channel-image-carousel';
import { reveal, viewportOnce } from '@/lib/motion';

function TextContent({ block, lang }: { block: TextBlock; lang: Lang }) {
  return (
    <div>
      {block.title && (
        <h4 className="mb-3 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.title, lang)}
        </h4>
      )}
      {block.prose ? (
        <div className="space-y-3">
          {block.items.map((it, j) => (
            <p
              key={j}
              className="rich text-base leading-relaxed text-[#3a3a3c]"
              dangerouslySetInnerHTML={{ __html: t(it, lang) }}
            />
          ))}
        </div>
      ) : (
        <RichList items={block.items} lang={lang} />
      )}
    </div>
  );
}

/**
 * K-Tech College "Free channel" tab only: a 2-column group layout —
 * full-width heading, left column = every text/stats/chart/funnel block in
 * order, right column = that group's gallery images as a horizontal-scroll
 * carousel (uniform cropped cards, click-to-morph lightbox). Groups without
 * a gallery collapse to a single full-width text column. Kept entirely
 * separate from GroupPanel so no other tab or project is affected.
 */
export function FreeChannelGroupPanel({ group, lang }: { group: Group; lang: Lang }) {
  const galleryBlock = group.blocks.find((b): b is GalleryBlock => b.type === 'gallery');
  const hasGallery = !!galleryBlock && galleryBlock.items.length > 0;
  const contentBlocks = group.blocks.filter((b) => b.type !== 'gallery' && b.type !== 'tools');
  const groupId = typeof group.title === 'string' ? group.title : t(group.title, 'en') || 'group';

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      {group.title && (
        <h3 className="mb-8 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">
          {t(group.title, lang)}
        </h3>
      )}

      <div className={hasGallery ? 'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start' : ''}>
        <div className="space-y-8">
          {contentBlocks.map((b, i) => {
            if (b.type === 'text') return <TextContent key={i} block={b} lang={lang} />;
            if (b.type === 'stats') return <Stats key={i} items={b.items} lang={lang} />;
            if (b.type === 'chart') {
              return (
                <DonutChart key={i} data={b.data} title={b.title} subtitle={b.subtitle} note={b.note} lang={lang} />
              );
            }
            if (b.type === 'funnel') return <Funnel key={i} steps={b.steps} lang={lang} />;
            return null;
          })}
        </div>

        {hasGallery && (
          <div className="lg:pt-1">
            <FreeChannelImageCarousel items={galleryBlock.items} lang={lang} groupId={groupId} />
          </div>
        )}
      </div>
    </motion.section>
  );
}
