import Image from 'next/image';
import { t, type Lang, type GalleryItem } from '@/lib/content';

/**
 * Two-column gallery grid. A gallery entry with a truthy third value spans the
 * full width. Images are uniform 16:9, so aspect-video + object-cover shows the
 * whole frame without cropping. Captions are localized via `lang`.
 */
export function Gallery({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-[18px] max-[820px]:grid-cols-1">
      {items.map(([src, captionField, full], i) => {
        const caption = t(captionField, lang);
        return (
          <figure key={i} className={full ? 'col-span-full' : undefined}>
            <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-line">
              <Image
                src={src}
                alt={caption}
                fill
                sizes={full ? '100vw' : '(max-width: 820px) 100vw, 50vw'}
                className="object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
            <figcaption className="mt-2 text-center text-[0.8rem] text-muted">
              {caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
