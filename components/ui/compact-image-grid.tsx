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
 * Compact creative-asset grid (not a full masonry showcase): small uniform
 * cropped thumbnails in a fixed grid, click opens a full-size lightbox.
 * Used inside the Meta Ads chip switcher panels, where galleries are a
 * secondary "proof" strip rather than the group's main visual. The modal
 * renders through a portal into document.body for the same reason as
 * FreeChannelImageCarousel: an ancestor `whileInView`/fade-transition
 * section's `filter`/`transform` would otherwise trap `position: fixed`
 * inside that section instead of the viewport. `gridId` namespaces the
 * lightbox so multiple grids can coexist without id collisions.
 */
export function CompactImageGrid({
  items,
  lang,
  gridId,
  layout = 'row',
}: {
  items: GalleryItem[];
  lang: Lang;
  gridId: string;
  /** 'row' (default): fit all items on one line, scrolling on mobile —
   *  used for the Meta Ads switcher's creative-proof strips. 'grid': a
   *  fixed wrapping grid (2 cols mobile/tablet, 4 desktop) — used for a
   *  standalone photo gallery like the Featured Case section. */
  layout?: 'row' | 'grid';
}) {
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

  if (items.length === 0) return null;

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
            layoutId={`cig-${gridId}-${openIdx}`}
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
      <div
        className={
          layout === 'grid'
            ? 'grid grid-cols-2 gap-3 lg:grid-cols-4'
            : 'grid grid-flow-col auto-cols-[minmax(120px,1fr)] gap-3 overflow-x-auto pb-1 sm:auto-cols-fr sm:overflow-visible'
        }
      >
        {items.map(([src, caption], i) => {
          const alt = caption ? t(caption, lang) : '';
          return (
            <motion.button
              key={i}
              type="button"
              layoutId={`cig-${gridId}-${i}`}
              onClick={() => setOpenIdx(i)}
              whileHover={{ y: -2 }}
              transition={tabSpring}
              aria-label={alt || 'Open image'}
              className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-white/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="h-full w-full object-cover" />
            </motion.button>
          );
        })}
      </div>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
