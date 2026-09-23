/**
 * Nguồn sự thật duy nhất cho trạng thái giấy phép và thông tin tổ chức.
 *
 * ⚠️ SAU KHI NHẬN ĐƯỢC 許可:
 *    1. Đổi LICENSE_STATUS: 'applying' → 'approved'
 *    2. Làm theo docs/after-approval-checklist.md
 *    Không cần sửa chỗ nào khác cho phần "申請中".
 */

export type LicenseStatus = 'applying' | 'approved';

/** 監理支援事業の許可の状況 */
export const LICENSE_STATUS = 'applying' as LicenseStatus;

export const isApplying: boolean = LICENSE_STATUS === 'applying';
export const isApproved: boolean = LICENSE_STATUS === 'approved';

/**
 * Feature flags.
 * Loại A trong docs/feedback-analysis-and-plan.md §5.4 — code vẫn còn,
 * chỉ tắt hiển thị. Bật lại = đổi giá trị ở đây.
 */
export const FEATURES = {
  /** Banner 「監理支援事業は現在、許可申請中です」 */
  showApplyingNotice: isApplying,
  /** Trang 採用情報 — bản gốc ở _archive/components/recruitment-page.tsx.bak */
  recruitment: isApproved,
  /** Section SNS ở trang chủ — bật khi tổ chức có tài khoản SNS thật */
  socialFeed: false,
  /** Icon SNS ở footer — bật cùng lúc với socialFeed */
  socialLinks: false,
  /** Mục lọc blog ở /news — bật khi có bài viết thật */
  blog: false,
  /** 3 tài liệu bắt buộc công khai — CHỈ được công khai sau khi có phép (xem trang /licensing) */
  publicDocuments: isApproved,
} as const;

/** Thông tin tổ chức — đã được KH xác nhận 2026-09-03 */
export const SITE = {
  domain: 'https://ta23.net',
  tel: '082-909-4208',
  telHref: 'tel:0829094208',
  email: 'info@ta23.net',
  postalCode: '733-0033',
  address: '広島県広島市西区観音本町2丁目1-50',
  addressEn: '2-1-50 Kannon-honmachi, Nishi-ku, Hiroshima-shi, Hiroshima 733-0033, Japan',
  mapUrl: 'https://maps.app.goo.gl/GRo15HJscsg513sL7',
  mapEmbedQuery: '広島県広島市西区観音本町2丁目1-50',
} as const;

/**
 * Thông tin tổ chức lấy từ giấy tờ gốc (thư mục `23-09/`):
 *   - 履歴事項全部証明書 (広島法務局, 令和8年7月28日)
 *   - 定款 (11 trang, 60 điều)
 * Xem `docs/feedback-23-09-analysis.md` §I-B.
 *
 *   string / {ja,en} → hiển thị giá trị
 *   null             → hiển thị 「準備中」
 *   false            → KH quyết định không công khai → ẩn hẳn dòng đó
 */
export type ProfileValue = string | { ja: string; en: string } | null | false;

/** Lấy chuỗi hiển thị theo ngôn ngữ. `null` = không hiển thị giá trị nào. */
export function profileText(v: ProfileValue, locale: 'ja' | 'en'): string | null {
  if (v === null || v === false) return null;
  return typeof v === 'string' ? v : v[locale];
}

export const ORG_PROFILE = {
  /** 登記: 法人成立の年月日 */
  established: { ja: '令和8年5月28日', en: 'May 28, 2026' } as ProfileValue,
  /** 登記: 払込済出資総額（出資1口 1万円 × 600口） */
  capital: { ja: '600万円', en: 'JPY 6,000,000' } as ProfileValue,
  /** KH 23-09: không công khai (số thay đổi theo thời gian) */
  memberCount: false as ProfileValue,
  /** 登記: 役員に関する事項 — địa chỉ nhà riêng trong 登記 KHÔNG được đăng */
  representative: '永井　伸枝' as ProfileValue,
  /**
   * ⏸️ ẨN DÒNG cho đến khi KH chốt — 申請書 ghi 「広島県の区域」 nhưng 登記/定款
   * điều 3 ghi 「広島県呉市及び安芸郡熊野町の区域」.
   * Xem docs/feedback-23-09-analysis.md §2.6. Điền giá trị thật là dòng hiện lại.
   */
  businessArea: false as ProfileValue,
  /** KH 23-09: 平日 9時〜18時 */
  businessHours: { ja: '平日 9:00〜18:00', en: 'Weekdays 9:00–18:00' } as ProfileValue,
  /** KH 23-09: chưa có FAX */
  fax: false as ProfileValue,
} as const;
