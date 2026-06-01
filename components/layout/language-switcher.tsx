'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/lib/navigation';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();

  const target = locale === 'ja' ? 'en' : 'ja';

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: target })}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:border-primary-300 hover:text-primary-700"
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5" />
      {t('switchLang')}
    </button>
  );
}
