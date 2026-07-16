'use client';

import { MotionConfig } from 'framer-motion';
import { LanguageProvider } from '@/components/LanguageProvider';

/**
 * Client boundary for app-wide context: language + Framer Motion.
 * `reducedMotion="user"` makes every motion component honor the visitor's
 * prefers-reduced-motion setting automatically.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
