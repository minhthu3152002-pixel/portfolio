'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { content, t, type Lang } from '@/lib/content';

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'portfolio-lang';

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'vi') return saved;
  } catch {
    /* ignore */
  }
  const nav = window.navigator.language?.toLowerCase() ?? '';
  return nav.startsWith('vi') ? 'vi' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start from 'en' so server and first client render match; correct in effect.
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  // Reflect language in <html lang> + per-language metadata on every change.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.title = t(content.site.title, lang);
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t(content.site.description, lang));
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    () => setLang(lang === 'en' ? 'vi' : 'en'),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
