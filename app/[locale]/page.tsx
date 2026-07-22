import { unstable_setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/hero';
import { AboutPreview } from '@/components/sections/about-preview';
import { UspGrid } from '@/components/sections/usp-grid';
import { FeaturedNews } from '@/components/sections/featured-news';
import { SocialFeed } from '@/components/sections/social-feed';
import { CtaBanner } from '@/components/sections/cta-banner';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AboutPreview />
      <UspGrid />
      <FeaturedNews />
      <SocialFeed />
      <CtaBanner />
    </>
  );
}
