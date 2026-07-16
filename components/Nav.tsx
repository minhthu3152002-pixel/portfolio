import Link from 'next/link';
import { content } from '@/lib/content';

/**
 * Sticky top navigation. Logo text splits at the first "." so the suffix
 * (e.g. ".mkt") renders in the accent color — edit site.logoText in
 * content.json to change it.
 */
export function Nav() {
  const { logoText, nav } = content.site;
  const dot = logoText.indexOf('.');
  const logoHead = dot === -1 ? logoText : logoText.slice(0, dot);
  const logoTail = dot === -1 ? '' : logoText.slice(dot);

  return (
    <nav className="sticky top-0 z-[60] border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-[1.05rem] font-extrabold tracking-[0.02em]"
        >
          {logoHead}
          <span className="text-accent">{logoTail}</span>
        </Link>
        <div className="flex gap-[26px] text-[0.88rem] text-muted">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
