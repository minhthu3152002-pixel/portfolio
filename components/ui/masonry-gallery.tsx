'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { t, type Lang, type GalleryItem } from '@/lib/content';

/**
 * Dedicated masonry photo grid for the standalone "Gallery" tab (CSS
 * multi-column, not the bento preview grid used elsewhere) — click an image
 * to open it full-size in a lightbox, closes on Escape or backdrop click.
 * Renders a soft placeholder instead of an empty grid when `items` is empty
 * (e.g. no gallery-*.png assets uploaded yet).
 */
export function MasonryGallery({ items, lang }: { items: GalleryItem[]; lang: Lang }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIdx(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIdx]);

  if (items.length === 0) {
    return (
      <div className="liquid-glass flex min-h-[160px] items-center justify-center rounded-[28px] p-8 text-center text-sm text-muted">
        {lang === 'vi' ? 'Ảnh sẽ được cập nhật sớm.' : 'Images coming soon.'}
      </div>
    );
  }

  const open = openIdx !== null ? items[openIdx] : undefined;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {items.map(([src, caption], i) => {
          const alt = caption ? t(caption, lang) : '';
          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={alt || 'Open image'}
              className="block w-full overflow-hidden rounded-[24px] border border-white/50 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.06)] transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt} className="block w-full" />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenIdx(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              src={open[0]}
              alt={open[1] ? t(open[1], lang) : ''}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setOpenIdx(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white outline-none backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X size={20} strokeWidth={2} aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
