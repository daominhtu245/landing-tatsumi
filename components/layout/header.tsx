'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/navigation';
import { Logo } from '@/components/common/logo';
import { LanguageSwitcher } from './language-switcher';
import { cn } from '@/lib/utils';

type DropdownItem = { label: string; href: string };
type NavItem = { label: string; href?: string; items?: DropdownItem[] };

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMobile(false);
    setOpenDrop(null);
  }, [pathname]);

  const nav: NavItem[] = [
    { label: t('home'), href: '/' },
    {
      label: t('about'),
      items: [
        { label: t('aboutCoop'), href: '/about' },
        { label: t('access'), href: '/contact#access' }
      ]
    },
    {
      label: t('business'),
      items: [
        { label: t('businessTop'), href: '/business' },
        { label: t('licensing'), href: '/licensing' }
      ]
    },
    {
      label: t('systems'),
      items: [
        { label: t('tit'), href: '/system/ginou-jisshu' },
        { label: t('ssw'), href: '/system/ikusei-shuro' },
        { label: t('ssk'), href: '/system/tokutei-ginou' }
      ]
    },
    { label: t('news'), href: '/news' },
    { label: t('contact'), href: '/contact' }
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all',
        scrolled
          ? 'border-b border-slate-200/80 bg-white/85 backdrop-blur-md'
          : 'bg-white'
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.items ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDrop(item.label)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary-50 hover:text-primary-700"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openDrop === item.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="min-w-[200px] overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-900/5">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-primary-50 hover:text-primary-700"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 hover:bg-primary-50 hover:text-primary-700'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="hidden rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 lg:inline-flex"
          >
            {t('contact')}
          </Link>
          <button
            type="button"
            onClick={() => setOpenMobile((v) => !v)}
            className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden"
            aria-label="Toggle menu"
          >
            {openMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {openMobile && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-wide flex flex-col gap-1 py-4">
            {nav.map((item) =>
              item.items ? (
                <details key={item.label} className="group rounded-xl">
                  <summary className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 marker:hidden hover:bg-primary-50">
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <div className="flex flex-col pl-3">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-primary-50"
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/contact"
              className="mt-2 inline-flex justify-center rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
