# Phân tích Feedback KH & Plan triển khai chi tiết (v2)

| | |
|---|---|
| Nguồn | `feedback.md` (tin nhắn KH, tiếng Nhật) + audit toàn bộ codebase |
| Ngày | 2026-09-03 |
| Trạng thái | **CHỜ CONFIRM — chưa chỉnh sửa 1 dòng code nào** |
| Base commit | `bf84715` (master) |
| Phạm vi audit | 12 route, 14 component, 2 file message, 9 bài viết, config SEO |

---

# PHẦN I — PHÂN TÍCH YÊU CẦU KHÁCH HÀNG

## 1.1 Bối cảnh nghiệp vụ

たつみ協同組合 đang ở **giữa 2 quy trình xin phép**:

```
┌─ 技能実習 (Technical Intern Training) ──────────────┐
│  外国人技能実習機構 (OTIT) ← ĐÃ NỘP 事業申請        │  → chờ kết quả
└─────────────────────────────────────────────────────┘
┌─ 育成就労 (Ikusei-Shuro, hiệu lực 2027) ────────────┐
│  監理支援事業の許可申請 ← ĐANG SOẠN HỒ SƠ           │  → website là ĐIỀU KIỆN BẮT BUỘC
└─────────────────────────────────────────────────────┘
```

→ **Website không phải là công cụ marketing. Nó là một hạng mục trong bộ hồ sơ xin phép.**

Đây là điểm mấu chốt quyết định toàn bộ hướng thiết kế: đối tượng đọc website #1 là **cán bộ thẩm định hồ sơ**, không phải doanh nghiệp tiếp nhận hay thực tập sinh.

## 1.2 Bóc tách 5 yêu cầu ngầm của KH

| # | KH nói | Ý thực sự | Hệ quả cho code |
|---|---|---|---|
| Y1 | 「かんたんなHPでいいので」 | Ngân sách chưa có (chờ 補助金). Không muốn đầu tư lớn lúc này | **Không rebuild.** Tận dụng hạ tầng đã có, chỉ thay nội dung. Ưu tiên "bớt" hơn "thêm" |
| Y2 | 「実習生事業をしているというHPにはできません」 | Sợ website **phản chứng** hồ sơ → bị bác đơn | Đây là **yêu cầu số 1**. Mọi câu chữ ngụ ý "đang hoạt động" đều phải gỡ |
| Y3 | 「たつみ協同組合の公式HPを作り、その中に許可申請中の監理支援機関のページを置く」 | Định vị lại site: từ *website công ty phái cử* → *website chính thức của hợp tác xã* | Đổi kiến trúc thông tin (IA), không chỉ đổi chữ |
| Y4 | 「許可後に『申請中』を削除し、3規程を追加公開すればいい」 | Muốn **chuyển đổi rẻ** sau khi có phép | Phải thiết kế cơ chế bật/tắt tập trung, không rải chữ "申請中" khắp nơi |
| Y5 | 「電話番号とメールアドレスが決まりました」 | Thông tin liên hệ giờ mới có thật → trước đó là giả | Xác nhận: mọi thông tin khác trên site cũng cần soát lại tính xác thực |

## 1.3 Ranh giới pháp lý (KH đã tự xác minh)

### ✅ ĐƯỢC đăng khi chưa có phép
1. 組合の基本情報
2. 組合の理念・目的
3. **現在行える事業** (共同購買 v.v.)
4. 組合へのお問い合わせ
5. 技能実習・育成就労・特定技能 — **giải thích mang tính phổ quát**
6. 「監理支援事業は現在、許可申請中です」

### ❌ CẤM khi chưa có phép
| Cấm | Lý do |
|---|---|
| 「当組合は監理支援機関です」 | Mạo nhận tư cách pháp lý |
| 「育成就労外国人を受け入れます」 | Cam kết dịch vụ chưa được phép |
| 「許可取得済み」 | Sai sự thật |
| 募集・営業表現 mang tính cam kết tiếp nhận | Chào bán dịch vụ chưa được phép |
| Công khai 業務運営規程 / 監理支援費表 | Quy định rõ: chỉ **sau khi có phép** |

### 📌 Câu chữ KH chỉ định dùng nguyên văn
```
技能実習生・育成就労制度・特定技能への取組みについて

当組合では、技能実習生・育成就労制度・特定技能における監理支援事業の
実施に向け、現在、許可申請手続きを進めています。
なお、当該事業は関係機関の許可を受けた後に開始する予定であり、
現時点では監理支援事業を行っておりません。
```

### 📌 Thông tin liên hệ chốt
```
〒733-0033  広島県広島市西区観音本町2丁目1-50
TEL   082-909-4208
MAIL  info@ta23.net
MAP   https://maps.app.goo.gl/GRo15HJscsg513sL7
```
※ Lưu ý: site hiện dùng `観音本町２丁目` (số full-width). KH viết `2丁目` (half-width). Thống nhất theo KH.

---

# PHẦN II — ĐÁNH GIÁ PROJECT HIỆN TẠI

## 2.1 Hạ tầng kỹ thuật — ĐÁNH GIÁ: TỐT, GIỮ NGUYÊN

| Hạng mục | Hiện trạng | Đánh giá |
|---|---|---|
| Framework | Next.js 14.2 App Router, TypeScript strict | ✅ Phù hợp, hiện đại, static export được |
| i18n | next-intl, ja/en, `localePrefix: 'always'` | ✅ Sạch, message tách khỏi component |
| Design system | Tailwind + CSS variables + component class (`btn-primary`, `container-wide`, `heading-eyebrow`) | ✅ Nhất quán, chất lượng cao — **tài sản đáng giữ** |
| Component | 14 component tách bạch, hầu hết là Server Component | ✅ Sửa nội dung không đụng logic |
| Kiến trúc nội dung | Text nằm trong `messages/*.json`, không hardcode | ✅ **Điểm quyết định**: sửa được ~70% rủi ro chỉ bằng sửa JSON |
| SEO | metadata, sitemap, robots, JSON-LD đầy đủ | ⚠️ Có nhưng đang dùng domain giả |

