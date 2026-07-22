import { t, type Block, type Lang } from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { Gallery } from '@/components/Gallery';
import { ToolLogo } from '@/components/ui/tool-icon';
import { LivePreview } from '@/components/ui/live-preview';
import { CompareSlider } from '@/components/ui/compare-slider';

/** Render an ordered list of content blocks, localized:
 *  text (bullet list / prose, optional heading) · stats · gallery · tools
 *  (chip row) · embed (live preview) · compare (before/after slider). */
export function Blocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text': {
            // Legacy path (no heading, not prose) stays byte-identical.
            if (!block.title && !block.prose) {
              return (
                <RichList
                  key={i}
                  items={block.items}
                  lang={lang}
                  className="mb-4 last:mb-0"
                />
              );
            }
            return (
              <div key={i} className="mb-6 last:mb-0">
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
                        className="rich text-[1rem] leading-[1.7] text-[#3a3a3c]"
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
          case 'stats':
            return (
              <div key={i} className="mb-6 last:mb-0">
                <Stats items={block.items} lang={lang} />
              </div>
            );
          case 'gallery':
            return (
              <div key={i} className="mb-4 last:mb-0">
                <Gallery items={block.items} lang={lang} />
              </div>
            );
          case 'tools':
            return (
              <div key={i} className="mb-6 flex flex-wrap gap-2 last:mb-0">
                {block.items.map((tool) => {
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
            );
          case 'embed':
            return (
              <LivePreview
                key={i}
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
          case 'compare':
            return (
              <CompareSlider
                key={i}
                before={block.before}
                after={block.after}
                beforeLabel={block.beforeLabel}
                afterLabel={block.afterLabel}
                liveUrl={block.liveUrl}
                title={block.title}
                caption={block.caption}
                lang={lang}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
