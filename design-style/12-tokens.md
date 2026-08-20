# 12 — Catalog token + CSS copy-paste

Đây là **nguồn sự thật** để mang hệ Giấy ấm sang website khác. Dán block CSS, load font, gắn class theo [07-components.md](./07-components.md).

## Font

| Token | Giá trị |
| --- | --- |
| `--font-sans` | `"Nunito", ui-sans-serif, system-ui, sans-serif` |
| `--font-display` | `"Fraunces", Georgia, serif` |

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

| Token | Hex | Class gợi ý |
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

`theme-color` = `#f7f1e8`.

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

## Motion

| Class | Animation |
| --- | --- |
| `animate-fade-up` | `fade-up 0.45s ease-out both` |
| `animate-soft-pulse` | `soft-pulse 2.4s ease-in-out infinite` |
| `animate-float` | `float-y 3.5s ease-in-out infinite` |

- `fade-up`: opacity 0→1, `translateY(8px)`→0
- `soft-pulse`: opacity 1 → 0.7 → 1
- `float-y`: `translateY(0)` → `-4px` → 0

## Layout constants

| Tên | Giá trị |
| --- | --- |
| App max width | `1440px` |
| Sidebar | `16rem` |
| Content pad | `16 / 24 / 32` |
| Control height | `44px` |
| FAB | `56px` |
| Mobile nav reserve | `pb-24` |
| Dialog max | `max-w-lg` + `calc(100% - 2rem)` |

## Category chip

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
| Series 1 | `#6b8f71` radius top 8 |
| Series 2 | `#9ec4d8` |
| Series 3 | `#f0c4a8` |

---

## Tailwind v4 — `@theme` (copy)

```css
@import "tailwindcss";

@theme {
  --font-sans: "Nunito", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Fraunces", Georgia, serif;

  --color-cream-50: #fbf8f3;
  --color-cream-100: #f7f1e8;
  --color-cream-200: #efe4d4;
  --color-cream-300: #e2d0b8;
  --color-ink-700: #4a3f35;
  --color-ink-800: #3a3129;
  --color-ink-900: #2c251f;

  --color-sage: #a8c5a0;
  --color-sage-soft: #d8e8d3;
  --color-sky: #9ec4d8;
  --color-sky-soft: #d5e8f2;
  --color-lavender: #c4b5d8;
  --color-lavender-soft: #ebe4f4;
  --color-peach: #f0c4a8;
  --color-peach-soft: #f9e6d8;
  --color-rose: #e8b4b8;
  --color-rose-soft: #f6e0e2;
  --color-mint: #a8d4c4;
  --color-mint-soft: #d8efe6;
  --color-butter: #ead89a;
  --color-butter-soft: #f6efd0;
  --color-coral: #e8a090;
  --color-coral-soft: #f6ddd6;

  --color-background: #f7f1e8;
  --color-foreground: #2c251f;
  --color-card: #fffbf6;
  --color-card-foreground: #2c251f;
  --color-popover: #fffbf6;
  --color-popover-foreground: #2c251f;
  --color-primary: #6b8f71;
  --color-primary-foreground: #fffbf6;
  --color-secondary: #efe4d4;
  --color-secondary-foreground: #3a3129;
  --color-muted: #efe4d4;
  --color-muted-foreground: #7a6b5d;
  --color-accent: #f0c4a8;
  --color-accent-foreground: #3a3129;
  --color-destructive: #c45c5c;
  --color-destructive-foreground: #fffbf6;
  --color-border: #e2d0b8;
  --color-input: #e2d0b8;
  --color-ring: #6b8f71;

  --radius-sm: 0.625rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.75rem;
  --radius-2xl: 2rem;

  --shadow-soft: 0 4px 20px -4px rgb(74 63 53 / 0.08),
    0 2px 8px -2px rgb(74 63 53 / 0.04);
  --shadow-lift: 0 8px 28px -6px rgb(74 63 53 / 0.12),
    0 4px 12px -4px rgb(74 63 53 / 0.06);
}

@layer base {
  * { border-color: var(--color-border); }
  html { scroll-behavior: smooth; }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
    background-image:
      radial-gradient(ellipse 80% 50% at 10% -10%, rgb(168 197 160 / 0.25), transparent),
      radial-gradient(ellipse 60% 40% at 90% 0%, rgb(240 196 168 / 0.2), transparent),
      radial-gradient(ellipse 50% 30% at 50% 100%, rgb(158 196 216 / 0.15), transparent);
    background-attachment: fixed;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@utility shadow-soft { box-shadow: var(--shadow-soft); }
@utility shadow-lift { box-shadow: var(--shadow-lift); }
@utility font-display { font-family: var(--font-display); }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes soft-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
@keyframes float-y {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@utility animate-fade-up { animation: fade-up 0.45s ease-out both; }
@utility animate-soft-pulse { animation: soft-pulse 2.4s ease-in-out infinite; }
@utility animate-float { animation: float-y 3.5s ease-in-out infinite; }
```

Không dùng Tailwind: đổi `@theme` thành `:root { … }` và viết class `.shadow-soft`, `.font-display`, v.v. Hex không đổi.
