import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';
import { SystemDisclaimer } from '@/components/common/system-disclaimer';
import { TrendingUp, MessagesSquare, Users } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'ssw' });
  return { title: t('title'), description: t('subtitle') };
}

const timeline = [
  { year: '2024', ja: '関連法の成立', en: 'Related legislation enacted' },
  { year: '2026', ja: '関係省令・指針の整備', en: 'Ministerial ordinances and guidelines prepared' },
  { year: '2027', ja: '育成就労制度の施行（予定）', en: 'Ikusei-Shuro program takes effect (planned)' },
  { year: '施行後', ja: '技能実習制度からの移行', en: 'Transition from the Technical Intern Training program' }
];

export default function SswPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <SswContent locale={locale as 'ja' | 'en'} />;
}

function SswContent({ locale }: { locale: 'ja' | 'en' }) {
  const t = useTranslations('ssw');

  // Read the diff table as arrays via t.raw
  const diffHeader = (t.raw('diff.header') as string[]) ?? [];
  const diffRows = (t.raw('diff.rows') as string[][]) ?? [];

  // 「企業様のメリット」(chào bán dịch vụ) đã đổi thành 「制度のポイント」
  // — mô tả nội dung chế độ ở thể trung lập.
  const pointKeys = ['period', 'transfer', 'japanese'] as const;
  const PointIcons = { period: TrendingUp, transfer: Users, japanese: MessagesSquare } as const;

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

      {/* Comparison */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <span className="heading-eyebrow">{t('diffTitle')}</span>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-primary-50 to-accent-50">
                <tr>
                  {diffHeader.map((h, i) => (
                    <th key={i} className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-primary-800 sm:px-8">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 even:bg-slate-50/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-5 py-4 sm:px-8 ${j === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Points */}
      <section className="py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <span className="heading-eyebrow">{t('pointsTitle')}</span>
          <div className="grid gap-6 md:grid-cols-3">
            {pointKeys.map((k) => {
              const Icon = PointIcons[k];
              return (
                <div key={k} className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-primary-50/50 p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-slate-900">
                    {t(`points.${k}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {t(`points.${k}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-tight space-y-10">
          <div className="space-y-3">
            <span className="heading-eyebrow">{t('scheduleTitle')}</span>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">
              {t('scheduleNote')}
            </p>
          </div>
          <ol className="relative space-y-6 border-l-2 border-primary-200 pl-6">
            {timeline.map((step) => (
              <li key={step.year} className="relative">
                <span className="absolute -left-[34px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 ring-4 ring-slate-50" />
                <div className="text-sm font-bold text-primary-700">{step.year}</div>
                <div className="text-base text-slate-800">{step[locale]}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SystemDisclaimer namespace="ssw" />
    </>
  );
}
