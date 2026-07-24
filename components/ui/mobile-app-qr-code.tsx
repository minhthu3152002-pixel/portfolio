'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { t, type Lang, type Localized } from '@/lib/content';
import { tabSpring } from '@/lib/motion';

/**
 * Small "scan to try it on your phone" QR block, shown beside a mobile-frame
 * live preview (currently just the Mavis hamster app). Generated locally via
 * qrcode.react (crisp SVG, no external QR image API / network round trip).
 * Deliberately visually secondary — small, muted copy, one accent-colored
 * corner icon — so it never competes with the phone preview it sits next to.
 */
export function MobileAppQrCode({
  url,
  title,
  subtitle,
  size = 120,
  lang,
  className = '',
}: {
  url: string;
  title?: Localized;
  subtitle?: Localized;
  size?: number;
  lang: Lang;
  className?: string;
}) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Mavis app on mobile"
      whileHover={{ y: -2 }}
      transition={tabSpring}
      className={`flex flex-col items-center gap-3 text-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--pc,theme(colors.accent))]/50 ${className}`}
    >
      {(title || subtitle) && (
        <div className="space-y-0.5">
          {title && <p className="text-[0.8rem] font-medium text-text">{t(title, lang)}</p>}
          {subtitle && <p className="text-[0.75rem] leading-snug text-muted">{t(subtitle, lang)}</p>}
        </div>
      )}

      <div className="relative flex h-24 w-24 items-center justify-center rounded-[16px] border border-line bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] sm:h-[120px] sm:w-[120px]">
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#1d1d1f"
          level="M"
          marginSize={0}
          title="QR code to open the Mavis mobile app"
          style={{ width: '100%', height: '100%' }}
        />
        <span
          aria-hidden
          className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[var(--pc,theme(colors.accent))] text-white shadow-sm"
        >
          <Smartphone size={12} strokeWidth={2} />
        </span>
      </div>
    </motion.a>
  );
}
