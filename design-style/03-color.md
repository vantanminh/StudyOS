# 03 — Màu sắc

Màu StudyOS là **kem + mực nâu + sage**, điểm pastel thấp bão hoà. Mọi màu UI phải lấy từ token, không tự pha hex lạnh (blue-600, zinc, slate).

Nguồn: `@theme` trong `src/index.css`.

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
| `muted` | `#efe4d4` | Nền phụ (trùng secondary — cố ý, cùng họ kem) |
| `muted-foreground` | `#7a6b5d` | Caption, meta, nav inactive |
| `accent` | `#f0c4a8` | Điểm nhấn ấm (peach) — dùng sparingly |
| `accent-foreground` | `#3a3129` | Chữ trên accent |
| `destructive` | `#c45c5c` | Xoá, lỗi thật sự |
| `destructive-foreground` | `#fffbf6` | Chữ trên destructive |
| `border` / `input` | `#e2d0b8` | Viền, input border |
| `ring` | `#6b8f71` | Focus ring (trùng primary) |

**Quy tắc:** chữ luôn ink/muted trên kem. Không đặt `foreground` đen thuần `#000`. Không đặt nền `#fff` lạnh — card là `#fffbf6` (trắng ngà).

## Nền kem (cream)

Thang giấy:

| Token | Hex | Dùng khi |
| --- | --- | --- |
| `cream-50` | `#fbf8f3` | Lớp trong cùng, ô task trong planner, row nhạt |
| `cream-100` | `#f7f1e8` | Nền app (= `background`) |
| `cream-200` | `#efe4d4` | Secondary / muted / hover |
| `cream-300` | `#e2d0b8` | Border, hover đậm hơn (`hover:bg-cream-300`) |

Cream không dùng làm chữ. Contrast chữ nằm ở ink.

## Mực (ink)

Thang chữ ấm — hơi nâu, không charcoal lạnh.

| Token | Hex | Dùng khi |
| --- | --- | --- |
| `ink-700` | `#4a3f35` | Chữ phụ đậm hơn muted, overlay dialog (`ink-900/30`) |
| `ink-800` | `#3a3129` | Label, chữ trên pastel soft, secondary-foreground |
| `ink-900` | `#2c251f` | Tiêu đề, chữ chính (= `foreground`) |

Không dùng `text-black`, `text-zinc-*`, `text-slate-*`.

## Primary sage

Sage là **màu hành động và sức sống nhẹ** — cây, tiến bộ, “được rồi”.

| Token | Hex | Dùng |
| --- | --- | --- |
| `sage` | `#a8c5a0` | Tint, blob, hover `sage/40` |
| `sage-soft` | `#d8e8d3` | Nav active, badge success, ô icon brand, nút `soft` |
| `primary` | `#6b8f71` | Nút chính, icon brand, progress fill, chart bar |

`primary` **đậm hơn** `sage` để chữ kem trên nút đọc được. Đừng dùng `sage` làm nền nút CTA (contrast yếu).

## Pastel điểm (accent family)

Tám cặp màu — mỗi cái có bản đặc và bản *soft* (nền chip). Đây là **hệ phân loại**, không phải hệ CTA.

| Tên | Đặc | Soft | Cảm giác | Việc nên dùng |
| --- | --- | --- | --- | --- |
| Sage | `#a8c5a0` | `#d8e8d3` | Ổn định, xong việc | Success, mastered, brand |
| Sky | `#9ec4d8` | `#d5e8f2` | Tĩnh, đang học | Topic `learning`, stat phụ |
| Lavender | `#c4b5d8` | `#ebe4f4` | Mềm, phụ | Môn học, phân loại trung tính |
| Peach | `#f0c4a8` | `#f9e6d8` | Ấm, gần hạn | Countdown exam, khối profile sidebar, tip |
| Rose | `#e8b4b8` | `#f6e0e2` | Cần chú ý | Overdue, needs_review, danger nhẹ |
| Mint | `#a8d4c4` | `#d8efe6` | Tươi, phụ | Môn học, không dùng thay sage |
| Butter | `#ead89a` | `#f6efd0` | Nhắc nhẹ | Warning, streak, reminder chip, practicing |
| Coral | `#e8a090` | `#f6ddd6` | Quá tải | Planner overload, không dùng thay destructive |

### Cách dùng pastel cho đúng

- **Nền chip / badge / subject tag:** luôn bản `-soft` + chữ `ink-800` (hoặc `primary` / `destructive` khi semantic).
- **Viền chip:** màu đặc `/40` (ví dụ `border-sage/40`) — đủ để phân biệt, không kẹo.
- **Khối nhấn trang:** `-soft` với opacity `40–60%` trên card (`bg-peach-soft/40`, `bg-sage-soft/40`).
- **Không** phủ full-page bằng pastel.
- **Không** dùng quá 2–3 pastel trên cùng một card.
- **Không** đặt chữ trắng trên pastel soft.

