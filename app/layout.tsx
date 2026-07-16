import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { content, t } from '@/lib/content';
import { Providers } from '@/components/Providers';
import { Nav } from '@/components/Nav';
import { Contact } from '@/components/Contact';
import './globals.css';

const sans = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600'],
  style: ['italic'],
  variable: '--font-serif',
  display: 'swap',
});

// Default (server) metadata is English; LanguageProvider updates the document
// title/description client-side to match the visitor's chosen language.
export const metadata: Metadata = {
  title: t(content.site.title, 'en'),
  description: t(content.site.description, 'en'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Providers>
          <Nav />
          {children}
          <Contact />
        </Providers>
      </body>
    </html>
  );
}
