'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  t,
  type Group,
  type Lang,
  type KpiCard,
  type ResultsColumn,
  type ResultsBlock,
  type ObjectiveChallengeBlock,
  type StrategyRoleBlock,
  type FunnelBlock,
  type GalleryBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Funnel } from '@/components/ui/funnel';
import { CompactImageGrid } from '@/components/ui/compact-image-grid';
import { reveal, viewportOnce } from '@/lib/motion';

function KpiCardEl({ kpi, lang }: { kpi: KpiCard; lang: Lang }) {
  return (
    <div className="liquid-glass flex min-h-[136px] flex-col justify-center rounded-[18px] p-5">
      <small className="block text-[0.72rem] font-semibold uppercase tracking-wide text-[#1d1d1f]/45">
        {t(kpi.label, lang)}
      </small>
      <b className="mt-1.5 block text-[1.6rem] font-extrabold leading-tight tracking-[-0.01em] text-[var(--pc,theme(colors.accent))]">
        {t(kpi.value, lang)}
      </b>
      {kpi.note && (
        <small className="mt-2 block text-[0.76rem] leading-snug text-[#1d1d1f]/55">{t(kpi.note, lang)}</small>
      )}
    </div>
  );
}

function ResultsColumnEl({ col, lang }: { col: ResultsColumn; lang: Lang }) {
  return (
    <div>
      <h4 className="mb-3 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(col.title, lang)}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {col.kpis.map((k, i) => (
          <KpiCardEl key={i} kpi={k} lang={lang} />
        ))}
      </div>
      {col.channelNote && (
        <p className="mt-2 text-[0.78rem] leading-relaxed text-[#1d1d1f]/45">{t(col.channelNote, lang)}</p>
      )}
    </div>
  );
}

/** Result columns stack full-width (not side by side) — each needs room for
 *  4 readable KPI cards in one row. */
function ResultsSection({ block, lang }: { block: ResultsBlock; lang: Lang }) {
  return (
    <div className="mb-8 space-y-6 last:mb-0">
      {block.columns.map((c, i) => (
        <ResultsColumnEl key={i} col={c} lang={lang} />
      ))}
    </div>
  );
}

function ObjectiveChallengeSection({ block, lang }: { block: ObjectiveChallengeBlock; lang: Lang }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 last:mb-0">
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-2 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.objectiveTitle, lang)}
        </h4>
        <p className="text-sm leading-relaxed text-muted">{t(block.objectiveText, lang)}</p>
      </div>
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-2 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.challengeTitle, lang)}
        </h4>
        <p className="text-sm leading-relaxed text-muted">{t(block.challengeText, lang)}</p>
      </div>
    </div>
  );
}

/** Chip-switchable role bullets (fade transition) — keeps 3 roles from
 *  stretching the section's height the way 3 stacked/2+1 cards would. */
function RoleSwitcher({ roles, lang }: { roles: StrategyRoleBlock['roles']; lang: Lang }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = roles[activeIdx];

  return (
    <div>
      <div role="tablist" aria-label="My Role" className="mb-4 flex flex-wrap gap-2">
        {roles.map((r, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIdx(i)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-[7px] text-[0.78rem] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--pc,theme(colors.accent))]/50 ${
                isActive
                  ? 'bg-[var(--pc,theme(colors.accent))] text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]'
                  : 'border border-line bg-white/70 text-text hover:bg-black/[0.03]'
              }`}
            >
              {t(r.title, lang)}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <RichList items={active.bullets} lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StrategyRoleSection({ block, lang }: { block: StrategyRoleBlock; lang: Lang }) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 last:mb-0">
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.strategyTitle, lang)}
        </h4>
        <RichList items={block.strategyBullets} lang={lang} />
      </div>
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(block.roleTitle, lang)}</h4>
        <RoleSwitcher roles={block.roles} lang={lang} />
      </div>
    </div>
  );
}

function FunnelSection({ block, lang }: { block: FunnelBlock; lang: Lang }) {
  return (
    <div className="mb-8 last:mb-0">
      {block.title && (
        <h4 className="mb-3 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(block.title, lang)}</h4>
      )}
      <Funnel steps={block.steps} lang={lang} />
    </div>
  );
}

/**
 * K-Tech College's Events tab "Featured Case" group — a dedicated compact
 * layout (results -> objective/challenge -> strategy/role -> event flow ->
 * gallery) that doesn't fit the generic bento GroupPanel, following the
 * same bypass pattern as FreeChannelGroupPanel/MetaAdsSwitcher.
 */
export function FeaturedCasePanel({ group, lang }: { group: Group; lang: Lang }) {
  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      {group.title && (
        <h3 className="mb-2 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">{t(group.title, lang)}</h3>
      )}
      {group.blocks.map((b, i) => {
        if (b.type === 'subheading') {
          return (
            <h4 key={i} className="mb-6 text-[1.4rem] font-bold tracking-[-0.01em] text-text">
              {t(b.text, lang)}
            </h4>
          );
        }
        if (b.type === 'results') return <ResultsSection key={i} block={b} lang={lang} />;
        if (b.type === 'objectiveChallenge') return <ObjectiveChallengeSection key={i} block={b} lang={lang} />;
        if (b.type === 'strategyRole') return <StrategyRoleSection key={i} block={b} lang={lang} />;
        if (b.type === 'funnel') return <FunnelSection key={i} block={b} lang={lang} />;
        if (b.type === 'gallery') {
          const gallery = b as GalleryBlock;
          return (
            <div key={i} className="mb-8 last:mb-0">
              {gallery.title && (
                <h4 className="mb-3 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
                  {t(gallery.title, lang)}
                </h4>
              )}
              <CompactImageGrid items={gallery.items} lang={lang} gridId="featured-case" layout="grid" />
            </div>
          );
        }
        return null;
      })}
    </motion.section>
  );
}
