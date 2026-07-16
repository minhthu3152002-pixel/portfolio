import {
  siMeta,
  siGoogleanalytics,
  siGoogleappsscript,
  siClaudecode,
  siClaude,
  siAnthropic,
  siGooglegemini,
  siGithub,
  siVercel,
} from 'simple-icons';

/** Minimal shape we use from a simple-icons icon. */
type Glyph = { path: string };

const SPARKLE =
  'M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9z';

/**
 * Map a tool's display name to a brand glyph. Returns a simple-icons glyph, the
 * literal 'sparkle' fallback (for Claude Code when the Anthropic mark is not
 * wanted), or null when no logo is available — callers then render the pill
 * with no icon (never a broken image). Brands absent from simple-icons (Canva,
 * ChatGPT/OpenAI) intentionally fall through to null.
 */
function resolve(name: string): Glyph | 'sparkle' | null {
  const n = name.toLowerCase();
  if (n.includes('claude code')) return siClaudecode ?? 'sparkle';
  if (n.includes('claude')) return siClaude;
  if (n.includes('anthropic')) return siAnthropic;
  if (n.includes('meta')) return siMeta;
  if (n.includes('apps script') || n.includes('appsscript')) return siGoogleappsscript;
  if (n.includes('analytic')) return siGoogleanalytics;
  if (n.includes('gemini')) return siGooglegemini;
  if (n.includes('github')) return siGithub;
  if (n.includes('vercel')) return siVercel;
  return null;
}

/** ~16px monochrome brand logo for a tool pill, or nothing if unavailable. */
export function ToolLogo({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const icon = resolve(name);
  if (!icon) return null;
  const path = icon === 'sparkle' ? SPARKLE : icon.path;
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
