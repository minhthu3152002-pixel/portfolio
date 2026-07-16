import { t, type Lang, type Stat } from '@/lib/content';

/** Big stat numbers in white rounded cards. Number color = project accent
 *  (--pc). Values are language-independent; labels localized. */
export function Stats({ items, lang }: { items: Stat[]; lang: Lang }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map(([value, label], i) => (
        <div
          key={i}
          className="rounded-2xl bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
        >
          <b className="block text-[2rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-[var(--pc,theme(colors.accent))]">
            {value}
          </b>
          <small className="mt-2 block text-[0.85rem] leading-snug text-muted">
            {t(label, lang)}
          </small>
        </div>
      ))}
    </div>
  );
}
