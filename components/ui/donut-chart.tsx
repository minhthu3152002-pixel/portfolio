'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { t, type Lang, type ChartDatum, type Localized } from '@/lib/content';

/**
 * Small donut chart (recharts) in the site's liquid-glass card style. The
 * last entry in `data` is treated as the "highlighted" slice — shown in the
 * project accent color and centered inside the donut — everything else is a
 * neutral gray. Built for a simple 2-3 slice split (e.g. paid vs free), not
 * a general-purpose chart.
 */
export function DonutChart({
  data,
  title,
  subtitle,
  note,
  lang,
}: {
  data: ChartDatum[];
  title?: Localized;
  subtitle?: Localized;
  note?: Localized;
  lang: Lang;
}) {
  const highlightIdx = data.length - 1;
  const highlighted = data[highlightIdx];

  return (
    <div className="liquid-glass rounded-[24px] p-6">
      {title && (
        <h4 className="mb-1 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(title, lang)}
        </h4>
      )}
      {subtitle && <p className="mb-5 text-sm leading-relaxed text-muted">{t(subtitle, lang)}</p>}

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <div className="relative h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.map((d) => ({ name: t(d.label, lang), value: d.value }))}
                dataKey="value"
                nameKey="name"
                innerRadius="70%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === highlightIdx ? 'var(--pc, #0071e3)' : 'rgba(29,29,31,0.12)'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[1.7rem] font-extrabold leading-none tabular-nums text-[var(--pc,theme(colors.accent))]">
              {highlighted.value}%
            </span>
            <span className="mt-1.5 text-[0.8rem] text-muted">{t(highlighted.label, lang)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: i === highlightIdx ? 'var(--pc, #0071e3)' : 'rgba(29,29,31,0.2)' }}
              />
              <span className="text-base font-semibold tabular-nums text-text">{d.value}%</span>
              <span className="text-base text-muted">{t(d.label, lang)}</span>
            </div>
          ))}
        </div>
      </div>

      {note && <p className="mt-5 text-sm leading-relaxed text-muted">{t(note, lang)}</p>}
    </div>
  );
}
