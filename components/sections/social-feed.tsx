import { useTranslations } from 'next-intl';
import { Instagram, ExternalLink } from 'lucide-react';

/**
 * Section SNS — hiện đang TẮT qua FEATURES.socialFeed (lib/site-config.ts).
 *
 * Bản trước dùng 6 ảnh stock và link tới trang chủ Instagram (không phải
 * tài khoản thật) — đã gỡ vì ngụ ý hoạt động không có thật.
 * Bản gốc: _archive/components/social-feed.tsx.bak
 *
 * ĐỂ BẬT LẠI: điền SOCIAL vào bên dưới bằng tài khoản thật rồi đặt
 * FEATURES.socialFeed = true.
 */
const SOCIAL: { handle: string; profileUrl: string; tiles: string[] } | null = null;

export function SocialFeed() {
  const t = useTranslations('social');

  if (!SOCIAL) return null;

  return (
    <section className="py-24 lg:py-32">
      <div className="container-wide grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-16">
        <div className="space-y-5">
          <span className="heading-eyebrow">{t('eyebrow')}</span>
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('title')}</h2>
          <p className="text-base leading-relaxed text-slate-600">{t('subtitle')}</p>
          <a
            href={SOCIAL.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent group inline-flex"
          >
            <Instagram className="mr-2 h-4 w-4" />
            {t('follow')} {SOCIAL.handle}
            <ExternalLink className="ml-2 h-4 w-4 opacity-70 transition group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {SOCIAL.tiles.map((src, i) => (
            <a
              key={i}
              href={SOCIAL.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
