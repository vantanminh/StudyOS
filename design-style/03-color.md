# 03 — Màu sắc

Màu Giấy ấm: **kem + mực nâu + sage**, điểm pastel thấp bão hoà. Mọi màu UI lấy từ token — không tự pha hex lạnh (`blue-600`, `zinc`, `slate`).

## Vai trò (semantic)

Dùng semantic trước. Chỉ xuống raw token khi semantic không đủ.

| Token | Hex | Vai trò |
| --- | --- | --- |
| `background` | `#f7f1e8` | Nền trang |
| `foreground` | `#2c251f` | Chữ chính |
| `card` | `#fffbf6` | Bề mặt nổi (card, input, popover, dialog) |
| `card-foreground` | `#2c251f` | Chữ trên card |
| `popover` / `popover-foreground` | `#fffbf6` / `#2c251f` | Menu, select |
| `primary` | `#6b8f71` | CTA, nav active, progress, chart chính |
| `primary-foreground` | `#fffbf6` | Chữ trên nút primary |
| `secondary` | `#efe4d4` | Nút phụ, track, hover nền, tab list |
| `secondary-foreground` | `#3a3129` | Chữ trên secondary |
| `muted` | `#efe4d4` | Nền phụ (trùng secondary — cố ý) |
| `muted-foreground` | `#7a6b5d` | Caption, meta, nav inactive |
| `accent` | `#f0c4a8` | Điểm nhấn ấm (peach) — sparingly |
| `accent-foreground` | `#3a3129` | Chữ trên accent |
| `destructive` | `#c45c5c` | Xoá, lỗi chặn luồng |
| `destructive-foreground` | `#fffbf6` | Chữ trên destructive |
| `border` / `input` | `#e2d0b8` | Viền, input |
| `ring` | `#6b8f71` | Focus ring (= primary) |

Chữ luôn ink/muted trên kem. Không `#000`. Không nền `#fff` lạnh — card là `#fffbf6` (trắng ngà).

## Nền kem (cream)

| Token | Hex | Dùng khi |
| --- | --- | --- |
| `cream-50` | `#fbf8f3` | Lớp trong cùng, row nhạt, ô lồng |
| `cream-100` | `#f7f1e8` | Nền trang (= `background`) |
| `cream-200` | `#efe4d4` | Secondary / muted / hover |
| `cream-300` | `#e2d0b8` | Border, hover đậm (`hover:bg-cream-300`) |

Cream không dùng làm chữ.

## Mực (ink)

| Token | Hex | Dùng khi |
| --- | --- | --- |
| `ink-700` | `#4a3f35` | Overlay (`ink-900/30`), chữ phụ đậm hơn muted |
| `ink-800` | `#3a3129` | Label, chữ trên pastel soft |
| `ink-900` | `#2c251f` | Tiêu đề, chữ chính |

Không `text-black`, `text-zinc-*`, `text-slate-*`.

## Primary sage

Sage = hành động và sức sống nhẹ.

| Token | Hex | Dùng |
| --- | --- | --- |
| `sage` | `#a8c5a0` | Tint, blob, hover `sage/40` |
| `sage-soft` | `#d8e8d3` | Nav active, badge success, ô icon brand, nút `soft` |
| `primary` | `#6b8f71` | Nút chính, icon brand, progress, chart |

`primary` đậm hơn `sage` để chữ kem đọc được. Đừng dùng `sage` làm nền CTA.

## Pastel điểm (phân loại)

Tám cặp — bản đặc + bản `-soft`. Đây là **hệ category**, không phải hệ CTA. Website đích map vào thẻ, danh mục, trạng thái của *mình*.

