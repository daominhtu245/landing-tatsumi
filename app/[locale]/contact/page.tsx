import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { ContactForm } from '@/components/forms/contact-form';

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
  const tf = useTranslations('footer');

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
                  <span className="text-slate-700">{tf('address')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary-600" />
                  <span className="text-slate-700">{tf('tel')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary-600" />
                  <span className="text-slate-700">{tf('email')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-primary-600" />
                  <span className="text-slate-700">{tf('hours')}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Access map */}
      <section id="access" className="border-t border-slate-100 bg-slate-50 py-20 lg:py-28">
        <div className="container-wide space-y-10">
          <div>
            <span className="heading-eyebrow">{t('accessTitle')}</span>
            <p className="mt-3 max-w-2xl text-base text-slate-700">{t('accessBody')}</p>
          </div>
          <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-slate-100 bg-white">
            <iframe
              title="Access map"
              src="https://www.google.com/maps?q=Tokyo+Station&output=embed"
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
