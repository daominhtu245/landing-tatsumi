# Checklist: việc cần làm NGAY khi nhận được 許可

> Tài liệu này dành cho thời điểm たつみ協同組合 nhận được giấy phép
> 監理支援事業. Trước thời điểm đó, **không thực hiện bước nào bên dưới**.

---

## Bước 1 — Đổi trạng thái giấy phép (1 dòng)

`lib/site-config.ts`:

```diff
- export const LICENSE_STATUS = 'applying' as LicenseStatus;
+ export const LICENSE_STATUS = 'approved' as LicenseStatus;
```

Một dòng này tự động làm 4 việc:

| | Trước | Sau |
|---|---|---|
| `FEATURES.showApplyingNotice` | `true` → hiện banner 許可申請中 ở trang chủ, `/business` | `false` → banner biến mất toàn site |
| `FEATURES.publicDocuments` | `false` → `/licensing` hiện danh sách「許可取得後に公開」 | `true` → khối đó ẩn, thay bằng link tài liệu thật |
| `FEATURES.recruitment` | `false` | `true` |
| `SystemDisclaimer` | hiện dòng「当該事業は現在、許可申請中です」ở 3 trang chế độ | ẩn dòng đó, giữ phần ghi nguồn |

Sau khi đổi, chạy:

```bash
npm run build && bash scripts/check-compliance.sh
```

> ⚠️ `check-compliance.sh` được viết cho giai đoạn 申請中. Sau khi có phép, các
> rule ở mục 1, 2, 3 của script cần nới lại — xem Bước 6.

---

## Bước 2 — Công khai 3 tài liệu bắt buộc

Theo quy định, 3 tài liệu này **chỉ được công khai sau khi có giấy phép**:

1. 個人情報の適正管理及び秘密の保持に関する規程の写し
2. 業務運営規程
3. 監理支援費表

**Cách làm:**

1. Đặt file PDF vào `public/documents/`:
   ```
   public/documents/kojin-joho-kitei.pdf
   public/documents/gyomu-unei-kitei.pdf
   public/documents/kanri-shien-hi.pdf
   ```
2. Trong `app/[locale]/licensing/page.tsx`, khối `{!FEATURES.publicDocuments && ...}`
   sẽ tự ẩn. Thêm khối mới `{FEATURES.publicDocuments && ...}` hiển thị 3 link tải.
3. Bỏ hậu tố「（許可取得後に公開）」trong `messages/{ja,en}.json` →
   `licensing.futureDocs.doc1/2/3`, đổi key sang `licensing.docs.*`.

---

## Bước 3 — Cập nhật nội dung trang `/licensing`

| Việc | Chi tiết |
|---|---|
| Đổi `statementBody1/2` | Hiện là文言「許可申請手続きを進めています / 現時点では行っておりません」→ thay bằng nội dung sau khi có phép |
| Thêm 許可番号 và 許可年月日 | Vào bảng `licensing.status` |
| Đổi `subtitle` / tiêu đề bảng | 「現在の状況」→ 「許可の状況」 |

---

## Bước 4 — Cập nhật thông tin tổ chức

`lib/site-config.ts` → `ORG_PROFILE`. Điền các mục còn `null` (đang hiển thị
「準備中」 trên `/about`):

```ts
established: '○○年○月○日',
capital: '○○○万円',
memberCount: '○○社',
representative: '永井伸枝',   // ← cần khách hàng xác nhận
businessArea: '広島県',
businessHours: '平日 9:00〜18:00',
```

---

## Bước 5 — Khôi phục các phần đang ẩn (nếu cần)

Xem `_archive/README.md` để biết chi tiết từng mục.

| Mục | Việc cần làm |
|---|---|
| `/recruitment` | Copy từ `_archive/`, **viết lại nội dung** cho khớp phạm vi giấy phép, gỡ redirect trong `next.config.mjs`, thêm lại vào header/footer/sitemap |
| SNS | Điền `SOCIAL` + `socialLinks` bằng tài khoản thật, bật `FEATURES.socialFeed` / `socialLinks` |
| Blog | Bật `FEATURES.blog`, viết bài mới bằng dữ liệu thật (xem `docs/content-guidelines.md`) |

> ⚠️ **Không copy nguyên văn** nội dung loại **B** trong `_archive/`. Đó là nội
> dung bịa, sai kể cả sau khi đã có giấy phép.

---

## Bước 6 — Nới quy tắc cho `scripts/check-compliance.sh`

Sau khi có phép, các rule sau **không còn đúng** và cần sửa:

| Mục trong script | Xử lý |
|---|---|
| §1 Mạo nhận tư cách pháp lý | Cho phép 「監理支援機関です」 nếu đúng với giấy phép; giữ chặn 「認定」「登録済」 nếu không chính xác |
| §3 Tài liệu chỉ công khai sau khi có phép | **Gỡ toàn bộ** — 3 tài liệu giờ bắt buộc công khai |
| §6 Nội dung bắt buộc | Bỏ yêu cầu 「現時点では監理支援事業を行っておりません」, thay bằng yêu cầu có 許可番号 |
| §2 Cam kết dịch vụ | **GIỮ NGUYÊN** — 「受入実績」「お約束します」「24時間365日」 vẫn phải đúng sự thật |

---

## Bước 7 — Kiểm tra & deploy

```bash
npm run build
bash scripts/check-compliance.sh
```

- [ ] Không còn chữ 「申請中」 ở bất cứ đâu (`grep -rn '申請中' app components messages`)
- [ ] 3 tài liệu tải về được ở cả `/ja/licensing` và `/en/licensing`
- [ ] 許可番号 hiển thị đúng
- [ ] Kiểm tra 2 ngôn ngữ × toàn bộ trang
- [ ] Submit lại sitemap lên Google Search Console
