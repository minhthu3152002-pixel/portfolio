'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { content, t, type Lang, type Localized } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { PILL_SPEED_MIN, PILL_SPEED_MAX } from '@/lib/motion';

/** Site primary blue accent (tailwind `accent` = #0071e3) as translucent glass. */
const GLASS_BG = 'rgba(0,113,227,0.34)';
const GLASS_BORDER = 'rgba(0,113,227,0.42)';

type PillDef = {
  label: Localized;
  sub?: string;
  href: string;
  external?: boolean;
  z: number;
};

/** Per-pill physics state, mutated in place by the shared rAF loop (never via
 *  React state, so frames stay transform-only and cheap). Coordinates are the
 *  pill CENTER; the element is positioned at (0,0) and moved with `transform`. */
type PillMotion = {
  cx: number;
  cy: number;
  vx: number; // px/s
  vy: number; // px/s
  angle: number; // deg, drifts within ±4
  angVel: number; // deg/s
  w: number;
  h: number;
  paused: boolean;
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Contact section: heading/intro on the left; on the right a glass "play area"
 *  where big translucent bubbles drift DVD-style and bounce off the walls. */
export function Contact() {
  const { lang } = useLanguage();
  const c = content.contact;
  const reduce = useReducedMotion();

  const linkedin = c.socials[0]?.href ?? '#';
  const pills: PillDef[] = [
    {
      label: { en: 'LinkedIn', vi: 'LinkedIn' },
      href: linkedin,
      external: linkedin.startsWith('http'),
      z: 40,
    },
    { label: { en: 'Resume', vi: 'CV' }, href: '#', z: 20 },
    { label: { en: 'Email', vi: 'Email' }, sub: c.email, href: `mailto:${c.email}`, z: 30 },
    {
      label: { en: 'Phone', vi: 'Điện thoại' },
      sub: c.phone,
      href: `tel:${c.phone.replace(/\s+/g, '')}`,
      z: 10,
    },
  ];

  return (
    <footer
      id="contact"
      className="scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#e9eefb] to-[#f5f5f7] px-6 py-24"
    >
      <div className="mx-auto grid max-w-wrap items-center gap-10 md:grid-cols-2">
        {/* left: heading + intro */}
        <div>
          <h2 className="mb-4 text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.02em]">
            {t(c.heading, lang)}
          </h2>
          <p className="max-w-[440px] text-[1.05rem] leading-relaxed text-muted">
            {t(c.subtitle, lang)}
          </p>
          <p className="mt-8 text-[0.85rem] text-muted">{t(c.location, lang)}</p>
        </div>

        {/* right: bouncing glass bubbles */}
        <BouncePlayground pills={pills} lang={lang} reduce={!!reduce} />
      </div>

      <p className="mt-16 text-center text-[0.8rem] text-[#a1a1a6]">
        {t(c.copyright, lang)}
      </p>
    </footer>
  );
}

function BouncePlayground({
  pills,
  lang,
  reduce,
}: {
  pills: PillDef[];
  lang: Lang;
  reduce: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const motions = useRef<PillMotion[]>([]);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const applyTransform = (el: HTMLAnchorElement, s: PillMotion, scale: number) => {
      el.style.transform = `translate(${s.cx - s.w / 2}px, ${s.cy - s.h / 2}px) rotate(${s.angle}deg) scale(${scale})`;
    };

    // Rotation-aware half-extents of the axis-aligned bounding box, so a
    // rotated pill never clips past a wall.
    const halfExtents = (s: PillMotion) => {
      const r = Math.abs((s.angle * Math.PI) / 180);
      const cos = Math.abs(Math.cos(r));
      const sin = Math.abs(Math.sin(r));
      return {
        hw: (s.w / 2) * cos + (s.h / 2) * sin,
        hh: (s.w / 2) * sin + (s.h / 2) * cos,
      };
    };

    // Measure pills + seed non-overlapping starts, velocities and rotation.
    const init = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const speedScale = mobile ? 0.5 : 1;
      const states: PillMotion[] = [];
      pillRefs.current.forEach((el) => {
        if (!el) return;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        let cx = W / 2;
        let cy = H / 2;
        for (let tries = 0; tries < 300; tries++) {
          cx = rand(w / 2, Math.max(w / 2, W - w / 2));
          cy = rand(h / 2, Math.max(h / 2, H - h / 2));
          const clear = states.every(
            (o) => Math.hypot(o.cx - cx, o.cy - cy) > Math.max(o.w, w) * 0.72,
          );
          if (clear) break;
        }
        const speed = rand(PILL_SPEED_MIN, PILL_SPEED_MAX) * speedScale;
        const dir = rand(0, Math.PI * 2);
        states.push({
          cx,
          cy,
          vx: Math.cos(dir) * speed,
          vy: Math.sin(dir) * speed,
          angle: rand(-4, 4),
          angVel: (Math.random() < 0.5 ? -1 : 1) * rand(0.5, 1.3),
          w,
          h,
          paused: false,
        });
        el.style.opacity = '1';
      });
      motions.current = states;
      states.forEach((s, i) => {
        const el = pillRefs.current[i];
        if (el) applyTransform(el, s, 1);
      });
    };

    init();

    // Reduced motion: place them statically, no loop.
    if (reduce) return;

    let last = performance.now();
    let rafId: number | null = null;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const W = container.clientWidth;
      const H = container.clientHeight;
      const states = motions.current;
      for (let i = 0; i < states.length; i++) {
        const s = states[i];
        const el = pillRefs.current[i];
        if (!el) continue;
        if (s.paused) {
          applyTransform(el, s, 1.05);
          continue;
        }
        // slow rotation drift, reversing at ±4°
        s.angle += s.angVel * dt;
        if (s.angle > 4) {
          s.angle = 4;
          s.angVel = -s.angVel;
        } else if (s.angle < -4) {
          s.angle = -4;
          s.angVel = -s.angVel;
        }
        s.cx += s.vx * dt;
        s.cy += s.vy * dt;
        const { hw, hh } = halfExtents(s);
        if (s.cx < hw) {
          s.cx = hw;
          s.vx = Math.abs(s.vx);
        } else if (s.cx > W - hw) {
          s.cx = W - hw;
          s.vx = -Math.abs(s.vx);
        }
        if (s.cy < hh) {
          s.cy = hh;
          s.vy = Math.abs(s.vy);
        } else if (s.cy > H - hh) {
          s.cy = H - hh;
          s.vy = -Math.abs(s.vy);
        }
        applyTransform(el, s, 1);
      }
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (rafId == null) {
        last = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    // Keep centers inside the box when it resizes.
    const ro = new ResizeObserver(() => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      motions.current.forEach((s) => {
        const { hw, hh } = halfExtents(s);
        s.cx = Math.min(Math.max(s.cx, hw), Math.max(hw, W - hw));
        s.cy = Math.min(Math.max(s.cy, hh), Math.max(hh, H - hh));
      });
    });
    ro.observe(container);

    // Pause the whole loop while off-screen.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(container);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [reduce, mobile, lang]);

  const setPaused = (i: number, paused: boolean) => {
    const s = motions.current[i];
    if (s) s.paused = paused;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full overflow-hidden rounded-[28px] border border-white/40 md:h-[560px]"
    >
      {pills.map((p, i) => (
        <a
          key={t(p.label, lang) + p.href}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          href={p.href}
          target={p.external ? '_blank' : undefined}
          rel={p.external ? 'noopener noreferrer' : undefined}
          onPointerEnter={() => setPaused(i, true)}
          onPointerLeave={() => setPaused(i, false)}
          onFocus={() => setPaused(i, true)}
          onBlur={() => setPaused(i, false)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: p.z,
            opacity: 0,
            willChange: 'transform',
            backgroundColor: GLASS_BG,
            borderColor: GLASS_BORDER,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            transition: 'opacity 0.5s ease',
          }}
          className="flex flex-col items-center justify-center rounded-full border px-9 py-5 text-center text-white outline-none ring-white/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.28)] focus-visible:ring-2 md:px-12 md:py-7"
        >
          <span className="text-2xl font-extrabold uppercase tracking-tight md:text-3xl">
            {t(p.label, lang)}
          </span>
          {p.sub && (
            <span className="mt-1 text-[0.8rem] font-medium normal-case text-white/85 md:text-sm">
              {p.sub}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
