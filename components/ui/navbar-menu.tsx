'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { tabSpring } from '@/lib/motion';

/**
 * Navbar hover-menu primitives — a light "Liquid Glass" adaptation of the
 * Aceternity UI "Navbar Menu" pattern. Top-level items reveal a frosted-glass
 * dropdown on hover; the panel morphs between items via a shared `layoutId`
 * using the site's `tabSpring`. Reduced-motion → fade only (no scale/spring).
 *
 * These are presentational primitives; Nav.tsx wires them to content.json.
 */

/** Menu row: clears the active item when the pointer leaves the whole bar. */
export function Menu({
  setActive,
  children,
}: {
  setActive: (id: string | null) => void;
  children: React.ReactNode;
}) {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="flex items-center gap-7"
    >
      {children}
    </nav>
  );
}

/**
 * One top-level item. The label is a real anchor (keyboard-usable, jumps to the
 * section); hovering/focusing reveals the dropdown `children`.
 */
export function MenuItem({
  id,
  label,
  href,
  active,
  setActive,
  children,
}: {
  id: string;
  label: string;
  href: string;
  active: string | null;
  setActive: (id: string | null) => void;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const open = active === id;

  return (
    <div
      onMouseEnter={() => setActive(id)}
      className="relative"
    >
      <Link
        href={href}
        onFocus={() => setActive(id)}
        aria-expanded={open}
        className={`rounded-full px-1 text-[0.85rem] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${
          open ? 'text-white' : 'text-white/75 hover:text-white'
        }`}
      >
        {label}
      </Link>

      {active !== null && open && children && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          transition={reduce ? { duration: 0.15 } : tabSpring}
          className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4"
        >
          <motion.div
            layoutId="nav-dropdown"
            transition={reduce ? { duration: 0.15 } : tabSpring}
            className="overflow-hidden rounded-[24px] border border-white/60 bg-white/70 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-[20px]"
          >
            <div className="w-max max-w-[92vw] p-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

/** Rich product row (thumbnail + title + description) for the Projects menu. */
export function ProductItem({
  title,
  description,
  href,
  src,
  onNavigate,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-2xl p-2 outline-none transition-colors hover:bg-black/[0.035] focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      <span className="relative h-[62px] w-[112px] shrink-0 overflow-hidden rounded-lg border border-line">
        <Image
          src={src}
          alt={title}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </span>
      <span className="max-w-[15rem]">
        <span className="block text-[0.9rem] font-semibold tracking-[-0.01em] text-[#1d1d1f] transition-colors group-hover:text-accent">
          {title}
        </span>
        <span className="mt-0.5 line-clamp-2 block text-[0.78rem] leading-snug text-[#6e6e73]">
          {description}
        </span>
      </span>
    </Link>
  );
}

/** Simple text link for the About / Contact menus. */
export function HoveredLink({
  children,
  href,
  external,
  onNavigate,
}: {
  children: React.ReactNode;
  href: string;
  external?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="block rounded-md px-1 py-1 text-[0.85rem] text-[#6e6e73] outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent/50"
    >
      {children}
    </Link>
  );
}
