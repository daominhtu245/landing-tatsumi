import type { Metadata } from 'next';
import { Noto_Sans_JP, Inter } from 'next/font/google';
import './globals.css';

const notoJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-noto-jp',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tatsumi-coop.example.jp'),
  title: {
    default: '辰巳協同組合 | Tatsumi Cooperative',
    template: '%s | 辰巳協同組合'
  },
  description:
    '辰巳協同組合 (Tatsumi Cooperative) — 技能実習・育成就労に対応する協同組合。受入企業と海外人材を信頼で結びます。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${notoJp.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
