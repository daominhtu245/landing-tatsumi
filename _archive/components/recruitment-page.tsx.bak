import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ArrowRight, Briefcase, UserPlus, CheckCircle2 } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { PageHeader } from '@/components/common/page-header';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'recruitment' });
  return { title: t('title'), description: t('subtitle') };
}

export default function RecruitmentPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <RecruitmentContent />;
}

function RecruitmentContent() {
  const t = useTranslations('recruitment');
  const steps = (['step1', 'step2', 'step3', 'step4'] as const);

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Two-target hero cards */}
      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-white to-primary-50 p-8 lg:p-10">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Briefcase className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              {t('forCompanyTitle')}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-700">
              {t('forCompanyBody')}
            </p>
            <Link href="/contact" className="btn-primary mt-7 inline-flex">
              {t('forCompanyCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-accent-100 bg-gradient-to-br from-white to-accent-50 p-8 lg:p-10">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500 text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">
              {t('forCandidateTitle')}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-700">
              {t('forCandidateBody')}
            </p>
            <Link href="/contact" className="btn-accent mt-7 inline-flex">
              {t('forCandidateCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-12">
          <span className="heading-eyebrow">{t('processTitle')}</span>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((k, i) => (
              <div key={k} className="rounded-3xl border border-slate-100 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t(`process.${k}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t(`process.${k}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
