import { t, type Lang, type Stat } from '@/lib/content';

/** Big stat numbers row. Number color follows the --pc CSS var (project accent).
 *  Labels are localized via `lang`; values (numbers) are language-independent. */
export function Stats({ items, lang }: { items: Stat[]; lang: Lang }) {
  return (
    <div className="flex flex-wrap gap-10">
      {items.map(([value, label], i) => (
        <div key={i}>
          <b className="block font-display text-[2.2rem] font-extrabold tabular-nums text-[var(--pc,theme(colors.accent))]">
            {value}
          </b>
          <small className="text-muted">{t(label, lang)}</small>
        </div>
      ))}
    </div>
  );
}
