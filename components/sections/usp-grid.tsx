import { useTranslations } from 'next-intl';
import { Headphones, Briefcase, ShieldCheck, Rocket } from 'lucide-react';
import { SectionHeading } from '@/components/common/section-heading';

const items = [
  { key: 'support', Icon: Headphones },
  { key: 'experience', Icon: Briefcase },
  { key: 'compliance', Icon: ShieldCheck },
  { key: 'ssw', Icon: Rocket }
] as const;

export function UspGrid() {
  const t = useTranslations('usp');

  return (
    <section className="py-24 lg:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} />
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map(({ key, Icon }) => (
            <div key={key} className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 transition hover:border-primary-200 hover:shadow-lg">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-slate-900">
                {t(`items.${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {t(`items.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
