'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

/**
 * Comet Card — an interactive 3D tilt + moving glare, adapted from the
 * Aceternity UI "Comet Card" pattern for this project:
 *  - uses the already-installed `framer-motion` (not `motion/react`)
 *  - perspective / preserve-3d via inline style (Tailwind v3 has no
 *    `perspective-*` / `transform-3d` utilities)
 *  - a SUBTLE white glare only, to sit inside the light "Liquid Glass" theme
 *  - tilt capped at a small angle so overlaid text stays readable
 *  - fully static on touch devices and prefers-reduced-motion
 *
 * It wraps arbitrary children (e.g. the About profile card) and only supplies
 * the motion — the child keeps its own radius / shadow / overflow.
 */
export function CometCard({
  children,
  className,
  /** Max tilt in degrees on each axis. Kept small (~9°) for readability. */
  rotateDepth = 9,
  /** Max parallax translation in px. */
  translateDepth = 6,
  /** Corner radius (px) for the glare overlay — match the child card. */
  radius = 28,
}: {
  children: React.ReactNode;
  className?: string;
  rotateDepth?: number;
  translateDepth?: number;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Enable the tilt only on hover-capable, fine-pointer, non-reduced-motion
  // devices. Touch / mobile / reduced-motion render a plain static card.
  useEffect(() => {
    const interactive = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(interactive.matches && !reduce.matches);
    update();
    interactive.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      interactive.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  // Mouse position over the card, normalized to [-0.5, 0.5].
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 120, damping: 18, mass: 0.4 };
  const mx = useSpring(x, spring);
  const my = useSpring(y, spring);

  const rotateX = useTransform(my, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const translateX = useTransform(mx, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(my, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);

  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%)`;

  // Static fallback: no perspective, no handlers, no glare.
  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={className} style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full"
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay"
          style={{ background: glare, borderRadius: radius, opacity: 0.5 }}
        />
      </motion.div>
    </div>
  );
}
