import type { Block } from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { Gallery } from '@/components/Gallery';

/** Render an ordered list of content blocks (text / stats / gallery). */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'text':
            return <RichList key={i} items={block.items} className="mb-4 last:mb-0" />;
          case 'stats':
            return (
              <div key={i} className="mb-6 last:mb-0">
                <Stats items={block.items} />
              </div>
            );
          case 'gallery':
            return (
              <div key={i} className="mb-4 last:mb-0">
                <Gallery items={block.items} />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
