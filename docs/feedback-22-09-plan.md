# Phân tích feedback 22-09 và plan chỉnh sửa

| | |
|---|---|
| Nguồn | `feedback-22-09.md` (khách dùng AI để soát toàn bộ trang) |
| Ngày | 2026-09-22 |
| Trạng thái | 🟡 **ĐANG TRIỂN KHAI** — ① và ③ đã sửa (2026-09-22); ② chờ dữ liệu khách; gửi khách: `docs/client-request-22-09.vi.md` / `.ja.md` |
| Base commit | `b927d06` (master) |

---

## 0. Tóm tắt

Khách soát toàn bộ trang với giả định cán bộ thẩm định (機構) sẽ xem web khi xét hồ sơ xin phép 監理支援機関. Kết luận của họ: hướng làm đã tốt, nhưng cần sửa 4 điểm trước khi nộp hồ sơ.

| # | Mức độ | Nội dung | Phải sửa code? | Cần khách cung cấp gì |
|---|---|---|---|---|
| ① | Cao nhất | Xóa badge 「✓ OTIT 認可」 | Có | Không cần |
| ② | Quan trọng | Điền các mục 「準備中」 trong 組合概要 | Có (sửa dữ liệu) | **Cần**: 登記事項証明書, 定款 |
| ③ | Quan trọng | Cập nhật trang 育成就労 theo chế độ mới nhất | Có (sửa nội dung) | Nên để khách duyệt câu chữ |
| ④ | OK | Trang 「許可後に公開する書類」 | Không | Không |
| ⑤ | Bước cuối | Đối chiếu web với 申請書, 登記, 定款 | Không (chỉ kiểm tra) | Bản sao hồ sơ |

Khách muốn **giữ nguyên**:
- Câu 「現在、許可申請手続きを進めています」 / 「関係機関の許可を受けた後に開始」 / 「現時点では監理支援事業を行っておりません」.
- Disclaimer 「本ページは制度の一般的な説明であり…」 ở các trang 技能実習, 育成就労, 特定技能.
- プライバシーポリシー.

Plan này không động vào những phần đó.

---

## ① Xóa 「✓ OTIT 認可」 (ưu tiên cao nhất)

### Khách yêu cầu
Tổ chức mới đang xin phép nên dòng 「OTIT 認可」 dễ bị hiểu là đã được cấp phép. Khách gợi ý thay bằng:
- ✓ 監理支援機関 許可申請中
- ✓ 多言語サポート体制
- ✓ 育成就労制度への対応準備中

### Hiện trạng
- `components/sections/hero.tsx:64-69` có 3 badge viết cứng bằng tiếng Nhật: `✓ OTIT 認可`, `✓ 24/7 多言語サポート`, `✓ 育成就労 対応`.
- Đây là phần còn sót từ template cũ. Đợt sửa 09-03 bỏ sót vì rà theo message key, mà chữ này không nằm trong `messages/*.json`.
- Vì viết cứng nên trang tiếng Anh `/en` cũng hiện chữ Nhật.
- Ngoài dòng OTIT, 2 badge còn lại cũng có rủi ro:
  - 「24/7 多言語サポート」 là cam kết dịch vụ, trong khi tổ chức chưa được phép hoạt động.
  - 「育成就労 対応」 ngụ ý là đang làm dịch vụ này.

### Cách xử lý
1. Chuyển 3 badge vào `messages/ja.json` và `messages/en.json` (namespace `hero.badges`) để trang EN hiện tiếng Anh.
2. Hiển thị badge theo `LICENSE_STATUS` trong `lib/site-config.ts`, giống cơ chế `showApplyingNotice` đang có. Khi có phép, đổi 1 flag là xong, không phải sửa lại hero.
3. Nội dung theo gợi ý của khách:
   - JA: `監理支援機関 許可申請中` / `多言語サポート体制` / `育成就労制度への対応準備中`
   - EN: `Supervising & Support Organization license: application in progress` / `Multilingual support structure` / `Preparing for the Ikusei-Shuro program`
4. Ghi điều cần lưu vào `docs/after-approval-checklist.md`: sau khi có phép thì đổi badge thành gì. Tuyệt đối không dùng chữ "OTIT 認可". OTIT không phải cơ quan cấp phép cho 監理支援機関.
5. Grep lại toàn repo (tsx, ts, json, md) với các từ `OTIT`, `認可`, `許可済`, `24/7`, `対応` để chắc không còn sót chỗ nào khác.

