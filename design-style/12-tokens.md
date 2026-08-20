# 12 — Catalog token

Bảng copy-paste. Nguồn: `src/index.css` `@theme`. Khi đổi CSS, sửa file này.

## Font

| Token | Giá trị |
| --- | --- |
| `--font-sans` | `"Nunito", ui-sans-serif, system-ui, sans-serif` |
| `--font-display` | `"Fraunces", Georgia, serif` |
| Utility display | `font-display` |

Google Fonts query:

```
Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700
Nunito:wght@400;500;600;700;800
```

## Cream

| Token | Hex |
| --- | --- |
| `--color-cream-50` | `#fbf8f3` |
| `--color-cream-100` | `#f7f1e8` |
| `--color-cream-200` | `#efe4d4` |
| `--color-cream-300` | `#e2d0b8` |

## Ink

| Token | Hex |
| --- | --- |
| `--color-ink-700` | `#4a3f35` |
| `--color-ink-800` | `#3a3129` |
| `--color-ink-900` | `#2c251f` |

## Pastel pairs

| Đặc | Hex | Soft | Hex |
| --- | --- | --- | --- |
| `--color-sage` | `#a8c5a0` | `--color-sage-soft` | `#d8e8d3` |
| `--color-sky` | `#9ec4d8` | `--color-sky-soft` | `#d5e8f2` |
| `--color-lavender` | `#c4b5d8` | `--color-lavender-soft` | `#ebe4f4` |
| `--color-peach` | `#f0c4a8` | `--color-peach-soft` | `#f9e6d8` |
| `--color-rose` | `#e8b4b8` | `--color-rose-soft` | `#f6e0e2` |
| `--color-mint` | `#a8d4c4` | `--color-mint-soft` | `#d8efe6` |
| `--color-butter` | `#ead89a` | `--color-butter-soft` | `#f6efd0` |
| `--color-coral` | `#e8a090` | `--color-coral-soft` | `#f6ddd6` |

## Semantic

| Token | Hex | Tailwind |
| --- | --- | --- |
| `--color-background` | `#f7f1e8` | `bg-background` |
| `--color-foreground` | `#2c251f` | `text-foreground` |
| `--color-card` | `#fffbf6` | `bg-card` |
| `--color-card-foreground` | `#2c251f` | `text-card-foreground` |
| `--color-popover` | `#fffbf6` | `bg-popover` |
| `--color-popover-foreground` | `#2c251f` | `text-popover-foreground` |
| `--color-primary` | `#6b8f71` | `bg-primary` / `text-primary` |
| `--color-primary-foreground` | `#fffbf6` | `text-primary-foreground` |
| `--color-secondary` | `#efe4d4` | `bg-secondary` |
| `--color-secondary-foreground` | `#3a3129` | `text-secondary-foreground` |
| `--color-muted` | `#efe4d4` | `bg-muted` |
| `--color-muted-foreground` | `#7a6b5d` | `text-muted-foreground` |
| `--color-accent` | `#f0c4a8` | `bg-accent` |
| `--color-accent-foreground` | `#3a3129` | `text-accent-foreground` |
| `--color-destructive` | `#c45c5c` | `bg-destructive` |
| `--color-destructive-foreground` | `#fffbf6` | `text-destructive-foreground` |
| `--color-border` | `#e2d0b8` | `border-border` |
| `--color-input` | `#e2d0b8` | `border-input` |
| `--color-ring` | `#6b8f71` | `ring-ring` |

`theme-color` meta = `#f7f1e8`.

## Radius

| Token | Giá trị |
| --- | --- |
| `--radius-sm` | `0.625rem` (10px) |
| `--radius-md` | `0.875rem` (14px) |
| `--radius-lg` | `1.25rem` (20px) |
| `--radius-xl` | `1.75rem` (28px) |
| `--radius-2xl` | `2rem` (32px) |

## Shadow

| Token | Giá trị |
| --- | --- |
| `--shadow-soft` | `0 4px 20px -4px rgb(74 63 53 / 0.08), 0 2px 8px -2px rgb(74 63 53 / 0.04)` |
| `--shadow-lift` | `0 8px 28px -6px rgb(74 63 53 / 0.12), 0 4px 12px -4px rgb(74 63 53 / 0.06)` |

Utilities: `shadow-soft`, `shadow-lift`.

## Motion utilities

| Class | Animation |
| --- | --- |
| `animate-fade-up` | `fade-up 0.45s ease-out both` |
| `animate-soft-pulse` | `soft-pulse 2.4s ease-in-out infinite` |
| `animate-float` | `float-y 3.5s ease-in-out infinite` |

Keyframes:

- `fade-up`: opacity 0→1, `translateY(8px)`→0
- `soft-pulse`: opacity 1 → 0.7 → 1
- `float-y`: `translateY(0)` → `-4px` → 0

## Layout constants (chưa token hoá CSS, coi như spec)

| Tên | Giá trị |
| --- | --- |
| App max width | `1440px` |
| Sidebar width | `16rem` (`w-64`) |
| Content pad | `16 / 24 / 32` (`px-4 sm:px-6 lg:px-8`) |
| Control height | `44px` (`h-11`) |
| FAB | `56px` (`h-14 w-14`) |
| Mobile nav reserve | `pb-24` |
| Dialog max | `max-w-lg` + `calc(100% - 2rem)` |

## Nền body

```css
background-image:
  radial-gradient(ellipse 80% 50% at 10% -10%, rgb(168 197 160 / 0.25), transparent),
  radial-gradient(ellipse 60% 40% at 90% 0%, rgb(240 196 168 / 0.2), transparent),
  radial-gradient(ellipse 50% 30% at 50% 100%, rgb(158 196 216 / 0.15), transparent);
background-attachment: fixed;
```

Sage `168 197 160` · Peach `240 196 168` · Sky `158 196 216`.

## Subject map (class string)

```
sage:      bg-sage-soft text-ink-800 border-sage/40
sky:       bg-sky-soft text-ink-800 border-sky/40
lavender:  bg-lavender-soft text-ink-800 border-lavender/40
peach:     bg-peach-soft text-ink-800 border-peach/40
rose:      bg-rose-soft text-ink-800 border-rose/40
mint:      bg-mint-soft text-ink-800 border-mint/40
butter:    bg-butter-soft text-ink-800 border-butter/40
coral:     bg-coral-soft text-ink-800 border-coral/40
```

## Chart

| Part | Value |
| --- | --- |
| Grid | `#e2d0b8` dash 3 3 |
| Bar | `#6b8f71` radius top 8 |
| Series 2 (spec) | `#9ec4d8` sky |
| Series 3 (spec) | `#f0c4a8` peach |
