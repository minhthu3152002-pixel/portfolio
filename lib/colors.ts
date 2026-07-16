/**
 * Single source of truth for the home-page color language.
 *
 * Each project defines ONE accent hue in content.json (`colors.accent`).
 * Everything visible on the home page — the liquid-glass shelf card AND the
 * project block directly below it — is derived from that same hue here, so the
 * two surfaces are guaranteed to be *light & lighter variations of one paint
 * swatch*: identical hue angle, different lightness only (no clashing).
 *
 *   shelf card   → softened "pastel poster" gradient  (deep → airy, same hue)
 *   home block   → light frosted tint of the same hue + two accent corner glows
 *
 * Tune the whole site's color feel from the small set of constants below.
 */

/** Hex -> HSL ({ h: 0-360, s/l: 0-1 }). */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

/** HSL -> #rrggbb. */
export function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const hex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * Softened "pastel poster" gradient stops for a project accent — same hue as
 * the home block, ~65-70% of the accent's punch: capped saturation and raised
 * lightness for an airy poster feel. The top-left `deep` stop stays low-
 * lightness (not highly saturated) so white text/graphics read even on light
 * accents like amber. Shared by the CSS gradient and the SVG folder fill.
 */
export function posterStops(accent: string): { deep: string; mid: string; airy: string } {
  const { h, s } = hexToHsl(accent);
  return {
    deep: hslToHex(h, Math.min(0.62, Math.max(0.44, s * 0.74)), 0.34),
    mid: hslToHex(h, Math.min(0.55, s * 0.62), 0.55),
    airy: hslToHex(h, Math.min(0.5, s * 0.55), 0.74),
  };
}

/** Shelf poster gradient as a CSS background string (deep → mid → airy). */
export function posterGradient(accent: string): string {
  const { deep, mid, airy } = posterStops(accent);
  return (
    `radial-gradient(78% 60% at 15% 0%, rgba(255,255,255,0.16), transparent 55%), ` +
    `linear-gradient(140deg, ${deep} 0%, ${mid} 52%, ${airy} 100%)`
  );
}

/**
 * Home block — a light frosted tint of the SAME hue (clearly teal/blue/purple/
 * green/amber, never near-white) plus the two accent corner-glow layers.
 *
 * `base` is the "lighter" swatch (very high lightness, same hue) that reads as
 * a colored frosted panel; `wash` + `glowTL` + `glowBR` add depth with the raw
 * accent. Dark body text (`colors.fg`, the same hue darkened) stays readable —
 * fg-on-base contrast tests at ~10:1 across all five accents.
 */
export function blockSurface(accent: string): {
  base: string;
  wash: { background: string; opacity: number };
  glowTL: { background: string; opacity: number };
  glowBR: { background: string; opacity: number };
} {
  const { h, s } = hexToHsl(accent);
  const base = hslToHex(h, Math.min(0.6, s * 0.62), 0.9);
  return {
    base,
    // uniform hue wash so the whole card reads clearly as its accent color
    wash: { background: accent, opacity: 0.14 },
    // two richer glows on diagonally-opposite corners for depth
    glowTL: {
      background: `radial-gradient(70% 70% at 0% 0%, ${accent}, transparent 70%)`,
      opacity: 0.4,
    },
    glowBR: {
      background: `radial-gradient(58% 62% at 100% 100%, ${accent}, transparent 66%)`,
      opacity: 0.4,
    },
  };
}
