'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { t, type Lang, type GalleryItem } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/** Modal image: blurred while loading, sharpens once the browser paints it. */
function ModalImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`max-h-[85vh] max-w-[90vw] object-contain transition-[filter,opacity] duration-500 ${
        loaded ? 'opacity-100 blur-0' : 'opacity-60 blur-lg'
      }`}
    />
  );
}

/**
 * Dedicated masonry photo grid for the standalone "Gallery" tab (CSS
 * multi-column, not the bento preview grid used elsewhere) — click an image
 * to open it full-size in a lightbox matching FreeChannelImageCarousel's:
 * centered card modal, soft backdrop, prev/next arrows, Escape/backdrop-click
 * to close, scroll-lock while open. Rendered through a portal into
 * `document.body` — this tab's section uses `whileInView` (a `filter`
 * transition even at rest), which would otherwise create a new containing
 * block and trap the modal's `position: fixed` inside the section's box
 * instead of the viewport (the exact bug this replaces). Renders a soft
 * placeholder instead of an empty grid when `items` is empty.
 */
export function MasonryGallery({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (openIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null);
      else if (e.key === 'ArrowRight') setOpenIdx((i) => (i === null ? i : Math.min(i + 1, items.length - 1)));
      else if (e.key === 'ArrowLeft') setOpenIdx((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [openIdx, items.length]);

  if (items.length === 0) {
    return (
      <div className="liquid-glass flex min-h-[160px] items-center justify-center rounded-[28px] p-8 text-center text-base text-muted">
        {lang === 'vi' ? 'Ảnh sẽ được cập nhật sớm.' : 'Images coming soon.'}
      </div>
    );
  }

  const open = openIdx !== null ? items[openIdx] : undefined;

  const modal = (
    <AnimatePresence>
      {open && openIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpenIdx(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
        >
          <motion.div
            layoutId={`mg-img-${openIdx}`}
            transition={tabSpring}
            onClick={(e) => e.stopPropagation()}
            className="liquid-glass overflow-hidden rounded-[24px] p-2"
          >
            <ModalImage src={open[0]} alt={open[1] ? t(open[1], lang) : ''} />
          </motion.div>

          {openIdx > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx - 1);
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white outline-none backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden />
            </button>
          )}
          {openIdx < items.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIdx(openIdx + 1);
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white outline-none backdrop-blur-md transition-colors hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden />
            </button>
          )}

          <button
            type="button"
            onClick={() => setOpenIdx(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white outline-none backdrop-blur-md transition-colors hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map(([src, caption], i) => {
          const alt = caption ? t(caption, lang) : '';
          return (
            <motion.button
              key={i}
              type="button"
              layoutId={`mg-img-${i}`}
              onClick={() => setOpenIdx(i)}
              transition={tabSpring}
              aria-label={alt || 'Open image'}
              className="block w-full overflow-hidden rounded-[24px] border border-white/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="block w-full" />
            </motion.button>
          );
        })}
      </div>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
