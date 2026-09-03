import { Info, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import { FEATURES } from '@/lib/site-config';
import { cn } from '@/lib/utils';

/**
 * Thông báo 「監理支援事業は現在、許可申請中です」.
 *
 * Toàn bộ nội dung lấy từ key `notice.applying` và hiển thị theo
 * FEATURES.showApplyingNotice. Sau khi có 許可: đổi LICENSE_STATUS
 * trong lib/site-config.ts → banner tự ẩn ở mọi trang.
 *
 * variant 'bar'   : dải mảnh, dùng ngay dưới header ở trang chủ
 * variant 'block' : khối đầy đủ, dùng trong nội dung trang
 */
export function NoticeBanner({
  variant = 'block',
  withLink = true,
  className
}: {
  variant?: 'bar' | 'block';
  withLink?: boolean;
  className?: string;
}) {
  const t = useTranslations('notice');

  if (!FEATURES.showApplyingNotice) return null;

  if (variant === 'bar') {
    return (
      <div className={cn('border-b border-amber-200/70 bg-amber-50/80', className)}>
        <div className="container-wide flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm text-amber-900">
          <Info className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
          <span className="font-semibold">{t('applyingShort')}</span>
          {withLink && (
            <Link
              href="/licensing"
              className="inline-flex items-center gap-1 font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-900"
            >
              {t('detailLink')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6',
        className
      )}
    >
      <div className="flex gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-amber-900">{t('applying')}</p>
          {withLink && (
            <Link
              href="/licensing"
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber-800 underline underline-offset-4 hover:text-amber-900"
            >
              {t('detailLink')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
