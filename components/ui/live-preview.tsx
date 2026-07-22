'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { t, type Lang, type Localized } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/** Bilingual microcopy (resolved through t()). */
const L = {
  openLive: { en: 'Open live preview in a new tab', vi: 'Mở bản xem trực tiếp ở tab mới' } as Localized,
  frameTitle: { en: 'Live preview', vi: 'Bản xem trực tiếp' } as Localized,
  loading: { en: 'Loading preview…', vi: 'Đang tải bản xem…' } as Localized,
  unavailable: { en: 'Preview unavailable', vi: 'Chưa có bản xem' } as Localized,
};

/** Logical width the phone iframe renders at, so the app picks its mobile
 *  layout; the screen is scaled down to fit the frame on any viewport. */
const PHONE_LOGICAL_W = 390;

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * Live preview embedded in a browser or phone frame (block type `embed`).
 * The iframe lazy-mounts via IntersectionObserver (only boots when scrolled
 * near the viewport); before that it shows the poster or a soft placeholder.
 * The zoom button opens the URL in a new tab (never a modal). Fully responsive;
 * hover uses the shared tabSpring and collapses under prefers-reduced-motion.
 */
export function LivePreview({
  url,
  frame = 'browser',
  embeddable = true,
  poster,
  aspect,
  title,
  note,
  caption,
  lang,
}: {
  url: string;
  frame?: 'browser' | 'mobile';
  embeddable?: boolean;
  poster?: string;
  aspect?: string;
  title?: Localized;
  note?: Localized;
  caption?: Localized;
  lang: Lang;
}) {
  const reduce = useReducedMotion();
  const isMobile = frame === 'mobile';
  const ratio = aspect ?? (isMobile ? '9/19.5' : '16/10');

  const nearRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // Lazy-mount the iframe only when the block scrolls near the viewport.
  useEffect(() => {
    if (!embeddable) return;
    const el = nearRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [embeddable]);

  // Phone: render the iframe at a fixed logical width and scale it to fit.
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!isMobile) return;
    const el = screenRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / PHONE_LOGICAL_W);
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  const showIframe = embeddable && near && !iframeFailed;
  const showPoster = !showIframe && !!poster && !posterFailed;

  const iframeEl = (
    <iframe
      src={url}
      title={t(title ?? L.frameTitle, lang)}
      loading="lazy"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      referrerPolicy="no-referrer"
      onError={() => setIframeFailed(true)}
      className="border-0 bg-white"
      style={
        isMobile
          ? {
              width: PHONE_LOGICAL_W,
              height: PHONE_LOGICAL_W * (19.5 / 9),
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }
          : { width: '100%', height: '100%' }
      }
    />
  );

  // The "screen": iframe → poster → soft placeholder, with the open button.
  const screen = (
    <div ref={nearRef} className="relative h-full w-full overflow-hidden bg-[#0e0e12]">
      {showIframe ? (
        isMobile ? (
          <div ref={screenRef} className="absolute inset-0 overflow-hidden">
            {iframeEl}
          </div>
        ) : (
          iframeEl
        )
      ) : showPoster ? (
        <img
          src={poster}
          alt=""
          onError={() => setPosterFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div
          ref={isMobile ? screenRef : undefined}
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/10 to-black/10 text-center text-[0.85rem] text-white/50"
        >
          {t(embeddable ? L.loading : L.unavailable, lang)}
        </div>
      )}

      {/* zoom / open-in-new-tab — never a modal */}
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t(L.openLive, lang)}
        whileHover={reduce ? undefined : { scale: 1.05 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        transition={tabSpring}
        className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white outline-none backdrop-blur-md transition-colors hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
      </motion.a>
    </div>
  );

  return (
    <figure className="mb-6 last:mb-0">
      {frame === 'mobile' ? (
        <div className="mx-auto w-full max-w-[300px]">
          {/* phone bezel */}
          <div className="rounded-[40px] border border-black/10 bg-[#0e0e12] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.04),0_18px_44px_rgba(0,0,0,0.16)]">
            <div className="relative w-full overflow-hidden rounded-[32px]" style={{ aspectRatio: ratio }}>
              {screen}
            </div>
          </div>
        </div>
      ) : (
        <div className="liquid-glass overflow-hidden rounded-[24px]">
          {/* browser chrome */}
          <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-2.5">
            <span className="flex shrink-0 gap-1.5" aria-hidden>
              <i className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <i className="h-2.5 w-2.5 rounded-full bg-black/15" />
              <i className="h-2.5 w-2.5 rounded-full bg-black/15" />
            </span>
            <span className="truncate text-[0.72rem] font-medium text-[#1d1d1f]/45">
              {hostOf(url)}
            </span>
          </div>
          <div className="relative w-full" style={{ aspectRatio: ratio }}>
            {screen}
          </div>
        </div>
      )}

      {note && (
        <p className="mt-2 text-center text-[0.78rem] text-[#1d1d1f]/45">{t(note, lang)}</p>
      )}
      {caption && (
        <figcaption className="mt-2 text-[0.85rem] text-[#1d1d1f]/55">{t(caption, lang)}</figcaption>
      )}
    </figure>
  );
}
