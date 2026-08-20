# 07 — Components

Primitives nằm ở `src/components/ui/`. Shared chrome: `src/components/shared/page.tsx`. Khi thêm variant, giữ tinh thần dưới đây — đừng kéo lại look shadcn zinc.

Class gộp: `cn()` từ `src/lib/utils.ts`. Variant: `cva`.

---

## Button

File: `src/components/ui/button.tsx`

Base: `rounded-xl text-sm font-semibold`, gap icon 8px, `focus-visible:ring-2 ring-ring ring-offset-2`, `active:scale-[0.98]`, disabled `opacity-50`.

| Variant | Look | Khi nào |
| --- | --- | --- |
| `default` | `bg-primary text-primary-foreground shadow-soft` · hover brightness 105 + lift | **Một** CTA chính / màn |
| `secondary` | `bg-secondary` · hover `cream-300` | Hành động phụ, Google login, Pause |
| `outline` | `border bg-card` · hover `secondary` | Huỷ, Help, Logout nhẹ |
| `ghost` | hover `secondary`, không viền | Inline, ít nhấn |
| `destructive` | `bg-destructive` + soft shadow | Xoá / đăng xuất dứt khoát (More) |
| `soft` | `bg-sage-soft text-ink-800` · hover `sage/40` | CTA dịu, cùng họ brand nhưng không phải primary đậm |

| Size | Height | Ghi chú |
| --- | --- | --- |
| `default` | `h-11 px-5` | Mặc định |
| `sm` | `h-9 px-3 text-xs rounded-lg` | Trong card, sidebar |
| `lg` | `h-12 px-6 text-base rounded-2xl` | Login, session, onboarding |
| `icon` | `h-10 w-10` | Chỉ icon |

Icon Lucide `size-4`. Luôn có text hoặc `aria-label`.

Thứ tự trong cụm: primary trái (hoặc phải trên desktop footer dialog — `DialogFooter` là `sm:justify-end`, primary thường đứng cuối). Mobile footer dialog xếp cột-reverse: primary nằm trên.

---

## Card

File: `src/components/ui/card.tsx`

```
rounded-2xl border-border/70 bg-card shadow-soft
```

- `CardHeader` `p-5` `space-y-1.5`
- `CardTitle` `font-display text-lg font-semibold`
- `CardDescription` `text-sm text-muted-foreground`
- `CardContent` `p-5 pt-0` — bản compact trang list dùng `p-4` trực tiếp trên content
- `CardFooter` `p-5 pt-0`

Tints hợp lệ: `bg-peach-soft/40`, `bg-sage-soft/40`, `bg-sage-soft/30`, session gradient. Giữ `shadow-soft` trừ khi `border-none` + `shadow-lift` (session).

---

## Badge

File: `src/components/ui/badge.tsx`

`rounded-full px-2.5 py-0.5 text-xs font-semibold`

| Variant | Class cảm giác |
| --- | --- |
| `default` | `bg-primary/15 text-primary` |
| `secondary` | secondary fill |
| `outline` | viền border |
| `success` | sage-soft + primary |
| `warn` | butter-soft + ink-800 |
| `danger` | rose-soft + destructive |

Không dùng badge như nút. Tối đa ~3 badge / hàng task. Icon trong badge (streak flame) `h-3.5 w-3.5`.

---

## Input · Textarea · Select · Label

Cùng DNA control:

```
h-11 rounded-xl border-input bg-card px-3 text-sm shadow-soft
focus-visible:ring-2 ring-ring
placeholder:text-muted-foreground
```

- Label: `text-sm font-semibold text-ink-800`, luôn gắn `htmlFor`.
- Field stack: `space-y-2` (label → control).
- Form stack: `space-y-4`.
- Textarea `min-h-[96px]`, cùng border/shadow.
- Select content: `rounded-xl shadow-lift`, item `rounded-lg py-2`, check trái `pl-8`.
- Không underline input. Không material floating label.

---

## Dialog

File: `src/components/ui/dialog.tsx`

- Overlay: `ink-900/30` + blur 2px
- Content: `max-w-lg`, `w-[calc(100%-2rem)]`, `rounded-2xl p-6 shadow-lift`, căn giữa viewport
- Title: Fraunces `text-lg`
- Description: `text-sm muted`
- Close: góc phải, `rounded-lg`, `aria-label="Đóng"`
- Footer: cột-reverse mobile, hàng `justify-end` từ `sm`

Quick Add, weekly plan, end-session đều dùng pattern này. Đừng full-screen modal trừ khi sau này có flow đặc biệt mobile — hiện không cần.

---

## Tabs

`TabsList`: `h-11 rounded-xl bg-secondary p-1`.  
`TabsTrigger` active: `bg-card shadow-soft text-foreground font-semibold`.

Dùng cho Planner views, Analytics range (7/30/90). Không dùng tabs như primary nav (đã có shell).

---

## Switch

Track `h-6 w-11 rounded-full`. Off: `secondary`. On: `primary`. Thumb `bg-card shadow-soft`. Luôn kèm label bên trái (Settings rows).

---

## Progress

Track `h-2.5 rounded-full bg-secondary`. Fill `bg-primary` `duration-500 ease-out`. Không sọc, không gradient fill.

---

## Separator

`bg-border` 1px. Trên login: divider “hoặc email” — line + nhãn `bg-card px-3 text-xs muted`.

---

## Toast (Sonner)

`src/App.tsx`: `position="top-center"`, class

```
rounded-xl border-border bg-card text-foreground shadow-lift
```

- Success: hoàn thành setup, tạo task, sync nhẹ
- Message: thông tin trung tính (dời lịch, không overload)
- Error: thất bại mạng/AI — câu ngắn, hướng xử lý

Không toast mỗi lần navigate. Không HTML trong toast.

---

## PageHeader · EmptyState · SkeletonBlock

File: `src/components/shared/page.tsx`

**PageHeader** — bắt buộc cho trang trong shell (trừ Today có hero riêng, Session, Login, Onboarding).

- H1 Fraunces `text-3xl tracking-tight`
- Description `text-sm muted`
- Actions hàng nút `gap-2`, wrap
- `animate-fade-up`, `mb-6`

**EmptyState**

- Dashed `border-border`, `bg-card/60`, `rounded-2xl py-12`
- Ô 56px sage-soft + 🍃 `animate-float`
- Title Fraunces `text-lg`, description `max-w-sm`
- Slot `action` cho CTA

Đừng empty-state khác emoji mỗi trang. 🍃 là dấu hiệu “chưa có gì, yên”. Có thể đổi copy, giữ khung.

**SkeletonBlock**

- `animate-soft-pulse rounded-xl bg-secondary`
- Dùng khối, không wave bạc

---

## LogoutButton

Bọc `Button`. More page: `variant="destructive"` full width. Sidebar: `outline sm` full width. Destructive chỉ nơi user cố ý tìm “thoát”.
