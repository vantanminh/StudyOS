# 04 — Typography

Hai họ chữ, hai việc. Không thêm font thứ ba.

## Họ chữ

| Vai trò | Font | Fallback | Load |
| --- | --- | --- | --- |
| UI / body | **Nunito** | `ui-sans-serif, system-ui, sans-serif` | 400, 500, 600, 700, 800 |
| Display / tiêu đề | **Fraunces** | `Georgia, serif` | opsz 9–144; 500, 600, 700 |

Load qua Google Fonts trong `index.html` (`preconnect` + stylesheet). Token:

```css
--font-sans: "Nunito", ui-sans-serif, system-ui, sans-serif;
--font-display: "Fraunces", Georgia, serif;
```

Utility: `font-sans` (mặc định body), `font-display`.

**Tại sao cặp này:** Nunito tròn, humanist, dễ đọc trên mobile. Fraunces là old-style serif có optical size — đủ “ấn tượng học thuật nhẹ” mà không cứng như Times. Cùng nhau chúng tạo cảm giác **vở + chữ in**, khớp giấy kem.

Không dùng Inter, Roboto, system-ui làm display. Không dùng Fraunces cho nút, nav, form, badge.

## Cân nặng

| Weight | Nunito | Fraunces |
| --- | --- | --- |
| 400 Regular | Body dài, caption nếu cần nhẹ | Không dùng |
| 500 Medium | Ít dùng; ưu tiên 400 hoặc 600 | Display nhẹ (hiếm) |
| 600 Semibold | **Mặc định UI**: nút, nav, label, badge, card title nhỏ | **Mặc định display** |
| 700 Bold | Nhấn trong body, gần như không cần | Tiêu đề rất lớn nếu cần |
| 800 ExtraBold | Tránh — quá nặng trên nền mềm | — |

Mặc định tiêu đề: `font-display font-semibold` (600). Mặc định UI đậm: `font-semibold`.

## Thang chữ chính thức

Dùng thang này cho UI mới. Số trong ngoặc là size Tailwind.

| Bậc | Size | Line | Weight | Font | Dùng |
| --- | --- | --- | --- | --- | --- |
| Display XL | `text-6xl` (60px) | tight | 600 | Fraunces | Timer Focus Session, `tabular-nums` |
| Display L | `text-4xl` (36px) | tight | 600 | Fraunces | Wordmark login |
| Display M | `text-3xl` (30px) | `tracking-tight` | 600 | Fraunces | Page title (`PageHeader`), hero Today |
| Display S | `text-2xl` (24px) | snug | 600 | Fraunces | Tiêu đề session, empty lớn, số stat lớn |
| Title | `text-xl` (20px) | snug | 600 | Fraunces | `CardTitle` lớn, section (`h2`) |
| Card title | `text-lg` (18px) | none / tight | 600 | Fraunces | `CardTitle` mặc định, dialog title |
| Body | `text-sm` (14px) | relaxed/normal | 400–600 | Nunito | Body, mô tả, form value, hầu hết UI |
| Body strong | `text-sm` | normal | 600 | Nunito | Nav, button, label |
| Meta | `text-xs` (12px) | normal | 400–600 | Nunito | Caption, badge, helper, chart tick |
| Micro | `text-[11px]`–`text-[10px]` | normal | 600 | Nunito | Email truncate, **chỉ** label bottom nav (`10px`) |

**Sàn:** không dưới `10px`. Bottom nav là ngoại lệ có chủ đích vì 5 cột. Mọi chỗ khác ≥ `12px` (`text-xs`).

Body mặc định của app là `text-sm`, không `text-base`. Đó là mật độ “gọn” của StudyOS — đừng nâng cả app lên 16px nếu không redesign spacing.

Nút `lg` được phép `text-base`. Nút `sm` dùng `text-xs`.

## Hierarchy một trang chuẩn

```
kicker     text-sm font-semibold text-primary     ← “Chào buổi chiều, An”
title      font-display text-3xl font-semibold text-ink-900
subtitle   text-sm text-muted-foreground
section    font-display text-xl font-semibold text-ink-900
card title font-display text-lg font-semibold
body       text-sm text-foreground / ink-800
meta       text-xs text-muted-foreground
```

`PageHeader` đã mã hoá title + description. Dùng nó, đừng tự invent H1 khác style.

Kicker (dòng nhỏ primary trước H1) dùng cho Today, onboarding step, session mode — tạo nhịp “ấm, rồi vào việc”.

## Tracking & số

- Page title: `tracking-tight` — Fraunces hơi rộng optical, siết nhẹ cho gọn.
- Session timer: `tabular-nums` bắt buộc để phút:giây không nhảy layout.
- Stat số lớn (`text-2xl` / `text-3xl`): khuyến nghị `tabular-nums`.
- Không `uppercase` trừ kicker session (`Focus Session · pomodoro`) — và khi uppercase phải `tracking-wide` + `text-sm` + `text-primary`.
- Không `italic` cho UI. Fraunces italic chỉ nếu sau này có quote editorial (hiện không có).

## Độ dài dòng

| Loại | Max |
| --- | --- |
| Page description, empty body | `max-w-sm` (~24rem) |
| Help / bài dài | `max-w-3xl` như Help page |
| Onboarding | `max-w-2xl` |
| Login card | `max-w-md` |
| Session | `max-w-lg` |
| App shell content | max app `1440px`, padding `px-4 sm:px-6 lg:px-8` |

Đoạn mô tả dưới title: một câu, không quá ~90 ký tự nếu có thể.

## Căn lề

- App: trái. Dialog header: trái (`text-left`).
- Login, onboarding intro, session, empty: **giữa**.
- Số stat trong mini card: trái, không center — dễ scan cột.

## Antialiasing

Body đã `antialiased`. Giữ nguyên. Không `subpixel-antialiased`.

## Tiếng Việt

Nunito và Fraunces cover tốt dấu tiếng Việt. Vẫn:

- Không cắt chữ bằng `truncate` trên **tiêu đề task** nếu chưa có tooltip/title.
- `truncate` được phép cho email trong sidebar (`text-[11px]`).
- `hyphens` không cần. Tránh `break-all`.

## Checklist chữ

- [ ] H1/H2/card title = Fraunces semibold
- [ ] Button, nav, badge, label = Nunito semibold
- [ ] Mô tả = `text-sm text-muted-foreground`
- [ ] Không font thứ 3, không Google Font mới
- [ ] Timer/stat = `tabular-nums`
- [ ] Không chữ trắng trên pastel soft