## Bảng semantic mở rộng (lớp chỉn chu)

Code hiện có badge `success | warn | danger`. Khi thiết kế state mới, map như sau:

| Ý nghĩa | Nền | Chữ | Ví dụ |
| --- | --- | --- | --- |
| Success / synced / mastered | `sage-soft` | `primary` | Badge success, sync “Đã đồng bộ” |
| Info / đang học | `sky-soft` | `ink-800` | Topic learning, stat phụ Today |
| Warning / pending / streak | `butter-soft` | `ink-800` | Badge warn, reminder host |
| Danger nhẹ / overdue / review | `rose-soft` | `destructive` | Badge danger, task quá hạn |
| Danger hành động (xoá) | `destructive` | `primary-foreground` | Button destructive |
| Neutral / archived | `secondary` | `muted-foreground` | Topic archived, not_started |

Destructive **đậm** (`#c45c5c`) chỉ cho hành động không đảo ngược hoặc lỗi chặn luồng. Overdue trên Today dùng rose-soft — nhắc, không phạt.

## Màu môn học (subject tokens)

`SUBJECT_COLOR_MAP` trong `src/lib/labels.ts`:

```
sage | sky | lavender | peach | rose | mint | butter | coral
```

Class chuẩn:

```
bg-{token}-soft text-ink-800 border-{token}/40
```

Gán màu khi tạo môn (xoay 8 token). Không để user tự nhập hex. Không dùng primary/destructive làm màu môn.

Hai môn cạnh nhau nên khác họ màu. Nếu trùng, xoay token kế tiếp.

## Topic status

| Status | Nền + chữ |
| --- | --- |
| `not_started` | `bg-muted text-muted-foreground` |
| `learning` | `bg-sky-soft text-ink-800` |
| `practicing` | `bg-butter-soft text-ink-800` |
| `needs_review` | `bg-rose-soft text-destructive` |
| `mastered` | `bg-sage-soft text-primary` |
| `archived` | `bg-secondary text-muted-foreground` |

## Overlay & trong suốt

| Dùng | Giá trị |
| --- | --- |
| Dialog overlay | `bg-ink-900/30` + `backdrop-blur-[2px]` — mờ ấm, không đen 70% |
| Sidebar | `bg-card/70 backdrop-blur-sm` |
| Mobile header | `bg-background/80 backdrop-blur-md` |
| Bottom nav | `bg-card/95 backdrop-blur-md` |
| Login card | `bg-card/90 backdrop-blur-sm` |
| Viền nhẹ trên kem | `border-border/50` tới `/70` — full `border` hơi nặng trên nền ấm |

## Chart (Analytics)

- Grid: `stroke="#e2d0b8"` (`border` / `cream-300`), dash `3 3`.
- Bar: `fill="#6b8f71"` (`primary`), `radius={[8, 8, 0, 0]}`.
- Tick: 11px, ink/muted — không xám Recharts mặc định nếu có thể set.
- Một series = primary. Series 2 (nếu thêm) = `sky`. Series 3 = `peach`. Không rainbow.

Tooltip chart nên ăn card + border + shadow-lift, chữ ink — không nền trắng CSS mặc định nếu custom được.

## Tương phản (tóm tắt)

Cặp **đạt** để body text:

- `ink-900` trên `background` / `card` / cream
- `ink-800` trên mọi `*-soft`
- `primary-foreground` trên `primary` và `destructive`
- `muted-foreground` trên cream — chỉ cho meta, không cho body dài

Cặp **tránh**:

- `muted-foreground` trên peach-soft/sage-soft (hơi yếu)
- `sage` (nhạt) làm nền nút + chữ kem
- `primary` chữ trên `sage-soft` thì được; `primary` chữ trên `background` được cho link/nhãn — không cho đoạn văn dài

Chi tiết a11y: [11-accessibility.md](./11-accessibility.md).

## Gradient cho phép

1. **Nền body** — 3 radial, đã định nghĩa global. Không nhân bản.
2. **Login blobs** — 3 vòng pastel blur.
3. **Focus Session card** — `bg-gradient-to-b from-sage-soft/80 to-card`. Đây là màn hình “nghi lễ”, được phép đặc biệt.

Cấm: gradient nút, gradient chữ, mesh phức tạp, dark-to-light lạnh.

## Dark mode

**Không có dark mode.** Palette được thiết kế cho giấy sáng. Đừng thêm `dark:` cho đến khi có quyết định brand riêng (và phải thiết kế lại ink/cream, không đảo ngược máy móc).