**Kết luận:** Codebase chất lượng tốt. Vấn đề **100% nằm ở nội dung**, không nằm ở kỹ thuật.

## 2.2 Độ lệch giữa project và mong muốn KH

```
Project hiện tại        →  「監理団体として実績豊富な会社」のマーケサイト
KH cần                  →  「協同組合の公式サイト（監理支援事業は申請中）」
```

Đây là **lệch định vị**, không phải lệch tính năng.

### Đánh giá 2 hướng xử lý

| | **Hướng A — Tái sử dụng, gỡ bỏ nội dung sai** | **Hướng B — Làm mới site tĩnh đơn giản** |
|---|---|---|
| Công sức | ~10–12h | ~20h+ |
| Rủi ro sót từ ngữ cấm | Trung bình → **hạ thấp bằng script kiểm tra tự động** | Thấp |
| Khớp với Y1 (ngân sách thấp) | ✅ | ❌ |
| Khớp với Y4 (chuyển đổi sau khi có phép) | ✅ giữ nguyên hạ tầng, chỉ bật lại | ❌ phải làm lại lần 2 |
| Giữ được design system | ✅ | ❌ vứt bỏ tài sản đã có |
| **Khuyến nghị** | ⭐ **CHỌN HƯỚNG A** | |

**Lý do chọn A:** KH nói "HP đơn giản là được" — nhưng "đơn giản" ở đây nghĩa là **ít nội dung, không khoa trương**, chứ không phải "code đơn giản". Việc *bớt nội dung* trên hạ tầng đã có vừa rẻ hơn, vừa cho ra đúng thứ KH cần, vừa giữ nguyên đường quay lại sau khi có 補助金 + 許可.

---

# PHẦN III — AUDIT CHI TIẾT: 24 ĐIỂM CẦN XỬ LÝ

Ký hiệu mức độ: 🔴 Chặn hồ sơ · 🟠 Rủi ro cao · 🟡 Cần sửa · 🔵 Cải thiện

## 3.1 🔴 NHÓM CHẶN HỒ SƠ — mâu thuẫn trực tiếp với đơn xin phép

| ID | File:vị trí | Nội dung | Vì sao chặn |
|---|---|---|---|
| **R1** | `content/posts.ts:199-222` | Bài 「**【お知らせ】監理団体許可の更新が完了しました**」 + 「2026年1月、外国人技能実習機構より監理団体許可の**更新を受けました**」 | **Tự nhận ĐÃ CÓ GIẤY PHÉP.** Đây là mâu thuẫn trực tiếp và tuyệt đối với hồ sơ 許可申請中. Nếu cán bộ thẩm định đọc được → hồ sơ có nguy cơ bị bác |
| **R2** | `content/posts.ts:119-143` | 【導入事例】愛知県・自動車部品メーカー様の成功例 —「**5年で実習生15名を受け入れた**製造業現場」 | Bịa 受入実績 5 năm 15 người |
| **R3** | `content/posts.ts:69-93` | 春の合同オリエンテーション開催レポート —「受入企業様と**新人実習生をお招きし**」 | Bịa sự kiện đã tổ chức có thực tập sinh |
| **R4** | `content/posts.ts:173-197` | 【5月開催】オープンハウスのご案内 —「**実習生の現場を見学いただける**、年に一度の」 | Bịa hoạt động thường niên + 営業表現 |
| **R5** | `messages/*.json` → `usp.items.experience` | 「豊富な現場経験 / 幅広い職種での**受入実績**」 | Bịa thành tích tiếp nhận |
| **R6** | `messages/*.json` → `usp.items.compliance` | 「**外国人技能実習機構の監査に対応する**透明な運営」 | Ngụ ý đang là đối tượng giám sát của OTIT = đã có phép |

## 3.2 🟠 NHÓM CAM KẾT DỊCH VỤ / 募集表現

| ID | File:vị trí | Nội dung | Vấn đề |
|---|---|---|---|
| **R7** | `messages` → `hero.subtitle` | 「海外の優秀な人材と、日本のものづくり企業を**結びます**。技能実習・育成就労両制度に**対応し**…サポートを**お約束します**」 | 3 lỗi trong 1 câu: đang vận hành + đã đáp ứng chế độ + cam kết |
| **R8** | `messages` → `hero.eyebrow` | 「外国人材受入れの伴走者」 | Định vị = 監理支援機関 đang hoạt động |
| **R9** | `messages` → `usp.items.support` | 「**24時間**多言語サポート / **365日**、企業様と実習生をサポート」 | Cam kết mức dịch vụ của nghiệp vụ chưa được phép |
| **R10** | `messages` → `usp.items.ssw` | 「育成就労制度**対応** / 長期キャリア設計を**提案**」 | Chào bán dịch vụ chưa được phép |
| **R11** | `app/[locale]/recruitment/*` + `messages.recruitment` | 「求職者の方へ…**応募する**」/ process: 面談・選考 → 教育・準備 → **入国・配属** | Chính xác là 「受入れを確約するような募集・営業表現」 KH nói phải tránh |
| **R12** | `messages` → `ctaBanner` | 「**外国人材の受入れ**、まずはお気軽にご相談ください」「貴社の事業に合わせた**プランをご提案**」 | 営業表現 cho dịch vụ chưa được phép |
| **R13** | `system/ginou-jisshu` | `flow[]`: お申込み→現地面接→母国での日本語教育→入国・配属→配属後フォロー | Từ "giải thích chế độ" thành "quy trình dịch vụ của chúng tôi" |
| **R14** | `messages.tit.faq` | 「**費用はどのくらいですか？**」→「お**見積りは無料**です」/「N5〜N4相当を目安に**教育しています**」 | Báo giá + tự nhận đang đào tạo |
| **R15** | `system/ikusei-shuro` | Section 「**企業様のメリット**」(長期キャリア設計/定着率…) | Chào bán, không phải giải thích chế độ |
| **R16** | `messages.aboutPreview.subtitle` | 「受入企業の課題と、海外人材の夢。その両方に**応える総合支援**」 | Tuyên bố đang cung cấp dịch vụ |

## 3.3 🟠 NHÓM BỊA HOẠT ĐỘNG / TÀI SẢN GIẢ

