import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { BadgeCheck, Award } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { SystemDisclaimer } from '@/components/common/system-disclaimer';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'ssk' });
  return { title: t('title'), description: t('subtitle') };
}

export default function SskPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <SskContent />;
}

function SskContent() {
  const t = useTranslations('ssk');

  const diffHeader = (t.raw('diff.header') as string[]) ?? [];
  const diffRows = (t.raw('diff.rows') as string[][]) ?? [];

  const levels = [
    { key: 'n1', Icon: BadgeCheck },
    { key: 'n2', Icon: Award }
  ] as const;

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Overview */}
      <section className="py-20 lg:py-28">
        <div className="container-tight space-y-6">
          <span className="heading-eyebrow">{t('overviewTitle')}</span>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-700">{t('overviewBody')}</p>
        </div>
      </section>

      {/* 1号・2号 */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <span className="heading-eyebrow">{t('levelsTitle')}</span>
          <div className="grid gap-6 md:grid-cols-2">
            {levels.map(({ key, Icon }) => (
              <div
                key={key}
                className="rounded-3xl border border-slate-100 bg-white p-7 lg:p-8"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  {t(`levels.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {t(`levels.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 対象分野 */}
      <section className="py-20 lg:py-28">
        <div className="container-tight space-y-5">
          <span className="heading-eyebrow">{t('fieldsTitle')}</span>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">{t('fieldsBody')}</p>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-500">{t('fieldsNote')}</p>
        </div>
      </section>

      {/* So sánh 3 chế độ */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <span className="heading-eyebrow">{t('diffTitle')}</span>
          <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-gradient-to-r from-primary-50 to-accent-50">
                <tr>
                  {diffHeader.map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-primary-800 sm:px-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 even:bg-slate-50/50">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-5 py-4 sm:px-6 ${
                          j === 0 ? 'font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
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

      <SystemDisclaimer namespace="ssk" />
    </>
  );
}
