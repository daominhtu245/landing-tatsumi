import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';

export function CtaBanner() {
  const t = useTranslations('ctaBanner');

  return (
    <section className="relative overflow-hidden py-20 lg:py-24">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 p-10 lg:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 left-16 h-72 w-72 rounded-full bg-accent-300/30 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                {t('title')}
              </h2>
              <p className="max-w-xl text-base text-primary-50/90">{t('subtitle')}</p>
            </div>
            <div className="lg:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary-800 shadow-xl shadow-primary-900/20 transition hover:bg-primary-50"
              >
                {t('button')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
