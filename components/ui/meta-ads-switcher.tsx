'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  t,
  type Lang,
  type MetaAdsSwitcherBlock,
  type SwitcherPanel,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { Stats } from '@/components/Stats';
import { Funnel } from '@/components/ui/funnel';
import { LivePreview } from '@/components/ui/live-preview';
import { CompactImageGrid } from '@/components/ui/compact-image-grid';
import { reveal, viewportOnce, tabSpring } from '@/lib/motion';

function PanelColumnsRow({ panel, lang }: { panel: NonNullable<SwitcherPanel['columns']>; lang: Lang }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(panel.leftTitle, lang)}
        </h4>
        <RichList items={panel.leftItems} lang={lang} />
      </div>
      <div className="liquid-glass rounded-[24px] p-6">
        <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">
          {t(panel.rightTitle, lang)}
        </h4>
        <RichList items={panel.rightItems} lang={lang} />
      </div>
    </div>
  );
}

/** One switcher panel's full content, in a fixed order. */
function PanelContent({
  panel,
  lang,
  galleryLayout = 'row',
}: {
  panel: SwitcherPanel;
  lang: Lang;
  galleryLayout?: 'row' | 'grid';
}) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="mb-2 text-[1.3rem] font-bold tracking-[-0.01em] text-text">{t(panel.title, lang)}</h4>
        <p className="text-base leading-relaxed text-[#3a3a3c]">{t(panel.description, lang)}</p>
      </div>

      {panel.kpis && <Stats items={panel.kpis} lang={lang} />}

      {panel.note && <p className="text-[0.85rem] leading-relaxed text-muted">{t(panel.note, lang)}</p>}

      {panel.insight && (
        <p className="text-base leading-relaxed text-[#3a3a3c]">{t(panel.insight, lang)}</p>
      )}

      {panel.funnel && <Funnel steps={panel.funnel} lang={lang} />}

      {panel.columns && <PanelColumnsRow panel={panel.columns} lang={lang} />}

      {panel.embedUrl && (
        <motion.div whileHover={{ y: -2 }} transition={tabSpring}>
          <LivePreview url={panel.embedUrl} frame="browser" caption={panel.embedCaption} lang={lang} />
        </motion.div>
      )}

      {panel.bullets && <RichList items={panel.bullets} lang={lang} />}

      {panel.gallery && panel.gallery.length > 0 && (
        <CompactImageGrid items={panel.gallery} lang={lang} gridId={panel.id} layout={galleryLayout} />
      )}
    </div>
  );
}

/**
 * Chip-based content switcher for K-Tech College's Paid tab "Meta Ads"
 * section — replaces what used to be 3 separate stacked groups
 * (Job Post Campaigns / Event Campaigns / Sample Meta Ads Plan) with one
 * heading, a row of chips, and a single active panel. Only the active
 * panel is ever in the DOM (AnimatePresence mode="wait" — no reserved
 * height for the tallest panel, no hidden-but-laid-out panels).
 */
export function MetaAdsSwitcher({ block, lang }: { block: MetaAdsSwitcherBlock; lang: Lang }) {
  const [activeId, setActiveId] = useState(block.panels[0]?.id);
  const active = block.panels.find((p) => p.id === activeId) ?? block.panels[0];

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="mb-20 last:mb-0"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-4xl font-bold leading-[1.15] tracking-[-0.02em]">{t(block.heading, lang)}</h3>
        <div
          role="tablist"
          aria-label={t(block.heading, lang)}
          className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible"
        >
          {block.panels.map((p) => {
            const isActive = p.id === active?.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveId(p.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[0.85rem] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--pc,theme(colors.accent))]/50 ${
                  isActive
                    ? 'bg-[var(--pc,theme(colors.accent))] text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)]'
                    : 'border border-line bg-white/70 text-text hover:bg-black/[0.03]'
                }`}
              >
                {t(p.chipLabel, lang)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="liquid-glass rounded-[28px] p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <PanelContent panel={active} lang={lang} galleryLayout={block.galleryLayout} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
