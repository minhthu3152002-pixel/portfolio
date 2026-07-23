'use client';

import { useEffect, useRef, useState } from 'react';
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
 * Horizontal-scroll image carousel for the K-Tech College Free tab's
 * right-hand column — uniform-cropped cards (object-cover, fixed aspect),
 * arrow buttons + native touch/trackpad scroll. Clicking a card "morphs" it
 * into a full-size modal via a shared `layoutId` (Aceternity Apple-Cards
 * style, reimplemented locally with framer-motion — not a copy of their
 * code). The modal is rendered through a portal into `document.body`: the
 * carousel lives inside a `whileInView` section whose `filter`/`transform`
 * would otherwise create a new containing block and trap the modal's
 * `position: fixed` inside that section's box instead of the viewport.
 * Modal supports prev/next arrows, Escape/backdrop-click to close, and
 * locks page scroll while open. `groupId` namespaces the layoutId so
 * multiple carousels can coexist on one tab without collisions.
 */
export function FreeChannelImageCarousel({
  items,
  lang,
  groupId,
}: {
  items: GalleryItem[];
  lang: Lang;
  groupId: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

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

  const scrollByCard = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 234, behavior: 'smooth' });
  };

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
            layoutId={`fc-img-${groupId}-${openIdx}`}
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
      <div className="relative">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-4 overflow-x-auto pb-1 [scroll-snap-type:x_mandatory]"
        >
          {items.map(([src, caption], i) => {
            const alt = caption ? t(caption, lang) : '';
            return (
              <motion.button
                key={i}
                type="button"
                layoutId={`fc-img-${groupId}-${i}`}
                onClick={() => setOpenIdx(i)}
                whileHover={{ y: -3 }}
                transition={tabSpring}
                aria-label={alt || 'Open image'}
                className="relative aspect-[3/4] w-[210px] shrink-0 overflow-hidden rounded-[22px] border border-white/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06)] [scroll-snap-align:start]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="h-full w-full object-cover" />
              </motion.button>
            );
          })}
        </div>

        {items.length > 2 && (
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition-colors hover:bg-black/[0.04]"
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition-colors hover:bg-black/[0.04]"
            >
              <ChevronRight size={18} strokeWidth={2} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
