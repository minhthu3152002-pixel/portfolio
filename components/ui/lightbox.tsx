'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, X } from 'lucide-react';

/**
 * Zoom trigger + full-size lightbox for an image whose inline thumbnail may
 * be cropped to fit a fixed-size cell. The trigger is invisible until the
 * parent (which must carry `className="group relative"`) is hovered; the
 * modal shows the original, uncropped image and closes on Escape or a click
 * outside the image.
 */
export function Lightbox({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Zoom image"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white opacity-0 outline-none backdrop-blur-md transition-opacity duration-200 hover:bg-black/65 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white/70 group-hover:opacity-100"
      >
        <Maximize2 size={14} strokeWidth={2} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              src={src}
              alt={alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
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