> ⚠️ **Cần xác nhận với khách:** 「多言語サポート体制」 cũng là mô tả dịch vụ. Nếu hiện tại tổ chức chưa có nhân sự đa ngôn ngữ thật, đề xuất bỏ badge này và chỉ giữ 2 badge.

### Sau khi xử lý
- Hero trang chủ hiện: 「✓ 監理支援機関 許可申請中 ✓ 多言語サポート体制 ✓ 育成就労制度への対応準備中」.
- Trang `/en` hiện bản tiếng Anh tương ứng.
- Khi có phép, đổi `LICENSE_STATUS` là badge tự đổi theo.

---

## ② Điền các mục 「準備中」 trong 組合概要

### Khách yêu cầu
URL này sẽ nộp cho 機構, nên thông tin trên web phải khớp với 登記事項証明書, 定款 và đơn xin phép. Các mục 設立年月日, 代表理事, 事業区域 đã chốt thì không có lý do để ghi 「準備中」. Riêng 組合員数 hay thay đổi nên có thể cân nhắc bỏ.

### Hiện trạng
- `lib/site-config.ts:54-62`: `ORG_PROFILE` có tất cả các trường là `null`. Đây là chủ ý từ đợt trước, để không tự bịa số liệu.
- `app/[locale]/about/page.tsx:36-40`: gặp `null` thì hiện `tc('preparing')`, tức 「準備中」 cho 5 dòng: 設立年月日, 出資金, 組合員数, 代表理事, 事業区域.
- Khi có `representative`, lời chào 代表挨拶 sẽ tự hiện tên người ký (`about/page.tsx:73`).

### Cách xử lý
1. **Việc của khách:** gửi thông tin chính xác theo 登記事項証明書 và 定款, gồm:
   - 設立年月日, viết theo lịch Nhật (令和◯年◯月◯日) hay dương lịch?
   - 出資金 (◯◯円)
   - Chức danh và họ tên 代表理事
   - 事業区域, chép đúng câu chữ trong 定款 (ví dụ 「広島県及び…」)
   - 組合員数: công khai hay không. Nếu công khai thì ghi theo mẫu 「◯社（令和◯年◯月現在）」.
   - Tùy chọn: 営業時間, FAX. Đã có sẵn trường trong config, footer và trang contact tự hiện khi có dữ liệu.
2. **Việc của dev:** điền giá trị vào `ORG_PROFILE`. Không cần sửa logic.
3. Bổ sung logic: **ẩn hẳn dòng** nào khách quyết định không công khai (ví dụ 組合員数) thay vì hiện 「準備中」. Như vậy trang 組合概要 không còn chữ 「準備中」 nào.
4. Cần bản tiếng Anh cho 事業区域. Tên người giữ nguyên chữ Nhật, hoặc thêm romaji nếu khách cung cấp.

### Sau khi xử lý
- Bảng 組合情報 chỉ còn thông tin đã xác nhận, khớp chữ với 登記 và 定款, không còn 「準備中」.
- Mục 代表挨拶 có tên 代表理事.

> ⏸️ **Điểm chặn:** Chưa có dữ liệu từ khách thì chưa làm được mục này. Không tự điền.

---

## ③ Cập nhật trang 育成就労制度 (`/system/ikusei-shuro`)

### Khách yêu cầu
Web vẫn còn cách viết của giai đoạn chế độ đang được thảo luận, như 「2027年までに施行される予定」 và 「〜する方向」. Thực tế:
- Chế độ **có hiệu lực ngày 2027年4月1日**.
- Hồ sơ xin phép 監理支援機関 trước ngày hiệu lực được nhận **từ 2026年4月15日**.
- Hồ sơ 育成就労計画 trước ngày hiệu lực dự kiến nhận **từ 2026年9月1日**.
- 運用要領 được cập nhật lần gần nhất **2026年8月5日**.

Phần chuyển việc (転籍) và yêu cầu tiếng Nhật cần viết theo 運用要領 hiện hành. Một tổ chức làm về chế độ này mà dùng câu chữ cũ sẽ để lại ấn tượng không tốt.

