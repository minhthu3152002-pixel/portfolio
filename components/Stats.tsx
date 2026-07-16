import type { Stat } from '@/lib/content';

/** Big stat numbers row. Number color follows the --pc CSS var (project accent). */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <div className="flex flex-wrap gap-10">
      {items.map(([value, label], i) => (
        <div key={i}>
          <b className="block font-display text-[2.2rem] font-extrabold text-[var(--pc,theme(colors.accent))]">
            {value}
          </b>
          <small className="text-muted">{label}</small>
        </div>
      ))}
    </div>
  );
}
