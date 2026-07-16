import { t, type Lang, type Localized } from '@/lib/content';

/**
 * Bulleted list where each item may contain trusted inline <b>/<a> markup from
 * content.json. The bullet color is driven by the CSS var --pc set on an
 * ancestor (falls back to the accent color). Items are localized via `lang`.
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
          className="rich relative mb-3.5 pl-[26px] text-[#c6cbd6] before:absolute before:left-0 before:top-[0.62em] before:h-[9px] before:w-[9px] before:rounded-full before:bg-[var(--pc,theme(colors.accent))] before:content-['']"
          dangerouslySetInnerHTML={{ __html: t(item, lang) }}
        />
      ))}
    </ul>
  );
}
