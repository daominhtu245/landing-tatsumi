import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { FileLock2, CircleDot, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { PageHeader } from '@/components/common/page-header';
import { FEATURES } from '@/lib/site-config';

/**
 * TRANG CỐT LÕI cho hồ sơ 許可申請.
 *
 * Đoạn `statementBody1/2` là văn bản do khách hàng chỉ định — KHÔNG sửa chữ.
 * Sau khi có 許可: đổi LICENSE_STATUS trong lib/site-config.ts, rồi làm theo
 * docs/after-approval-checklist.md (thay phần 「申請中」 và công khai 3 tài liệu).
 */

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'licensing' });
  return { title: t('title'), description: t('subtitle') };
}

export default function LicensingPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <LicensingContent />;
}

function LicensingContent() {
  const t = useTranslations('licensing');
  const tn = useTranslations('nav');

  const statusRows = [
    { label: t('status.stateLabel'), value: t('status.stateVal') },
    { label: t('status.startLabel'), value: t('status.startVal') },
    { label: t('status.nowLabel'), value: t('status.nowVal') }
  ];

  const systemLinks = [
    { label: tn('tit'), href: '/system/ginou-jisshu' },
    { label: tn('ssw'), href: '/system/ikusei-shuro' },
    { label: tn('ssk'), href: '/system/tokutei-ginou' }
  ] as const;

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      {/* Tuyên bố chính thức — nguyên văn theo chỉ định của khách hàng */}
      <section className="py-20 lg:py-24">
        <div className="container-tight">
          <div className="rounded-3xl border-2 border-primary-100 bg-gradient-to-br from-primary-50/60 to-white p-8 lg:p-12">
            <h2 className="text-xl font-bold leading-relaxed text-slate-900 lg:text-2xl">
              {t('statementTitle')}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-loose text-slate-800 lg:text-lg">
              <p>{t('statementBody1')}</p>
              <p>{t('statementBody2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bảng trạng thái */}
      <section className="pb-20 lg:pb-24">
        <div className="container-tight space-y-8">
          <span className="heading-eyebrow">{t('statusTitle')}</span>
          <dl className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {statusRows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[110px_1fr] gap-4 px-5 py-5 sm:grid-cols-[200px_1fr] sm:px-8 ${
                  i !== 0 ? 'border-t border-slate-100' : ''
                }`}
              >
                <dt className="text-sm font-semibold text-slate-500">{row.label}</dt>
                <dd className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                  <span>{row.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tài liệu sẽ công khai sau khi có giấy phép */}
      {!FEATURES.publicDocuments && (
        <section className="border-t border-slate-100 bg-slate-50 py-20 lg:py-24">
          <div className="container-tight space-y-8">
            <span className="heading-eyebrow">{t('futureDocsTitle')}</span>
            <ul className="space-y-3">
              {(['doc1', 'doc2', 'doc3'] as const).map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-sm text-slate-600"
                >
                  <FileLock2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span>{t(`futureDocs.${k}`)}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-slate-500">{t('futureDocsNote')}</p>
          </div>
        </section>
      )}

      {/* Điều hướng sang các trang giải thích chế độ */}
      <section className="py-20 lg:py-24">
        <div className="container-tight space-y-8">
          <div className="space-y-3">
            <span className="heading-eyebrow">{t('systemsTitle')}</span>
            <p className="max-w-2xl text-base text-slate-700">{t('systemsBody')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {systemLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-5 transition hover:border-primary-200 hover:shadow-md"
              >
                <span className="text-sm font-semibold text-slate-800">{label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary-600 transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
