'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from 'react';
import { t, type Lang, type Localized } from '@/lib/content';

const L = {
  handleAria: { en: 'Drag to compare before and after', vi: 'Kéo để so sánh trước và sau' } as Localized,
  missing: { en: 'Image coming soon', vi: 'Ảnh sẽ cập nhật' } as Localized,
};

const DEFAULT_BEFORE = { en: 'Old', vi: 'Cũ' } as Localized;
const DEFAULT_AFTER = { en: 'New', vi: 'Mới' } as Localized;

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/[0.04] to-black/[0.1] text-[0.85rem] text-[#1d1d1f]/40">
      {label}
    </div>
  );
}

/**
 * Before/after compare slider (block type `compare`). A draggable divider
 * (pointer + keyboard) reveals the `after` image over `before`; the handle line
 * uses the project accent (--pc). Missing images fall back to a placeholder so
 * the build never breaks. The user always controls the divider, so
 * prefers-reduced-motion only means "no auto-run" — there is none here.
 */
export function CompareSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  caption,
  lang,
}: {
  before: string;
  after: string;
  beforeLabel?: Localized;
  afterLabel?: Localized;
  title?: Localized;
  caption?: Localized;
  lang: Lang;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const [beforeFailed, setBeforeFailed] = useState(false);
  const [afterFailed, setAfterFailed] = useState(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const endDrag = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPos((p) => Math.max(0, p - 4));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPos((p) => Math.min(100, p + 4));
    }
  };

  return (
    <figure>
      {caption && (
        <p className="mb-2 text-xs text-[#1d1d1f]/45">{t(caption, lang)}</p>
      )}
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="relative w-full touch-none select-none overflow-hidden rounded-[24px] border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)]"
      >
        {/* AFTER — base layer (shows through right of the handle), drives
            the height via its natural ratio */}
        {afterFailed ? (
          <div className="aspect-[16/10] w-full">
            <Placeholder label={t(L.missing, lang)} />
          </div>
        ) : (
          <img
            src={after}
            alt=""
            draggable={false}
            onError={() => setAfterFailed(true)}
            className="block h-auto w-full select-none object-cover object-top"
          />
        )}

        {/* BEFORE — overlay revealed left of the handle, clipped to `pos%` */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {beforeFailed ? (
            <Placeholder label={t(L.missing, lang)} />
          ) : (
            <img
              src={before}
              alt=""
              draggable={false}
              onError={() => setBeforeFailed(true)}
              className="absolute inset-0 h-full w-full select-none object-cover object-top"
            />
          )}
        </div>

        {/* corner labels */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/40 bg-black/45 px-3 py-1 text-[0.72rem] font-semibold text-white backdrop-blur-md">
          {t(beforeLabel ?? DEFAULT_BEFORE, lang)}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/40 bg-black/45 px-3 py-1 text-[0.72rem] font-semibold text-white backdrop-blur-md">
          {t(afterLabel ?? DEFAULT_AFTER, lang)}
        </span>

        {/* divider + handle (accent-colored), keyboard-operable slider */}
        <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[var(--pc,#06b6d4)]" style={{ left: `${pos}%` }}>
          <div
            role="slider"
            aria-label={t(L.handleAria, lang)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="pointer-events-auto absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-[var(--pc,#06b6d4)] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc,#06b6d4)]"
          >
            <span className="h-4 w-[3px] rounded-full bg-[var(--pc,#06b6d4)]" />
          </div>
        </div>
      </div>
    </figure>
  );
}
