# 13 — Nên và không nên

Checklist review UI khi áp dụng Giấy ấm cho website bất kỳ.

## Màu

**Nên:** nền `background` / `card`, chữ ink; một CTA primary; pastel `-soft` cho chip và tint; rose-soft cảnh báo nhẹ; butter-soft nhắc; sage-soft success.

**Không:** `zinc` / `slate`; `#000` / `#fff` thuần; gradient nút; `sage` nhạt làm nền CTA; dark mode đảo; 5+ pastel một card.

## Chữ

**Nên:** Fraunces H1/H2/card title/số lớn; Nunito semibold nút/nav/label; body `text-sm`; `tabular-nums` cho số.

**Không:** font thứ 3; Fraunces trong button; ALL CAPS trừ kicker; body `text-base` hàng loạt trong app; chữ < 10px.

## Layout

**Nên:** card `rounded-2xl shadow-soft border-border/70`; control `h-11 rounded-xl`; `space-y-6` / `gap-3`; `pb-24` nếu có bottom nav.

**Không:** card góc vuông / radius 6–8px; `shadow-xl` đen; bảng Excel full-bleed; sticky CTA đè nav.

## Motion

**Nên:** `animate-fade-up` vào trang; `active:scale-[0.98]` nút; một float / viewport.

**Không:** parallax, confetti, shake; pulse chữ; bỏ `prefers-reduced-motion`.

## Component

**Nên:** empty dashed + 🍃 (hoặc một glyph trong ô sage-soft); toast top-center card; dialog `max-w-lg` bo 2xl.

**Không:** `alert()` cho flow chính; modal full-screen không cần; badge giả nút; placeholder thay label.

## Nội dung

**Nên:** ngắn, ấm; gợi ý tự động = xem trước + xác nhận; lỗi có cách sửa.

**Không:** hustle copy, emoji 🚀 trong H1; mã lỗi trần; đổ lỗi user.

## Icon

**Nên:** Lucide (hoặc SVG 1 màu), 16px mặc định, map vai trò ổn định trong *website đó*.

**Không:** đổi icon home mỗi lần; 8 màu icon trên một nav.
