# 07 — Components

Spec hình — triển khai bằng HTML/CSS, React, Vue, hay shadcn đều được. Tên class là Tailwind gợi ý; map 1:1 sang CSS thuần nếu cần.

Đừng kéo look mặc định zinc/slate của thư viện UI.

---

## Button

Base: `rounded-xl text-sm font-semibold`, gap icon 8px, `focus-visible:ring-2 ring-ring ring-offset-2`, `active:scale-[0.98]`, disabled `opacity-50`.

| Variant | Look | Khi nào |
| --- | --- | --- |
| `default` | `bg-primary text-primary-foreground shadow-soft` · hover brightness 105 + lift | **Một** CTA chính / view |
| `secondary` | `bg-secondary` · hover `cream-300` | Phụ, OAuth, Pause |
| `outline` | `border bg-card` · hover `secondary` | Huỷ, thoát nhẹ |
| `ghost` | hover `secondary` | Inline |
| `destructive` | `bg-destructive` + soft shadow | Xoá / thoát dứt khoát |
| `soft` | `bg-sage-soft text-ink-800` · hover `sage/40` | CTA dịu, cùng họ brand |

| Size | Height |
| --- | --- |
| `default` | `h-11 px-5` |
| `sm` | `h-9 px-3 text-xs rounded-lg` |
| `lg` | `h-12 px-6 text-base rounded-2xl` |
| `icon` | `h-10 w-10` |

Icon 16px. Luôn có chữ hoặc `aria-label`. Dialog footer desktop: primary cuối (`justify-end`). Mobile: `flex-col-reverse` — primary trên.

---

## Card

```
rounded-2xl border-border/70 bg-card shadow-soft
```

- Header `p-5 space-y-1.5`
- Title `font-display text-lg font-semibold`
- Description `text-sm text-muted-foreground`
- Content `p-5 pt-0` (list compact: `p-4`)
- Footer `p-5 pt-0`

Tint hợp lệ: `bg-peach-soft/40`, `bg-sage-soft/40`. Tập trung: `border-none shadow-lift` + gradient sage→card.

---

## Badge

`rounded-full px-2.5 py-0.5 text-xs font-semibold`

| Variant | Look |
| --- | --- |
| `default` | `bg-primary/15 text-primary` |
| `secondary` | secondary fill |
| `outline` | viền border |
| `success` | sage-soft + primary |
| `warn` | butter-soft + ink-800 |
| `danger` | rose-soft + destructive |

Không dùng như nút. ≤ 3 badge / hàng. Icon trong badge `h-3.5 w-3.5`.

---

## Input · Textarea · Select · Label

```
h-11 rounded-xl border-input bg-card px-3 text-sm shadow-soft
focus-visible:ring-2 ring-ring
placeholder:text-muted-foreground
```

- Label: `text-sm font-semibold text-ink-800` + `for`.
- Field: `space-y-2`. Form: `space-y-4`.
- Textarea `min-h-[96px]`.
- Select panel: `rounded-xl shadow-lift`; item `rounded-lg py-2`.
- Không underline, không floating label.

---

## Dialog

- Overlay: `ink-900/30` + blur 2px
- Hộp: `max-w-lg`, `w-[calc(100%-2rem)]`, `rounded-2xl p-6 shadow-lift`, giữa viewport
- Title Fraunces `text-lg`; mô tả `text-sm muted`
- Close góc phải, `aria-label="Đóng"`
- Không full-screen trừ flow mobile thật sự cần (hiếm)

---

## Tabs

List: `h-11 rounded-xl bg-secondary p-1`.  
Trigger active: `bg-card shadow-soft font-semibold`.

Lọc / khoảng thời gian / view phụ. Không thay primary nav.

---

## Switch

`h-6 w-11 rounded-full`. Off `secondary`, on `primary`. Thumb `bg-card shadow-soft`. Label luôn đứng cạnh.

---

## Progress

Track `h-2.5 rounded-full bg-secondary`. Fill `bg-primary duration-500 ease-out`. Không sọc, không gradient.

---

## Separator

`bg-border` 1px. Divider chữ (“hoặc”): line + nhãn `bg-card px-3 text-xs muted`.

---

## Toast

`position: top-center`.

```
rounded-xl border-border bg-card text-foreground shadow-lift
```

Success / message / error — câu ngắn. Không toast mỗi lần đổi trang. Không HTML trong toast.

---

## Page header

- H1 Fraunces `text-3xl tracking-tight`
- Description `text-sm muted`
- Actions `gap-2` wrap
- `animate-fade-up`, `mb-6`

Dùng cho trang trong app. Auth / wizard / hero / tập trung có khuôn riêng ([08-patterns.md](./08-patterns.md)).

---

## Empty state

- Dashed `border-border`, `bg-card/60`, `rounded-2xl py-12`, căn giữa
- Ô 56px sage-soft + 🍃 `animate-float` (`aria-hidden`)
- Title Fraunces `text-lg`, mô tả `max-w-sm`
- Một CTA

Đổi copy theo website. Giữ khung và 🍃 (hoặc một glyph Lucide trong ô sage-soft — không đổi emoji mỗi trang).

---

## Skeleton

`animate-soft-pulse rounded-xl bg-secondary`. Khối, không wave bạc.

---

## Link

Trong body: `text-primary font-semibold underline-offset-4 hover:underline`. Không xanh Bootstrap. Không gạch chân sẵn trừ khi là text-link phụ.
