'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import {
  t,
  type Group,
  type Lang,
  type Localized,
  type TextBlock,
  type ToolsBlock,
  type EmbedBlock,
  type CompareBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { ToolLogo } from '@/components/ui/tool-icon';
import { LivePreview } from '@/components/ui/live-preview';
import { CompareSlider } from '@/components/ui/compare-slider';
import { reveal, viewportOnce, tabSpring } from '@/lib/motion';

const L = {
  viewLive: { en: 'View live', vi: 'Xem bản live' } as Localized,
};

/** A bullet like "<b>Title</b> rest of the sentence" -> card title/description.
 *  No <b> tag -> the whole line becomes the title, no description. */
function splitBold(html: string): { title: string; desc: string } {
  const m = html.match(/^<b>(.*?)<\/b>\s*(.*)$/s);
  if (m) return { title: m[1], desc: m[2].trim() };
  return { title: html, desc: '' };
}

type VisualCell =
  | { kind: 'embed'; block: EmbedBlock }
  | { kind: 'compare'; block: CompareBlock }
  | { kind: 'image'; src: string; caption?: Localized; full?: boolean };

/** Bento span for a visual cell in the 3-col grid (1 col on mobile). */
function spanClass(cell: VisualCell, sole: boolean): string {
  if (cell.kind === 'compare') return 'sm:col-span-3';
  if (cell.kind === 'embed') {
    if (cell.block.frame === 'mobile') return 'sm:col-span-1';
    return sole ? 'sm:col-span-3' : 'sm:col-span-2';
  }
  return cell.full ? 'sm:col-span-3' : 'sm:col-span-1';
}

function IntroText({ block, lang }: { block: TextBlock; lang: Lang }) {
  if (block.prose) {
    return (
      <div className="max-w-[640px] space-y-3">
        {block.items.map((it, j) => (
          <p
            key={j}
            className="rich text-[1rem] leading-[1.7] text-[#3a3a3c]"
            dangerouslySetInnerHTML={{ __html: t(it, lang) }}
          />
        ))}
      </div>
    );
  }
  return <RichList items={block.items} lang={lang} className="max-w-[640px]" />;
}

function FeatureCardGrid({ block, lang }: { block: TextBlock; lang: Lang }) {
  return (
    <div className="mb-10 last:mb-0">
      {block.title && (
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.title, lang)}
        </h4>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {block.items.map((item, i) => {
          const { title, desc } = splitBold(t(item, lang));
          return (
            <div key={i} className="liquid-glass rounded-[20px] p-4">
              <p
                className="text-[0.95rem] font-bold leading-snug text-text"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {desc && (
                <p
                  className="mt-1.5 text-[0.88rem] leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: desc }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GalleryCell({ src, caption, lang }: { src: string; caption?: Localized; lang: Lang }) {
  return (
    <figure>
      <div className="liquid-glass overflow-hidden rounded-[28px] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption ? t(caption, lang) : ''}
          className="block h-auto w-full rounded-[20px] object-contain"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-[0.85rem] text-[#1d1d1f]/55">
          {t(caption, lang)}
        </figcaption>
      )}
    </figure>
  );
}

function ViewLiveButton({ href, lang }: { href: string; lang: Lang }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={reduce ? undefined : { scale: 1.03 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={tabSpring}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-black/85 px-5 py-2.5 text-[0.85rem] font-semibold text-white outline-none backdrop-blur-xl transition-colors hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white/50"
    >
      {t(L.viewLive, lang)}
      <ArrowUpRight size={15} strokeWidth={2.25} aria-hidden />
    </motion.a>
  );
}

/**
 * One group of a project tab, in the bento showcase layout:
 *   HEADER  — group heading + intro text + tool chips (left), "View live" CTA (right)
 *   GRID    — bento grid of every visual block (embed/gallery/compare), hidden if none
 *   FEATURES— remaining text blocks as 2-col cards, stats as-is
 */
export function GroupPanel({ group, lang }: { group: Group; lang: Lang }) {
  const blocks = group.blocks;

  const introIdx = blocks.findIndex((b) => b.type === 'text' && !(b as TextBlock).title);
  const intro = introIdx >= 0 ? (blocks[introIdx] as TextBlock) : undefined;
  const toolsBlock = blocks.find((b): b is ToolsBlock => b.type === 'tools');

  const visualCells: VisualCell[] = [];
  for (const b of blocks) {
    if (b.type === 'embed') visualCells.push({ kind: 'embed', block: b });
    else if (b.type === 'compare') visualCells.push({ kind: 'compare', block: b });
    else if (b.type === 'gallery') {
      for (const [src, caption, full] of b.items) {
        visualCells.push({ kind: 'image', src, caption, full: !!full });
      }
    }
  }
  const sole = visualCells.length === 1;

  const remaining = blocks.filter(
    (b, i) => i !== introIdx && b.type !== 'tools' && b.type !== 'embed' && b.type !== 'gallery' && b.type !== 'compare',
  );

  const embedBlock = blocks.find((b): b is EmbedBlock => b.type === 'embed');
  const compareBlock = blocks.find((b): b is CompareBlock => b.type === 'compare');
  const liveUrl = embedBlock?.url ?? compareBlock?.liveUrl;

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {group.title && (
            <h3 className="mb-4 text-[1.4rem] font-bold leading-[1.2] tracking-[-0.02em]">
              {t(group.title, lang)}
            </h3>
          )}
          {intro && <IntroText block={intro} lang={lang} />}
          {toolsBlock && (
            <div className="mt-4 flex flex-wrap gap-2">
              {toolsBlock.items.map((tool) => {
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
          )}
        </div>
        {liveUrl && <ViewLiveButton href={liveUrl} lang={lang} />}
      </div>

      {/* PREVIEW GRID */}
      {visualCells.length > 0 && (
        <div className="mb-10 grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          {visualCells.map((cell, i) => (
            <div key={i} className={spanClass(cell, sole)}>
              {cell.kind === 'embed' ? (
                <LivePreview
                  url={cell.block.url}
                  frame={cell.block.frame}
                  embeddable={cell.block.embeddable}
                  poster={cell.block.poster}
                  aspect={cell.block.aspect}
                  title={cell.block.title}
                  note={cell.block.note}
                  caption={cell.block.caption}
                  lang={lang}
                />
              ) : cell.kind === 'compare' ? (
                <CompareSlider
                  before={cell.block.before}
                  after={cell.block.after}
                  beforeLabel={cell.block.beforeLabel}
                  afterLabel={cell.block.afterLabel}
                  title={cell.block.title}
                  caption={cell.block.caption}
                  lang={lang}
                />
              ) : (
                <GalleryCell src={cell.src} caption={cell.caption} lang={lang} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* FEATURES */}
      {remaining.map((b, i) => {
        if (b.type === 'stats') {
          return (
            <div key={i} className="mb-10 last:mb-0">
              <Stats items={b.items} lang={lang} />
            </div>
          );
        }
        if (b.type === 'text') {
          return <FeatureCardGrid key={i} block={b} lang={lang} />;
        }
        return null;
      })}
    </motion.section>
  );
}
