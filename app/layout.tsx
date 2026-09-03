import type { Metadata } from 'next';
import { Noto_Sans_JP, Inter } from 'next/font/google';
import { SITE } from '@/lib/site-config';
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
  metadataBase: new URL(SITE.domain),
  title: {
    default: 'たつみ協同組合 | Tatsumi Cooperative',
    template: '%s | たつみ協同組合'
  },
  description:
    'たつみ協同組合（Tatsumi Cooperative）の公式サイト。広島市西区を拠点に、共同購買事業などを通じて組合員である事業者の事業活動を支える協同組合です。'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${notoJp.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
