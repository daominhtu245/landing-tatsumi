# Báo cáo triển khai — chỉnh sửa website theo yêu cầu 許可申請

| | |
|---|---|
| Ngày | 2026-09-04 |
| Kế hoạch gốc | `docs/feedback-analysis-and-plan.md` |
| Base commit | `bf84715` → snapshot `2879f95` |
| Trạng thái | ✅ Hoàn thành P0–P7 |

---

## Kết quả kiểm tra

| Hạng mục | Kết quả |
|---|---|
| `scripts/check-compliance.sh` | ✅ **PASS** — 0 ERROR (baseline ban đầu: 16 nhóm vi phạm) |
| `npm run build` | ✅ 30/30 trang static |
| `npx tsc --noEmit` | ✅ sạch |
| `npm run lint` | ✅ sạch |
| 22 route × 2 ngôn ngữ | ✅ 22/22 trả 200 |
| Quét HTML đã render (1.4 MB) tìm 14 nhóm nội dung cấm | ✅ sạch hoàn toàn |
| Cơ chế chuyển đổi 申請中 ↔ 許可済 | ✅ kiểm thử 2 chiều bằng build thật |

---

## Đã xử lý — 30 điểm rủi ro

### 🔴 Nhóm chặn hồ sơ (6/6)

| ID | Trước | Sau |
|---|---|---|
| R1 | Bài 「監理団体許可の更新が完了しました」— **tự nhận đã có giấy phép** | Đã gỡ. Thay bằng 1 thông báo có thật: 「公式ホームページを開設いたしました」 |
| R2 | 導入事例「5年で実習生15名を受け入れた」 | Đã gỡ |
| R3 | Báo cáo sự kiện có thực tập sinh tham dự | Đã gỡ |
| R4 | オープンハウス「実習生の現場を見学いただける」 | Đã gỡ |
| R5 | 「幅広い職種での受入実績」 | → 「組合員による共同購買を通じ、調達面での相互扶助を図ります」 |
| R6 | 「外国人技能実習機構の監査に対応する透明な運営」 | → 「中小企業等協同組合法をはじめ、関係法令の遵守を徹底します」 |

### 🟠 Cam kết dịch vụ / 募集表現 (10/10)

| ID | Trước | Sau |
|---|---|---|
| R7 | hero:「両制度に対応し…サポートをお約束します」 | 「共同購買事業などを通じて組合員である事業者の事業活動を支える協同組合です。あわせて…現在、許可申請の手続きを進めています」 |
| R8 | 「外国人材受入れの伴走者」 | 「広島市西区・中小企業等協同組合」 |
| R9 | 「24時間多言語サポート / 365日」 | → 「地域に根ざす」 |
| R10 | 「育成就労制度対応 / キャリア設計を提案」 | → 「制度への取組み（監理支援事業は許可申請中）」 |
| R11 | Trang `/recruitment`:「応募する」「入国・配属」 | Đã gỡ + redirect 307 → `/contact` |
| R12 | ctaBanner:「外国人材の受入れ…プランをご提案」 | 「組合に関するお問い合わせは、お気軽にご連絡ください」 |
| R13 | 受入フロー: お申込み→現地面接→入国・配属 | 制度の一般的な流れ: 要件確認→選抜→入国前講習→入国後講習→技能実習 |
| R14 | FAQ:「お見積りは無料」「N5〜N4相当を目安に教育しています」 | FAQ về nội dung chế độ, dẫn tới nguồn công khai |
| R15 | 「企業様のメリット」 | 「制度のポイント」 (trung lập) |
| R16 | 「受入企業の課題と海外人材の夢に応える総合支援」 | 「組合の概要と、現在行っている事業のご案内です」 |

### 🟠 Bịa hoạt động / tài sản giả (4/4)

R17 SocialFeed (6 ảnh stock + link Instagram rỗng) → data-driven, `SOCIAL = null` · R18 3 icon SNS rỗng ở footer → ẩn bằng cờ · R19 2 bài blog bịa kinh nghiệm → đã gỡ · R20 ảnh 大鳥居 ở mục 代表挨拶 → **giữ nguyên**, chuyển sang tự host `public/images/` (ảnh thắng cảnh Hiroshima, alt mô tả đúng, không ngụ ý là ảnh hoạt động của tổ chức)

### 🔴 Sai thông tin / kỹ thuật (10/10)

