import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // /recruitment đã được gỡ trong giai đoạn 許可申請中 (xem _archive/README.md).
  // Redirect tạm thời (308) để link cũ / cache của Google không dẫn tới 404.
  async redirects() {
    return [
      { source: '/:locale(ja|en)/recruitment', destination: '/:locale/contact', permanent: false },
      { source: '/recruitment', destination: '/ja/contact', permanent: false }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' }
    ]
  }
};

export default withNextIntl(nextConfig);
