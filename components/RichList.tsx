import { t, type Lang, type Localized } from '@/lib/content';

/**
 * Clean bullet list with accent dots. Items may contain trusted inline <b>/<a>
 * markup from content.json. Dot/link color follows --pc (project accent).
 * Items are localized via `lang`.
 */
export function RichList({
  items,
  lang,
  className,
}: {
  items: Localized[];
  lang: Lang;
  className?: string;
}) {
  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li
          key={i}
          className="rich relative mb-3 pl-6 text-base leading-relaxed text-[#3a3a3c] before:absolute before:left-0 before:top-[0.6em] before:h-[7px] before:w-[7px] before:rounded-full before:bg-[var(--pc,theme(colors.accent))] before:content-['']"
          dangerouslySetInnerHTML={{ __html: t(item, lang) }}
        />
      ))}
    </ul>
  );
}
