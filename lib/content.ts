import data from '@/content/content.json';

export type NavLink = { label: string; href: string };

export type Social = { label: string; href: string };

export type Cta = { label: string; href: string };

export type ProjectColors = { bg: string; fg: string; accent: string };

/** Gallery entry: [src, caption] or [src, caption, 1] where 1 = full width. */
export type GalleryItem = [string, string] | [string, string, number];

/** Stat entry: [value, label] — e.g. ["26.7M", "views in 4 months"]. */
export type Stat = [string, string];

/** A content block inside a group. Discriminated by `type`. */
export type TextBlock = { type: 'text'; items: string[] };
export type StatsBlock = { type: 'stats'; items: Stat[] };
export type GalleryBlock = { type: 'gallery'; items: GalleryItem[] };
export type Block = TextBlock | StatsBlock | GalleryBlock;

/** A group is an optional sub-heading + its blocks, inside a tab. */
export type Group = {
  enabled?: boolean;
  title: string | null;
  blocks: Block[];
};

/** A section renders as a pill tab; it holds groups. */
export type Section = {
  enabled?: boolean;
  id: string;
  label: string;
  groups: Group[];
};

export type Project = {
  enabled?: boolean;
  id: string;
  title: string;
  short: string;
  tags: string[];
  colors: ProjectColors;
  cover: string;
  sections: Section[];
};

export type SiteContent = {
  site: {
    title: string;
    logoText: string;
    description: string;
    nav: NavLink[];
  };
  hero: {
    badge: string;
    headline: string;
    headlineItalic: string;
    subtitle: string;
    cta: Cta;
  };
  contact: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    socials: Social[];
    copyright: string;
  };
  projects: Project[];
};

export const content = data as SiteContent;

/** True unless `enabled` is explicitly false (absence = enabled). */
export const isEnabled = (x: { enabled?: boolean }): boolean =>
  x.enabled !== false;

/**
 * Only enabled projects, in author order. Everything downstream (home blocks,
 * routes, numbering) derives from this list so a disabled project vanishes
 * everywhere and numbering closes the gap automatically.
 */
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