| Tên | Đặc | Soft | Cảm giác | Gợi ý dùng generic |
| --- | --- | --- | --- | --- |
| Sage | `#a8c5a0` | `#d8e8d3` | Ổn định, xong | Success, hoàn tất, brand |
| Sky | `#9ec4d8` | `#d5e8f2` | Tĩnh, thông tin | Info, đang xử lý, stat phụ |
| Lavender | `#c4b5d8` | `#ebe4f4` | Mềm, trung tính | Danh mục phụ |
| Peach | `#f0c4a8` | `#f9e6d8` | Ấm, gần | Tip, profile, nhấn thời hạn nhẹ |
| Rose | `#e8b4b8` | `#f6e0e2` | Cần chú ý | Cảnh báo nhẹ, lỗi chưa phá huỷ |
| Mint | `#a8d4c4` | `#d8efe6` | Tươi | Danh mục; không thay sage |
| Butter | `#ead89a` | `#f6efd0` | Nhắc nhẹ | Warning, pending, banner nhắc |
| Coral | `#e8a090` | `#f6ddd6` | Quá ngưỡng | Overload, quota; không thay destructive |

### Cách dùng

- Chip / tag: `-soft` + chữ `ink-800` (+ viền đặc `/40`).
- Khối nhấn: `-soft` opacity `40–60%` trên card.
- Không phủ full-page pastel.
- Không quá 2–3 pastel trên một card.
- Không chữ trắng trên pastel soft.
- Không để user tự nhập hex category — xoay 8 token.

Class chip chuẩn:

```
bg-{token}-soft text-ink-800 border-{token}/40
```

Hai category cạnh nhau nên khác họ. Trùng thì xoay token kế.

## Semantic trạng thái

| Ý nghĩa | Nền | Chữ |
| --- | --- | --- |
| Success / xong / synced | `sage-soft` | `primary` |
| Info / trung tính nổi | `sky-soft` | `ink-800` |
| Warning / pending | `butter-soft` | `ink-800` |
| Danger nhẹ / cần xử lý | `rose-soft` | `destructive` |
| Danger hành động (xoá) | `destructive` | `primary-foreground` |
| Neutral / lưu trữ / idle | `secondary` | `muted-foreground` |

Destructive đậm chỉ cho hành động không đảo ngược hoặc lỗi chặn luồng. Nhắc nhở trên list dùng rose-soft — không phạt.

## Overlay & trong suốt

| Dùng | Giá trị |
| --- | --- |
| Dialog overlay | `bg-ink-900/30` + `backdrop-blur-[2px]` |
| Sidebar | `bg-card/70 backdrop-blur-sm` |
| Header sticky | `bg-background/80 backdrop-blur-md` |
| Bottom nav | `bg-card/95 backdrop-blur-md` |
| Auth card | `bg-card/90 backdrop-blur-sm` |
| Viền trên kem | `border-border/50`–`/70` |

## Chart

- Grid: `#e2d0b8`, dash `3 3`.
- Series 1: `#6b8f71` (primary), bar bo trên `8px`.
- Series 2: `#9ec4d8` (sky). Series 3: `#f0c4a8` (peach). Không rainbow.
- Tick ~11px, ink/muted.
- Tooltip: card + border + `shadow-lift`, chữ ink.

## Tương phản

**Đạt:** `ink-900` trên cream/card; `ink-800` trên `*-soft`; kem trên `primary` / `destructive`; muted chỉ cho meta.

**Tránh:** muted dài trên peach-soft; `sage` nhạt + chữ kem làm nút; `primary` cho đoạn văn dài.

## Gradient cho phép

1. Nền body — 3 radial global. Không nhân bản.
2. Auth blobs — 3 vòng pastel blur.
3. Màn hình “tập trung / nghi lễ” (timer, checkout yên, đọc không nhiễu): `bg-gradient-to-b from-sage-soft/80 to-card`. Tối đa một loại này mỗi flow.

Cấm: gradient nút, gradient chữ, mesh phức tạp.

## Dark mode

**Không có.** Palette thiết kế cho giấy sáng. Đừng đảo `dark:` máy móc. Nếu website bắt buộc dark, đó là hệ khác — thiết kế lại ink/cream, không invert.