| ID | File | Nội dung | Vấn đề |
|---|---|---|---|
| **R17** | `components/sections/social-feed.tsx` | 6 ảnh Unsplash + 「現場の様子、**実習生の成長を毎週更新中**」 + link `https://instagram.com` (rỗng) + `@tatsumi.coop` | Bịa hoạt động SNS + 6 link chết |
| **R18** | `components/layout/footer.tsx:20-22` | Icon SNS → `instagram.com` / `facebook.com` / `linkedin.com` | 3 link chết, gây mất uy tín khi thẩm định |
| **R19** | `content/posts.ts` (2 bài blog còn lại) | 「**たつみ協同組合がサポートする現場で**実際にうまくいった5つの工夫」 | Bịa kinh nghiệm vận hành |
| **R20** | `app/[locale]/about/page.tsx:31` | Ảnh Unsplash 大鳥居 làm ảnh 代表挨拶 | Ảnh stock ở vị trí đáng lẽ là ảnh người thật — dễ bị nhận ra |

## 3.4 🔴 NHÓM SAI THÔNG TIN / KỸ THUẬT

| ID | File:dòng | Vấn đề | Mức |
|---|---|---|---|
| **R21** | `components/forms/contact-form.tsx:34` | `await new Promise(r => setTimeout(r, 800))` → **form KHÔNG gửi mail**, chỉ `console.log`. Hiển thị "送信が完了しました" là **thông báo sai** | 🔴 KH yêu cầu「組合へのお問い合わせ」— cán bộ thẩm định có thể test thật |
| **R22** | `messages.footer.tel` | `TEL: 03-0000-0000` — số giả | 🔴 |
| **R23** | `app/layout.tsx:22`, `app/[locale]/layout.tsx:30-31`, `app/sitemap.ts:5`, `app/robots.ts:6` | Domain giả `https://tatsumi-coop.example.jp` ở 4 nơi | 🔴 sitemap/OGP/JSON-LD trỏ tên miền không tồn tại |
| **R24** | `app/[locale]/layout.tsx:34-36` | JSON-LD description 「技能実習・育成就労に**対応する**協同組合です」 + `sameAs: ['https://instagram.com','https://facebook.com']` | 🟠 Dữ liệu có cấu trúc khai báo sai — Google/thẩm định đều đọc được |
| **R25** | `messages.footer.address` / `about.info.addressVal` | Thiếu 〒733-0033, dùng số full-width `２丁目` | 🟡 |
| **R26** | `contact/page.tsx:70` | iframe map dùng query tự chế, không dùng URL KH gửi | 🟡 |
| **R27** | `messages.contact.subjectOptions.candidate` = 「応募・採用について」 + `contact-form.tsx:15` enum `'candidate'` | 募集表現 nằm cả trong UI lẫn schema | 🟠 |
| **R28** | `messages.footer.hours` 「平日 9:00-18:00」 / `about.greetingName` 「代表理事 永井伸枝」 / `privacy.lastUpdated` 「2026年4月1日」 / `contact.accessBody` 「JR西広島駅から徒歩15分」 | 4 thông tin **chưa được KH xác nhận** | 🟡 |
| **R29** | `messages.about.info.businessVal` | 事業内容 =「外国人技能実習生受入事業、育成就労支援事業、研修事業」 | 🔴 Khai sai 事業内容 — mâu thuẫn với 定款 và với hồ sơ |
| **R30** | `privacy` mục 1 | 「お問い合わせ、**応募**、サービス提供等」 | 🟡 Còn dấu vết 募集 |

## 3.5 THIẾU — cần bổ sung theo yêu cầu KH

| ID | Nội dung thiếu | Nguồn yêu cầu |
|---|---|---|
| **N1** | Trang 「**監理支援事業について（許可申請中）**」 | Y3 — trang cốt lõi của cả hồ sơ |
| **N2** | Trang/section 「**共同購買など現在行える事業**」 | Danh sách ĐƯỢC đăng, mục 3 |
| **N3** | Giải thích 「**特定技能**」 | KH liệt kê 3 chế độ, site mới có 2 |
| **N4** | 組合概要 đầy đủ: 設立年月日 / 出資金 / 組合員数 / 理事構成 / 事業区域 | Danh sách ĐƯỢC đăng, mục 1 |
| **N5** | Notice bar 「許可申請中」 quản lý tập trung | Y4 |
| **N6** | Cơ chế **chuyển đổi sau khi có phép** + 3 trang tài liệu (chuẩn bị, chưa publish) | Y4 |

---

# PHẦN IV — KIẾN TRÚC ĐÍCH

## 4.1 Sitemap sau khi chỉnh sửa

```
/                          ホーム — 組合の公式サイトとして再構成
├─ /about                  組合概要（理念・目的・組合情報・代表挨拶）
├─ /business          ★NEW 事業案内（共同購買など現在行える事業）
├─ /licensing         ★NEW 監理支援事業について（許可申請中）◀ TRANG CỐT LÕI
├─ /system/
│   ├─ ginou-jisshu        技能実習制度とは（一般的説明のみ）
│   ├─ ikusei-shuro        育成就労制度とは（一般的説明のみ）
│   └─ tokutei-ginou  ★NEW 特定技能とは（一般的説明のみ）
├─ /news                   お知らせ（組合からの告知のみ）
├─ /contact                お問い合わせ（新連絡先＋地図＋実送信）
└─ /privacy                プライバシーポリシー

── ẨN (giữ code, bật lại sau khi có phép) ──
✗ /recruitment             → 301 redirect về /contact
✗ SocialFeed section       → ẩn bằng feature flag
✗ /licensing/kitei         → 業務運営規程（許可後に公開）
✗ /licensing/hiyou         → 監理支援費表（許可後に公開）
✗ /licensing/privacy-rule  → 個人情報の適正管理及び秘密の保持に関する規程（許可後に公開）
```

## 4.2 Header nav mới

