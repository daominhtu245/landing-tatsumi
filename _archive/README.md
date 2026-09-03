# `_archive/` — Nội dung đã gỡ khỏi website

Thư mục này **không nằm trong build** (`tsconfig.json` → `exclude`) và không tạo
route nào. Mục đích: giữ lại nguyên trạng những gì đã gỡ, để khôi phục hoặc đối
chiếu khi cần.

**Lý do gỡ:** たつみ協同組合 đang trong giai đoạn 許可申請 của 監理支援事業.
Website không được chứa nội dung ngụ ý đã có giấy phép hoặc đang cung cấp dịch
vụ chưa được cấp phép. Chi tiết: `docs/feedback-analysis-and-plan.md`.

---

## Ba lớp backup

| Lớp | Ở đâu | Khôi phục |
|---|---|---|
| **0. Git** | tag `v1.0-pre-compliance`, branch `archive/pre-compliance-20260904` (đã push lên origin) | `git checkout v1.0-pre-compliance -- <file>` |
| **1. Thư mục này** | file `.bak` / `.pre-compliance.*` bên dưới | copy ngược về vị trí cũ |
| **2. Feature flag** | `lib/site-config.ts` → `FEATURES` | đổi `false` → `true` |

Khôi phục toàn bộ trạng thái cũ:

```bash
git checkout -b restore-pre-compliance archive/pre-compliance-20260904
```

---

## Phân loại A / B / C

| Loại | Nghĩa | Có khôi phục nguyên văn được không |
|---|---|:---:|
| **A** | Cấu trúc/tính năng đúng, chỉ chưa được phép hiển thị | ✅ Được |
| **B** | Nội dung **sai sự thật** | ❌ Không — chỉ dùng tham khảo, phải viết lại bằng dữ liệu thật |
| **C** | Rác kỹ thuật (link chết, domain giả, SĐT giả) | — Không cần |

---

## Bảng đối chiếu

### `content/posts.pre-compliance.ts` — 9 bài viết cũ

| Slug | Loại | Vấn đề |
|---|:---:|---|
| `new-license-renewal` | **B** | 「監理団体許可の更新が完了しました」— tự nhận **đã có giấy phép**. Mâu thuẫn trực tiếp với hồ sơ 許可申請中 |
| `manufacturing-case-study` | **B** | 導入事例 bịa: 「5年で実習生15名を受け入れた」 |
| `spring-orientation-2026` | **B** | Bịa sự kiện đã tổ chức có thực tập sinh tham dự |
| `open-house-may-2026` | **B** | Bịa sự kiện thường niên + 営業表現 |
| `vietnamese-trainees-onboarding` | **B** | 「たつみ協同組合がサポートする現場で」— bịa kinh nghiệm vận hành |
| `japanese-language-tips` | **B** | Ngụ ý đang phụ trách đào tạo thực tập sinh |
| `ikusei-shuro-2027-overview` | **B** | Nội dung chế độ thì được, nhưng ở dạng blog marketing |
| `golden-week-notice-2026` | **B** | Thông báo nghỉ lễ của năm cũ, chưa xác minh |
| — | | Thay bằng 1 thông báo có thật: `website-launch` |

> ⚠️ **`new-license-renewal` tuyệt đối không đăng lại.** Sau khi có giấy phép,
> viết bài mới với ngày cấp và số giấy phép thật.

### `messages/{ja,en}.pre-compliance.json` — bản message cũ

| Phần | Loại | Vấn đề |
|---|:---:|---|
| `hero.subtitle` | **B** | 「両制度に対応し…サポートをお約束します」 |
| `hero.eyebrow` | **B** | 「外国人材受入れの伴走者」 |
| `usp.items.experience` | **B** | 「幅広い職種での受入実績」 |
| `usp.items.support` | **B** | 「24時間多言語サポート / 365日」 |
| `usp.items.compliance` | **B** | 「外国人技能実習機構の監査に対応する透明な運営」 |
| `usp.items.ssw` | **B** | 「育成就労制度対応 / 長期キャリア設計を提案」 |
| `about.info.businessVal` | **B** | 事業内容 khai là 「技能実習生受入事業、育成就労支援事業」 |
| `ctaBanner` | **B** | 「外国人材の受入れ…プランをご提案」 |
| `recruitment.*` | **A** | Namespace của trang 採用情報 — khôi phục cùng trang, nhưng **phải viết lại nội dung** |
| `footer.tel` | **C** | `03-0000-0000` |

### `components/recruitment-page.tsx.bak` — trang `/recruitment`

- **Loại A** (cấu trúc) + nội dung bên trong là **loại B**
- Đã gỡ khỏi `app/[locale]/recruitment/`, có redirect 307 → `/contact` trong `next.config.mjs`
- Vấn đề: 「求職者の方へ…応募する」, các bước 面談・選考 → 教育・準備 → 入国・配属
  = đúng loại 「受入れを確約するような募集・営業表現」 mà khách hàng nói phải tránh

**Khôi phục sau khi có giấy phép:**
```bash
mkdir -p "app/[locale]/recruitment"
cp _archive/components/recruitment-page.tsx.bak "app/[locale]/recruitment/page.tsx"
# khôi phục namespace recruitment từ _archive/messages/*.pre-compliance.json
# VIẾT LẠI nội dung cho phù hợp phạm vi giấy phép được cấp
# đặt FEATURES.recruitment = true, gỡ redirect trong next.config.mjs,
# thêm lại vào header/footer/sitemap
```

### `components/social-feed.tsx.bak` — section SNS

- **Loại A**; file hiện tại `components/sections/social-feed.tsx` vẫn còn nhưng
  đã chuyển sang data-driven và `SOCIAL = null` nên không render gì
- Bản `.bak` chứa 6 ảnh Unsplash + link tới `https://instagram.com` (trang chủ
  Instagram, **không phải** tài khoản của tổ chức) → **loại C**, không dùng lại

**Bật lại khi có tài khoản SNS thật:** điền `SOCIAL` trong
`components/sections/social-feed.tsx` và `socialLinks` trong
`components/layout/footer.tsx`, rồi đặt `FEATURES.socialFeed` /
`FEATURES.socialLinks` = `true`.

---

## Đã xoá hẳn (loại C — không backup)

| Nội dung | Ở đâu trước đây |
|---|---|
| `TEL: 03-0000-0000` | `messages/*.json` |
| Domain `tatsumi-coop.example.jp` | `app/layout.tsx`, `app/[locale]/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` |
| `sameAs: ['https://instagram.com','https://facebook.com']` trong JSON-LD | `app/[locale]/layout.tsx` |
| 3 icon SNS trỏ link rỗng | `components/layout/footer.tsx` |
| Ảnh stock 大鳥居 ở mục 代表挨拶 | `app/[locale]/about/page.tsx` |
