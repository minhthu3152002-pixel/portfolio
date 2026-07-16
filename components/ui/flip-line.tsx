'use client';

import { useEffect, useRef, useState } from 'react';
import { t, type Lang, type Localized } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { FlipWords } from '@/components/ui/flip-words';

/** Font size (px) the hidden candidates are measured at before scaling. */
const BASE_PX = 40;
/** Readable floor; only dropped below to avoid overflow on very narrow phones. */
const MIN_PX = 14;
/** Upper sanity cap so a wide column can't blow the line up. */
const MAX_PX = 30;

const LANGS: Lang[] = ['en', 'vi'];

/**
 * The About "flip line": a static prefix + one flipping word, sized so the
 * LONGEST variant (longest word × longest language) exactly spans the box's
 * width, then LOCKED — every word and both languages render at that one size
 * (shorter words leave trailing space, nothing rescales while flipping or on
 * EN/VI switch). Matches the Languages-panel label typography (Inter semibold);
 * prefix in #1d1d1f, flipping word in the blue accent. One line, never wraps.
 */
export function FlipLine({
  prefix,
  words,
  suffix,
  className,
}: {
  prefix: Localized;
  words: Localized[];
  suffix: Localized;
  className?: string;
}) {
  const { lang } = useLanguage();
  const boxRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState<number | null>(null);

  // Every full-line candidate across BOTH languages, so the locked size fits the
  // widest possible line and never changes per word or per language.
  const candidates = LANGS.flatMap((l) =>
    words.map((w) => `${t(prefix, l)}${t(w, l)}${t(suffix, l)}`),
  );
  const key = candidates.join('|');

  useEffect(() => {
    const box = boxRef.current;
    const measure = measureRef.current;
    if (!box || !measure) return;

    const fit = () => {
      const avail = box.clientWidth;
      let maxW = 0;
      for (const child of Array.from(measure.children)) {
        maxW = Math.max(maxW, (child as HTMLElement).getBoundingClientRect().width);
      }
      if (!avail || !maxW) return;
      const raw = (avail / maxW) * BASE_PX;
      // Fit exactly; keep >= MIN when it fits, only dip under to avoid overflow.
      const next = Math.min(MAX_PX, raw >= MIN_PX ? Math.max(MIN_PX, raw) : raw);
      setFontPx(next);
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    // Re-measure once webfonts finish loading (Inter loads async).
    let cancelled = false;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(() => {
      if (!cancelled) fit();
    });
    return () => {
      ro.disconnect();
      cancelled = true;
    };
  }, [key]);

  const wordStrings = words.map((w) => t(w, lang));

  return (
    <div className={className}>
      <div ref={boxRef} className="relative w-full">
        {/* hidden measurer: every candidate at BASE_PX in the SAME typography as
            the visible line (panel-heading weight + tracking) so the locked size
            is measured accurately */}
        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none absolute left-[-9999px] top-0 font-extrabold"
          style={{ fontSize: BASE_PX, letterSpacing: '-0.02em', visibility: 'hidden' }}
        >
          {candidates.map((c, i) => (
            <div key={i} className="whitespace-nowrap">
              {c}
            </div>
          ))}
        </div>

        <p
          className="whitespace-nowrap font-extrabold leading-[1.3] tracking-[-0.02em] text-[#1d1d1f]"
          style={{
            fontSize: fontPx ?? BASE_PX,
            visibility: fontPx ? 'visible' : 'hidden',
          }}
        >
          {t(prefix, lang)}
          <FlipWords words={wordStrings} className="font-extrabold text-accent" />
          {t(suffix, lang)}
        </p>
      </div>
    </div>
  );
}
