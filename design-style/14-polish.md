# 14 — Lớp chỉn chu (polish)

Chi tiết nâng hệ Giấy ấm khi dựng website mới. Không phụ thuộc tính năng gốc — chỉ hình và tương tác.

---

## 1. Quang học

- Icon cạnh chữ: `items-center gap-2`. Lệch: `translate-y-[0.5px]` trên icon.
- Wordmark cạnh ô 40px: tagline `text-xs` sát, leading chặt.
- Số 6xl: một dòng, `tabular-nums`, không `tracking-widest`.
- Badge + icon: `gap-1`, icon `3.5`.

## 2. Viền chỉ đủ thấy

| Bề mặt | Border |
| --- | --- |
| Card resting | `border-border/70` |
| Header / sidebar / nav | `/50`–`/60` |
| Ô lồng | `/50`–`/60` |
| Tint sage intro | `border-primary/15`–`/20` |
| Cảnh báo nhẹ | `border-rose/30` |
| Quá ngưỡng | `border-coral/50` |
| Tập trung / lifted mạnh | `border-none` |

Một object: tint **hoặc** lift mạnh — không cả ba (viền đậm + tint + lift), trừ auth card.

## 3. Hover = giấy nhấc lên

Tile bấm được: `hover:shadow-lift` hoặc `hover:bg-secondary`, không scale 1.02. Primary: `brightness-105` + lift. Disabled không hover.

## 4. Stagger

Hero 0ms, hàng sau 60ms / 120ms. Dừng sau 3–4 phần. `both` fill-mode trên fade-up.

## 5. Số liệu đo được

Stat lớn: semibold, ink hoặc primary, `tabular-nums`. Đơn vị nhỏ hơn số. Progress có label hoặc %. Chart: grid kem, bar sage, không legend rainbow.

## 6. Ngân sách pastel

Mỗi view: **1 canvas + 1 họ nhấn**. Settings: kem + một callout sage. Không peach + lavender + mint cùng form. Map cụ thể: [08-patterns.md](./08-patterns.md).

## 7. Chip chọn

Idle / hover / selected + focus ring như button. Selected: sage-soft + `shadow-soft`, không viền extra. `flex-wrap gap-2`.

## 8. Dialog đủ bộ

Title Fraunces, description nếu cần, body `space-y-4`, footer nút, X + Escape. Khẳng định = primary. Xoá = destructive. Mobile: primary trên (column-reverse).

## 9. Trạng thái hệ thống

| Trạng thái | Badge |
| --- | --- |
| Xong / synced | `success` |
| Đang chờ | `warn` |
| Thất bại | `danger` |
| Chế độ hạn chế | `outline` + `text-xs muted` |

Busy: spinner trong nút, disable sibling. Không spinner vô danh mãi.

## 10. Màn hình tập trung

Một card, `p-8 space-y-6`. Không list phụ, không chart. Kết thúc bằng dialog, không điều hướng mất context. Prompt tiếp tục: hai nút rõ trên card.

## 11. Empty một giọng

Mọi list trống cùng khung empty. Đổi copy. Giữ 🍃 (hoặc một glyph). “Không tìm thấy ID” là lỗi nhẹ, không empty “chưa có”.

## 12. Mobile

CTA hero wrap `gap-2`, không chỉ góc phải desktop. Gợi ý kéo-thả phải có nút/chữ, không chỉ hover. Bottom nav: 5 item, label `10px semibold`.

## 13. Dạy trong UI

Intro sage-soft + tip peach-soft. Số bước trong ô sage. Tip không `!`, không “Pro tip”.

## 14. Không hệ song song

Cấm “chỉn chu” bằng skin khác: token lạnh, Framer cho fade 450ms, checkbox lệch switch, glass `bg-white/10` dark dashboard.

Chỉn chu = làm đúng Giấy ấm, dày hơn — không theme mới.

## 15. Checklist ship

- [ ] Token từ catalog, không hex lạ
- [ ] Một primary
- [ ] Fraunces title, Nunito UI
- [ ] Empty / loading / error
- [ ] `aria-label` icon-only, `lang` đúng
- [ ] Ring focus, reduced motion
- [ ] Mobile không đè nav
- [ ] Copy ngắn, không hustle
- [ ] Pastel ≤ ngân sách view
- [ ] Toast chỉ khi cần biết

10/10 — UI thuộc Giấy ấm, dù website làm việc gì.
