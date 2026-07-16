/**
 * Bulleted list where each item may contain trusted inline <b> markup coming
 * from content.json. The bullet color is driven by the CSS var --pc set on an
 * ancestor (falls back to the accent color).
 */
export function RichList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {items.map((html, i) => (
        <li
          key={i}
          className="rich relative mb-3.5 pl-[26px] text-[#c6cbd6] before:absolute before:left-0 before:top-[0.62em] before:h-[9px] before:w-[9px] before:rounded-full before:bg-[var(--pc,theme(colors.accent))] before:content-['']"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ))}
    </ul>
  );
}
