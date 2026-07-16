import Image from 'next/image';
import { t, type Lang, type GalleryItem } from '@/lib/content';

/**
 * Gallery grid in device-frame style (rounded frame, thin border, soft shadow).
 * A gallery entry with a truthy third value spans the full width. Images are
 * uniform 16:9. Captions localized via `lang`.
 */
export function Gallery({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-5 max-[820px]:grid-cols-1">
      {items.map(([src, captionField, full], i) => {
        const caption = t(captionField, lang);
        return (
          <figure key={i} className={full ? 'col-span-full' : undefined}>
            <div className="rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.10)]">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={caption}
                  fill
                  sizes={full ? '100vw' : '(max-width: 820px) 100vw, 50vw'}
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-2.5 text-center text-[0.82rem] text-muted">
              {caption}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
