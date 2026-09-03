import { useTranslations } from 'next-intl';
import { ArrowUpRight, Building2, ShoppingBasket, FileCheck2 } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SectionHeading } from '@/components/common/section-heading';

const items = [
  { key: 'coop', icon: Building2, href: '/about', color: 'from-primary-500 to-primary-700' },
  { key: 'business', icon: ShoppingBasket, href: '/business', color: 'from-primary-400 to-accent-500' },
  { key: 'licensing', icon: FileCheck2, href: '/licensing', color: 'from-accent-400 to-accent-600' }
] as const;

export function AboutPreview() {
  const t = useTranslations('aboutPreview');

  return (
    <section className="py-24 lg:py-32">
      <div className="container-wide space-y-12">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ key, icon: Icon, href, color }) => (
            <Link
              key={key}
              href={href}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-2xl hover:shadow-primary-900/5"
            >
              <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-primary-600/20`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                {t(`items.${key}.desc`)}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                {t('more')}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 opacity-0 blur-2xl transition group-hover:opacity-70" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
