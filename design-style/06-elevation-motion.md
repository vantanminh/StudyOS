# 06 — Elevation & chuyển động

Độ nổi StudyOS đến từ **bóng nâu ấm rất nhẹ** và **kính mờ**, không từ layer đen hay neon. Chuyển động nhỏ, chậm, dễ tắt.

## Bóng

Hai utility — gần như đủ cho cả app:

```css
--shadow-soft: 0 4px 20px -4px rgb(74 63 53 / 0.08),
               0 2px 8px  -2px rgb(74 63 53 / 0.04);
--shadow-lift: 0 8px 28px -6px rgb(74 63 53 / 0.12),
               0 4px 12px -4px rgb(74 63 53 / 0.06);
```

Màu bóng = `ink-700` (`74 63 53`), không phải black. Opacity 4–12%.

| Utility | Khi nào |
| --- | --- |
| `shadow-soft` | Card, input, nav active, badge surface, toast nhẹ, button primary |
| `shadow-lift` | Dialog, select content, FAB, login card, session card, hover primary, More tile hover |

Cặp hover chuẩn của nút primary: `shadow-soft` → `hover:shadow-lift` + `hover:brightness-105`.

**Không:** `shadow-md/lg/xl` mặc định Tailwind (đen), `drop-shadow`, glow `shadow-primary/50`, viền giả 3D.

Bề mặt đã có border kem (`border-border/60–70`) thì bóng chỉ việc “nâng giấy”, không cần nặng.

## Blur & kính

| Mặt | Công thức |
| --- | --- |
| Sidebar | `bg-card/70 backdrop-blur-sm` |
| Mobile header | `bg-background/80 backdrop-blur-md` |
| Bottom nav | `bg-card/95 backdrop-blur-md` |
| Login card | `bg-card/90 backdrop-blur-sm` |
| Dialog overlay | `bg-ink-900/30 backdrop-blur-[2px]` |
| Login blobs | `blur-3xl` trên vòng pastel |

Blur là để **lộ nền kem/blob**, không phải glassmorphism iOS dày. Overlay dialog chỉ `2px` — vẫn đọc được trang dưới, vẫn focus được modal.

## Tầng bề mặt (elevation scale)

Từ thấp lên cao:

1. **Canvas** — `background` + radial global, không bóng.
2. **Sunken** — `cream-50/80` trong card, dashed empty, secondary track.
3. **Resting card** — `bg-card shadow-soft border-border/70 rounded-2xl`.
4. **Tinted card** — resting + `bg-peach-soft/40` (countdown) hoặc `bg-sage-soft/40` (help intro).
5. **Lifted** — dialog, login, session, FAB: `shadow-lift`.
6. **Overlay** — ink 30% + blur.

Một trang điển hình chỉ dùng 2–4. Session được phép nhảy tầng 5 ngay vì là “màn hình nghi lễ”.

## Keyframes hiện có

Định nghĩa trong `src/index.css`:

### `animate-fade-up`

- 0 → 8px lên, fade in, `0.45s ease-out both`.
- Trang vào, `PageHeader`, login card, hero Today.
- Stagger: `style={{ animationDelay: "60ms" }}` cho hàng tiếp (Today stats). Bước stagger 40–80ms. Không quá 200ms.

### `animate-soft-pulse`

- Opacity 1 ↔ 0.7, `2.4s ease-in-out infinite`.
- Skeleton (`SkeletonBlock` trên `bg-secondary`).
- Login blob sage.
- Không dùng cho nút hay chữ (gây loé).

### `animate-float`

- TranslateY 0 ↔ `-4px`, `3.5s ease-in-out infinite`.
- Ô icon login, empty state 🍃.
- **Một** float mỗi viewport. Không float nav.

### Khác

- Spinner: Lucide `Loader2` + `animate-spin` — loading auth/AI.
- Progress fill: `transition-all duration-500 ease-out`.
- Button: `transition-all` + `active:scale-[0.98]` — nhấn có “thật”.
- Dialog: Radix `animate-in/out` (duration ~200ms).

## Timing

| Loại | Duration | Easing |
| --- | --- | --- |
| Hover màu / bóng | ~150–200ms | default / ease |
| Fade-up vào trang | 450ms | ease-out |
| Dialog | 200ms | Radix |
| Progress | 500ms | ease-out |
| Pulse / float loop | 2.4s / 3.5s | ease-in-out |
| Active press | tức thì scale 0.98 | — |

Không bounce, không elastic, không page-flip. Không animation > 500ms trừ loop trang trí.

## Reduced motion

Đã global:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

UI mới **không** được bypass bằng inline `animation: ... !important`. Loop float/pulse tự tắt. Logic timer session vẫn chạy — chỉ UI motion dừng.

## Hover & press

- Desktop: hover đổi nền `secondary` / `cream-300`, hoặc brightness trên primary.
- Press: `active:scale-[0.98]` trên button — đủ, đừng thêm rotate/skew.
- Card More: `hover:shadow-lift` — nâng giấy, không scale cả tile (tránh layout shift).
- Không hover-only thông tin quan trọng — mobile không có hover.

## Những chuyển động cấm

- Parallax nền
- Confetti khi complete task
- Shake form error (dùng chữ `text-destructive` là đủ)
- Skeleton shimmer bạc (dùng `soft-pulse` trên `bg-secondary`)
- Auto-playing Lottie lớn
- Transition route custom phức tạp — `Outlet key={pathname}` + fade-up nội dung là đủ
