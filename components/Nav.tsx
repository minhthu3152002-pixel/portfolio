'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { content, projects, t, type Lang, type NavMenuItem } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';
import { heroNavIn, heroFade, heroStepDelay, HERO_NAV_STEP } from '@/lib/motion';
import {
  Menu,
  MenuItem,
  ProductItem,
  HoveredLink,
} from '@/components/ui/navbar-menu';

type LinkDef = { label: string; href: string; external?: boolean };

/**
 * Floating pill navbar (Apple "Dynamic Island" style): logo on the left, a
 * centered hover-menu (Projects / About / Contact — from content.nav), and the
 * EN|VI toggle on the right. Sticky above the hero glass shelf. On touch it
 * collapses to a hamburger that opens the same content as a glass sheet.
 */
export function Nav() {
  const { lang, setLang } = useLanguage();
  const reduce = useReducedMotion();
  // The navbar entrance only plays on the homepage first load (the Nav lives in
  // the root layout and persists across routes). Everywhere else it just renders.
  const isHome = usePathname() === '/';
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Entrance props: animate as the last step of the hero sequence on home;
  // render statically (no entrance) on every other page so it can't break.
  const navMotion = isHome
    ? {
        initial: 'hidden' as const,
        animate: 'visible' as const,
        variants: reduce ? heroFade : heroNavIn,
        custom: reduce ? undefined : { delay: heroStepDelay(HERO_NAV_STEP) },
      }
    : { initial: false as const };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc closes the mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const { logoText } = content.site;
  const dot = logoText.indexOf('.');
  const logoHead = dot === -1 ? logoText : logoText.slice(0, dot);
  const logoTail = dot === -1 ? '' : logoText.slice(dot);

  const navItems = content.nav.filter((n) => n.enabled !== false);

  // Dropdown data (all bilingual, all from content.json).
  const aboutLinks: LinkDef[] = [
    { label: lang === 'vi' ? 'Kinh nghiệm' : 'Experience', href: '/#about-experience' },
    { label: lang === 'vi' ? 'Học vấn' : 'Education', href: '/#about-education' },
    { label: lang === 'vi' ? 'Công cụ' : 'Tools', href: '/#about-tools' },
  ];
  const c = content.contact;
  const contactLinks: LinkDef[] = [
    { label: 'Email', href: `mailto:${c.email}` },
    {
      label: lang === 'vi' ? 'Điện thoại' : 'Phone',
      href: `tel:${c.phone.replace(/\s+/g, '')}`,
    },
    ...c.socials.map((s) => ({
      label: t(s.label, lang),
      href: s.href,
      external: s.href.startsWith('http'),
    })),
  ];

  const itemHref = (id: string) =>
    id === 'projects' ? '/#projects' : id === 'about' ? '/#about' : '/#contact';

  const renderDropdown = (id: string, close?: () => void) => {
    if (id === 'projects') {
      return (
        <div className="flex w-max min-w-[190px] flex-col gap-0.5">
          {projects.map((p) => {
            const first = p.tags[0];
            return (
              <ProductItem
                key={p.id}
                title={t(p.title, lang).split('—')[0].trim()}
                tag={t(first, lang)}
                href={`/project/${p.id}`}
                onNavigate={close}
              />
            );
          })}
        </div>
      );
    }
    const links = id === 'about' ? aboutLinks : id === 'contact' ? contactLinks : [];
    return (
      <div className="flex min-w-[180px] flex-col gap-1">
        {links.map((l) => (
          <HoveredLink key={l.href} href={l.href} external={l.external} onNavigate={close}>
            {l.label}
          </HoveredLink>
        ))}
      </div>
    );
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <motion.div {...navMotion} className="pointer-events-auto w-full max-w-[720px]">
      <nav
        className={`flex w-full items-center justify-between gap-3 rounded-[26px] border border-white/10 bg-black/85 text-white backdrop-blur-xl transition-all duration-300 ${
          scrolled ? 'px-4 py-1.5 shadow-lg' : 'px-5 py-2.5'
        }`}
      >
        <Link href="/" className="shrink-0 text-[1rem] font-extrabold tracking-tight">
          {logoHead}
          <span className="text-[#4f9dff]">{logoTail}</span>
        </Link>

        {/* centered hover menu (desktop) */}
        <div className="hidden flex-1 justify-center sm:flex">
          <Menu setActive={setActive}>
            {navItems.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                label={t(item.label, lang)}
                href={itemHref(item.id)}
                active={active}
                setActive={setActive}
              >
                {renderDropdown(item.id)}
              </MenuItem>
            ))}
          </Menu>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle lang={lang} setLang={setLang} />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-full outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 sm:hidden"
          >
            <Hamburger open={mobileOpen} />
          </button>
        </div>
      </nav>
      </motion.div>

      {/* mobile glass sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setMobileOpen(false)}
              className="pointer-events-auto fixed inset-0 z-40 cursor-default sm:hidden"
            />
            <MobileSheet
              items={navItems}
              lang={lang}
              renderDropdown={renderDropdown}
              onClose={() => setMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileSheet({
  items,
  lang,
  renderDropdown,
  onClose,
}: {
  items: NavMenuItem[];
  lang: Lang;
  renderDropdown: (id: string, close?: () => void) => React.ReactNode;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto absolute inset-x-3 top-[62px] z-50 mx-auto max-h-[70vh] max-w-[720px] overflow-y-auto rounded-[24px] border border-white/60 bg-white/70 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-[20px] sm:hidden"
    >
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className="border-b border-line/60 last:border-0">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[0.95rem] font-semibold text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {t(item.label, lang)}
              <Chevron open={open} />
            </button>
            {open && <div className="px-2 pb-3">{renderDropdown(item.id, onClose)}</div>}
          </div>
        );
      })}
    </motion.div>
  );
}

function LanguageToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full bg-white/10 p-0.5 text-[0.72rem] font-semibold"
    >
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2 py-1 uppercase outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${
            lang === l ? 'bg-white text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d={open ? 'M4 4l10 10' : 'M3 5h12'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d={open ? 'M14 4L4 14' : 'M3 9h12'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {!open && (
        <path d="M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={`text-[#6e6e73] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M3.5 5.5L7 9l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
