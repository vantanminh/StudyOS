# 11 — Accessibility

Dịu dàng phải **dùng được**: bàn phím, reader, giảm motion, contrast trên giấy kem.

## Focus

Mọi control tương tác: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring` (và `ring-offset-2` trên nút). Ring = `primary` `#6b8f71`.

Không `outline-none` mà không ring thay thế. Không chỉ dựa vào hover.

Thứ tự tab theo DOM. Dialog Radix đã trap focus + Escape. Close có `aria-label="Đóng"`.

## Tên gọi

- Nav: `aria-label="Điều hướng chính"` / `"Điều hướng mobile"`.
- FAB: `aria-label="Thêm task"`.
- Quick Add header button: `"Thêm nhanh"`.
- Session Pause/Resume/End: label Việt.
- Loader giữa màn: `aria-label="Đang tải"`.
- Blobs / deco: `aria-hidden`.
- Empty emoji ô: `aria-hidden`.
- Skeleton: `aria-hidden`.

Icon-only = luôn có accessible name.

## Contrast

Nền kem làm muted (`#7a6b5d` trên `#f7f1e8`) đạt khoảng **AA cho chữ ≥ 14px semibold / 18px regular**. Vì vậy:

- Body quan trọng: `ink-800` / `ink-900`, không muted.
- Muted chỉ caption, timestamp, nav inactive, placeholder.
- Placeholder không phải instruction duy nhất — luôn có Label.
- Chữ trên `*-soft`: `ink-800`, `primary` (sage-soft), hoặc `destructive` (rose-soft).
- Nút primary: kem trên `#6b8f71` — đủ. Không đổi primary sang `sage` nhạt.
- `primary/15` badge: chữ `primary` đậm, size `xs` semibold — chấp nhận cho chip, không cho đoạn văn.

Destructive `#c45c5c` trên kem: cảnh báo/link OK. Trên rose-soft: tốt hơn cho badge.

## Motion

Xem [06-elevation-motion.md](./06-elevation-motion.md). `prefers-reduced-motion` đã cắt animation/transition global. Timer session **không** phải animation trang trí — vẫn cập nhật số.

Không autoplay video/sound. Notification hệ thống chỉ khi user bật và đã grant.

## Touch & mục tiêu

- Control chính ≥ 44px (`h-11`).
- Bottom nav: cả cột bấm được, không chỉ icon.
- FAB 56px.
- Hàng settings: cả row cao thoáng, switch không dính nhau.

## Đọc số & thời gian

- Timer `tabular-nums` + format `mm:ss`.
- `formatMinutes` ra “2 giờ 15 phút” — tốt cho reader hơn `2h15`.
- Ngày: `EEEE, d MMMM yyyy` locale `vi`.
- Chart: không chỉ màu — có số ở stat row phía trên.

## Form

- Label visible, không chỉ placeholder.
- `autoComplete` đúng trên login (`email`, `current-password` / `new-password`).
- `required` khi field bắt buộc.
- Lỗi: text, không chỉ màu viền.
- Disabled: `opacity-50` + `pointer-events-none` / `cursor-not-allowed`; khi busy, disable cả form (login đã làm).

## Ngôn ngữ trang

`<html lang="vi">`. Đừng để đoạn Anh dài không khai báo nếu sau này xen nội dung Anh.

## Keyboard trên custom widget

Tabs, Select, Dialog, Switch: Radix — giữ primitive, đừng thay `div onClick` cho tab. Chip onboarding là `button` (toggle) — Enter/Space hoạt động.

## Cấm a11y-break

- Text trong ảnh
- Contrast xám nhạt trên peach
- `title` tooltip là thông tin duy nhất
- Blink / pulse trên chữ
- Bắt buộc hover để hiện CTA