```
ホーム │ 組合について ▾ │ 事業案内 ▾            │ お知らせ │ お問い合わせ │ EN
        ├ 組合概要      ├ 共同購買事業
        └ アクセス      ├ 監理支援事業について（許可申請中）
                        └ 制度紹介 ▾
                           ├ 技能実習制度とは
                           ├ 育成就労制度とは
                           └ 特定技能とは
```
※ Bỏ mục 採用情報.

## 4.3 Cơ chế chuyển đổi 「申請中 → 許可済」 (đáp ứng Y4)

Tạo **1 file duy nhất** `lib/site-config.ts`:

```ts
// ⚠️ Sau khi nhận được 許可: đổi 'applying' → 'approved' và bật các cờ bên dưới.
//    Xem hướng dẫn đầy đủ: docs/after-approval-checklist.md
export const LICENSE_STATUS = 'applying' as 'applying' | 'approved';

export const FEATURES = {
  showApplyingNotice: LICENSE_STATUS === 'applying', // banner「許可申請中」
  recruitment:        LICENSE_STATUS === 'approved', // trang 採用情報
  socialFeed:         false,                          // bật khi có SNS thật
  blog:               false,                          // bật khi có bài viết thật
  publicDocuments:    LICENSE_STATUS === 'approved', // 業務運営規程/監理支援費表/個人情報規程
  englishLocale:      true,                           // xem quyết định D-3
} as const;

export const SITE = {
  domain: 'https://ta23.net',        // ← cần KH xác nhận
  tel:    '082-909-4208',
  email:  'info@ta23.net',
  postalCode: '733-0033',
  address: '広島県広島市西区観音本町2丁目1-50',
  mapUrl: 'https://maps.app.goo.gl/GRo15HJscsg513sL7',
} as const;
```

→ Sau khi có phép: **sửa 1 dòng + xoá 1 key message** là xong. Đúng ý Y4.

---

# PHẦN V — CHIẾN LƯỢC BACKUP (bắt buộc trước khi xoá bất cứ thứ gì)

## 5.1 Nguyên tắc: 3 lớp, không bao giờ mất dữ liệu

```
Lớp 0 — Git       : tag + branch lưu toàn bộ trạng thái hiện tại
Lớp 1 — _archive/ : file bị gỡ được DI CHUYỂN vào thư mục ngoài build
Lớp 2 — Feature   : phần bị ẩn giữ nguyên code, chỉ tắt bằng cờ
        flag
```

## 5.2 Lớp 0 — Git (thực hiện ĐẦU TIÊN, trước mọi thay đổi)

```bash
git add -A && git commit -m "chore: snapshot before compliance rewrite"
git tag -a v1.0-pre-compliance -m "Bản đầy đủ trước khi chỉnh sửa theo yêu cầu 許可申請"
git branch archive/pre-compliance-20260903
git push origin master --tags
git push origin archive/pre-compliance-20260903
```

**Khôi phục toàn bộ bất cứ lúc nào:**
```bash
git checkout v1.0-pre-compliance -- <đường/dẫn/file>   # khôi phục 1 file
git checkout -b restore archive/pre-compliance-20260903 # khôi phục toàn bộ
```

## 5.3 Lớp 1 — Thư mục `_archive/` (ngoài phạm vi build)

```
_archive/                          ← KHÔNG nằm trong app/, không thành route
├─ README.md                       ← bảng đối chiếu: gỡ gì, ở đâu, khôi phục ra sao
├─ content/
│   └─ posts.pre-compliance.ts     ← 9 bài viết gốc
├─ messages/
│   ├─ ja.pre-compliance.json      ← message gốc
│   └─ en.pre-compliance.json
└─ components/
    ├─ recruitment-page.tsx.bak    ← trang 採用情報 gốc
    └─ social-feed.tsx.bak         ← section SNS gốc
```

⚠️ **Điểm kỹ thuật quan trọng:** `app/[locale]/recruitment/page.tsx` phải được **di chuyển ra khỏi `app/`**, không chỉ đổi tên tại chỗ. Next.js App Router quét theo cấu trúc thư mục — để file trong `app/` là rủi ro tạo route ngoài ý muốn.

Thêm vào `tsconfig.json` → `"exclude": ["_archive"]` để không lọt vào type-check/build.

## 5.4 Lớp 2 — Phân loại nội dung gỡ bỏ: A / B / C

| Loại | Định nghĩa | Cách xử lý | Khôi phục |
|---|---|---|---|
| **A — Cấu trúc** | Tính năng đúng nhưng *chưa được phép hiển thị* | Ẩn bằng feature flag, code ở nguyên vị trí | ✅ Bật cờ → về ngay |
| **B — Nội dung sai sự thật** | Thông tin bịa, sai với thực tế | Chuyển vào `_archive/`, xoá khỏi build | ⚠️ **KHÔNG khôi phục nguyên văn.** Chỉ dùng làm mẫu để viết lại bằng dữ liệu thật |
| **C — Rác kỹ thuật** | Link chết, domain giả, số điện thoại giả | Xoá thẳng | ❌ Không cần khôi phục |

### Phân loại từng hạng mục

| Hạng mục | Loại | Backup ở đâu | Đường quay lại |
|---|---|---|---|
| Trang `/recruitment` | **A** | `_archive/components/recruitment-page.tsx.bak` + git tag | Sau khi có phép: `FEATURES.recruitment = true`, copy file về, **viết lại nội dung** cho hợp quy |
| Section `SocialFeed` | **A** | Giữ nguyên component, chỉ bỏ khỏi `page.tsx` + cờ `socialFeed` | Khi có SNS thật: thay 6 ảnh + link thật, bật cờ |
| Locale `en` (nếu tắt) | **A** | Giữ nguyên `messages/en.json` | Bật `englishLocale` trong `i18n.ts` |
| Bài R1 (許可更新) | **B** | `_archive/content/posts.pre-compliance.ts` | ❌ Không bao giờ dùng lại. Sau khi có phép sẽ viết bài mới với ngày tháng & số giấy phép thật |
| Bài R2/R3/R4/R19 | **B** | 同上 | Viết lại khi có sự kiện/khách hàng thật |
| Copy `usp.*` cũ | **B** | `_archive/messages/ja.pre-compliance.json` | Dùng làm tham khảo văn phong, viết lại nội dung |
| Section 企業様のメリット | **B** | git tag | Viết lại khi được phép chào dịch vụ |
| SNS link giả (footer) | **C** | — | Thêm mới khi có tài khoản thật |
| Domain `example.jp` | **C** | — | — |
| TEL `03-0000-0000` | **C** | — | — |

