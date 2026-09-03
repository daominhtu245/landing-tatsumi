import { notFound } from 'next/navigation';
import { unstable_setRequestLocale, getTranslations } from 'next-intl/server';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Link } from '@/lib/navigation';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/content/posts';
import { PostCard } from '@/components/blog/post-card';
import { formatDate } from '@/lib/utils';
import { locales } from '@/i18n';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllPosts().map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  const post = getPostBySlug(slug);
  if (!post) return {};
  const loc = (locale === 'ja' ? 'ja' : 'en') as 'ja' | 'en';
  return {
    title: post.title[loc],
    description: post.excerpt[loc]
  };
}

export default function NewsDetailPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string };
}) {
  unstable_setRequestLocale(locale);
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <Article slug={slug} />;
}

function Article({ slug }: { slug: string }) {
  const locale = useLocale() as 'ja' | 'en';
  const post = getPostBySlug(slug)!;
  const related = getRelatedPosts(slug);
  const t = useTranslations('news');

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
        <div className="container-tight py-16 lg:py-20">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4" />
            News
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-white px-3 py-1 font-semibold uppercase tracking-wider text-primary-700 ring-1 ring-primary-100">
              {t(`categories.${post.category}`)}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.date, locale)}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {post.title[locale]}
          </h1>
        </div>
      </section>

      {/* Cover */}
      {post.cover && (
        <div className="container-tight -mt-10 mb-12">
          <div className="aspect-[16/8] overflow-hidden rounded-3xl shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      {/* Body */}
      <article className="container-tight pb-20 pt-12">
        <div className="prose-content mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-800">
          {post.body[locale].map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-20">
          <div className="container-wide space-y-10">
            <h2 className="text-2xl font-bold text-slate-900">{t('relatedTitle')}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
