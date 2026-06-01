import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import type { Post } from '@/content/posts';
import { formatDate, cn } from '@/lib/utils';

const categoryStyles: Record<string, string> = {
  info: 'bg-primary-50 text-primary-700 border-primary-100',
  blog: 'bg-accent-50 text-accent-700 border-accent-100',
  event: 'bg-emerald-50 text-emerald-700 border-emerald-100'
};

export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const locale = useLocale() as 'ja' | 'en';
  const t = useTranslations('news');

  return (
    <Link
      href={`/news/${post.slug}`}
      className={cn(
        'group block overflow-hidden rounded-3xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl',
        featured && 'md:flex md:gap-6'
      )}
    >
      <div className={cn('relative overflow-hidden bg-slate-100', featured ? 'md:w-2/5' : 'aspect-[16/10]')}>
        {/* Using img for simplicity vs next/image requiring config */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className={cn('flex flex-col gap-3 p-6', featured && 'md:flex-1 md:p-8')}>
        <div className="flex items-center gap-3 text-xs">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold uppercase tracking-wider',
              categoryStyles[post.category]
            )}
          >
            {t(`categories.${post.category}`)}
          </span>
          <span className="text-slate-500">{formatDate(post.date, locale)}</span>
        </div>
        <h3 className={cn('font-bold text-slate-900', featured ? 'text-2xl' : 'text-lg', 'line-clamp-2')}>
          {post.title[locale]}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
          {post.excerpt[locale]}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary-700">
          {t('readMore')}
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