## 5.5 Tài liệu bàn giao sẽ tạo kèm

| File | Nội dung |
|---|---|
| `_archive/README.md` | Bảng đối chiếu đầy đủ: mục nào bị gỡ, loại A/B/C, nằm ở đâu, lệnh khôi phục |
| `docs/after-approval-checklist.md` | Checklist từng bước cần làm **ngay khi nhận được 許可** |
| `docs/content-guidelines.md` | Quy tắc viết nội dung: từ ngữ cấm, mẫu câu an toàn — để KH tự thêm bài về sau không phạm quy |

---

# PHẦN VI — PLAN TRIỂN KHAI CHI TIẾT

**Tổng: 36 task / 7 phase / ~12h công**
Có thể bàn giao bản dùng được cho hồ sơ sau **P0–P4 (~8h)**.

---

## PHASE 0 — Backup & khung an toàn `~0.5h` ⛔ CHẶN TẤT CẢ

| # | Task | File | Est |
|---|---|---|---|
| 0.1 | Commit + tag `v1.0-pre-compliance` + branch archive + push | git | 10p |
| 0.2 | Tạo `_archive/` + `_archive/README.md` | mới | 10p |
| 0.3 | Thêm `"exclude": ["_archive"]` vào tsconfig | `tsconfig.json` | 5p |
| 0.4 | Tạo `lib/site-config.ts` (§4.3) | mới | 15p |
| 0.5 | Tạo `scripts/check-compliance.sh` — grep từ ngữ cấm, exit 1 nếu dính | mới | 20p |

**Task 0.5 — script kiểm tra tự động (chi tiết):**
```bash
# Quét messages/, content/, app/, components/ tìm các mẫu:
#   監理支援機関です | 許可取得済 | 受入実績 | 受け入れます | お約束します
#   監理団体許可 | 業務運営規程 | 監理支援費表 | 24時間 | 365日
#   03-0000-0000 | example.jp | instagram.com | facebook.com | linkedin.com
# → in ra file:dòng, exit 1
```
Chạy script này trước mỗi lần deploy → **biến "rà soát thủ công dễ sót" thành kiểm tra máy**.

---

## PHASE 1 — Gỡ rủi ro chặn hồ sơ `~2.5h` 🔴 ƯU TIÊN CAO NHẤT

| # | Task | File | Xử lý ID | Est |
|---|---|---|---|---|
| 1.1 | Copy `content/posts.ts` → `_archive/content/posts.pre-compliance.ts` | archive | — | 5p |
| 1.2 | Copy `messages/{ja,en}.json` → `_archive/messages/*.pre-compliance.json` | archive | — | 5p |
| 1.3 | Rút `content/posts.ts` còn **1–2 thông báo thật** (mẫu: 「ホームページを開設いたしました」). Giữ nguyên type + 3 hàm `getPostBySlug/getAllPosts/getRelatedPosts` để không vỡ import | `content/posts.ts` | R1–R4, R19 | 40p |
| 1.4 | Viết lại `usp` (4 mục) → nội dung sự thật, không cam kết | `messages/*.json` | R5, R6, R9, R10 | 30p |
| 1.5 | Viết lại `hero` (eyebrow/title/subtitle/CTA) | `messages/*.json` | R7, R8 | 25p |
| 1.6 | Viết lại `ctaBanner` + `aboutPreview` | `messages/*.json` | R12, R16 | 20p |
| 1.7 | Gỡ `SocialFeed` khỏi `page.tsx`, bọc cờ `FEATURES.socialFeed` | `app/[locale]/page.tsx` | R17 | 10p |
| 1.8 | Gỡ 3 icon SNS ở footer (bọc cờ) | `components/layout/footer.tsx` | R18 | 10p |
| 1.9 | Move `/recruitment` → `_archive/`, thêm redirect `/recruitment` → `/contact` trong `next.config.mjs`; gỡ khỏi header/footer/sitemap | 4 file | R11 | 25p |
| 1.10 | Sửa `about.info.businessVal` → 事業内容 thật + ghi chú 申請中 | `messages/*.json` | R29 | 10p |

### Bản nháp copy — Phase 1 (sẵn sàng dán vào `messages/ja.json`)

```jsonc
"hero": {
  "eyebrow": "広島市西区・中小企業等協同組合",
  "title1": "信頼を土台に、",
  "title2": "組合員とともに。",
  "subtitle": "たつみ協同組合は、広島県広島市西区を拠点に、共同購買事業などを通じて組合員企業の事業活動を支える協同組合です。あわせて、技能実習・育成就労制度・特定技能における監理支援事業の実施に向け、現在、許可申請の手続きを進めています。",
  "ctaContact": "お問い合わせ",
  "ctaAbout": "組合について"
},

"usp": {
  "eyebrow": "OUR APPROACH",
  "title": "組合の考え方",
  "items": {
    "local":      { "title": "地域に根ざす",   "desc": "広島市西区に事務所を構え、地域の事業者とともに歩みます。" },
    "purchase":   { "title": "共同購買",       "desc": "組合員による共同購買を通じ、調達面での相互扶助を図ります。" },
    "compliance": { "title": "法令の遵守",     "desc": "中小企業等協同組合法をはじめ、関係法令の遵守を徹底します。" },
    "study":      { "title": "制度への取組み", "desc": "技能実習・育成就労制度・特定技能について、正確な情報の提供に努めています。（監理支援事業は許可申請中）" }
  }
},

"ctaBanner": {
  "title": "組合に関するお問い合わせは、お気軽にご連絡ください。",
  "subtitle": "組合の事業内容や加入についてのご質問を承ります。",
  "button": "お問い合わせフォームへ"
},

"about": {
  "info": {
    "businessVal": "共同購買事業 ほか（定款に定める事業）\n※ 技能実習・育成就労制度・特定技能に係る監理支援事業は、現在許可申請中です。"
  }
},

"notice": {
  "applying": "監理支援事業（技能実習・育成就労制度・特定技能）は、現在、関係機関へ許可申請中です。許可を受けた後に事業を開始する予定であり、現時点では当該事業を行っておりません。"
}
```

