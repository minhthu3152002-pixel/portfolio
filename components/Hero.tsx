'use client';

import Link from 'next/link';
import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/** Home hero band. Text comes from content.hero, localized. */
export function Hero() {
  const { lang } = useLanguage();
  const h = content.hero;
  return (
    <header className="relative overflow-hidden pb-[90px] pt-[110px]">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-[220px] h-[600px] w-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,122,69,.13), transparent 65%)',
        }}
      />
      <div className="wrap relative">
        <p className="eyebrow">{t(h.badge, lang)}</p>
        <h1 className="mb-[22px] max-w-[880px] text-[clamp(2.5rem,6.4vw,4.4rem)] font-extrabold tracking-[-0.02em]">
          {t(h.headline, lang)}{' '}
          <em className="headline-gradient not-italic">
            {t(h.headlineItalic, lang)}
          </em>
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.02rem] text-muted">
          {t(h.subtitle, lang)}
        </p>
        <Link
          href={h.cta.href}
          className="inline-block rounded-full bg-accent px-[30px] py-3.5 text-[0.95rem] font-semibold text-[#1a0d05] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,122,69,0.35)]"
        >
          {t(h.cta.label, lang)}
        </Link>
      </div>
    </header>
  );
}
