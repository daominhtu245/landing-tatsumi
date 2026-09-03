import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { ContactForm } from '@/components/forms/contact-form';
import { SITE, ORG_PROFILE } from '@/lib/site-config';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title'), description: t('subtitle') };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations('contact');
  const tc = useTranslations('common');
  const tf = useTranslations('footer');
  const locale = useLocale() as 'ja' | 'en';

  const address = locale === 'ja' ? `〒${SITE.postalCode} ${SITE.address}` : SITE.addressEn;

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="py-20 lg:py-28">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">{t('formTitle')}</h2>
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-7">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-primary-700">
                {t('infoTitle')}
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                  <span className="text-slate-700">{address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary-600" />
                  <a href={SITE.telHref} className="font-semibold text-slate-800 hover:text-primary-700">
                    {SITE.tel}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary-600" />
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-slate-800 hover:text-primary-700">
                    {SITE.email}
                  </a>
                </li>
                {ORG_PROFILE.businessHours && (
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-primary-600" />
                    <span className="text-slate-700">
                      {tf('labels.hours')}: {ORG_PROFILE.businessHours}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Access map */}
      <section id="access" className="border-t border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <div className="space-y-3">
            <span className="heading-eyebrow">{t('accessTitle')}</span>
            <p className="max-w-2xl text-base text-slate-700">{t('accessBody')}</p>
            <a
              href={SITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              {tc('openInMaps')}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-slate-100 bg-white">
            <iframe
              title="Access map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapEmbedQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}