---

## PHASE 2 — Thông tin thật & SEO `~1.5h` 🔴

| # | Task | File | ID | Est |
|---|---|---|---|---|
| 2.1 | `footer.tel` → `TEL: 082-909-4208` | `messages/*.json` | R22 | 5p |
| 2.2 | `footer.address` / `about.info.addressVal` → `〒733-0033 広島県広島市西区観音本町2丁目1-50` | `messages/*.json` | R25 | 5p |
| 2.3 | Thay domain giả ở **4 nơi** → đọc từ `SITE.domain` | `app/layout.tsx`, `app/[locale]/layout.tsx`, `app/sitemap.ts`, `app/robots.ts` | R23 | 25p |
| 2.4 | Viết lại JSON-LD: bỏ `sameAs` giả, sửa description, thêm `address`(PostalAddress) + `telephone` + `email` | `app/[locale]/layout.tsx` | R24 | 25p |
| 2.5 | Sửa metadata gốc (title/description) theo định vị mới | `app/layout.tsx` | R23 | 10p |
| 2.6 | Thay iframe map + thêm nút「Googleマップで開く」→ URL KH gửi | `app/[locale]/contact/page.tsx` | R26 | 15p |
| 2.7 | Đổi `subjectOptions`: `candidate`→`system`「制度に関するお問い合わせ」, `company`→「共同購買・組合加入について」; sửa enum zod | `messages`, `contact-form.tsx` | R27 | 15p |
| 2.8 | Cập nhật 営業時間 / 代表理事 / アクセス文 / privacy 最終更新日 | `messages`, `privacy/page.tsx` | R28, R30 | 15p ⏸ *chờ KH trả lời* |

---

## PHASE 3 — Trang mới theo yêu cầu KH `~3h` 🔴

| # | Task | File | ID | Est |
|---|---|---|---|---|
| 3.1 | **`/licensing`** — trang cốt lõi. Dùng **nguyên văn** đoạn KH chỉ định + box trạng thái + danh sách tài liệu sẽ công khai sau khi có phép | `app/[locale]/licensing/page.tsx` (mới) | N1 | 60p |
| 3.2 | Component `NoticeBanner` (đọc `FEATURES.showApplyingNotice` + `notice.applying`), đặt ở home + 3 trang chế độ + `/licensing` | `components/common/notice-banner.tsx` (mới) | N5 | 30p |
| 3.3 | **`/business`** — 共同購買 v.v. Tái dụng layout `about` | `app/[locale]/business/page.tsx` (mới) | N2 | 40p ⏸ *chờ KH mô tả nghiệp vụ* |
| 3.4 | **`/system/tokutei-ginou`** — giải thích 特定技能 phổ quát (在留資格/12分野/1号2号/技能実習との違い) | `app/[locale]/system/tokutei-ginou/page.tsx` (mới) | N3 | 45p |
| 3.5 | Mở rộng bảng 組合情報: +設立年月日 +出資金 +組合員数 +理事構成 +事業区域 +TEL +MAIL | `about/page.tsx`, `messages` | N4 | 25p ⏸ *chờ KH* |
| 3.6 | Cập nhật header nav + footer sitemap theo §4.2 | `header.tsx`, `footer.tsx` | — | 20p |
| 3.7 | Cập nhật `app/sitemap.ts`: +licensing +business +tokutei-ginou, −recruitment | `app/sitemap.ts` | — | 10p |

### Bản nháp trang `/licensing` (JA)

```
H1  技能実習生・育成就労制度・特定技能への取組みについて

    当組合では、技能実習生・育成就労制度・特定技能における監理支援事業の
    実施に向け、現在、許可申請手続きを進めています。
    なお、当該事業は関係機関の許可を受けた後に開始する予定であり、
    現時点では監理支援事業を行っておりません。
    ▲ nguyên văn theo chỉ định của KH — KHÔNG sửa

┌ 現在の状況 ────────────────────────────┐
│  ステータス   許可申請の手続き中          │
│  事業開始     許可を受けた後を予定         │
│  現時点       監理支援事業は行っておりません │
└────────────────────────────────────────┘

H2  許可取得後に公開を予定している書類        ← quyết định D-2
    ・個人情報の適正管理及び秘密の保持に関する規程の写し
    ・業務運営規程
    ・監理支援費表
    ※ 上記は許可を受けた後、本ページにて公開いたします。

H2  制度についてはこちら                      ← link sang 3 trang chế độ
    → 技能実習制度とは  → 育成就労制度とは  → 特定技能とは
```

---

## PHASE 4 — Form liên hệ hoạt động thật `~1.5h` 🔴

| # | Task | Est |
|---|---|---|
| 4.1 | Chọn phương án (xem so sánh dưới) — **cần KH quyết** | — |
| 4.2 | Nối gửi mail thật về `info@ta23.net` | 45p |
| 4.3 | Xử lý lỗi: khi gửi thất bại phải báo lỗi + hiện TEL/MAIL, **không hiện "送信完了" giả** | 20p |
| 4.4 | Chống spam đơn giản (honeypot + rate limit) | 20p |
| 4.5 | Bổ sung điều khoản xử lý dữ liệu vào privacy nếu dùng dịch vụ bên thứ 3 | 15p |

### So sánh 4 phương án

| | Thời gian | Chi phí | Điều kiện | Rủi ro |
|---|---|---|---|---|
| **(a) Resend + Route Handler** | 1.5h + chờ DNS | Free 3k mail/tháng | Cần thêm DNS record cho `ta23.net` | Phải chạm DNS đang chạy mail |
| **(b) SMTP của ta23.net + nodemailer** ⭐ | 1h | 0đ | Cần host/user/pass SMTP từ KH | Không chạm DNS. Mail đi từ chính domain — **đáng tin nhất khi thẩm định** |
| **(c) Formspree / Getform** | 20p | Free 50 mail/tháng | Không cần gì | Dữ liệu cá nhân đi qua bên thứ 3 → phải ghi vào privacy policy |
| **(d) Bỏ form, dùng mailto + TEL nổi bật** | 20p | 0đ | Không cần gì | UX kém, site trông chưa hoàn thiện |

