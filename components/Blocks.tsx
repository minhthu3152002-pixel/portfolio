import { type Block, type Lang } from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { Gallery } from '@/components/Gallery';
import { Embed } from '@/components/Embed';
import { ToolLogo } from '@/components/ui/tool-icon';

/** Render an ordered list of content blocks (text / stats / gallery), localized. */
export function Blocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return (
              <RichList
                key={i}
                items={block.items}
                lang={lang}
                className="mb-4 last:mb-0"
              />
            );
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
          case 'embed':
            return (
              <div key={i} className="mb-6 last:mb-0">
                <Embed block={block} />
              </div>
            );
          case 'tools':
            return (
              <div key={i} className="mb-4 flex flex-wrap gap-2 last:mb-0">
                {block.items.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-[7px] text-[0.78rem] font-medium text-text shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                  >
                    <ToolLogo name={name} className="shrink-0 text-muted" />
                    {name}
                  </span>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