| ID | Trước | Sau |
|---|---|---|
| R21 | Form chỉ `setTimeout(800)` + `console.log` rồi **báo gửi thành công giả** | API route thật (nodemailer/SMTP). Chưa cấu hình → 503 + hiện TEL/mail, **không báo thành công giả** |
| R22 | `TEL: 03-0000-0000` | `082-909-4208` (bấm gọi được) |
| R23 | Domain giả `tatsumi-coop.example.jp` ở 4 nơi | `SITE.domain` = `https://ta23.net` |
| R24 | JSON-LD:「技能実習・育成就労に対応する」+ `sameAs` link rỗng | Chỉ khai sự thật + PostalAddress + telephone + email + hasMap |
| R25 | Thiếu 〒, dùng số full-width `２丁目` | `〒733-0033 …観音本町2丁目1-50` |
| R26 | iframe map query tự chế | Embed đúng địa chỉ + nút「Google マップで開く」→ URL KH gửi |
| R27 | subject「応募・採用について」 | 「制度に関するお問い合わせ」(sửa cả zod enum) |
| R28 | 4 thông tin chưa xác minh (営業時間/代表理事/アクセス/更新日) | Hiện 「準備中」 hoặc đã gỡ, không bịa |
| R29 | 事業内容 =「技能実習生受入事業、育成就労支援事業」 | 「共同購買事業 ほか（定款に定める事業）」+ ghi chú 申請中 |
| R30 | privacy còn chữ 「応募」 | Đã viết lại + bổ sung TEL/mail |

---

## Đã bổ sung — 6 hạng mục

| ID | Nội dung |
|---|---|
| N1 | **`/licensing`** — trang cốt lõi cho hồ sơ. Dùng **nguyên văn** đoạn KH chỉ định, bảng 現在の状況, danh sách 3 tài liệu「許可取得後に公開」 |
| N2 | **`/business`** — 共同購買事業 (nghiệp vụ hiện được phép) + khối 監理支援事業 申請中 + mời liên hệ gia nhập |
| N3 | **`/system/tokutei-ginou`** — giải thích 特定技能, có bảng so sánh 3 chế độ |
| N4 | 組合概要 mở rộng 10 mục; mục chưa xác nhận hiện 「準備中」 |
| N5 | `NoticeBanner` — thông báo 申請中 lấy từ **1 key duy nhất**, 2 biến thể (bar/block) |
| N6 | Cơ chế chuyển đổi hậu-許可 + 3 tài liệu bàn giao |

---

## Sitemap sau chỉnh sửa

```
/                          ホーム (+ banner 許可申請中)
/about                     組合概要 — 10 mục thông tin
/business             ★NEW 事業案内 — 共同購買事業
/licensing            ★NEW 監理支援事業について（許可申請中）◀ CỐT LÕI
/system/ginou-jisshu       技能実習制度とは — có trích nguồn
/system/ikusei-shuro       育成就労制度とは — có trích nguồn
/system/tokutei-ginou ★NEW 特定技能とは — có trích nguồn
/news                      お知らせ — 1 thông báo có thật
/contact                   お問い合わせ — form gửi mail thật
/privacy                   プライバシーポリシー
/api/contact          ★NEW POST endpoint gửi mail

✗ /recruitment → redirect 307 sang /contact
```

---

## Backup — 3 lớp, khôi phục được toàn bộ

| Lớp | Địa chỉ |
|---|---|
| **0. Git** | tag `v1.0-pre-compliance` + branch `archive/pre-compliance-20260904` (đã push origin) |
| **1. `_archive/`** | 9 bài viết gốc, 2 file message gốc, trang `/recruitment`, SocialFeed gốc |
| **2. Feature flag** | `lib/site-config.ts` → `FEATURES` |

Bảng đối chiếu đầy đủ + phân loại A/B/C: **`_archive/README.md`**

---

## Chuyển đổi sau khi có 許可 — sửa 1 dòng

`lib/site-config.ts`:
```diff
- export const LICENSE_STATUS = 'applying' as LicenseStatus;
+ export const LICENSE_STATUS = 'approved' as LicenseStatus;
```

**Đã kiểm thử bằng build thật**, dòng này tự động:
- ẩn banner 申請中 ở trang chủ và `/business`
- ẩn khối 3 tài liệu「許可取得後に公開」ở `/licensing`
- ẩn disclaimer 申請中 ở 3 trang chế độ (**giữ lại phần trích nguồn** — đúng)
- bật `FEATURES.recruitment`

Các bước còn lại: **`docs/after-approval-checklist.md`** (7 bước)

---

## Còn lại — cần khách hàng cung cấp

Không chặn việc nộp hồ sơ. Site hiện hiển thị 「準備中」 cho các mục này.

### Cấu hình để form gửi được mail
`SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` của `info@ta23.net` → xem `DEPLOY.md` §9.
**Chưa có thì form vẫn an toàn**: báo lỗi kèm SĐT + email, không báo thành công giả.

### Thông tin tổ chức (`lib/site-config.ts` → `ORG_PROFILE`)
設立年月日 · 出資金 · 組合員数 · 代表理事 · 事業区域 · 営業時間

### Nội dung
- Mô tả cụ thể 共同購買 (đang mặc定 chung chung + 「準備中」)
- Logo chính thức (đang dùng SVG placeholder)
- Ảnh thật của văn phòng/tổ chức (hiện `/about` dùng ảnh thắng cảnh Hiroshima làm ảnh trang trí)
- Tài khoản SNS thật (nếu có)

### Câu hỏi quan trọng nhất
> **Website này đã từng public chưa?**
> Nếu rồi, cần xử lý Google cache cho bài 「監理団体許可の更新が完了しました」 —
> submit lại sitemap + dùng công cụ Removals của Search Console.
