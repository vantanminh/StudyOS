# 05 — Layout, spacing, radius

Lưới **4px**, bo góc lớn, bề mặt thoáng. Khoảng trắng là brand — đừng sợ trống. Hai khung: **marketing** (trang công khai) và **app** (đã đăng nhập). Cùng token.

## Thang spacing

| Token | px | Việc điển hình |
| --- | --- | --- |
| `0.5` / `1` | 2 / 4 | Gap icon-chữ sát, badge py |
| `1.5` | 6 | Gap icon–label nav mobile |
| `2` | 8 | Cụm nút, chip, badge px |
| `2.5` | 10 | Nav item py |
| `3` | 12 | Gap grid chặt, padding ô nhỏ |
| `4` | 16 | Card compact, pad page mobile |
| `5` | 20 | Card chuẩn (`p-5`), py main |
| `6` | 24 | `space-y-6` section, dialog pad |
| `8` | 32 | Auth / hero inner |
| `10` | 40 | Pad dọc wizard / auth |

Rhythm: `space-y-6` giữa block lớn. Grid card: `gap-3`. Cụm nút: `gap-2`. Không spacing lẻ trừ căn optical.

## Radius theo vai trò

| Vai trò | Radius |
| --- | --- |
| Nút, input, select, tab, nav row | `rounded-xl` (nút sm: `rounded-lg`) |
| Nút lg, FAB | `rounded-2xl` |
| Card, empty, banner nhắc, khối profile | `rounded-2xl` |
| Badge, progress, switch | `rounded-full` |
| Dialog | `rounded-2xl` |
| Hero trong app / auth surface | `1.75rem`–`2rem` |
| Ô icon brand | `rounded-xl` → `rounded-3xl` theo size |

Token theme: `--radius-sm` 10px · `md` 14px · `lg` 20px · `xl` 28px · `2xl` 32px.

Cấm `rounded-none` và radius 6–8px cho control (trông shadcn zinc).

## Khung app (đã đăng nhập)

Max: `max-w-[1440px] mx-auto min-h-dvh`.

### Desktop (`lg+`)

```
┌────────────┬─────────────────────────────┐
│ Sidebar    │  Main                       │
│ w-64       │  px-8 py-5                  │
│ sticky     │                             │
│ card/70    │                             │
│ blur       │                             │
│ border-r   │                             │
└────────────┴─────────────────────────────┘
```

- Sidebar `w-64`, `px-4 py-6`, `border-border/60`.
- Logo + tagline `mb-8`.
- Nav: `gap-1`, item `rounded-xl px-3 py-2.5`.
- Active: `bg-sage-soft text-ink-900 shadow-soft`.
- Inactive: `text-muted-foreground`, hover `bg-secondary`.
- Chân sidebar: khối `bg-peach-soft/60 rounded-2xl p-4` (tài khoản, CTA phụ, thoát).

Website chỉ cần top nav: cùng token, bar `h-14`–`h-16`, `bg-card/80 backdrop-blur-md`, `border-b border-border/50`. Không đổi màu.

### Mobile (`< lg`)

```
Header sticky   bg-background/80 blur-md   px-4 py-3
Main            px-4 py-5  (sm:px-6)       pb-24 nếu có bottom nav
Bottom nav      fixed bottom               card/95 blur + safe-area
```

Bottom nav tối đa **5 cột**. Cột giữa có thể là FAB tạo mới: `h-14 w-14 rounded-2xl bg-primary shadow-lift -mt-5`. Mục phụ dồn trang “Thêm” — grid 2 cột, tile `rounded-2xl p-5 shadow-soft`.

Không có bottom nav (blog, marketing): `pb` bình thường, không `pb-24`.

## Khung marketing / trang công khai

- Header tối giản: wordmark + vài link + một CTA primary.
- Nội dung `max-w-3xl` (bài) hoặc `max-w-5xl` (grid feature).
- Hero: căn giữa hoặc trái, H1 Fraunces, một CTA, không video autoplay.
- Footer: `text-xs muted`, viền `border-border/50`, không nền đen.

## Page padding

| Breakpoint | Horizontal |
| --- | --- |
| default | `px-4` (16) |
| `sm` | `px-6` (24) |
| `lg` | `px-8` (32) |

## Grid

- Stat: `grid gap-3 sm:grid-cols-3`.
- Card vừa: `gap-3 sm:grid-cols-2 lg:grid-cols-3`.
- Tray mobile: `grid-cols-2 gap-3`.
- Feature marketing: `sm:grid-cols-2 gap-3`.

Cùng padding trong một grid (`p-4` hoặc `p-5`). Không xen.

## Chiều cao control

| Control | Height |
| --- | --- |
| Button default / Input / Select / TabsList | `h-11` (44px) |
| Button sm | `h-9` — card chặt, desktop |
| Button lg | `h-12` |
| Button icon | `h-10 w-10` |
| FAB | `h-14 w-14` |
| Switch | `h-6 w-11` |
| Progress | `h-2.5` |
| Wizard segments | `h-2` full width |

Mobile: ưu tiên `default`/`lg` cho CTA.

## Z-index

| Layer | z |
| --- | --- |
| Base | auto |
| Sticky header | `z-30` |
| Bottom nav | `z-40` |
| Dialog / popover | `z-50` |
| Toast | trên dialog |

Không `z-[9999]`.

## Safe area

Bottom nav: `pb-[max(0.5rem,env(safe-area-inset-bottom))]`. Viewport `viewport-fit=cover`. `min-h-dvh` thay `100vh`. CTA fixed-bottom cộng safe area + khoảng nav.
