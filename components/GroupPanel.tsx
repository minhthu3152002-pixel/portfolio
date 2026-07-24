'use client';

import { motion } from 'framer-motion';
import {
  t,
  type Block,
  type Group,
  type Lang,
  type Localized,
  type TextBlock,
  type ToolsBlock,
  type EmbedBlock,
  type CompareBlock,
  type StatsBlock,
  type GalleryBlock,
  type CardItem,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { ToolLogo } from '@/components/ui/tool-icon';
import { LivePreview } from '@/components/ui/live-preview';
import { CompareSlider } from '@/components/ui/compare-slider';
import { DonutChart } from '@/components/ui/donut-chart';
import { Funnel } from '@/components/ui/funnel';
import { MasonryGallery } from '@/components/ui/masonry-gallery';
import { MobileAppQrCode } from '@/components/ui/mobile-app-qr-code';
import { reveal, viewportOnce } from '@/lib/motion';

/** A bullet like "<b>Title</b> rest of the sentence" -> title/description.
 *  No <b> tag -> the whole line is plain description text, no bold title. */
function splitBold(html: string): { title: string; desc: string } {
  const m = html.match(/^<b>(.*?)<\/b>\s*(.*)$/s);
  if (m) return { title: m[1], desc: m[2].trim() };
  return { title: '', desc: html };
}

/** "How it's built" / "Implementation" -> the right box; anything else
 *  (Solution / Feature / ...) -> the left box. */
function isImplementationTitle(block: TextBlock): boolean {
  const title = t(block.title, 'en').toLowerCase();
  return title.includes('built') || title.includes('implement') || title.includes('how it');
}

type VisualCell =
  | { kind: 'embed'; block: EmbedBlock }
  | { kind: 'compare'; block: CompareBlock }
  | { kind: 'image'; src: string; caption?: Localized; full?: boolean };

/** Bento span for a visual cell in the 3-col grid (1 col on mobile). */
function spanClass(cell: VisualCell): string {
  if (cell.kind === 'compare') return 'sm:col-span-3';
  if (cell.kind === 'embed') {
    return cell.block.frame === 'mobile' ? 'sm:col-span-1' : 'sm:col-span-3';
  }
  return cell.full ? 'sm:col-span-3' : 'sm:col-span-1';
}

function IntroText({ block, lang, wide }: { block: TextBlock; lang: Lang; wide?: boolean }) {
  const widthClass = wide ? 'w-full' : 'max-w-[640px]';
  if (block.prose) {
    return (
      <div className={`${widthClass} space-y-3`}>
        {block.items.map((it, j) => (
          <p
            key={j}
            className="rich text-base leading-relaxed text-[#3a3a3c]"
            dangerouslySetInnerHTML={{ __html: t(it, lang) }}
          />
        ))}
      </div>
    );
  }
  return <RichList items={block.items} lang={lang} className={widthClass} />;
}

/** One "feature box": a single card holding the block's title + every bullet
 *  stacked vertically. A bullet's bold `<b>` lead-in (if any) renders as a
 *  bold sub-title; the rest is always plain, smaller description text.
 *  `flatText` drops the card chrome (bg/border/shadow/rounded/padding) for
 *  a plain-paragraph look — used project-wide for K-Tech College.
 *  `bulletItems` prefixes each non-prose item with a dot marker (matching
 *  RichList) — also K-Tech College only; skipped for `prose` blocks, which
 *  are flowing paragraphs rather than a bullet list. */
function FeatureBox({
  block,
  lang,
  flatText,
  bulletItems,
}: {
  block: TextBlock;
  lang: Lang;
  flatText?: boolean;
  bulletItems?: boolean;
}) {
  const showBox = block.boxed || !flatText;
  const showBullets = bulletItems && !block.prose;
  return (
    <div className={showBox ? 'liquid-glass rounded-[24px] p-6' : ''}>
      {block.title && (
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.title, lang)}
        </h4>
      )}
      <div className="flex flex-col gap-4">
        {block.items.map((item, i) => {
          const { title, desc } = splitBold(t(item, lang));
          return (
            <div key={i} className={showBullets ? 'relative pl-6' : ''}>
              {showBullets && (
                <span
                  aria-hidden
                  className="absolute left-0 top-[0.55em] h-[7px] w-[7px] rounded-full bg-[var(--pc,theme(colors.accent))]"
                />
              )}
              {title && (
                <p
                  className="text-[1.0625rem] font-bold leading-snug text-text"
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              )}
              {desc && (
                <p
                  className={`text-sm font-normal leading-relaxed text-muted ${title ? 'mt-1.5' : ''}`}
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

/** Consecutive text blocks pair up two-at-a-time into side-by-side box rows
 *  (Solution/Implementation-style pairs, but also e.g. a 2025-vs-2026 or
 *  Strategy-vs-Challenges pair) — keyword-matched left/right within a pair
 *  when one side clearly reads as "the built/implementation side", original
 *  order otherwise. An odd block left over renders as one full-width box. */
function FeatureBoxes({
  blocks,
  lang,
  flatText,
  bulletItems,
}: {
  blocks: TextBlock[];
  lang: Lang;
  flatText?: boolean;
  bulletItems?: boolean;
}) {
  if (blocks.length === 0) return null;
  const rows: TextBlock[][] = [];
  for (let i = 0; i < blocks.length; i += 2) {
    const a = blocks[i];
    const b = blocks[i + 1];
    if (!b) {
      rows.push([a]);
    } else if (isImplementationTitle(b) && !isImplementationTitle(a)) {
      rows.push([a, b]);
    } else if (isImplementationTitle(a) && !isImplementationTitle(b)) {
      rows.push([b, a]);
    } else {
      rows.push([a, b]);
    }
  }
  return (
    <>
      {rows.map((row, i) =>
        row.length === 2 ? (
          <div key={i} className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FeatureBox block={row[0]} lang={lang} flatText={flatText} bulletItems={bulletItems} />
            <FeatureBox block={row[1]} lang={lang} flatText={flatText} bulletItems={bulletItems} />
          </div>
        ) : (
          <div key={i} className="mb-10">
            <FeatureBox block={row[0]} lang={lang} flatText={flatText} bulletItems={bulletItems} />
          </div>
        ),
      )}
    </>
  );
}

function StatsSection({ block, lang }: { block: StatsBlock; lang: Lang }) {
  return (
    <div className="mb-10 last:mb-0">
      {block.title && (
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.title, lang)}
        </h4>
      )}
      <Stats items={block.items} lang={lang} />
    </div>
  );
}

/** A row of N short cards (e.g. platform blurbs) — always boxed, evenly
 *  split on desktop/tablet, stacked on mobile. */
function Cards({ items, lang }: { items: CardItem[]; lang: Lang }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 last:mb-0">
      {items.map((c, i) => (
        <div key={i} className="liquid-glass rounded-[24px] p-6">
          <h4 className="mb-2 text-[1.0625rem] font-bold tracking-[-0.01em] text-text">
            {t(c.title, lang)}
          </h4>
          <p className="text-sm leading-relaxed text-muted">{t(c.desc, lang)}</p>
        </div>
      ))}
    </div>
  );
}

/** Renders the "features" area — everything left after intro/tools/visual —
 *  in original content.json order. Consecutive text blocks buffer up and
 *  flush as paired FeatureBoxes rows; stats/chart/funnel render inline at
 *  their own position, each in its own full-width row. */
function renderFeatures(
  remaining: Block[],
  lang: Lang,
  flatText?: boolean,
  bulletItems?: boolean,
): React.ReactNode[] {
  const output: React.ReactNode[] = [];
  let textBuffer: TextBlock[] = [];
  const flushText = (key: string) => {
    if (textBuffer.length === 0) return;
    output.push(
      <FeatureBoxes key={key} blocks={textBuffer} lang={lang} flatText={flatText} bulletItems={bulletItems} />,
    );
    textBuffer = [];
  };

  remaining.forEach((b, i) => {
    if (b.type === 'text') {
      textBuffer.push(b);
      return;
    }
    flushText(`text-${i}`);
    if (b.type === 'stats') {
      output.push(<StatsSection key={i} block={b} lang={lang} />);
    } else if (b.type === 'chart') {
      output.push(
        <div key={i} className="mb-10 last:mb-0">
          <DonutChart data={b.data} title={b.title} subtitle={b.subtitle} note={b.note} lang={lang} />
        </div>,
      );
    } else if (b.type === 'funnel') {
      output.push(
        <div key={i} className="mb-10 last:mb-0">
          {b.title && (
            <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(b.title, lang)}</h4>
          )}
          <Funnel steps={b.steps} lang={lang} />
        </div>,
      );
    } else if (b.type === 'cards') {
      output.push(<Cards key={i} items={b.items} lang={lang} />);
    }
  });
  flushText('text-end');

  return output;
}

function EmbedCell({ block, lang }: { block: EmbedBlock; lang: Lang }) {
  return (
    <LivePreview
      url={block.url}
      frame={block.frame}
      embeddable={block.embeddable}
      poster={block.poster}
      aspect={block.aspect}
      title={block.title}
      note={block.note}
      caption={block.caption}
      lang={lang}
    />
  );
}

function CompareCell({ block, lang }: { block: CompareBlock; lang: Lang }) {
  return (
    <CompareSlider
      before={block.before}
      after={block.after}
      beforeLabel={block.beforeLabel}
      afterLabel={block.afterLabel}
      title={block.title}
      caption={block.caption}
      lang={lang}
    />
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
        <figcaption className="mt-2 text-[0.95rem] text-[#1d1d1f]/55">
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
export function GroupPanel({
  group,
  lang,
  spacious,
  masonry,
  flatText,
  wideIntro,
  bulletItems,
}: {
  group: Group;
  lang: Lang;
  /** Extra bottom margin — for groups that are distinct sub-projects sharing
   *  one tab (e.g. two case studies), not sequential steps of one story. */
  spacious?: boolean;
  /** Standalone photo-gallery tab: a CSS masonry grid + click-to-zoom
   *  lightbox instead of the bento preview grid used everywhere else. */
  masonry?: boolean;
  /** Drop the card chrome around text feature boxes for a plain-paragraph
   *  look (highlight-number stats keep their boxes regardless). */
  flatText?: boolean;
  /** Let the group's intro paragraph/list fill the full container width
   *  instead of the usual 640px reading-width cap. */
  wideIntro?: boolean;
  /** Prefix each non-prose feature-box item with a dot marker (RichList
   *  style). K-Tech College only. */
  bulletItems?: boolean;
}) {
  const blocks = group.blocks;

  const introIdx = blocks.findIndex((b) => b.type === 'text' && !(b as TextBlock).title);
  const intro = introIdx >= 0 ? (blocks[introIdx] as TextBlock) : undefined;
  const toolsBlock = blocks.find((b): b is ToolsBlock => b.type === 'tools');
  const galleryBlock = blocks.find((b): b is GalleryBlock => b.type === 'gallery');

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

  const soleCell = visualCells.length === 1 ? visualCells[0] : undefined;
  const soleIsMobile = soleCell?.kind === 'embed' && soleCell.block.frame === 'mobile';

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`${spacious ? 'mb-32' : 'mb-20'} last:mb-0`}
    >
      {/* HEADER */}
      <div className="mb-8">
        {group.title && (
          <h3 className="mb-4 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">
            {t(group.title, lang)}
          </h3>
        )}
        {intro && <IntroText block={intro} lang={lang} wide={wideIntro} />}
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
      {masonry ? (
        <div className="mb-10">
          <MasonryGallery items={galleryBlock?.items ?? []} lang={lang} />
        </div>
      ) : soleCell && soleCell.kind === 'embed' && soleCell.block.frame === 'mobile' && soleCell.block.qr ? (
        <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <div className="w-full max-w-[320px]">
            <EmbedCell block={soleCell.block} lang={lang} />
          </div>
          <MobileAppQrCode
            url={soleCell.block.qr.url}
            title={soleCell.block.qr.title}
            subtitle={soleCell.block.qr.subtitle}
            lang={lang}
          />
        </div>
      ) : soleCell ? (
        <div className="mb-10 flex justify-center">
          <div className={soleIsMobile ? 'w-full max-w-[320px]' : 'w-full'}>
            {soleCell.kind === 'embed' ? (
              <EmbedCell block={soleCell.block} lang={lang} />
            ) : soleCell.kind === 'compare' ? (
              <CompareCell block={soleCell.block} lang={lang} />
            ) : (
              <GalleryCell src={soleCell.src} caption={soleCell.caption} lang={lang} />
            )}
          </div>
        </div>
      ) : visualCells.length > 1 ? (
        <div className="mb-10 grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          {visualCells.map((cell, i) => (
            <div key={i} className={spanClass(cell)}>
              {cell.kind === 'embed' ? (
                <EmbedCell block={cell.block} lang={lang} />
              ) : cell.kind === 'compare' ? (
                <CompareCell block={cell.block} lang={lang} />
              ) : (
                <GalleryCell src={cell.src} caption={cell.caption} lang={lang} />
              )}
            </div>
          ))}
        </div>
      ) : null}

      {/* FEATURES */}
      {renderFeatures(remaining, lang, flatText, bulletItems)}
    </motion.section>
  );
}
