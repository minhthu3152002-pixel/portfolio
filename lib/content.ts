import data from '@/content/content.json';

export type NavLink = { label: string; href: string };

export type Social = { label: string; href: string };

export type ProjectColors = { bg: string; fg: string; accent: string };

/** Gallery entry: [src, caption] or [src, caption, 1] where 1 = full width. */
export type GalleryItem = [string, string] | [string, string, number];

/** Stat entry: [value, label] — e.g. ["26.7M", "views in 4 months"]. */
export type Stat = [string, string];

export type Project = {
  id: string;
  num: string;
  title: string;
  short: string;
  tags: string[];
  colors: ProjectColors;
  cover: string;
  overview: string[];
  challenge: string[];
  solution: string[];
  stats: Stat[];
  results: string[];
  gallery: GalleryItem[];
};

export type SiteContent = {
  site: {
    title: string;
    description: string;
    logoText: string;
    nav: NavLink[];
  };
  hero: {
    badge: string;
    headline: string;
    headlineItalic: string;
    headlineTail: string;
    subtitle: string;
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

export const projects = content.projects;

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
