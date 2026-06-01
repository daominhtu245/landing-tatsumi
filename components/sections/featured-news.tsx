import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { SectionHeading } from '@/components/common/section-heading';
import { PostCard } from '@/components/blog/post-card';
import { getAllPosts } from '@/content/posts';

export function FeaturedNews() {
  const t = useTranslations('news');
  const posts = getAllPosts().slice(0, 3);

  return (
    <section className="bg-slate-50 py-24 lg:py-32">
      <div className="container-wide space-y-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
          <Link href="/news" className="link-underline">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
