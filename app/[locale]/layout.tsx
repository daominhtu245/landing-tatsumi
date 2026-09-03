import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import { SITE } from '@/lib/site-config';
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

  // Dữ liệu có cấu trúc: chỉ khai báo sự thật kiểm chứng được.
  // KHÔNG khai báo tư cách 監理支援機関 khi chưa có giấy phép.
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'ja' ? 'たつみ協同組合' : 'Tatsumi Cooperative',
    alternateName: locale === 'ja' ? 'Tatsumi Cooperative' : 'たつみ協同組合',
    url: `${SITE.domain}/${locale}`,
    description:
      locale === 'ja'
        ? 'たつみ協同組合は、広島市西区を拠点に共同購買事業などを行う中小企業等協同組合です。'
        : 'Tatsumi Cooperative is a business cooperative based in Nishi-ku, Hiroshima, engaged in joint purchasing and related activities.',
    telephone: SITE.tel,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      postalCode: SITE.postalCode,
      addressCountry: 'JP',
      addressRegion: locale === 'ja' ? '広島県' : 'Hiroshima',
      addressLocality: locale === 'ja' ? '広島市西区' : 'Nishi-ku, Hiroshima-shi',
      streetAddress: locale === 'ja' ? '観音本町2丁目1-50' : '2-1-50 Kannon-honmachi'
    },
    hasMap: SITE.mapUrl
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