**Khuyến nghị: (b)** — KH đã có `info@ta23.net` nên gần như chắc chắn có SMTP. Không đụng DNS, mail gửi từ chính tên miền của tổ chức, không đưa dữ liệu cá nhân ra ngoài. Phương án dự phòng nếu KH không lấy được thông tin SMTP: **(c)**.

---

## PHASE 5 — Rà nội dung 3 trang chế độ `~1.5h` 🟠

| # | Task | File | ID | Est |
|---|---|---|---|---|
| 5.1 | `ginou-jisshu`: gỡ section `flow[]` (お申込み→配属). Thay bằng 「制度の一般的な流れ」 mô tả trung lập, không phải "quy trình của chúng tôi" | `system/ginou-jisshu/page.tsx` | R13 | 25p |
| 5.2 | Gỡ FAQ báo giá + 「教育しています」. Giữ FAQ mang tính giải thích chế độ | `messages.tit.faq` | R14 | 20p |
| 5.3 | `ikusei-shuro`: gỡ section 「企業様のメリット」. Thay bằng 「制度のポイント」 mô tả trung lập | `system/ikusei-shuro/page.tsx` | R15 | 25p |
| 5.4 | Thêm 出典 (nguồn: 出入国在留管理庁 / 厚生労働省) vào cuối 3 trang chế độ | 3 file | — | 20p |
| 5.5 | Thay ảnh Unsplash 大鳥居 ở `/about` → placeholder trung tính hoặc ảnh thật | `about/page.tsx` | R20 | 10p |

**Ghi chú 5.4:** Thêm nguồn trích dẫn là **điểm cộng khi thẩm định** — chứng minh nội dung là thông tin công khai được trích dẫn, không phải quảng cáo dịch vụ.

---

## PHASE 6 — Chuẩn bị hậu-許可 & bàn giao `~1h` 🔵

| # | Task | File | ID | Est |
|---|---|---|---|---|
| 6.1 | Viết `docs/after-approval-checklist.md` | mới | N6 | 25p |
| 6.2 | Tạo template (chưa link, `FEATURES.publicDocuments=false`) cho 3 trang: 業務運営規程 / 監理支援費表 / 個人情報規程 | 3 file mới | N6 | 20p |
| 6.3 | Viết `docs/content-guidelines.md` — quy tắc viết bài cho KH | mới | — | 15p |
| 6.4 | Hoàn thiện `_archive/README.md` với bảng đối chiếu đầy đủ | `_archive/README.md` | — | 10p |

---

## PHASE 7 — Kiểm thử & deploy `~1h`

| # | Task | Est |
|---|---|---|
| 7.1 | `npx tsc --noEmit` + `npm run lint` + `npm run build` | 15p |
| 7.2 | Chạy `scripts/check-compliance.sh` → phải PASS sạch | 5p |
| 7.3 | Kiểm tra thủ công: 2 locale × 10 trang, mobile, link chết, form gửi thật | 20p |
| 7.4 | Kiểm tra sitemap.xml / robots.txt / JSON-LD (Rich Results Test) | 10p |
| 7.5 | Deploy + trỏ domain `ta23.net` (theo `DEPLOY.md` §8) | 20p |
| 7.6 | **Rà cuối bằng checklist §7.1** rồi mới giao URL cho KH nộp hồ sơ | 10p |

---

## 6.8 Sơ đồ phụ thuộc

```
P0 (backup)  ⛔ chặn tất cả
 └─→ P1 (gỡ rủi ro)  ──┬─→ P5 (3 trang chế độ)  ──┐
     P2 (thông tin)  ──┤                           ├─→ P7 (test+deploy)
     P3 (trang mới)  ──┤   P6 (hậu-許可)         ──┘
     P4 (form)       ──┘

⏸ Chờ KH trả lời: 2.8, 3.3, 3.5, 4.1  → không chặn các task còn lại
```

**Mốc bàn giao:**
- **M1 — sau P0–P2 (~4.5h):** site đã sạch rủi ro pháp lý, thông tin thật. *Có thể nộp hồ sơ nếu gấp.*
- **M2 — sau P0–P4 (~8h):** ⭐ **bản khuyến nghị nộp hồ sơ** — đủ trang `/licensing`, form chạy thật.
- **M3 — sau P0–P7 (~12h):** hoàn chỉnh, có tài liệu bàn giao, sẵn sàng chuyển đổi sau khi có phép.

---

# PHẦN VII — KIỂM SOÁT CHẤT LƯỢNG

## 7.1 Checklist từ ngữ cấm (tự động hoá bằng `scripts/check-compliance.sh`)

**Tư cách pháp lý**
- [ ] Không có 「監理支援機関です」「監理団体です」「許可取得済」「認定」「登録済」
- [ ] Không có bài viết nào nhắc 「許可の更新」「許可を受けました」

**Cam kết dịch vụ**
- [ ] Không có 「受け入れます」「受入実績」「送り出します」「派遣します」
- [ ] Không có 「お約束します」「保証します」「確約」
- [ ] Không có 「24時間」「365日」 gắn với dịch vụ chưa được phép
- [ ] Không có báo giá / 「お見積り無料」

**Tài liệu bị cấm công khai trước khi có phép**
- [ ] Không công khai 業務運営規程
- [ ] Không công khai 監理支援費表
- [ ] Không công khai 個人情報の適正管理及び秘密の保持に関する規程

**Nội dung bịa**
- [ ] Không có bài viết/ảnh mô tả hoạt động thực tập sinh như đã diễn ra
- [ ] Không có 導入事例 / 実績数字
- [ ] Không còn link SNS rỗng, domain `example.jp`, TEL `03-0000-0000`