### Hiện trạng
Những chỗ chứa câu chữ cũ:

| Vị trí | Nội dung hiện tại |
|---|---|
| `messages/ja.json:227` `ssw.overviewBody` | 「2027年までに施行される予定です」 |
| `ja.json:249` bảng so sánh, dòng 転籍 | 「一定の要件のもとで可能とする方向」 |
| `ja.json:254` bảng so sánh, dòng 日本語要件 | 「段階的に要件を設ける方向」 |
| `ja.json:266` `points.transfer.desc` | 「…認められる方向で制度設計がなされています」 |
| `ja.json:270` `points.japanese.desc` | 「…設けられる方向で制度設計がなされています」 |
| `ja.json:274` `scheduleNote` | 「見通しであり、今後変更される可能性」 |
| `app/[locale]/system/ikusei-shuro/page.tsx:12-17` timeline | `2026: 関係省令・指針の整備` / `2027: 施行（予定）` |
| `messages/en.json` | Các câu tiếng Anh tương ứng ("by 2027"…) |

Đã grep `方向` và `2027` trên toàn repo. Ngoài các chỗ trên chỉ còn `tit.faq.a4` ở trang 技能実習 (「経過措置等は…定められます」). Câu này chưa sai nhưng có thể viết cụ thể hơn.

### Cách xử lý
1. **Tra nguồn chính thức trước khi viết.** Lấy từ trang 育成就労 của 法務省 / 出入国在留管理庁, 運用要領 bản 2026-08-05, và thông báo nhận hồ sơ của 機構. Mỗi con số và mốc thời gian phải có nguồn, không viết theo trí nhớ.
2. Viết lại các đoạn trên theo thể **mô tả chế độ ở thì hiện tại**, bỏ 「方向」 và 「予定」:
   - **Tổng quan:** 「…2027年4月1日から施行されます」.
   - **転籍:** nêu điều kiện theo 運用要領, gồm thời gian đã làm tại cùng một nơi theo từng ngành nghề, mức kỹ năng, mức tiếng Nhật, và điều kiện đối với nơi nhận chuyển đến.
   - **日本語要件:** nêu các mốc bắt buộc (trước khi bắt đầu làm việc, sau khoảng 1 năm, khi chuyển sang 特定技能1号) và trình độ tương ứng, sau khi đã đối chiếu với tài liệu chính thức.
   - Ở câu nào quy định còn khác nhau theo ngành nghề thì ghi rõ 「分野により異なります」.
3. **Timeline mới** (mốc nào cũng phải có nguồn):

   | Thời điểm | Nội dung |
   |---|---|
   | 2024年6月 | 改正法の成立・公布 |
   | 2025年 | 政令・省令・基本方針等の整備 |
   | 2026年4月15日 | 監理支援機関の許可の施行日前申請 受付開始 |
   | 2026年9月1日 | 育成就労計画の認定の施行日前申請 受付開始 |
   | 2027年4月1日 | 育成就労制度 施行 |
   | 施行後 | 技能実習制度からの経過措置 |

4. Sửa `scheduleNote` thành 「令和8年9月時点の公表情報に基づきます。最新情報は関係機関の公表資料をご確認ください。」. Ghi thêm tên 運用要領 và ngày cập nhật vào `sourceNote`.
5. Cập nhật `en.json` cho khớp.
6. Rà nhanh trang 技能実習 (`tit.faq.a4`) và trang 特定技能 (bảng so sánh) để các mốc thời gian nhất quán giữa 3 trang.
7. **Giữ nguyên** disclaimer 「本ページは制度の一般的な説明であり…」 ở cuối trang.

> 💡 Khách có đề nghị để AI của họ soạn sẵn bản sửa (「修正指示書」). **Đề xuất: nhận bản đó nếu khách gửi.** Team mình vẫn đối chiếu lại với nguồn chính thức rồi mới đưa lên. Nếu khách không gửi, team mình soạn bản nháp để khách duyệt câu chữ trước khi deploy.

### Sau khi xử lý
- Trang 育成就労 ghi đúng ngày có hiệu lực 2027年4月1日.
- Có timeline đủ các mốc nhận hồ sơ.
- Phần 転籍 và 日本語要件 viết theo 運用要領 hiện hành, không còn 「方向」 hay 「予定」.
- Nguồn và ngày tham chiếu được ghi rõ.
- Bản JA và EN khớp nhau.

