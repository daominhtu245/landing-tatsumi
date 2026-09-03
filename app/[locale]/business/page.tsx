import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ShoppingBasket, ArrowRight, Users, Info } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { PageHeader } from '@/components/common/page-header';
import { NoticeBanner } from '@/components/common/notice-banner';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'business' });
  return { title: t('title'), description: t('subtitle') };
}

export default function BusinessPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <BusinessContent />;
}

function BusinessContent() {
  const t = useTranslations('business');

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Giới thiệu */}
      <section className="py-20 lg:py-24">
        <div className="container-tight space-y-5">
          <span className="heading-eyebrow">{t('introTitle')}</span>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-700">{t('introBody')}</p>
        </div>
      </section>

      {/* 共同購買事業 — nghiệp vụ hiện tại được phép thực hiện */}
      <section className="bg-slate-50 py-20 lg:py-24">
        <div className="container-tight">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 lg:p-12">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-600/20">
              <ShoppingBasket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 lg:text-3xl">{t('purchaseTitle')}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700">
              {t('purchaseBody')}
            </p>
            {/* Chi tiết mặt hàng: chờ khách hàng cung cấp — hiển thị 準備中 thay vì bịa */}
            <p className="mt-6 flex items-start gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span>{t('purchasePreparing')}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 監理支援事業 — nêu rõ đang xin phép */}
      <section className="py-20 lg:py-24">
        <div className="container-tight space-y-6">
          <span className="heading-eyebrow">{t('licensingTitle')}</span>
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">
            {t('licensingBody')}
          </p>
          <NoticeBanner variant="block" withLink={false} className="max-w-3xl" />
          <Link href="/licensing" className="btn-primary inline-flex">
            {t('licensingCta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 加入について */}
      <section className="border-t border-slate-100 bg-slate-50 py-20 lg:py-24">
        <div className="container-tight">
          <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="space-y-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 lg:text-2xl">{t('joinTitle')}</h2>
              <p className="max-w-xl text-base leading-relaxed text-slate-700">{t('joinBody')}</p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0 self-start lg:self-center">
              {t('joinCta')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
