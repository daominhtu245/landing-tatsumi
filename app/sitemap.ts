import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { getAllPosts } from '@/content/posts';

const BASE = 'https://tatsumi-coop.example.jp';

const routes = [
  '',
  '/about',
  '/system/ginou-jisshu',
  '/system/ikusei-shuro',
  '/news',
  '/recruitment',
  '/contact',
  '/privacy'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = '2026-06-01';

  const staticEntries = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${BASE}/${locale}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.7
    }))
  );

  const postEntries = locales.flatMap((locale) =>
    getAllPosts().map((post) => ({
      url: `${BASE}/${locale}/news/${post.slug}`,
      lastModified: post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    }))
  );

  return [...staticEntries, ...postEntries];
}
