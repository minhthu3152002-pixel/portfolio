'use client';

import Link from 'next/link';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * Sticky top navigation with a bilingual EN|VI toggle. Logo text splits at the
 * first "." so the suffix (e.g. ".mkt") renders in the accent color.
 */
export function Nav() {
  const { lang, setLang } = useLanguage();
  const { logoText, nav } = content.site;
  const dot = logoText.indexOf('.');
  const logoHead = dot === -1 ? logoText : logoText.slice(0, dot);
  const logoTail = dot === -1 ? '' : logoText.slice(dot);

  return (
    <nav className="sticky top-0 z-[60] border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-[1.05rem] font-extrabold tracking-[0.02em]"
        >
          {logoHead}
          <span className="text-accent">{logoTail}</span>
        </Link>
        <div className="flex items-center gap-[26px] text-[0.88rem] text-muted">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-text"
            >
              {t(link.label, lang)}
            </Link>
          ))}
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>
    </nav>
  );
}

function LanguageToggle({
  lang,
  setLang,
}: {
  lang: 'en' | 'vi';
  setLang: (l: 'en' | 'vi') => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-line p-0.5 text-[0.75rem] font-semibold"
    >
      {(['en', 'vi'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === l ? 'bg-accent text-[#1a0d05]' : 'text-muted hover:text-text'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
