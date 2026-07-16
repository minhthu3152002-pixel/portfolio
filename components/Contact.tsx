'use client';

import { content, t } from '@/lib/content';
import { useLanguage } from '@/components/LanguageProvider';

/** Contact footer — all values come from content.json, localized. */
export function Contact() {
  const { lang } = useLanguage();
  const c = content.contact;
  return (
    <footer id="contact" className="border-t border-line py-20 text-center">
      <div className="wrap">
        <p className="eyebrow">{t(c.eyebrow, lang)}</p>
        <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold">
          {t(c.heading, lang)}
        </h2>
        <p className="mb-[26px] text-muted">{t(c.subtitle, lang)}</p>
        <a
          className="inline-block rounded-full bg-accent px-[30px] py-3.5 text-[0.95rem] font-semibold text-[#1a0d05] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,122,69,0.35)]"
          href={`mailto:${c.email}`}
        >
          {c.email}
        </a>
        <div className="mt-[26px] flex flex-wrap justify-center gap-[22px] text-[0.9rem] text-muted">
          <a className="hover:text-accent" href={`tel:${c.phone.replace(/\s+/g, '')}`}>
            {c.phone}
          </a>
          <span>·</span>
          <span>{t(c.location, lang)}</span>
          {c.socials.map((s) => (
            <span key={t(s.label, lang)} className="contents">
              <span>·</span>
              <a className="hover:text-accent" href={s.href}>
                {t(s.label, lang)}
              </a>
            </span>
          ))}
        </div>
        <p className="mt-10 text-[0.8rem] text-[#565c6b]">{t(c.copyright, lang)}</p>
      </div>
    </footer>
  );
}
