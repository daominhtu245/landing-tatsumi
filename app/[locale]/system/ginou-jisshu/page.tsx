import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';
import { SystemDisclaimer } from '@/components/common/system-disclaimer';
import {
  Wrench, Tractor, ChefHat, Hammer, Factory, Stethoscope, Truck, Building2,
  ChevronRight
} from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'tit' });
  return { title: t('title'), description: t('subtitle') };
}

const industries = [
  { key: 'manufacturing', Icon: Factory, ja: '製造業', en: 'Manufacturing' },
  { key: 'construction', Icon: Hammer, ja: '建設業', en: 'Construction' },
  { key: 'agriculture', Icon: Tractor, ja: '農業', en: 'Agriculture' },
  { key: 'food', Icon: ChefHat, ja: '食品加工', en: 'Food processing' },
  { key: 'machine', Icon: Wrench, ja: '機械・金属', en: 'Machinery & metals' },
  { key: 'care', Icon: Stethoscope, ja: '介護', en: 'Care services' },
  { key: 'logistics', Icon: Truck, ja: '物流', en: 'Logistics' },
  { key: 'building', Icon: Building2, ja: 'ビル管理', en: 'Building maintenance' }
];

/**
 * Trình tự chung do CHẾ ĐỘ quy định — không phải quy trình dịch vụ của tổ chức.
 * Cách diễn đạt cố ý giữ ở thể trung lập (không dùng 「当組合が〜します」).
 */
const flow = [
  { ja: '制度上の要件の確認', en: 'Checking the requirements set by the program' },
  { ja: '送出国での候補者の選抜', en: 'Selection of candidates in the sending country' },
  { ja: '入国前の講習・日本語学習', en: 'Pre-entry training and Japanese-language study' },
  { ja: '入国後の講習', en: 'Post-entry training' },
  { ja: '実習実施者のもとでの技能実習', en: 'Technical intern training at the implementing organization' }
];

export default function TitPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <TitContent />;
}

function TitContent() {
  const t = useTranslations('tit');
  const locale = useLocale() as 'ja' | 'en';

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Overview */}
      <section className="py-20 lg:py-28">
        <div className="container-tight space-y-6">
          <span className="heading-eyebrow">{t('overviewTitle')}</span>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-700">
            {t('overviewBody')}
          </p>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-12">
          <div className="space-y-3">
            <span className="heading-eyebrow">{t('industriesTitle')}</span>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              {t('industriesNote')}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {industries.map(({ key, Icon, ja, en }) => (
              <div key={key} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-primary-200 hover:shadow-md">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {locale === 'ja' ? ja : en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow */}
      <section className="py-20 lg:py-28">
        <div className="container-wide space-y-12">
          <div className="space-y-3">
            <span className="heading-eyebrow">{t('flowTitle')}</span>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">{t('flowNote')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {flow.map((step, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {step[locale]}
                  </p>
                </div>
                {i < flow.length - 1 && (
                  <ChevronRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-tight space-y-10">
          <span className="heading-eyebrow">{t('faqTitle')}</span>
          <div className="space-y-3">
            {([1, 2, 3, 4] as const).map((i) => (
              <details
                key={i}
                className="group rounded-2xl border border-slate-100 bg-white p-5 transition open:border-primary-200 open:shadow-sm"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-semibold text-slate-900 marker:hidden">
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700">
                      Q
                    </span>
                    {t(`faq.q${i}`)}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-open:rotate-90" />
                </summary>
                <p className="mt-4 flex gap-3 pl-9 text-sm leading-relaxed text-slate-700">
                  <span>{t(`faq.a${i}`)}</span>
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SystemDisclaimer namespace="tit" />
    </>
  );
}
