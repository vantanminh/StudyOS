# 08 — Patterns màn hình

Các khuôn lặp lại. Implement trang mới bằng cách **ghép pattern**, không thiết kế từ trắng.

---

## 1. Hero hôm nay (Today)

Khối đầu trang chủ — khác PageHeader:

```
rounded-[1.75rem] border-border/60 bg-card/80 p-5 sm:p-6 shadow-soft animate-fade-up
```

- Kicker primary: greeting + tên
- H1 Fraunces `text-3xl`: “Hôm nay cần học gì?”
- Ngày `text-sm muted` (date-fns locale `vi`)
- Hàng badge: streak (warn + flame), đã học, dự kiến
- CTA phải: Start Focus Session (primary) + Hướng dẫn (outline)

Đây là **mặt thương hiệu trong app**. Đừng lặp hero này ở Settings/Tasks.

---

## 2. Stat row

`grid gap-3 sm:grid-cols-3` + card `p-4`:

- Label `text-xs muted` hoặc `text-xs font-semibold muted` (countdown)
- Value Fraunces `text-xl`–`text-2xl` / Nunito `text-2xl font-semibold`
- Countdown exam: card `bg-peach-soft/40` — ấm, gần hạn, không đỏ

Today còn cặp mini tile `bg-sage-soft/60` và `bg-sky-soft/60` cho review / completed — pastel phân vai, không phải CTA.

---

## 3. Task row

Ô trong list / timeline:

```
rounded-2xl (hoặc rounded-xl) border-border/60 bg-cream-50/80 p-4
```

- Trái: title `font-semibold`, meta `text-xs muted`
- Subject chip: `SUBJECT_COLOR_MAP` pill
- Phải: nút sm outline/ghost (Start, Done, Snooze)

**Overdue:** `border-rose/30 bg-rose-soft/40` — khác biệt rõ nhưng vẫn mềm.  
**Planner day cell:** `bg-cream-50 p-2 text-xs`, overload thêm `border-coral/50`.

Không zebra-stripe. Không table dày viền.

---

## 4. Focus Session

Màn hình nghi lễ — được phép “đặc” hơn:

- Căn giữa `max-w-lg`, card `border-none shadow-lift`
- `bg-gradient-to-b from-sage-soft/80 to-card`
- Kicker uppercase tracking-wide primary
- Timer Fraunces `text-6xl tabular-nums`
- Hai nút lg: Pause secondary / Resume primary + End outline
- Dialog kết thúc: rating, notes, complete task — form chuẩn

Không chrome sidebar hành động phụ. User đang học.

---

## 5. Login

- Blobs sage/peach/sky `blur-3xl` tuyệt đối
- Card `rounded-[2rem] bg-card/90 p-8 shadow-lift`
- Icon 64px float
- Wordmark `text-4xl` Fraunces
- Google = secondary lg; email submit = primary lg
- Divider “hoặc email”
- Link chuyển đăng ký: `text-sm text-primary underline-offset-4 hover:underline` — không nút thứ 3
- Lỗi config: `rounded-xl border-destructive/30 bg-destructive/5 text-xs`

Một cột, `max-w-md`. Không split hero ảnh.

---

## 6. Onboarding (4 bước)

- Center `max-w-2xl py-10`
- Step kicker `Bước n/4` primary
- Segment progress: 4 thanh `h-2 rounded-full`, active `bg-primary`, rest `bg-secondary`
- Chip chọn môn/kỳ thi:  
  selected `bg-sage-soft text-ink-900 shadow-soft`  
  idle `bg-secondary text-muted-foreground hover:bg-cream-300`
- Exam block: `rounded-xl border bg-cream-50 p-4`

Không wizard sidebar. Không skip mơ hồ nếu thiếu tên/môn — toast error + nhảy về bước thiếu.

---

## 7. Planner tuần

- Thanh công cụ + tabs
- Cột ngày: heading uppercase `text-xs` + số Fraunces `text-lg`
- Task chip nhỏ, subject pill
- Backlog cột phụ `bg-secondary/60`
- Quá tải: viền coral, không khoá drop
- AI plan / smart reschedule: dialog preview, user xác nhận — không tự apply im lặng về mặt UI (luôn thấy list)

---

## 8. Reminder host

`AutomationHost` trên main:

```
rounded-2xl border-border/60 bg-butter-soft/40 p-3
```

Butter = nhắc nhẹ, không khẩn. Icon Bell, nút dismiss, CTA đi tới task. Không overlay full màn, không modal chặn.

---

## 9. Help intro card

`border-primary/20 bg-sage-soft/40` + Sparkles + CardTitle. Đoạn giải thích sản phẩm. Tip cục bộ: `bg-peach-soft/50 rounded-xl px-3 py-2 text-sm text-ink-800`.

Số bước trong ô icon `h-9 w-9 rounded-xl bg-sage-soft text-primary`.

---

## 10. More (mobile)

- Profile card `rounded-2xl shadow-soft` + logout destructive
- Grid 2: tile `p-5`, icon `h-6 w-6 text-primary`, label `text-sm font-semibold`
- Hover/tap: `hover:shadow-lift`

Đây là “tray” — không search, không folder lồng.

---

## 11. Settings rows

Hàng `flex justify-between gap-3 rounded-xl border-border/50 px-3 py-2`: label trái, switch/control phải. Nhóm trong Card. Callout info: `bg-cream-50/80` hoặc `border-primary/15 bg-sage-soft/30`.

---

## 12. Documents / files

List trong card, hành động outline sm (tải, xoá). Upload lỗi → toast error, không banner đỏ full. Giữ empty 🍃 khi chưa có file.

---

## 13. Analytics

- Tabs range trước, stat row, chart card `h-72`
- Bar primary, grid cream-300
- Readiness: số `text-3xl font-semibold text-primary` + nhãn muted
- Disclaimer `text-xs muted` dưới H2 — số không được trông như lời hứa

---

## 14. Loading & lỗi trang

- Auth boot: `Loader2 h-8 w-8 text-primary` giữa viewport — không skeleton toàn app
- Missing session: Fraunces `text-2xl` + nút Về Today
- Lỗi form: `text-sm text-destructive` dưới field hoặc `text-center` trên login
- Không error boundary illustration phức tạp trong guide này; nếu thêm: empty-state dashed + CTA

---

## 15. Quick Add

Dialog chuẩn. Parse AI: preview rồi mới lưu. Toast message khi preview, toast error khi fail. Primary “Lưu” chỉ enable khi form hợp lệ.

---

## Điều hướng — map cảm xúc

| Khu | Màu cảm xúc chủ | Ghi chú |
| --- | --- | --- |
| Today | Card kem + peach countdown + sage/sky stats | Trung tâm ngày |
| Planner | Cream cells, coral overload | Lịch, không calendar native thô |
| Session | Sage gradient | Tập trung |
| Review / Errors | Rose khi due/severity | Nhắc, không báo động |
| Analytics | Primary numbers | Trầm, số liệu |
| Help | Sage intro + peach tips | Dạy nhẹ |
| Login | Blob 3 màu brand | Cửa vào |

Một trang không được sơn cả 8 pastel.
