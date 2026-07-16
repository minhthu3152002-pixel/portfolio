'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { content, t, type Lang } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Floating pill-shaped dark navbar (Apple "Dynamic Island" style): fixed,
 * centered, shrinks slightly on scroll. Logo · links · EN|VI toggle · white
 * "Contact" CTA. All labels localized.
 */
export function Nav() {
  const { lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { logoText, nav } = content.site;
  const dot = logoText.indexOf('.');
  const logoHead = dot === -1 ? logoText : logoText.slice(0, dot);
  const logoTail = dot === -1 ? '' : logoText.slice(dot);

  const contactLink = nav.find((n) => n.href.includes('#contact'));
  const textLinks = nav.filter((n) => !n.href.includes('#contact'));

  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3">
      <nav
        className={`pointer-events-auto flex w-full max-w-[720px] items-center justify-between gap-3 rounded-full border border-white/10 bg-black/85 text-white backdrop-blur-xl transition-all duration-300 ${
          scrolled ? 'px-4 py-1.5 shadow-lg' : 'px-5 py-2.5'
        }`}
      >
        <Link
          href="/"
          className="shrink-0 text-[1rem] font-extrabold tracking-tight"
        >
          {logoHead}
          <span className="text-[#4f9dff]">{logoTail}</span>
        </Link>

        <div className="hidden items-center gap-5 text-[0.85rem] text-white/75 sm:flex">
          {textLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {t(link.label, lang)}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle lang={lang} setLang={setLang} />
          <Link
            href={contactLink?.href ?? '/#contact'}
            className="rounded-full bg-white px-3.5 py-1.5 text-[0.8rem] font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            {contactLink ? t(contactLink.label, lang) : 'Contact'}
          </Link>
        </div>
      </nav>
    </header>
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
          className={`rounded-full px-2 py-1 uppercase transition-colors ${
            lang === l ? 'bg-white text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
