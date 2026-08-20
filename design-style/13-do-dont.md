# 13 — Nên và không nên

Checklist ngắn khi review UI. Chi tiết nằm ở các file khác.

## Màu

**Nên**

- Nền `background` / `card`, chữ `ink-900` / `ink-800`.
- Một primary CTA.
- Pastel `-soft` cho chip, tint card, empty icon well.
- Overdue = rose-soft; reminder = butter-soft; success = sage-soft.

**Không**

- `zinc`, `slate`, `neutral` Tailwind mặc định.
- `#000` / `#fff` thuần.
- Gradient trên nút, chữ rainbow.
- Primary nhạt (`sage`) làm nền nút + chữ kem.
- Dark mode đảo màu tạm.
- 5+ pastel trên một card.

## Chữ

**Nên**

- Fraunces cho H1/H2/CardTitle/timer.
- Nunito semibold cho nút, nav, label.
- `text-sm` body, `text-xs` meta.
- `tabular-nums` cho giờ và stat.

**Không**

- Inter / Roboto / font thứ 3.
- Fraunces trong button.
- ALL CAPS trừ kicker session.
- Body `text-base` hàng loạt (phá mật độ).
- Chữ < 10px.

## Layout & hình khối

**Nên**

- Card `rounded-2xl shadow-soft border-border/70`.
- Control `h-11 rounded-xl`.
- `space-y-6` giữa section, `gap-3` grid.
- `pb-24` trên mobile (đã có shell).

**Không**

- Card góc vuông / `rounded-md` nhỏ.
- Shadow đen `shadow-xl`.
- Full-bleed bảng Excel.
- Sticky CTA đè bottom nav.

## Motion

**Nên**

- `animate-fade-up` khi vào trang.
- `active:scale-[0.98]` trên button.
- Một float / viewport.

**Không**

- Parallax, confetti, shake.
- Pulse chữ.
- Bỏ qua `prefers-reduced-motion`.

## Component

**Nên**

- Dùng primitive sẵn có.
- EmptyState dashed + 🍃.
- Toast top-center card style.
- Dialog `max-w-lg` bo 2xl.

**Không**

- Alert native browser cho flow chính.
- Modal full-screen không cần thiết.
- Badge bấm được giả làm nút.
- Placeholder thay label.

## Nội dung

**Nên**

- Việt, xưng bạn, câu ngắn.
- AI = xem trước + xác nhận.
- Lỗi có cách sửa.

**Không**

- Hustle copy, emoji 🚀💯 trong H1.
- Mã lỗi Firebase trần.
- “Bạn đã thất bại streak”.

## Icon

**Nên**

- Lucide, size 16 mặc định, map nav ổn định.

**Không**

- Đổi icon Today mỗi sprint.
- Icon nhiều màu trong một hàng nav.
