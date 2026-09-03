#!/usr/bin/env bash
# ============================================================================
#  check-compliance.sh — Kiểm tra từ ngữ cấm trước khi deploy
#
#  Bối cảnh: たつみ協同組合 đang trong giai đoạn 許可申請中 của 監理支援事業.
#  Website KHÔNG được chứa nội dung ngụ ý đã có giấy phép hoặc đang
#  cung cấp dịch vụ chưa được cấp phép.
#
#  Dùng:  bash scripts/check-compliance.sh
#  Exit:  0 = sạch  |  1 = phát hiện vi phạm
#
#  ⚠️ SAU KHI CÓ 許可: xem docs/after-approval-checklist.md để nới quy tắc.
# ============================================================================
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

SCAN_DIRS=(app components messages content lib)
EXCLUDE='--exclude-dir=node_modules --exclude-dir=.next --exclude-dir=_archive'
RED=$'\033[31m'; YEL=$'\033[33m'; GRN=$'\033[32m'; DIM=$'\033[2m'; RST=$'\033[0m'
violations=0

# check <ERROR|WARN> <pattern> <reason> [allow_pattern]
#   allow_pattern: dòng khớp mẫu này được coi là hợp lệ và bỏ qua.
check() {
  local level="$1" pattern="$2" reason="$3" allow="${4:-}"
  local hits
  hits=$(grep -rnE $EXCLUDE "$pattern" "${SCAN_DIRS[@]}" 2>/dev/null)
  if [ -n "$allow" ] && [ -n "$hits" ]; then
    hits=$(echo "$hits" | grep -vE "$allow" || true)
  fi
  if [ -n "$hits" ]; then
    if [ "$level" = "ERROR" ]; then
      printf '%s✗ ERROR%s  %s\n' "$RED" "$RST" "$reason"
      violations=$((violations + 1))
    else
      printf '%s⚠ WARN %s  %s\n' "$YEL" "$RST" "$reason"
    fi
    printf '%s%s%s\n\n' "$DIM" "$(echo "$hits" | sed 's/^/         /')" "$RST"
  fi
}

echo "════════════════════════════════════════════════════════════"
echo " Kiểm tra tuân thủ — 許可申請中 (LICENSE_STATUS=applying)"
echo "════════════════════════════════════════════════════════════"
echo

echo "── 1. Mạo nhận tư cách pháp lý ─────────────────────────────"
check ERROR '監理支援機関(です|として)'        'Tự nhận là 監理支援機関'
check ERROR '監理団体(です|として|許可)'        'Tự nhận là 監理団体 / nhắc 監理団体許可'
check ERROR '許可(取得済|を受けました|の更新)'  'Tuyên bố đã có / đã gia hạn giấy phép'
check ERROR '(認定|登録)(済|されています)'      'Tuyên bố đã được công nhận / đăng ký'

echo "── 2. Cam kết dịch vụ chưa được phép ───────────────────────"
check ERROR '受入実績'                          'Tuyên bố có thành tích tiếp nhận'
check ERROR '(を|外国人を)受け入れます'          'Cam kết sẽ tiếp nhận'
check ERROR 'お約束します'                      'Cam kết dịch vụ'
check ERROR '(保証|確約)(します|いたします)'     'Bảo đảm / cam kết chắc chắn'
check ERROR '24時間.*(サポート|対応)'            'Cam kết mức dịch vụ 24h'
check ERROR '365日'                             'Cam kết mức dịch vụ 365 ngày'
check ERROR 'お見積り(は)?無料'                  'Báo giá dịch vụ chưa được phép'

echo "── 3. Tài liệu chỉ được công khai sau khi có phép ──────────"
# Cho phép NÊU TÊN tài liệu kèm ghi chú「許可取得後に公開」(trang /licensing,
# quyết định D-2). Vẫn chặn nếu công khai nội dung tài liệu.
DOC_ALLOW='許可取得後に公開|to be published after authorization'
check ERROR '業務運営規程'          '業務運営規程 bị công khai trước khi có phép'   "$DOC_ALLOW"
check ERROR '監理支援費表'          '監理支援費表 bị công khai trước khi có phép'   "$DOC_ALLOW"
check ERROR '秘密の保持に関する規程' '個人情報規程 bị công khai trước khi có phép'   "$DOC_ALLOW"

echo "── 4. Dữ liệu giả / rác kỹ thuật ───────────────────────────"
check ERROR '03-0000-0000'                      'Số điện thoại giả'
check ERROR 'example\.(jp|com)'                 'Domain giả'
check ERROR 'https://(www\.)?instagram\.com"'   'Link Instagram rỗng'
check ERROR 'https://(www\.)?facebook\.com"'    'Link Facebook rỗng'
check ERROR 'https://(www\.)?linkedin\.com"'    'Link LinkedIn rỗng'
check WARN  'images\.unsplash\.com'             'Ảnh stock — kiểm tra xem có ngụ ý hoạt động thật không'

echo "── 5. Diễn đạt tuyển dụng / môi giới ───────────────────────"
check ERROR '(実習生|技能実習生)を(募集|派遣|送り出)'  '募集・派遣表現'
check WARN  '応募'                              'Còn dấu vết 募集表現 — kiểm tra ngữ cảnh'
check WARN  '導入事例'                          'Có 導入事例 — cần là khách hàng thật'

echo "── 6. Nội dung BẮT BUỘC phải có ────────────────────────────"
# Nội dung bắt buộc phải xuất hiện ở phần HIỂN THỊ cho người dùng
# (messages/ + app/ + components/), không tính comment trong lib/.
RENDER_DIRS=(app components messages)
required() {
  local pattern="$1" reason="$2"
  if grep -rqE $EXCLUDE "$pattern" "${RENDER_DIRS[@]}" 2>/dev/null; then
    printf '%s✓%s      %s\n' "$GRN" "$RST" "$reason"
  else
    printf '%s✗ ERROR%s  THIẾU: %s\n' "$RED" "$RST" "$reason"
    violations=$((violations + 1))
  fi
}
required '許可申請'                        'Có nhắc trạng thái 許可申請中'
required '現時点では監理支援事業を行っておりません'  'Có câu tuyên bố chưa hoạt động (nguyên văn KH)'
# Thông tin liên hệ được khai báo tập trung ở lib/site-config.ts
required_any() {
  local pattern="$1" reason="$2"
  if grep -rqE $EXCLUDE "$pattern" "${SCAN_DIRS[@]}" 2>/dev/null; then
    printf '%s✓%s      %s\n' "$GRN" "$RST" "$reason"
  else
    printf '%s✗ ERROR%s  THIẾU: %s\n' "$RED" "$RST" "$reason"
    violations=$((violations + 1))
  fi
}
required_any '082-909-4208'                'Có số điện thoại thật'
required_any 'info@ta23\.net'              'Có email thật'
required_any '733-0033'                    'Có mã bưu chính'
echo

echo "════════════════════════════════════════════════════════════"
if [ "$violations" -eq 0 ]; then
  printf '%s PASS — không phát hiện vi phạm.%s\n' "$GRN" "$RST"
  echo "════════════════════════════════════════════════════════════"
  exit 0
else
  printf '%s FAIL — %d nhóm vi phạm. KHÔNG deploy cho đến khi xử lý xong.%s\n' "$RED" "$violations" "$RST"
  echo "════════════════════════════════════════════════════════════"
  exit 1
fi
