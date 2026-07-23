'use client';

import {
  Share2,
  Users,
  Flame,
  Send,
  Repeat,
  FileText,
  Award,
  Trophy,
  Megaphone,
  UserPlus,
  CheckCircle2,
  Bell,
  MapPin,
  ArrowRight,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react';
import { t, type Lang, type FunnelStep } from '@/lib/content';

/** Maps a step's `icon` name to its glyph; falls back to Share2. */
const FUNNEL_ICONS: Record<string, LucideIcon> = {
  Share2,
  Users,
  Flame,
  Send,
  Repeat,
  FileText,
  Award,
  Trophy,
  Megaphone,
  UserPlus,
  CheckCircle2,
  Bell,
  MapPin,
};

/**
 * Horizontal process funnel (vertical on mobile): a row of icon-badge steps
 * connected by arrows. `highlight` steps get the project accent instead of
 * the neutral gray badge, for the one or two steps that matter most.
 */
export function Funnel({ steps, lang }: { steps: FunnelStep[]; lang: Lang }) {
  return (
    <div className="liquid-glass rounded-[24px] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-1">
        {steps.map((step, i) => {
          const Icon = (step.icon && FUNNEL_ICONS[step.icon]) || Share2;
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:items-center sm:gap-0 sm:text-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  step.highlight
                    ? 'border-[var(--pc,theme(colors.accent))] bg-[var(--pc,theme(colors.accent))]/12'
                    : 'border-line bg-white'
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  className={step.highlight ? 'text-[var(--pc,theme(colors.accent))]' : 'text-muted'}
                />
              </span>

              <div className="sm:mt-1.5 sm:px-1">
                <p
                  className={`text-[0.85rem] font-semibold leading-snug ${
                    step.highlight ? 'text-[var(--pc,theme(colors.accent))]' : 'text-text'
                  }`}
                >
                  {t(step.label, lang)}
                </p>
                {step.desc && (
                  <p className="mt-0.5 text-[0.78rem] leading-snug text-muted">{t(step.desc, lang)}</p>
                )}
              </div>

              {!isLast && (
                <span aria-hidden className="shrink-0 text-muted/45 sm:mt-1.5 sm:self-start">
                  <ArrowDown size={14} strokeWidth={1.75} className="sm:hidden" />
                  <ArrowRight size={14} strokeWidth={1.75} className="mx-auto hidden sm:block" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
