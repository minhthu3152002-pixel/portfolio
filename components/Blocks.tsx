import { type Block, type Lang } from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { Gallery } from '@/components/Gallery';

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
          default:
            return null;
        }
      })}
    </>
  );
}
