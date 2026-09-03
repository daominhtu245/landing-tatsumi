/**
 * お知らせ（組合からの告知）
 *
 * ⚠️ QUY TẮC VIẾT BÀI — xem docs/content-guidelines.md
 *    Trong giai đoạn xin phép, CHỈ đăng sự việc có thật của tổ chức.
 *    KHÔNG đăng: thành tích tiếp nhận, case study khách hàng, hoạt động
 *    của thực tập sinh, hay bất cứ nội dung nào ngụ ý nghiệp vụ chưa
 *    được cấp phép đang hoạt động. Chi tiết: docs/content-guidelines.md
 *
 * 9 bài viết trước đây (chứa nội dung không có thật) được lưu tại
 * _archive/content/posts.pre-compliance.ts — chỉ dùng tham khảo văn phong,
 * KHÔNG khôi phục nguyên văn.
 */

export type PostCategory = 'info' | 'blog' | 'event';

export type Post = {
  slug: string;
  category: PostCategory;
  date: string; // ISO
  /** Ảnh bìa. Bỏ trống → hiển thị nền chuyển sắc thay cho ảnh stock. */
  cover?: string;
  title: { ja: string; en: string };
  excerpt: { ja: string; en: string };
  body: { ja: string[]; en: string[] }; // paragraphs
};

export const posts: Post[] = [
  {
    slug: 'website-launch',
    category: 'info',
    date: '2026-09-04',
    title: {
      ja: '【お知らせ】たつみ協同組合の公式ホームページを開設いたしました',
      en: 'Notice: The official website of Tatsumi Cooperative is now open'
    },
    excerpt: {
      ja: '当組合の概要、事業内容、および外国人材に関する各制度の一般的な情報をご覧いただけます。',
      en: 'You can now find our organizational profile, current activities, and general information on Japan\'s foreign-workforce programs.'
    },
    body: {
      ja: [
        'このたび、たつみ協同組合の公式ホームページを開設いたしました。',
        '本サイトでは、当組合の概要および現在行っている事業についてご案内するとともに、技能実習制度・育成就労制度・特定技能について、一般的な情報を掲載しております。',
        'なお、これらの制度に係る監理支援事業につきましては、現在、関係機関へ許可申請の手続きを進めている段階です。当該事業は許可を受けた後に開始する予定であり、現時点では監理支援事業を行っておりません。',
        '今後、掲載内容を順次充実させてまいります。ご不明な点がございましたら、お問い合わせフォームまたはお電話にてご連絡ください。'
      ],
      en: [
        'The official website of Tatsumi Cooperative is now available.',
        'This site introduces our organizational profile and the activities we currently carry out, together with general information on the Technical Intern Training program, the Ikusei-Shuro program, and the Specified Skilled Worker status.',
        'Regarding the supervising and support business related to these programs, we are currently in the process of applying for authorization from the relevant authorities. That business is scheduled to begin only after authorization is granted; at present we do not conduct it.',
        'We will continue to expand the content of this site. For any questions, please contact us via the inquiry form or by telephone.'
      ]
    }
  }
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === current.category ? 0 : 1;
      const bSame = b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}

/** Các category thực sự đang có bài — dùng để dựng bộ lọc ở /news */
export function getUsedCategories(): PostCategory[] {
  const order: PostCategory[] = ['info', 'blog', 'event'];
  return order.filter((c) => posts.some((p) => p.category === c));
}
