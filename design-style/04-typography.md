# 04 — Typography

Hai họ chữ, hai việc. Không thêm font thứ ba.

## Họ chữ

| Vai trò | Font | Fallback | Load |
| --- | --- | --- | --- |
| UI / body | **Nunito** | `ui-sans-serif, system-ui, sans-serif` | 400, 500, 600, 700, 800 |
| Display / tiêu đề | **Fraunces** | `Georgia, serif` | opsz 9–144; 500, 600, 700 |

```css
--font-sans: "Nunito", ui-sans-serif, system-ui, sans-serif;
--font-display: "Fraunces", Georgia, serif;
```

Utility: `font-sans` (body), `font-display` (tiêu đề).

Nunito tròn, dễ đọc mobile. Fraunces old-style, optical size — học thuật nhẹ, không cứng Times. Cùng nhau: **vở + chữ in** trên giấy kem.

Không Inter / Roboto làm display. Không Fraunces cho nút, nav, form, badge.

Google Fonts:

```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;500;600;700;800&display=swap
```

`preconnect` `fonts.googleapis.com` và `fonts.gstatic.com`.

## Cân nặng

| Weight | Nunito | Fraunces |
| --- | --- | --- |
| 400 | Body, caption nhẹ | Không dùng |
| 500 | Ít dùng | Display nhẹ (hiếm) |
| 600 | **Mặc định UI** (nút, nav, label, badge) | **Mặc định display** |
| 700 | Nhấn body, gần như không cần | Tiêu đề rất lớn nếu cần |
| 800 | Tránh | — |

## Thang chữ

| Bậc | Size | Weight | Font | Dùng |
| --- | --- | --- | --- | --- |
| Display XL | `text-6xl` (60px) | 600 | Fraunces | Số lớn (timer, KPI hero), `tabular-nums` |
| Display L | `text-4xl` (36px) | 600 | Fraunces | Wordmark auth, H1 marketing |
| Display M | `text-3xl` (30px) | 600 | Fraunces | Page title, hero trong app — `tracking-tight` |
| Display S | `text-2xl` (24px) | 600 | Fraunces | Section lớn, empty lớn, stat lớn |
| Title | `text-xl` (20px) | 600 | Fraunces | `h2`, card lớn |
| Card title | `text-lg` (18px) | 600 | Fraunces | Card / dialog title |
| Body | `text-sm` (14px) | 400–600 | Nunito | Hầu hết UI |
| Body strong | `text-sm` | 600 | Nunito | Nav, button, label |
| Meta | `text-xs` (12px) | 400–600 | Nunito | Caption, badge, helper, tick |
| Micro | `11px`–`10px` | 600 | Nunito | Truncate phụ; **chỉ** label bottom nav ở `10px` |

**Sàn:** ≥ `12px` trừ label bottom nav `10px`.

Body mặc định hệ này là `text-sm`, không `text-base` — mật độ gọn. Nút `lg` được `text-base`. Nút `sm` dùng `text-xs`.

Landing marketing có thể H1 `text-4xl`–`text-5xl`; body vẫn `text-sm` hoặc tối đa `text-base` cho đoạn đọc dài (`max-w-3xl`).

## Hierarchy trang chuẩn

```
kicker     text-sm font-semibold text-primary
title      font-display text-3xl font-semibold tracking-tight text-ink-900
subtitle   text-sm text-muted-foreground
section    font-display text-xl font-semibold text-ink-900
card title font-display text-lg font-semibold
body       text-sm text-foreground / ink-800
meta       text-xs text-muted-foreground
```

Kicker (dòng primary trước H1) cho greeting, bước wizard, nhãn màn hình tập trung.

## Tracking & số

- Page title: `tracking-tight`.
- Số lớn / giờ: `tabular-nums`.
- `uppercase` chỉ kicker nghi lễ: `tracking-wide text-sm text-primary`.
- Không italic UI. Fraunces italic chỉ cho quote editorial (hiếm).

## Độ dài dòng

| Loại | Max |
| --- | --- |
| Description, empty | `max-w-sm` |
| Bài / docs | `max-w-3xl` |
| Wizard / onboarding | `max-w-2xl` |
| Auth card | `max-w-md` |
| Màn hình tập trung | `max-w-lg` |
| App shell | `1440px`, pad `px-4 sm:px-6 lg:px-8` |

Mô tả dưới title: một câu, ~90 ký tự nếu có thể.

## Căn lề

- App, dialog header, stat: **trái**.
- Auth, wizard intro, empty, màn hình tập trung: **giữa**.

## Antialiasing

`antialiased` trên body. Không `subpixel-antialiased`.

## Ngôn ngữ có dấu

Nunito + Fraunces cover tốt tiếng Việt và Latin. Không `truncate` tiêu đề quan trọng nếu chưa có tooltip. `truncate` được cho email / meta. Tránh `break-all`.

## Checklist

- [ ] H1/H2/card title = Fraunces semibold
- [ ] Button, nav, badge, label = Nunito semibold
- [ ] Mô tả = `text-sm text-muted-foreground`
- [ ] Không font thứ 3
- [ ] Số lớn = `tabular-nums`
- [ ] Không chữ trắng trên pastel soft
