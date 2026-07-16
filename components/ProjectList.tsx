'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { projects, type Project } from '@/lib/content';
import { ProjectBlock } from '@/components/ProjectBlock';
import { reveal, viewportOnce } from '@/lib/motion';

/** Sticky top offset (below the floating navbar) + per-card lip. */
const STICK_TOP = 96;
const LIP = 16;

/**
 * Home project list as a scroll-driven CARD STACK: each block is sticky at the
 * top; as the next block scrolls up it covers the previous one (leaving a small
 * lip), and the covered card scales down / dims — all tied to scroll position
 * (reverses on scroll up). Desktop only for the scale/dim; mobile keeps the
 * sticky stacking without transforms; reduced-motion renders a normal list.
 */
export function ProjectList() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const sticky = !reduce;
  const transforms = !reduce && !mobile;

  return (
    <div ref={containerRef}>
      {projects.map((project, i) => (
        <StackedCard
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          progress={scrollYProgress}
          sticky={sticky}
          transforms={transforms}
        />
      ))}
    </div>
  );
}

function StackedCard({
  project,
  index,
  total,
  progress,
  sticky,
  transforms,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  sticky: boolean;
  transforms: boolean;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Covered during this card's scroll window; the last card never recedes (push
  // its range out of [0,1] so it stays at full scale). Depth reads purely via a
  // gentle scale-down (0.97) + the incoming card's top shadow/border — no dim.
  const r0 = isLast ? 2 : index / total;
  const r1 = isLast ? 3 : (index + 1) / total;
  const scale = useTransform(progress, [r0, r1], [1, 0.97]);
  const y = useTransform(progress, [r0, r1], [0, -22]);

  return (
    <div
      style={sticky ? { position: 'sticky', top: STICK_TOP + index * LIP } : undefined}
      className={sticky ? undefined : 'mb-6'}
    >
      <motion.div
        style={transforms ? { scale, y } : undefined}
        className="relative origin-top"
      >
        {isFirst ? (
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <ProjectBlock project={project} num={index + 1} />
          </motion.div>
        ) : (
          <ProjectBlock project={project} num={index + 1} />
        )}
      </motion.div>
    </div>
  );
}
