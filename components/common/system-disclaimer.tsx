import { BookOpen, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FEATURES } from '@/lib/site-config';

/**
 * Chân trang cho 3 trang giải thích chế độ.
 *
 * Hai việc nó làm, đều cần cho hồ sơ 許可申請:
 *  1. Ghi nguồn → chứng minh đây là thông tin công khai được trích dẫn,
 *     không phải quảng cáo dịch vụ.
 *  2. Nói rõ trang này không có nghĩa tổ chức đang thực hiện 監理支援事業.
 *
 * `disclaimer` tự ẩn sau khi có giấy phép (FEATURES.showApplyingNotice).
 */
export function SystemDisclaimer({ namespace }: { namespace: 'tit' | 'ssw' | 'ssk' }) {
  const t = useTranslations(namespace);

  return (
    <section className="border-t border-slate-100 py-12">
      <div className="container-tight space-y-3 text-sm leading-relaxed text-slate-500">
        <p className="flex items-start gap-2">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <span>{t('sourceNote')}</span>
        </p>
        {FEATURES.showApplyingNotice && (
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <span>{t('disclaimer')}</span>
          </p>
        )}
      </div>
    </section>
  );
}
