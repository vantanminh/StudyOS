# 05 — Layout, spacing, radius

StudyOS dựa trên **lưới 4px**, bo góc lớn, bề mặt thoáng. Khoảng trắng là một phần brand — đừng sợ “trống”.

## Thang spacing

Ưu tiên bước 4px. Tailwind mặc định khớp.

| Token | px | Việc điển hình |
| --- | --- | --- |
| `0.5` / `1` | 2 / 4 | Gap icon-chữ rất sát, badge py |
| `1.5` | 6 | Gap icon-label mobile nav |
| `2` | 8 | Gap nút nhóm, gap chip, padding badge px |
| `2.5` | 10 | Nav item py |
| `3` | 12 | Gap card grid chặt, padding ô nhỏ |
| `4` | 16 | Padding card compact, gap section nhỏ, px page mobile |
| `5` | 20 | Padding card chuẩn (`p-5`), py main |
| `6` | 24 | `space-y-6` giữa section, mb page header, padding card lớn / dialog |
| `8` | 32 | Login card inner, session card, khoảng hero |
| `10` | 40 | Padding dọc onboarding/login |

**Rhythm trang:** `space-y-6` giữa các block lớn. Grid card: `gap-3`. Cụm nút: `gap-2`.

Không dùng spacing lẻ (`13px`, `15px`) trừ khi căn optical icon.

## Radius

Token trong `@theme`:

| Token | rem | px | Dùng |
| --- | --- | --- | --- |
| `rounded-sm` | 0.625 | 10 | Hiếm; chip rất nhỏ |
| `rounded-lg` | ~0.5–0.875* | — | Nút `sm`, close dialog, tab trigger, select item |
| `rounded-xl` | — | ~12–14 visual | **Mặc định control**: nút, input, nav item, textarea, toast |
| `radius-md` | 0.875 | 14 | Token theme |
| `radius-lg` | 1.25 | 20 | — |
| `rounded-2xl` | — | 16–20 visual | **Card**, empty, khối More, FAB Add |
| `radius-xl` | 1.75 | 28 | Hero Today (`rounded-[1.75rem]`) |
| `radius-2xl` | 2 | 32 | Login card (`rounded-[2rem]`), login icon ô |

\*Component đang mix `rounded-lg` / `rounded-xl` / `rounded-2xl` của Tailwind. Khi làm UI mới, map theo **vai trò**:

| Vai trò | Radius |
| --- | --- |
| Nút, input, select, tab, nav row | `rounded-xl` (nút sm: `rounded-lg`) |
| Nút lg, FAB | `rounded-2xl` |
| Card, empty, reminder host, khối profile | `rounded-2xl` |
| Badge, progress, switch | `rounded-full` |
| Dialog | `rounded-2xl` |
| Hero / login surface | `1.75rem`–`2rem` |
| Ô icon brand | `rounded-xl` → `rounded-3xl` theo size (xem brand) |

Cấm `rounded-none` và `rounded-md` nhỏ (6–8px) cho control — sẽ làm UI “shadcn mặc định”, mất chất mềm.

## App shell

Khung tối đa: `max-w-[1440px] mx-auto min-h-dvh`.

### Desktop (`lg:` ≥ 1024px)

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
- Chân sidebar: khối `bg-peach-soft/60 rounded-2xl p-4` (profile, sync, Quick Add, logout).

### Mobile (`< lg`)

```
Header sticky   bg-background/80 blur-md   px-4 py-3
Main            px-4 py-5  (sm:px-6)       pb-24
Bottom nav      fixed inset-x-0 bottom-0   card/95 blur
                safe-area-inset-bottom
```

Bottom nav 5 cột: Today · Planner · **Add FAB** · Review · More.

FAB Add: `h-14 w-14 rounded-2xl bg-primary shadow-lift -mt-5` — nổi lên trên thanh, là điểm neo ngón cái.

Các mục phụ (Subjects, Tasks, Exams, Errors, Analytics, Documents, Help, Settings) dồn vào **More** — grid 2 cột, card vuông mềm.

## Page padding & content width

| Breakpoint | Horizontal pad |
| --- | --- |
| default | `px-4` (16) |
| `sm` | `px-6` (24) |
| `lg` | `px-8` (32) |

Help: `max-w-3xl`. Onboarding: `max-w-2xl mx-auto px-4 py-10`. Login/session: căn giữa viewport.

## Grid

- Stat hàng: `grid gap-3 sm:grid-cols-3`.
- Subject / readiness: `gap-3 sm:grid-cols-2 lg:grid-cols-3`.
- More: `grid-cols-2 gap-3`.
- Quick start help: `sm:grid-cols-2 gap-3`.

Card trong grid **cùng padding** (`p-4` compact hoặc `p-5` chuẩn). Không xen kẽ.

## Chiều cao control

Touch target tối thiểu 44px theo cảm giác:

| Control | Height |
| --- | --- |
| Button default / Input / Select / TabsList | `h-11` (44px) |
| Button sm | `h-9` (36) — chỉ desktop dày, hoặc trong card chặt |
| Button lg | `h-12` (48) |
| Button icon | `h-10 w-10` |
| FAB | `h-14 w-14` |
| Switch | `h-6 w-11` |
| Progress | `h-2.5` |
| Onboarding step dots | `h-2` full width segments |

Trên mobile ưu tiên `default`/`lg`, hạn chế `sm` cho CTA.

## Z-index

| Layer | z | Ví dụ |
| --- | --- | --- |
| Base | auto | Nội dung |
| Sticky header mobile | `z-30` | App header |
| Bottom nav | `z-40` | Mobile nav |
| Dialog / select portal | `z-50` | Radix overlay + content |
| Toast | trên dialog (Sonner mặc định) | Thông báo |

Không đặt `z-[9999]` thủ công. FAB nằm trong nav `z-40`.

## Safe area

Bottom nav: `pb-[max(0.5rem,env(safe-area-inset-bottom))]`. Viewport: `viewport-fit=cover` trong `index.html`. `min-h-dvh` / `h-dvh` thay `100vh` để tránh thanh địa chỉ mobile.

Trang mới có CTA fixed-bottom phải cộng safe area + `pb-24` trên main (đã có trong shell).
