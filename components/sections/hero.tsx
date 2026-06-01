import { useTranslations } from 'next-intl';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/lib/navigation';

export function Hero() {
  const t = useTranslations('hero');
  const brand = useTranslations('brand');

  return (
    <section className="relative overflow-hidden">
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" aria-hidden />
      <div
        className="absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-primary-400/30 to-accent-400/30 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-32 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-accent-300/20 to-primary-300/20 blur-3xl"
        aria-hidden
      />

      {/* dragon-snake SVG motif */}
      <svg
        className="absolute right-0 top-1/2 -z-0 hidden h-[80%] -translate-y-1/2 text-primary-600/10 lg:block"
        viewBox="0 0 400 600"
        fill="none"
        aria-hidden
      >
        <path
          d="M 50 50 Q 150 100, 100 200 T 200 400 T 100 550"
          stroke="currentColor"
          strokeWidth="60"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="container-wide relative grid gap-12 py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-32">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent-500" />
            {t('eyebrow')}
          </span>
          <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[64px] lg:leading-[1.1]">
            {t('title1')}
            <br />
            <span className="bg-gradient-to-r from-primary-700 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              {t('title2')}
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-700 lg:text-lg">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary group">
              {t('ctaContact')}
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="/recruitment" className="btn-ghost">
              {t('ctaRecruit')}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-slate-500">
            <span>✓ OTIT 認可</span>
            <span>✓ 24/7 多言語サポート</span>
            <span>✓ 育成就労 対応</span>
          </div>
        </div>

        {/* Right visual — kanji block + decoration */}
        <div className="relative hidden lg:flex">
          <div className="relative ml-auto h-full w-full max-w-sm">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10" />
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white bg-white/60 p-8 shadow-2xl shadow-primary-900/10 backdrop-blur-xl">
              <div className="writing-vertical mx-auto text-[140px] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-b from-primary-700 to-accent-500 bg-clip-text text-transparent">
                  辰巳
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 border-t border-slate-200 pt-4">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-700">
                  Tatsumi
                </span>
                <span className="text-sm text-slate-600">
                  {brand('tagline')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
