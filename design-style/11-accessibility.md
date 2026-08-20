# 11 — Accessibility

Dịu dàng phải dùng được: bàn phím, reader, giảm motion, contrast trên giấy kem.

## Focus

Mọi control: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` (+ `ring-offset-2` trên nút). Ring `#6b8f71`.

Không `outline-none` trơn. Không chỉ hover.

Thứ tự tab theo DOM. Dialog trap focus + Escape. Close có accessible name.

## Tên gọi

- Nav: `aria-label` (“Điều hướng chính”, “Primary”).
- FAB / icon-only: `aria-label`.
- Loader: `aria-label` đang tải.
- Blob, empty emoji, skeleton: `aria-hidden`.

## Contrast

Muted `#7a6b5d` trên `#f7f1e8` đạt khoảng **AA** cho chữ ≥ 14px semibold / 18px regular.

- Body quan trọng: `ink-800` / `ink-900`.
- Muted: caption, timestamp, nav inactive, placeholder.
- Placeholder không thay label.
- Chữ trên `*-soft`: `ink-800`, `primary` (sage-soft), hoặc `destructive` (rose-soft).
- Nút primary: kem trên `#6b8f71`. Không đổi sang `sage` nhạt.
- Badge `primary/15`: chip OK, không dùng cho đoạn văn.

## Motion

[06-elevation-motion.md](./06-elevation-motion.md). Cắt animation khi `prefers-reduced-motion`. Số đếm / timer vẫn chạy.

Không autoplay video/sound. Notification hệ thống chỉ khi user bật.

## Touch

- Control chính ≥ 44px (`h-11`).
- Bottom nav: cả cột bấm được.
- FAB 56px.
- Hàng settings thoáng, switch không dính.

## Số & thời gian

- `tabular-nums` cho giờ và KPI.
- Thời lượng nên đọc được (“2 giờ 15 phút”) hơn `2h15` nếu audience phổ thông.
- Ngày theo locale website.
- Chart: có số ở stat, không chỉ màu.

## Form

- Label visible.
- `autocomplete` đúng trên auth.
- `required` khi bắt buộc.
- Lỗi bằng chữ, không chỉ viền.
- Busy: disable form, spinner trong nút.

## Ngôn ngữ

`html lang` đúng. Đoạn ngoại ngữ dài: đánh dấu `lang` riêng.

## Widget

Tabs, select, dialog, switch: primitive có keyboard (Radix hoặc tương đương). Chip chọn = `button`, không `div onClick`.

## Cấm

- Text trong ảnh là thông tin duy nhất
- Muted trên peach-soft cho đoạn dài
- `title` tooltip là tên duy nhất của nút
- Blink / pulse chữ
- CTA chỉ hiện khi hover
