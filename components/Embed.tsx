'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { EmbedBlock } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/**
 * Live-site preview frame ("mobile" notch or "browser" chrome). Shows a
 * poster image if given, otherwise a lazy-loaded (viewport-triggered) iframe
 * as a live visual — either way the whole card is a link that opens the real
 * `url` in a new tab, so the iframe never needs to be interactive.
 */
export function Embed({ block }: { block: EmbedBlock }) {
  const { frame, url, poster } = block;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (poster || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [poster]);

  const screen = poster ? (
    <Image
      src={poster}
      alt=""
      fill
      sizes={frame === 'mobile' ? '320px' : '(max-width: 820px) 100vw, 640px'}
      className="object-cover"
    />
  ) : inView ? (
    <iframe
      src={url}
      title={url}
      loading="lazy"
      className="pointer-events-none h-full w-full"
    />
  ) : null;

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={reduce ? undefined : { scale: 1.025, y: -4 }}
      transition={tabSpring}
      className="group relative mx-auto block w-full rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_50px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_64px_rgba(0,0,0,0.18)]"
    >
      {/* soft accent glow ring, fades in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 ring-1 ring-[var(--pc,theme(colors.accent))]/40 transition-opacity duration-300 group-hover:opacity-100"
      />

      {frame === 'mobile' ? (
        <div className="mx-auto max-w-[300px]">
          <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[34px] border border-black/10 bg-black">
            <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[90px] -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-0">{screen}</div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white">
          <div className="flex items-center gap-1.5 border-b border-black/5 bg-black/[0.03] px-3.5 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 truncate rounded-full bg-black/5 px-3 py-1 text-[0.72rem] text-muted">
              {url.replace(/^https?:\/\//, '')}
            </span>
          </div>
          <div className="relative aspect-video w-full">{screen}</div>
        </div>
      )}
    </motion.a>
  );
}
