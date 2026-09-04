# Quy tắc viết nội dung cho website たつみ協同組合

Dành cho người thêm/sửa nội dung (bài お知らせ, văn bản trong `messages/*.json`).

**Áp dụng khi `LICENSE_STATUS = 'applying'`** trong `lib/site-config.ts`.
Sau khi có giấy phép, xem `docs/after-approval-checklist.md`.

---

## Nguyên tắc nền

> Website là **một hạng mục trong bộ hồ sơ xin phép**, không phải công cụ
> marketing. Người đọc quan trọng nhất là **cán bộ thẩm định hồ sơ**.

Một câu chữ sai có thể **phản chứng chính bộ hồ sơ** đang nộp. Khi phân vân
giữa "viết cho hay" và "viết cho đúng" — luôn chọn đúng.

---

## ❌ TUYỆT ĐỐI KHÔNG viết

### Mạo nhận tư cách pháp lý
| Cấm | Vì sao |
|---|---|
| 当組合は監理支援機関です | Chưa có giấy phép |
| 監理団体として… | 同上 |
| 許可取得済み / 認定を受けています | Sai sự thật |
| 監理団体許可の更新が完了しました | Mâu thuẫn trực tiếp với hồ sơ đang nộp |

### Cam kết dịch vụ chưa được phép
| Cấm | Thay bằng |
|---|---|
| 育成就労外国人を受け入れます | 制度に関する情報を提供しています |
| 受入実績が豊富です | (không viết — chưa có thực tế) |
| 24時間365日サポートします | (không viết) |
| お見積りは無料です | (không viết) |
| サポートをお約束します | 〜に努めています |

### Bịa hoạt động
- Bài viết mô tả thực tập sinh, hiện trường, sự kiện **chưa từng diễn ra**
- 導入事例 với khách hàng không có thật
- Ảnh stock đặt ở vị trí gợi ý là ảnh hoạt động thật của tổ chức

  > **Ranh giới:** ảnh trang trí gắn với địa phương (VD 厳島神社 大鳥居 ở `/about`)
  > **được phép** — miễn là `alt` mô tả đúng nội dung ảnh và ảnh không đặt kèm
  > chú thích khẳng định đó là hoạt động của tổ chức. Cấm là khi ảnh + chú thích
  > tạo ra tuyên bố sai, VD 6 ảnh stock kèm 「実習生の成長を毎週更新中」.

- Ảnh phải **tự host** trong `public/images/`, không hotlink từ CDN ngoài —
  xem `public/images/README.md`.
- Link SNS trỏ tới trang chủ dịch vụ thay vì tài khoản thật của tổ chức

### Tài liệu chỉ được công khai sau khi có phép
- 業務運営規程
- 監理支援費表
- 個人情報の適正管理及び秘密の保持に関する規程

> Được phép **nêu tên** kèm ghi chú「許可取得後に公開」 (đang làm ở `/licensing`).
> **Không** được đăng nội dung tài liệu.

---

## ✅ ĐƯỢC viết

1. 組合の基本情報 — tên, địa chỉ, liên hệ, 設立, 出資金, 組合員数, 代表理事
2. 理念・目的
3. **Nghiệp vụ hiện đang được phép làm** — 共同購買事業 v.v.
4. お問い合わせ
5. 技能実習・育成就労・特定技能 — **ở mức thông tin chung, có trích nguồn**
6. 「監理支援事業は現在、許可申請中です」

---

## Mẫu câu an toàn

| Tình huống | Mẫu câu |
|---|---|
| Nói về 監理支援事業 | 「監理支援事業の実施に向け、現在、許可申請手続きを進めています。」 |
| Nói rõ chưa hoạt động | 「現時点では監理支援事業を行っておりません。」 |
| Mở đầu phần giải thích chế độ | 「〜制度は、…を目的として設けられた制度です。」 |
| Kết phần giải thích chế độ | 「出典：出入国在留管理庁の公表資料をもとに、一般的な情報として作成しています。」 |
| Nói về nội dung chưa chốt | 「詳細につきましては、準備が整い次第、掲載いたします。」 |
| Nói về việc tổ chức đang làm | 「〜に努めています」「〜を目指しています」 |

**Không dùng:**「〜します」「〜いたします」「保証」「確約」「お約束」 cho nghiệp vụ
chưa được cấp phép.

---

## Cách thêm 1 bài お知らせ

Sửa `content/posts.ts`:

```ts
{
  slug: 'ten-slug-khong-dau',
  category: 'info',              // 'info' | 'blog' | 'event'
  date: '2026-09-04',            // ISO
  // cover: bỏ trống → dùng nền chuyển sắc. Chỉ đặt ảnh THẬT của tổ chức.
  title:   { ja: '…', en: '…' },
  excerpt: { ja: '…', en: '…' },
  body:    { ja: ['đoạn 1', 'đoạn 2'], en: ['…'] }
}
```

Bắt buộc: **cả `ja` và `en`**. Nội dung phải là sự việc có thật.

---

## Bắt buộc chạy trước khi deploy

```bash
bash scripts/check-compliance.sh
```

PASS mới được deploy. Script quét `app/ components/ messages/ content/ lib/`
tìm từ ngữ cấm và kiểm tra các nội dung bắt buộc phải có.

Nếu script báo sai (false positive) — ví dụ từ khoá nằm trong comment hướng dẫn
— hãy **sửa cách viết comment**, đừng nới rule của script.
