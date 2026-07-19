import data from '@/content/content.json';

export type Lang = 'en' | 'vi';

/** A localizable field: either a plain string (same in both langs, e.g. a
 *  proper noun) or an { en, vi } pair. `t()` resolves it to a string. */
export type Localized = string | { en: string; vi?: string };

/** Resolve a localizable field to a string for the given language, with
 *  graceful fallback (missing vi -> en; plain string -> itself). */
export function t(field: Localized | null | undefined, lang: Lang): string {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  return field[lang] ?? field.en ?? '';
}

export type NavLink = { label: Localized; href: string };
export type Social = { label: Localized; href: string };

/** A top-level navbar-menu item. `id` selects its dropdown content in Nav. */
export type NavMenuItem = { id: string; label: Localized; enabled?: boolean };

/** A large section headline: localizable text with an optional `enabled` flag
 *  (set false to hide the headline without touching code). */
export type SectionHeading = { enabled?: boolean; en: string; vi?: string };
export type Cta = { label: Localized; href: string };

export type ProjectColors = { bg: string; fg: string; accent: string };

/** Gallery entry: [src, caption] or [src, caption, 1] where 1 = full width. */
export type GalleryItem =
  | [string, Localized]
  | [string, Localized, number];

/** Stat entry: [value, label] — value is a plain string (a number), label is localizable. */
export type Stat = [string, Localized];

export type TextBlock = { type: 'text'; items: Localized[] };
export type StatsBlock = { type: 'stats'; items: Stat[] };
export type GalleryBlock = { type: 'gallery'; items: GalleryItem[] };
export type Block = TextBlock | StatsBlock | GalleryBlock;

export type Group = {
  enabled?: boolean;
  title: Localized | null;
  blocks: Block[];
};

export type Section = {
  enabled?: boolean;
  id: string;
  label: Localized;
  groups: Group[];
};

export type Project = {
  enabled?: boolean;
  id: string;
  title: Localized;
  short: Localized;
  tags: Localized[];
  colors: ProjectColors;
  cover: string;
  /** Optional dedicated nav-dropdown thumbnail; falls back to `cover`. */
  thumb?: string;
  sections: Section[];
};

/** One role in the About timeline. `period`/`title` localizable; `org` plain. */
export type Experience = { period: Localized; title: Localized; org: string };

/** One language row: name + level localizable, `value` = 0-100 proficiency. */
export type Language = { name: Localized; level: Localized; value: number };

/** One education row. `school`/`year`/`gpa` are plain; `degree` is localizable. */
export type Education = {
  school: string;
  degree: Localized;
  year: string;
  gpa?: string;
};

/** A looping "flip words" line: static prefix/suffix + a rotating word list.
 *  Adding/removing a word is pure content — no code change. */
export type FlipLine = {
  enabled?: boolean;
  prefix: Localized;
  words: Localized[];
  suffix: Localized;
};

/** An avatar trait chip: a localizable label, plus an optional `icon` string
 *  that keys a lucide glyph (see TRAIT_ICONS in AboutMe). Plain strings and
 *  `{ en, vi }` (no icon) render text-only. */
export type Trait = string | { en: string; vi?: string; icon?: string };

/** "About me" block — single source under content.about (see HOW-TO-EDIT.md). */
export type About = {
  heading?: SectionHeading;
  name: string;
  role: Localized;
  avatar: string;
  traits: Trait[];
  summary: Localized;
  flipLine?: FlipLine;
  experience: Experience[];
  education: Education[];
  skills: Localized[];
  tools: Localized[];
  languages: Language[];
};

export type SiteContent = {
  site: {
    title: Localized;
    logoText: string;
    description: Localized;
  };
  nav: NavMenuItem[];
  projectsHeading?: SectionHeading;
  hero: {
    headline: Localized;
    headlineItalic: Localized;
    subtitle: Localized;
    cta: Cta;
    shelfTitle: Localized;
    shelfFilterAll: Localized;
  };
  about: About;
  contact: {
    heading: Localized;
    subtitle: Localized;
    email: string;
    phone: string;
    location: Localized;
    socials: Social[];
    copyright: Localized;
  };
  projects: Project[];
};

export const content = data as SiteContent;

/** True unless `enabled` is explicitly false (absence = enabled). */
export const isEnabled = (x: { enabled?: boolean }): boolean =>
  x.enabled !== false;

/** Only enabled projects, in author order — the source for home blocks,
 *  routes and numbering. */
export const projects: Project[] = content.projects.filter(isEnabled);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

/** 1-based number of a project among the enabled list (0 if not found). */
export function projectNumber(id: string): number {
  return projects.findIndex((p) => p.id === id) + 1;
}

/** Zero-pad a project number for display, e.g. 1 -> "01". */
export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Enabled sections of a project. */
export function enabledSections(project: Project): Section[] {
  return project.sections.filter(isEnabled);
}

/** Enabled groups of a section. */
export function enabledGroups(section: Section): Group[] {
  return section.groups.filter(isEnabled);
}
