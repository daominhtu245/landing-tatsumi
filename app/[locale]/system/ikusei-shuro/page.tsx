import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';
import { TrendingUp, MessagesSquare, Users } from 'lucide-react';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'ssw' });
  return { title: t('title'), description: t('subtitle') };
}

const timeline = [
  { year: '2026', ja: '関係省令・指針の整備', en: 'Regulations and guidelines published' },
  { year: '2027 H1', ja: '育成就労制度 施行', en: 'Ikusei-Shuro program launches' },
  { year: '2027 H2', ja: '新規受入の本格開始', en: 'Full-scale new intake' },
  { year: '〜2030', ja: '技能実習からの完全移行完了', en: 'Full transition from Technical Intern Training' }
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

  const benefitKeys = ['long', 'skill', 'stable'] as const;
  const BenefitIcons = { long: TrendingUp, skill: MessagesSquare, stable: Users } as const;

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

      {/* Benefits */}
      <section className="py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <span className="heading-eyebrow">{t('benefitsTitle')}</span>
          <div className="grid gap-6 md:grid-cols-3">
            {benefitKeys.map((k) => {
              const Icon = BenefitIcons[k];
              return (
                <div key={k} className="rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-primary-50/50 p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-slate-900">
                    {t(`benefits.${k}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {t(`benefits.${k}.desc`)}
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
          <span className="heading-eyebrow">{t('scheduleTitle')}</span>
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
    </>
  );
}
