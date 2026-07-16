'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/lib/content';
import { ProjectBlock } from '@/components/ProjectBlock';
import {
  stackContainer,
  stackItem,
  viewportOnce,
  FOCUS,
} from '@/lib/motion';

/**
 * Home project list. Two motion layers share one "unfolding" signature:
 *  1. ENTRANCE cascade — Framer staggerChildren springs each block in (once).
 *  2. FOCUS scaling — a single rAF loop (desktop only) eases each block toward
 *     scale/opacity based on distance from viewport center (wheel-picker feel);
 *     hovering a block makes it the focused one and eases siblings down.
 * Mobile (<768px) and prefers-reduced-motion skip the focus loop: static,
 * fully-visible blocks.
 */
export function ProjectList() {
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef<number | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    let raf = 0;
    const state = items.current.map(() => ({ s: 1, o: 1 }));

    const clear = () => {
      items.current.forEach((el) => {
        if (el) {
          el.style.transform = '';
          el.style.opacity = '';
        }
      });
    };

    const loop = () => {
      const mid = window.innerHeight / 2;
      items.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        const tt = Math.min(1, dist / FOCUS.falloff);
        let targetS = 1 - tt * (1 - FOCUS.minScale);
        let targetO = 1 - tt * (1 - FOCUS.minOpacity);
        if (hovered.current !== null) {
          if (hovered.current === i) {
            targetS = FOCUS.hoverScale;
            targetO = 1;
          } else {
            targetS = Math.min(targetS, 0.985);
            targetO = Math.min(targetO, 0.9);
          }
        }
        const st = state[i];
        st.s += (targetS - st.s) * 0.15;
        st.o += (targetO - st.o) * 0.15;
        el.style.transform = `scale(${st.s.toFixed(4)})`;
        el.style.opacity = st.o.toFixed(3);
      });
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (desktop.matches && !reduce.matches) {
        raf = requestAnimationFrame(loop);
      } else {
        clear();
      }
    };

    start();
    desktop.addEventListener('change', start);
    reduce.addEventListener('change', start);
    return () => {
      cancelAnimationFrame(raf);
      desktop.removeEventListener('change', start);
      reduce.removeEventListener('change', start);
    };
  }, []);

  return (
    <motion.div
      variants={stackContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex flex-col gap-6"
    >
      {projects.map((project, i) => (
        <motion.div
          key={project.id}
          variants={stackItem}
          style={{ transformOrigin: 'top' }}
        >
          <div
            ref={(el) => {
              items.current[i] = el;
            }}
            onMouseEnter={() => (hovered.current = i)}
            onMouseLeave={() => {
              if (hovered.current === i) hovered.current = null;
            }}
            style={{ willChange: 'transform, opacity' }}
          >
            <ProjectBlock project={project} num={i + 1} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
