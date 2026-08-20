# 06 — Elevation & chuyển động

Độ nổi đến từ **bóng nâu ấm rất nhẹ** và **kính mờ**. Chuyển động nhỏ, chậm, dễ tắt.

## Bóng

```css
--shadow-soft: 0 4px 20px -4px rgb(74 63 53 / 0.08),
               0 2px 8px  -2px rgb(74 63 53 / 0.04);
--shadow-lift: 0 8px 28px -6px rgb(74 63 53 / 0.12),
               0 4px 12px -4px rgb(74 63 53 / 0.06);
```

Màu bóng = ink (`74 63 53`), không black. Opacity 4–12%.

| Utility | Khi nào |
| --- | --- |
| `shadow-soft` | Card, input, nav active, button primary |
| `shadow-lift` | Dialog, select, FAB, auth card, hover primary, tile bấm được |

Nút primary: `shadow-soft` → `hover:shadow-lift` + `hover:brightness-105`.

Không `shadow-md/lg/xl` Tailwind (đen), không glow màu, không 3D.

## Blur & kính

| Mặt | Công thức |
| --- | --- |
| Sidebar | `bg-card/70 backdrop-blur-sm` |
| Header sticky | `bg-background/80 backdrop-blur-md` |
| Bottom nav | `bg-card/95 backdrop-blur-md` |
| Auth card | `bg-card/90 backdrop-blur-sm` |
| Dialog overlay | `bg-ink-900/30 backdrop-blur-[2px]` |
| Auth blobs | `blur-3xl` |

Blur để lộ nền kem — không glass iOS dày.

## Tầng bề mặt

1. **Canvas** — background + radial, không bóng.
2. **Sunken** — `cream-50/80`, dashed empty, secondary track.
3. **Resting card** — `bg-card shadow-soft border-border/70 rounded-2xl`.
4. **Tinted card** — resting + `peach-soft/40` hoặc `sage-soft/40`.
5. **Lifted** — dialog, auth, FAB, màn hình tập trung: `shadow-lift`.
6. **Overlay** — ink 30% + blur.

Một trang dùng 2–4 tầng. Màn hình tập trung được nhảy tầng 5.

## Keyframes

### `animate-fade-up`

Opacity 0→1, `translateY(8px)`→0, `0.45s ease-out both`. Trang vào, header, auth card. Stagger 40–80ms, tối đa 3–4 phần, delay ≤ 200ms.

### `animate-soft-pulse`

Opacity 1 ↔ 0.7, `2.4s ease-in-out infinite`. Skeleton trên `bg-secondary`. Blob auth. Không pulse chữ/nút.

### `animate-float`

`translateY(0)` ↔ `-4px`, `3.5s ease-in-out infinite`. Ô icon auth, empty 🍃. **Một** float mỗi viewport.

### Khác

- Spinner: icon + `animate-spin`.
- Progress: `duration-500 ease-out`.
- Button: `transition-all` + `active:scale-[0.98]`.
- Dialog: ~200ms.

Không bounce, elastic, page-flip. Không animation trang trí > 500ms trừ loop.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Không bypass. Timer/số liệu vẫn cập nhật — chỉ UI motion dừng.

## Hover & press

- Hover: `secondary` / `cream-300`, hoặc brightness trên primary.
- Press: `active:scale-[0.98]` trên button. Tile: `hover:shadow-lift`, không scale cả card.
- Không thông tin chỉ hiện khi hover.

## Cấm

- Parallax nền
- Confetti hoàn thành
- Shake lỗi form
- Skeleton shimmer bạc
- Lottie lớn autoplay
- Transition route phức tạp — fade-up nội dung là đủ
