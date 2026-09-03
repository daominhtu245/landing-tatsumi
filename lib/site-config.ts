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
 * Thông tin CHƯA được KH xác nhận → hiển thị 「準備中」 thay vì bịa.
 * Điền giá trị thật vào đây khi KH cung cấp.
 */
export const ORG_PROFILE = {
  established: null as string | null,      // 設立年月日
  capital: null as string | null,          // 出資金
  memberCount: null as string | null,      // 組合員数
  representative: null as string | null,   // 代表理事
  businessArea: null as string | null,     // 事業区域
  businessHours: null as string | null,    // 営業時間
  fax: null as string | null,
} as const;
