'use client';

import { motion } from 'framer-motion';
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
import { reveal, viewportOnce } from '@/lib/motion';

/** A bullet like "<b>Title</b> rest of the sentence" -> item title/description.
 *  No <b> tag -> the whole line becomes the title, no description. */
function splitBold(html: string): { title: string; desc: string } {
  const m = html.match(/^<b>(.*?)<\/b>\s*(.*)$/s);
  if (m) return { title: m[1], desc: m[2].trim() };
  return { title: html, desc: '' };
}

/** "How it's built" / "Implementation" -> the left box; anything else
 *  (Solution / Feature / ...) -> the right box. */
function isImplementationTitle(block: TextBlock): boolean {
  const title = t(block.title, 'en').toLowerCase();
  return title.includes('built') || title.includes('implement') || title.includes('how it');
}

type VisualCell =
  | { kind: 'embed'; block: EmbedBlock }
  | { kind: 'compare'; block: CompareBlock }
  | { kind: 'image'; src: string; caption?: Localized; full?: boolean };

/** Bento span for a visual cell in the 3-col grid (1 col on mobile). Browser
 *  embeds always take the full row so any trailing gallery images (e.g. the
 *  Coffee Chat confirmation/reminder emails) land on their own row below it. */
function spanClass(cell: VisualCell): string {
  if (cell.kind === 'compare') return 'sm:col-span-3';
  if (cell.kind === 'embed') {
    return cell.block.frame === 'mobile' ? 'sm:col-span-1' : 'sm:col-span-3';
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
            className="rich text-sm leading-relaxed text-[#3a3a3c]"
            dangerouslySetInnerHTML={{ __html: t(it, lang) }}
          />
        ))}
      </div>
    );
  }
  return <RichList items={block.items} lang={lang} className="max-w-[640px]" />;
}

/** One "feature box": a single card holding the block's title + every bullet
 *  stacked vertically (bold lead-in + description), not one card per bullet. */
function FeatureBox({ block, lang }: { block: TextBlock; lang: Lang }) {
  return (
    <div className="liquid-glass rounded-[24px] p-6">
      {block.title && (
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.title, lang)}
        </h4>
      )}
      <div className="flex flex-col gap-4">
        {block.items.map((item, i) => {
          const { title, desc } = splitBold(t(item, lang));
          return (
            <div key={i}>
              <p
                className="text-base font-bold leading-snug text-text"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              {desc && (
                <p
                  className="mt-1.5 text-sm font-normal leading-relaxed text-muted"
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

/** Solution/Feature + Implementation render as exactly two side-by-side
 *  boxes (Implementation left, Solution right); a single extra text block
 *  renders as one full-width box; more than two falls back to a stack. */
function FeatureBoxes({ blocks, lang }: { blocks: TextBlock[]; lang: Lang }) {
  if (blocks.length === 0) return null;
  if (blocks.length === 2) {
    const left = blocks.find(isImplementationTitle) ?? blocks[1];
    const right = blocks.find((b) => b !== left) ?? blocks[0];
    return (
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FeatureBox block={left} lang={lang} />
        <FeatureBox block={right} lang={lang} />
      </div>
    );
  }
  return (
    <div className="mb-10 flex flex-col gap-4">
      {blocks.map((b, i) => (
        <FeatureBox key={i} block={b} lang={lang} />
      ))}
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

/**
 * One group of a project tab, in the bento showcase layout:
 *   HEADER  — group heading + intro text + tool chips
 *   GRID    — bento grid of every visual block (embed/gallery/compare), hidden if none
 *   FEATURES— remaining text blocks as two side-by-side boxes, stats as-is
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

  const remaining = blocks.filter(
    (b, i) => i !== introIdx && b.type !== 'tools' && b.type !== 'embed' && b.type !== 'gallery' && b.type !== 'compare',
  );
  const remainingTextBlocks = remaining.filter((b): b is TextBlock => b.type === 'text');
  const statsBlocks = remaining.filter((b) => b.type === 'stats');

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      {/* HEADER */}
      <div className="mb-8">
        {group.title && (
          <h3 className="mb-4 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">
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

      {/* PREVIEW GRID */}
      {visualCells.length > 0 && (
        <div className="mb-10 grid grid-cols-1 items-start gap-4 sm:mx-auto sm:max-w-[75%] sm:grid-cols-3">
          {visualCells.map((cell, i) => (
            <div key={i} className={spanClass(cell)}>
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
      {statsBlocks.map((b, i) =>
        b.type === 'stats' ? (
          <div key={`stats-${i}`} className="mb-10 last:mb-0">
            <Stats items={b.items} lang={lang} />
          </div>
        ) : null,
      )}
      <FeatureBoxes blocks={remainingTextBlocks} lang={lang} />
    </motion.section>
  );
}
