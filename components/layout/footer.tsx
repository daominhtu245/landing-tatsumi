import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { Logo } from '@/components/common/logo';
import { Mail, MapPin, Phone, Clock, Instagram, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  const t = useTranslations();
  const year = 2026;

  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="container-wide grid gap-10 py-16 lg:grid-cols-4">
        <div className="lg:col-span-2 space-y-5">
          <Logo />
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            {t('brand.tagline')}。{t('hero.subtitle')}
          </p>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t('footer.sitemap')}
          </h3>
          <ul className="space-y-2 text-slate-700">
            <li><Link href="/about" className="hover:text-primary-700">{t('nav.aboutCoop')}</Link></li>
            <li><Link href="/system/ginou-jisshu" className="hover:text-primary-700">{t('nav.tit')}</Link></li>
            <li><Link href="/system/ikusei-shuro" className="hover:text-primary-700">{t('nav.ssw')}</Link></li>
            <li><Link href="/news" className="hover:text-primary-700">{t('nav.news')}</Link></li>
            <li><Link href="/recruitment" className="hover:text-primary-700">{t('nav.recruitment')}</Link></li>
            <li><Link href="/contact" className="hover:text-primary-700">{t('nav.contact')}</Link></li>
            <li><Link href="/privacy" className="hover:text-primary-700">{t('nav.privacy')}</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Contact
          </h3>
          <ul className="space-y-2.5 text-slate-700">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />{t('footer.address')}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-600" />{t('footer.tel')}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-600" />{t('footer.email')}</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary-600" />{t('footer.hours')}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-wide flex flex-col items-start justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© {year} たつみ協同組合 (Tatsumi Cooperative). {t('footer.rights')}</p>
          <Link href="/privacy" className="hover:text-primary-700">{t('nav.privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}
