import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';
import { Compass, Target, Sparkles } from 'lucide-react';
import { SITE, ORG_PROFILE } from '@/lib/site-config';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), description: t('subtitle') };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations('about');
  const tc = useTranslations('common');
  const locale = useLocale() as 'ja' | 'en';

  const missionKeys = ['purpose', 'policy', 'stance'] as const;
  const Icons = { purpose: Compass, policy: Target, stance: Sparkles } as const;

  const address = locale === 'ja' ? `〒${SITE.postalCode} ${SITE.address}` : SITE.addressEn;

  /**
   * Bảng 組合情報.
   * Mục nào khách hàng chưa xác nhận thì hiện 「準備中」 — không bịa giá trị.
   */
  const rows: { key: string; value: string }[] = [
    { key: 'name', value: t('info.nameVal') },
    { key: 'address', value: address },
    { key: 'tel', value: SITE.tel },
    { key: 'email', value: SITE.email },
    { key: 'established', value: ORG_PROFILE.established ?? tc('preparing') },
    { key: 'capital', value: ORG_PROFILE.capital ?? tc('preparing') },
    { key: 'memberCount', value: ORG_PROFILE.memberCount ?? tc('preparing') },
    { key: 'representative', value: ORG_PROFILE.representative ?? tc('preparing') },
    { key: 'businessArea', value: ORG_PROFILE.businessArea ?? tc('preparing') },
    { key: 'business', value: t('info.businessVal') }
  ];

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Greeting */}
      <section className="py-20 lg:py-28">
        <div className="container-tight grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Chưa có ảnh thật của tổ chức → dùng khối màu theo design system,
              không dùng ảnh stock để tránh gợi ý hoạt động không có thật. */}
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 via-white to-accent-100"
            aria-hidden
          >
            <svg
              className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 text-primary-600/20"
              viewBox="0 0 400 600"
              fill="none"
            >
              <path
                d="M 50 50 Q 150 100, 100 200 T 200 400 T 100 550"
                stroke="currentColor"
                strokeWidth="60"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="space-y-5">
            <span className="heading-eyebrow">{t('greetingTitle')}</span>
            <p className="text-lg leading-relaxed text-slate-700 lg:text-xl">
              {t('greetingBody')}
            </p>
            {ORG_PROFILE.representative && (
              <p className="text-sm font-semibold text-primary-700">
                {t('greetingNameLabel')} {ORG_PROFILE.representative}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-12">
          <span className="heading-eyebrow">{t('missionTitle')}</span>
          <div className="grid gap-6 md:grid-cols-3">
            {missionKeys.map((k) => {
              const Icon = Icons[k];
              return (
                <div key={k} className="rounded-3xl border border-slate-100 bg-white p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900">
                    {t(`mission.${k}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {t(`mission.${k}.body`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info table */}
      <section className="bg-slate-50 pb-20 lg:pb-28">
        <div className="container-tight">
          <span className="heading-eyebrow">{t('infoTitle')}</span>
          <dl className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {rows.map(({ key, value }, i) => (
              <div
                key={key}
                className={`grid grid-cols-[110px_1fr] gap-4 px-5 py-4 sm:grid-cols-[200px_1fr] sm:px-8 ${
                  i !== 0 ? 'border-t border-slate-100' : ''
                }`}
              >
                <dt className="text-sm font-semibold text-slate-500">{t(`info.${key}`)}</dt>
                <dd className="whitespace-pre-line text-sm text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-slate-500">{t('businessNote')}</p>
        </div>
      </section>
    </>
  );
}
