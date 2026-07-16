import type { Metadata } from 'next';
import { Bricolage_Grotesque, Be_Vietnam_Pro } from 'next/font/google';
import { content } from '@/lib/content';
import { Providers } from '@/components/Providers';
import { Nav } from '@/components/Nav';
import { Contact } from '@/components/Contact';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-display',
  display: 'swap',
});

const body = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: content.site.title,
  description: content.site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
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
