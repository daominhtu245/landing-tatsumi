import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return { title: t('title'), description: t('subtitle') };
}

const sections = {
  ja: [
    {
      heading: '1. 個人情報の取得と利用目的',
      body: '当組合は、お問い合わせ、応募、サービス提供等の業務遂行に必要な範囲で個人情報を取得し、利用目的の範囲内でのみ取り扱います。'
    },
    {
      heading: '2. 個人情報の第三者提供',
      body: 'ご本人の同意なく個人情報を第三者に提供することはありません。ただし、法令に基づく場合等を除きます。'
    },
    {
      heading: '3. 個人情報の安全管理',
      body: '個人情報の漏えい、滅失、毀損の防止その他の個人情報の安全管理のために、必要かつ適切な措置を講じます。'
    },
    {
      heading: '4. 個人情報の開示・訂正・削除',
      body: 'ご本人からの個人情報の開示、訂正、削除等のご請求に対し、合理的な範囲で速やかに対応いたします。'
    },
    {
      heading: '5. お問い合わせ窓口',
      body: '本ポリシーに関するお問い合わせは、お問い合わせフォームよりお寄せください。'
    }
  ],
  en: [
    {
      heading: '1. Collection and use of personal data',
      body: 'We collect personal data only to the extent required for inquiries, applications, and service delivery, and we use it only for those purposes.'
    },
    {
      heading: '2. Disclosure to third parties',
      body: 'We do not disclose personal data to third parties without consent, except as required by law.'
    },
    {
      heading: '3. Data security',
      body: 'We take reasonable and appropriate measures to prevent leakage, loss, or damage of personal data.'
    },
    {
      heading: '4. Access, correction, deletion',
      body: 'We respond promptly to reasonable requests from individuals to access, correct, or delete their personal data.'
    },
    {
      heading: '5. Contact',
      body: 'For questions regarding this policy, please reach out via our contact form.'
    }
  ]
};

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const locale = useLocale() as 'ja' | 'en';
  const t = useTranslations('privacy');

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section className="py-20 lg:py-24">
        <div className="container-tight max-w-3xl space-y-8">
          <p className="text-sm text-slate-500">{t('lastUpdated')}</p>
          {sections[locale].map((s) => (
            <div key={s.heading} className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
              <p className="text-base leading-relaxed text-slate-700">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
