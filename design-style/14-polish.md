# 14 — Lớp chỉn chu (polish)

Phần này **nâng** ngôn ngữ hiện có thành hệ thống khép kín. Một phần đã có trong code; phần còn lại là spec khi viết UI mới — **không yêu cầu refactor ngay**, nhưng UI mới phải theo.

Đây là chỗ “thật chỉn chu”: chi tiết nhỏ cộng lại thành cảm giác sản phẩm hoàn chỉnh.

---

## 1. Quang học (optical, không chỉ số)

- Icon Lucide cạnh chữ: thẳng hàng bằng `items-center gap-2`. Nếu trông thấp, `translate-y-[0.5px]` trên icon — không tăng font.
- Wordmark Fraunces cạnh ô 40px: căn theo cap-height, tagline `text-xs` sát dưới, `leading` chặt.
- Timer 6xl: giữ một dòng, `tabular-nums`, không `tracking-widest` (sẽ hở xấu).
- Badge có icon: `gap-1`, icon `3.5` — không `gap-2` (lỏng).

## 2. Viền chỉ đủ thấy

Trên kem, viền đầy `#e2d0b8` đôi khi nặng. Ưu tiên:

| Bề mặt | Border |
| --- | --- |
| Card resting | `border-border/70` |
| Header / sidebar / nav | `border-border/50`–`/60` |
| Ô lồng trong card | `border-border/50`–`/60` |
| Tint sage help | `border-primary/15`–`/20` |
| Overdue | `border-rose/30` |
| Overload | `border-coral/50` |
| Session | `border-none` (đã có shadow-lift) |

Một object: **hoặc** tint nền **hoặc** bóng mạnh — không cả ba (border đậm + tint + lift) trừ login.

## 3. Hover là “giấy nhấc lên”

- Tile / card bấm được: `hover:shadow-lift` hoặc `hover:bg-secondary`, **không** scale 1.02 (nhảy layout).
- Primary: `brightness-105` + lift — như đèn ấm hơn, không như neon.
- Disabled không có hover.

## 4. Stagger có nhịp

Hero `fade-up` 0ms. Hàng stat `60ms`. Hàng tiếp `120ms`. Dừng sau 3–4 phần. Cả trang delay 400ms+ trông chậm, giả.

`both` fill-mode đã tránh flash unstyled. Giữ `both` khi dùng fade-up.

## 5. Số liệu trông “đo được”

- Stat lớn: semibold, ink hoặc primary, `tabular-nums`.
- Đơn vị (`phút`, `%`, `ngày`) `text-sm` hoặc `text-xs muted` — không cùng size với số.
- Progress luôn có ngữ cảnh (label hoặc %).
- Chart: grid kem, bar sage, góc trên 8px — không `stroke` đen, không legend rainbow.

## 6. Pastel có ngân sách

Mỗi view: **1 nền canvas + 1 họ nhấn**.

Ví dụ Today: canvas kem, peach countdown, sage/sky mini-stat, rose chỉ khi overdue. Hết.

Settings: kem + một callout sage-soft. Không peach + lavender + mint cùng form.

## 7. Chip chọn (onboarding / filters)

Trạng thái idle / hover / selected đã có. Bổ sung spec focus: ring như button. Selected không cần viền extra — sage-soft + `shadow-soft` đã đủ “nút được ấn”.

Nhiều chip: `flex-wrap gap-2`, không hàng scroll ẩn.

## 8. Dialog hoàn chỉnh

Luôn đủ: title Fraunces, description muted nếu cần ngữ cảnh, body form `space-y-4`, footer nút. Close X + Escape.

Primary trong footer: hành động khẳng định (“Lưu”, “Tạo”, “Kết thúc phiên”). Destructive trong dialog xoá: variant destructive, không primary xanh.

Mobile: footer stack, primary **trên** (column-reverse đã có).

## 9. Trạng thái đồng bộ & hệ thống

Badge sync sidebar là mẫu: success / warn, chữ Việt. Mở rộng:

| Trạng thái | Badge |
| --- | --- |
| Đã đồng bộ | `success` |
| Đang chờ | `warn` |
| Thất bại | `danger` |
| Demo local | `outline` + câu `text-xs muted` |

Không spinner vĩnh viễn không tên. Busy nút: `Loader2` trong nút, disable siblings.

## 10. Focus session như nghi lễ

Đã đúng hướng. Chỉn chu thêm khi sửa:

- Một card, nhiều thở (`p-8`, `space-y-6`).
- Không list task khác, không chart.
- Kết thúc = dialog, không navigate ngay mất context.
- Resume prompt: cùng card, hai nút rõ — không toast-only.

## 11. Empty, một giọng

Mọi list trống: `EmptyState` shared. Đổi title/description/action. Giữ 🍃 + dashed + float.

Ngoại lệ: missing session (có object ID sai) là error nhẹ, không empty “chưa có”.

## 12. Mobile first cho ngón cái

- CTA ngày (Start Session) không chỉ ở góc phải desktop — trên mobile hero stack, nút full hoặc wrap `gap-2` (Today đã wrap).
- Không hover-only drag hint trên Planner; cần nút/sm text “xếp vào ngày”.
- Bottom nav label `10px semibold` — giữ 5 item, không thêm item thứ 6.

## 13. Help & tip

Intro sage-soft + tip peach-soft: **dạy** bằng màu brand, không banner info xanh Bootstrap. Số bước trong ô sage. Tip không `!` và không “Pro tip 💡”.

## 14. Không thêm hệ song song

Cấm khi “chỉn chu” theo hướng khác:

- Design tokens CSS mới màu lạnh
- Thư viện animation (Framer) cho fade đơn giản
- Custom checkbox lệch switch
- Card glass đậm `bg-white/10` kiểu dark dashboard

Chỉn chu = **làm đúng hệ hiện có, dày spec hơn**, không phải skin mới.

## 15. Checklist ship UI mới

In và đánh dấu:

- [ ] Token màu/radius/shadow từ catalog, không hex lạ
- [ ] Một primary
- [ ] Fraunces title, Nunito UI
- [ ] Empty / loading / error
- [ ] `aria-label` icon-only, `lang` Việt
- [ ] Ring focus, reduced motion
- [ ] Mobile không đè nav
- [ ] Copy ngắn, không hustle
- [ ] Pastel ≤ ngân sách view
- [ ] Toast chỉ khi user cần biết

Khi đủ 10/10 — UI đó thuộc StudyOS.
