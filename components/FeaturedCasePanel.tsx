'use client';

import { motion } from 'framer-motion';
import {
  t,
  type Group,
  type Lang,
  type KpiCard,
  type ResultsColumn,
  type ResultsBlock,
  type ObjectiveStrategyBlock,
  type RoleCardsBlock,
  type GalleryBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { CompactImageGrid } from '@/components/ui/compact-image-grid';
import { reveal, viewportOnce } from '@/lib/motion';

function KpiCardEl({ kpi, lang }: { kpi: KpiCard; lang: Lang }) {
  return (
    <div className="liquid-glass flex min-h-[116px] flex-col justify-center rounded-[16px] p-4">
      <small className="block text-[0.7rem] font-medium uppercase tracking-wide text-[#1d1d1f]/45">
        {t(kpi.label, lang)}
      </small>
      <b className="mt-1 block text-[1.3rem] font-extrabold leading-tight tracking-[-0.01em] text-[var(--pc,theme(colors.accent))]">
        {t(kpi.value, lang)}
      </b>
      {kpi.note && (
        <small className="mt-1.5 block text-[0.72rem] leading-snug text-[#1d1d1f]/55">
          {t(kpi.note, lang)}
        </small>
      )}
    </div>
  );
}

function ResultsColumnEl({ col, lang }: { col: ResultsColumn; lang: Lang }) {
  return (
    <div>
      <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(col.title, lang)}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {col.kpis.map((k, i) => (
          <KpiCardEl key={i} kpi={k} lang={lang} />
        ))}
      </div>
      {col.channelNote && (
        <p className="mt-3 text-[0.78rem] leading-relaxed text-[#1d1d1f]/45">{t(col.channelNote, lang)}</p>
      )}
    </div>
  );
}

function ResultsSection({ block, lang }: { block: ResultsBlock; lang: Lang }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
      {block.columns.map((c, i) => (
        <ResultsColumnEl key={i} col={c} lang={lang} />
      ))}
    </div>
  );
}

function ObjectiveStrategySection({ block, lang }: { block: ObjectiveStrategyBlock; lang: Lang }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-2 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.objectiveTitle, lang)}
        </h4>
        <p className="mb-5 text-sm leading-relaxed text-muted">{t(block.objectiveText, lang)}</p>
        <h4 className="mb-2 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.challengeTitle, lang)}
        </h4>
        <p className="text-sm leading-relaxed text-muted">{t(block.challengeText, lang)}</p>
      </div>
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(block.strategyTitle, lang)}
        </h4>
        <RichList items={block.strategyBullets} lang={lang} />
      </div>
    </div>
  );
}

function RoleCardsSection({ block, lang }: { block: RoleCardsBlock; lang: Lang }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {block.items.map((c, i) => (
        <div key={i} className="liquid-glass rounded-[24px] p-6">
          <h4 className="mb-4 text-[1.0625rem] font-bold tracking-[-0.01em] text-text">{t(c.title, lang)}</h4>
          <RichList items={c.bullets} lang={lang} />
        </div>
      ))}
    </div>
  );
}

/**
 * K-Tech College's Events tab "Featured Case" group — a dedicated compact
 * layout (results -> objective/challenge/strategy -> my role -> gallery)
 * that doesn't fit the generic bento GroupPanel, following the same
 * bypass pattern as FreeChannelGroupPanel/MetaAdsSwitcher.
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
        <h3 className="mb-8 text-4xl font-bold leading-[1.15] tracking-[-0.02em]">{t(group.title, lang)}</h3>
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
        if (b.type === 'objectiveStrategy') return <ObjectiveStrategySection key={i} block={b} lang={lang} />;
        if (b.type === 'roleCards') return <RoleCardsSection key={i} block={b} lang={lang} />;
        if (b.type === 'gallery') {
          const gallery = b as GalleryBlock;
          return (
            <div key={i} className="mb-10 last:mb-0">
              <CompactImageGrid items={gallery.items} lang={lang} gridId="featured-case" layout="grid" />
            </div>
          );
        }
        return null;
      })}
    </motion.section>
  );
}
