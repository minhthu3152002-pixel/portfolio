'use client';

import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/** Contact footer — Apple pricing-card style. All values localized. */
export function Contact() {
  const { lang } = useLanguage();
  const c = content.contact;
  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-gradient-to-b from-[#e9eefb] to-[#f5f5f7] px-6 py-20"
    >
      <div className="mx-auto max-w-[880px] rounded-[32px] bg-white px-6 py-14 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:px-16">
        <p className="eyebrow">{t(c.eyebrow, lang)}</p>
        <h2 className="mb-4 text-[clamp(1.9rem,4.5vw,2.8rem)] font-extrabold tracking-[-0.02em]">
          {t(c.heading, lang)}
        </h2>
        <p className="mx-auto mb-8 max-w-[520px] text-[1.02rem] leading-relaxed text-muted">
          {t(c.subtitle, lang)}
        </p>
        <a
          className="inline-block rounded-full bg-black px-7 py-3.5 text-[0.95rem] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
          href={`mailto:${c.email}`}
        >
          {c.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.9rem] text-muted">
          <a className="hover:text-text" href={`tel:${c.phone.replace(/\s+/g, '')}`}>
            {c.phone}
          </a>
          <span className="text-line">·</span>
          <span>{t(c.location, lang)}</span>
          {c.socials.map((s) => (
            <span key={t(s.label, lang)} className="flex items-center gap-x-4">
              <span className="text-line">·</span>
              <a className="hover:text-text" href={s.href}>
                {t(s.label, lang)}
              </a>
            </span>
          ))}
        </div>
        <p className="mt-10 text-[0.8rem] text-[#a1a1a6]">{t(c.copyright, lang)}</p>
      </div>
    </footer>
  );
}
