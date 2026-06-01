import { useTranslations } from 'next-intl';
import { Instagram, ExternalLink } from 'lucide-react';

const tiles = [
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
];

export function SocialFeed() {
  const t = useTranslations('social');

  return (
    <section className="py-24 lg:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <span className="heading-eyebrow">{t('eyebrow')}</span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
          <p className="text-base leading-relaxed text-slate-600">{t('subtitle')}</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent group inline-flex"
          >
            <Instagram className="mr-2 h-4 w-4" />
            {t('follow')} @tatsumi.coop
            <ExternalLink className="ml-2 h-4 w-4 opacity-70 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {tiles.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-700/0 to-accent-500/0 opacity-0 transition group-hover:from-primary-700/40 group-hover:to-accent-500/40 group-hover:opacity-100">
                <Instagram className="h-7 w-7 text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
