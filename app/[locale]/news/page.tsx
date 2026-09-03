'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/common/page-header';
import { PostCard } from '@/components/blog/post-card';
import { getAllPosts, getUsedCategories, type PostCategory } from '@/content/posts';
import { cn } from '@/lib/utils';

type Filter = 'all' | PostCategory;

export default function NewsPage() {
  const t = useTranslations('newsPage');
  const tn = useTranslations('news');
  const [filter, setFilter] = useState<Filter>('all');

  const posts = useMemo(() => {
    const all = getAllPosts();
    return filter === 'all' ? all : all.filter((p) => p.category === filter);
  }, [filter]);

  // Chỉ hiện bộ lọc cho category thực sự có bài — tránh tab rỗng
  // khi 9 bài viết cũ đã được gỡ.
  const used = getUsedCategories();
  const filters: Filter[] = used.length > 1 ? ['all', ...used] : [];

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="py-16 lg:py-20">
        <div className="container-wide space-y-10">
          {filters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition',
                  filter === f
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:text-primary-700'
                )}
              >
                {tn(`categories.${f}`)}
              </button>
            ))}
          </div>
          )}

          {posts.length === 0 ? (
            <p className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center text-slate-500">
              {t('empty')}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
