'use client';

import { motion } from 'framer-motion';
import {
  t,
  type Group,
  type Lang,
  type TextBlock,
  type EmbedBlock,
  type ToolsBlock,
} from '@/lib/content';
import { RichList } from '@/components/RichList';
import { LivePreview } from '@/components/ui/live-preview';
import { ToolLogo } from '@/components/ui/tool-icon';
import { reveal, viewportOnce } from '@/lib/motion';

/**
 * AI & Automation's "Email CRM" tab: a fixed 38/62 desktop split (left:
 * description/limitation/impact text, right: the interactive HTML tool
 * preview) instead of the generic GroupPanel's stacked preview-grid-then-
 * features flow — the preview needs to stay large and side-by-side with
 * the text, not collapse to a full-width block above it. Stacks (text
 * first, then preview) on mobile via normal source order.
 */
export function EmailCrmPanel({ group, lang }: { group: Group; lang: Lang }) {
  const blocks = group.blocks;
  const textBlocks = blocks.filter((b): b is TextBlock => b.type === 'text');
  const intro = textBlocks.find((b) => !b.title);
  const namedTextBlocks = textBlocks.filter((b) => !!b.title);
  const embedBlock = blocks.find((b): b is EmbedBlock => b.type === 'embed');
  const toolsBlock = blocks.find((b): b is ToolsBlock => b.type === 'tools');

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[38%_1fr] lg:gap-10">
        <div className="flex flex-col gap-8">
          {intro && (
            <p className="rich text-base leading-relaxed text-[#3a3a3c]" dangerouslySetInnerHTML={{ __html: t(intro.items[0], lang) }} />
          )}
          {namedTextBlocks.map((b, i) => (
            <div key={i} className={b.boxed ? 'liquid-glass rounded-[24px] p-6' : ''}>
              {b.title && (
                <h4 className="mb-4 text-[1.05rem] font-bold tracking-[-0.01em] text-text">{t(b.title, lang)}</h4>
              )}
              {b.prose ? (
                <div className="space-y-3">
                  {b.items.map((it, j) => (
                    <p
                      key={j}
                      className="rich text-sm leading-relaxed text-muted"
                      dangerouslySetInnerHTML={{ __html: t(it, lang) }}
                    />
                  ))}
                </div>
              ) : (
                <RichList items={b.items} lang={lang} />
              )}
            </div>
          ))}
          {toolsBlock && (
            <div className="flex flex-wrap gap-2">
              {toolsBlock.items.map((tool) => {
                const name = t(tool, lang);
                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-[5px] text-[0.75rem] font-medium text-text"
                  >
                    <ToolLogo name={name} className="shrink-0 text-muted" />
                    {name}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {embedBlock && (
          <div>
            <LivePreview
              url={embedBlock.url}
              frame={embedBlock.frame}
              embeddable={embedBlock.embeddable}
              poster={embedBlock.poster}
              aspect={embedBlock.aspect}
              title={embedBlock.title}
              note={embedBlock.note}
              caption={embedBlock.caption}
              lang={lang}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
}