**Bắt buộc phải có**
- [ ] Hiển thị 「監理支援事業は現在、許可申請中です」
- [ ] Có câu 「現時点では監理支援事業を行っておりません」 (nguyên văn KH)
- [ ] Nội dung chế độ ở dạng **thông tin chung có trích nguồn**, không chào bán
- [ ] Thông tin liên hệ khớp 100% với hồ sơ nộp

## 7.2 Bảng rủi ro

| Rủi ro | Khả năng | Ảnh hưởng | Biện pháp |
|---|---|---|---|
| Sót từ ngữ cấm ở bản EN | **Cao** (dễ chỉ sửa JA rồi quên EN) | 🔴 | Script check quét cả 2 file; hoặc tạm tắt locale EN (D-3) |
| Google còn cache trang cũ (`/recruitment`, bài 許可更新) | Trung bình | 🟠 | 301 redirect + submit lại sitemap. Site chưa deploy public thì rủi ro = 0 → **cần KH xác nhận site đã online chưa** |
| KH không kịp cung cấp thông tin 組合 (設立/出資金…) | Trung bình | 🟡 | Dùng cấu trúc có sẵn, hiện 「準備中」, điền sau — không chặn nộp hồ sơ |
| Không lấy được thông tin SMTP | Trung bình | 🟡 | Dự phòng: Formspree (c) |
| Sửa quá tay, mất nội dung cần dùng lại sau khi có phép | Thấp | 🟡 | Chiến lược backup 3 lớp §5 |

---

# PHẦN VIII — QUYẾT ĐỊNH CẦN KH/ANH XÁC NHẬN

## 8.1 Quyết định về phạm vi (cần anh chốt để bắt đầu)

| ID | Quyết định | Khuyến nghị |
|---|---|---|
| **D-1** | Xoá 9 bài viết + trang `/recruitment` + section SNS? | ✅ **Có** — đây là nhóm rủi ro lớn nhất. Đã có backup 3 lớp, khôi phục được bất cứ lúc nào |
| **D-2** | Trang `/licensing` có liệt kê 3 tài liệu「許可取得後に公開予定」không? | ✅ **Có** — chỉ nói *sẽ* công khai sau khi có phép, không phải công khai. Thể hiện hiểu đúng quy định → điểm cộng khi thẩm định |
| **D-3** | Giữ bản tiếng Anh? | 🤔 **Tạm tắt EN** trong giai đoạn nộp hồ sơ → giảm ~25% công + loại bỏ rủi ro sót từ ngữ cấm ở EN. Code giữ nguyên, bật lại bằng 1 cờ. Nếu KH cần EN thì giữ, tôi sẽ soát song song |
| **D-4** | Phương án form liên hệ | ⭐ **(b) SMTP của ta23.net** — dự phòng (c) Formspree |
| **D-5** | Ưu tiên bàn giao | ⭐ **M2 (~8h)** — đủ chất lượng nộp hồ sơ |

## 8.2 Câu hỏi cần gửi KH (không chặn P0–P1)

**Về 組合 — dùng cho `/about` và `/business`:**
1. 設立年月日、出資金、組合員数、理事の構成は？
2. 代表理事のお名前は「永井伸枝」で正しいでしょうか？
3. 定款に定める事業の正式な記載を教えてください（共同購買事業の正式名称）
4. 現在実際に行っている共同購買の具体的な内容は？（何を共同購買しているか）
5. 事業区域はどちらまででしょうか？

**Về vận hành:**
6. 営業時間は「平日9:00〜18:00」で正しいでしょうか？FAXはありますか？
7. SNSアカウント（Instagram / Facebook）は実在しますか？（無い場合は削除します）
8. お問い合わせフォーム：`info@ta23.net` のSMTP情報（サーバー・ポート・ID・パスワード）をご提供いただけますか？

**Về website:**
9. 英語版は必要でしょうか？（申請時は日本語のみでも問題ないと思われます）
10. ロゴデータ・事務所や役員のお写真はございますか？（現在は全てストック写真です）
11. ドメイン `ta23.net` は取得済みでしょうか？DNSの管理はどちらですか？
12. **現在このサイトは既に公開されていますか？**（公開済みならGoogleキャッシュ対策が必要）
13. 申請書類の提出予定日はいつ頃でしょうか？

---

# PHỤ LỤC — Danh sách file bị tác động

## Sửa đổi (17 file)
```
messages/ja.json                          ★ nhiều nhất
messages/en.json                          ★ (nếu giữ EN)
content/posts.ts
app/layout.tsx
app/[locale]/layout.tsx
app/[locale]/page.tsx
app/[locale]/about/page.tsx
app/[locale]/contact/page.tsx
app/[locale]/privacy/page.tsx
app/[locale]/system/ginou-jisshu/page.tsx
app/[locale]/system/ikusei-shuro/page.tsx
app/sitemap.ts
app/robots.ts
components/layout/header.tsx
components/layout/footer.tsx
components/forms/contact-form.tsx
next.config.mjs                           (redirect /recruitment)
tsconfig.json                             (exclude _archive)
```

## Tạo mới (13 file)
```
lib/site-config.ts
components/common/notice-banner.tsx
app/[locale]/licensing/page.tsx           ◀ trang cốt lõi
app/[locale]/business/page.tsx
app/[locale]/system/tokutei-ginou/page.tsx
app/api/contact/route.ts                  (nếu chọn phương án b)
scripts/check-compliance.sh
_archive/README.md
_archive/content/posts.pre-compliance.ts
_archive/messages/ja.pre-compliance.json
_archive/messages/en.pre-compliance.json
_archive/components/recruitment-page.tsx.bak
docs/after-approval-checklist.md
docs/content-guidelines.md
```

## Di chuyển / gỡ (2)
```
app/[locale]/recruitment/page.tsx    → _archive/components/recruitment-page.tsx.bak  (loại A, khôi phục được)
components/sections/social-feed.tsx  → giữ nguyên file, tắt bằng cờ                  (loại A, khôi phục được)
```

**Không đụng tới:** `tailwind.config.ts`, `app/globals.css`, `lib/utils.ts`, `lib/navigation.ts`, `i18n.ts`, `middleware.ts`, `components/common/{logo,page-header,section-heading}.tsx`, `components/blog/post-card.tsx` — design system giữ nguyên 100%.
