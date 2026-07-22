import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ja' ? 'たつみ協同組合' : 'Tatsumi Cooperative',
    alternateName: 'Tatsumi Cooperative',
    url: `https://tatsumi-coop.example.jp/${locale}`,
    logo: 'https://tatsumi-coop.example.jp/logo.png',
    description:
      locale === 'ja'
        ? 'たつみ協同組合は技能実習・育成就労に対応する協同組合です。'
        : 'Tatsumi Cooperative supports both Technical Intern Training and the new Ikusei-Shuro program in Japan.',
    sameAs: ['https://instagram.com', 'https://facebook.com']
  };

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