---

## ④ Trang 「許可後に公開する書類」: không sửa

- **Khách đánh giá:** Tốt. Danh sách hồ sơ nộp mới nhất của 機構 cũng ghi rõ 業務運営規程 và 監理支援費表 phải được công khai trên internet sau khi có phép.
- **Hiện trạng:** Trang `/licensing` đang ghi 3 văn bản sẽ công khai sau khi có phép. `FEATURES.publicDocuments = isApproved`.
- **Xử lý:** Không sửa code. Chỉ kiểm tra lại tên 3 văn bản có khớp với danh sách hồ sơ mới nhất của 機構 không.

---

## ⑤ Đối chiếu cuối trước khi nộp hồ sơ

Khách đề xuất đối chiếu tên, địa chỉ, 代表者 và 事業区域 giữa web và 申請書, 登記, 定款.

**Cách làm:** Sau khi xong ①–③, lập bảng đối chiếu (web ↔ 登記 ↔ 定款 ↔ 申請書) cho các mục: 名称, 所在地 (thống nhất chữ số full-width hay half-width), TEL, 代表者, 事業区域, 設立年月日, 事業内容. Khách tick xác nhận từng dòng.

---

## Thứ tự triển khai

| Bước | Việc | Phụ thuộc |
|---|---|---|
| 1 | ① Badge hero, chuyển vào i18n và gắn với `LICENSE_STATUS` | Làm được ngay |
| 2 | ③ Tra nguồn chính thức, soạn nội dung JA/EN mới, gửi khách duyệt, rồi cập nhật code | Cần khách duyệt câu chữ |
| 3 | ② Điền `ORG_PROFILE` và ẩn các dòng không công khai | Cần dữ liệu 登記 / 定款 |
| 4 | ⑤ Bảng đối chiếu cuối | Sau bước 1–3 |
| 5 | `yarn build`, kiểm tra thủ công `/ja` và `/en` (trang chủ, about, ikusei-shuro), cập nhật `docs/after-approval-checklist.md` và ghi lại vào `docs/` | — |

Mỗi bước là 1 commit riêng (`fix(hero)…`, `content(ikusei-shuro)…`, `content(about)…`) để dễ review và dễ revert.

## Cần khách trả lời

1. Dữ liệu 組合概要 theo 登記 / 定款: 設立年月日, 出資金, 代表理事, 事業区域.
2. Có công khai 組合員数 không?
3. Giữ badge 「多言語サポート体制」 không, hay bỏ?
4. Khách có gửi 「修正指示書」 do AI của họ soạn cho trang 育成就労 không, hay để team mình soạn rồi gửi duyệt?

---

## Kết quả triển khai (2026-09-22)

| # | Trạng thái | Đã làm |
|---|---|---|
| ① | ✅ Xong | Badge hero chuyển vào `hero.badges.applying` (JA/EN), chỉ hiện khi `isApplying`. Thêm rule chặn `OTIT 認可` và `24/7` vào `scripts/check-compliance.sh` |
| ② | 🟡 Chờ khách | Đã thêm hỗ trợ `false` = ẩn dòng trong `ORG_PROFILE`. Chưa điền dữ liệu |
| ③ | ✅ Xong (chờ khách duyệt câu chữ) | Viết lại `ssw.*`, timeline 6 mốc (hiển thị theo ngôn ngữ), `tit.faq.a4`. Nguồn: 出入国在留管理庁「育成就労制度Q&A」. Thêm rule chặn cách viết cũ (§5b) |
| ④ | ✅ Không đổi | — |
| ⑤ | ⏸️ Sau ② | — |

Kiểm tra: `npm run build` OK, `bash scripts/check-compliance.sh` PASS. Rule mới bắt được đúng nội dung cũ ở `HEAD` (2 lỗi ở hero, 5 lỗi ở `ja.json`).

Nguồn đã tra:
- https://www.moj.go.jp/isa/applications/faq/ikusei_qa_00002.html (施行日 Q3, 転籍 Q48/Q50, 日本語 Q56/Q75, 在留期間 Q9)
- Chưa đối chiếu trực tiếp 運用要領 bản 2026-08-05 mà khách nhắc tới
