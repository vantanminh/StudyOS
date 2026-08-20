# 08 — Patterns (khuôn trang generic)

Khuôn hình, không tính năng sản phẩm. Website đích nhét nội dung của mình vào. Ghép pattern — đừng thiết kế từ trắng.

---

## 1. Hero trong app (home đã login)

Khác page header — mặt thương hiệu của phiên làm việc:

```
rounded-[1.75rem] border-border/60 bg-card/80 p-5 sm:p-6 shadow-soft animate-fade-up
```

- Kicker primary (greeting hoặc nhãn ngắn)
- H1 Fraunces `text-3xl`
- Meta `text-sm muted`
- Hàng badge tùy chọn
- CTA phải (wrap trên mobile): một primary + một outline

Chỉ **một** hero kiểu này trên home. Trang list/settings dùng page header.

---

## 2. Hero marketing (trang công khai)

Căn giữa, `py-16`–`py-24`, không blob thêm nếu đã có radial global.

- Ô icon 64px (tuỳ chọn)
- H1 `text-4xl` Fraunces
- Một đoạn `text-sm muted max-w-md mx-auto`
- Một primary `lg` + link phụ `text-primary`

Không carousel, không video autoplay, không 3 CTA.

---

## 3. Stat row

`grid gap-3 sm:grid-cols-3` + card `p-4`:

- Label `text-xs muted`
- Số `text-2xl font-semibold tabular-nums` (Fraunces hoặc Nunito semibold)
- Đơn vị `text-xs muted`, không cùng size với số

Khối “gần hạn / nổi ấm”: `bg-peach-soft/40`. Cặp mini: `sage-soft/60` và `sky-soft/60`.

---

## 4. List row / item

```
rounded-2xl border-border/60 bg-cream-50/80 p-4
```

- Trái: title `font-semibold`, meta `text-xs muted`, chip category
- Phải: nút sm outline/ghost

Cần chú ý: `border-rose/30 bg-rose-soft/40`.  
Quá ngưỡng: `border-coral/50`.  
Không zebra, không table viền dày.

---

## 5. Màn hình tập trung

Một việc, ít chrome (timer, soạn thảo yên, checkout bước cuối):

- Giữa `max-w-lg`
- Card `border-none shadow-lift`
- `bg-gradient-to-b from-sage-soft/80 to-card`
- Kicker uppercase tracking-wide primary
- Số/tiêu đề lớn Fraunces
- Hai nút `lg` (phụ + chính) + huỷ outline

Không sidebar hành động phụ trên màn này.

---

## 6. Auth (đăng nhập / đăng ký)

- Blobs sage/peach/sky `blur-3xl` tuyệt đối
- Card `rounded-[2rem] bg-card/90 p-8 shadow-lift max-w-md`
- Icon 64px float + wordmark `text-4xl` Fraunces
- OAuth = secondary `lg`; submit = primary `lg`
- Divider “hoặc …”
- Chuyển mode: `text-sm text-primary underline-offset-4 hover:underline`
- Lỗi hệ thống: `rounded-xl border-destructive/30 bg-destructive/5 text-xs`

Một cột. Không split ảnh.

---

## 7. Wizard / onboarding

- Center `max-w-2xl py-10`
- Kicker `Bước n/N` primary
- Segment `h-2 rounded-full`: xong `bg-primary`, chưa `bg-secondary`
- Chip chọn: selected `bg-sage-soft text-ink-900 shadow-soft`; idle `bg-secondary text-muted-foreground hover:bg-cream-300`
- Khối phụ: `rounded-xl border bg-cream-50 p-4`

Thiếu field: toast + nhảy về bước thiếu. Không skip mơ hồ.

---

## 8. Lịch / bảng ngày (nếu website có)

- Heading cột: `text-xs uppercase muted` + số Fraunces `text-lg`
- Ô: `bg-cream-50 p-2 text-xs`
- Chip category trong ô
- Cột phụ backlog: `bg-secondary/60`
- Overload: `border-coral/50`, không khoá tương tác

---

## 9. Banner nhắc (inline)

```
rounded-2xl border-border/60 bg-butter-soft/40 p-3
```

Butter = nhắc nhẹ. Icon + chữ + dismiss + một CTA. Không overlay full, không modal chặn.

---

## 10. Intro / tip

Intro sản phẩm: `border-primary/20 bg-sage-soft/40` + title Fraunces.  
Tip cục bộ: `bg-peach-soft/50 rounded-xl px-3 py-2 text-sm text-ink-800`.  
Số bước: ô `h-9 w-9 rounded-xl bg-sage-soft text-primary`.

Không banner xanh Bootstrap, không “Pro tip 💡”.

---

## 11. Tray “thêm” (mobile)

- Card tài khoản `rounded-2xl shadow-soft`
- Grid 2: tile `p-5`, icon `h-6 w-6 text-primary`, label `text-sm font-semibold`
- `hover:shadow-lift`

Không search, không folder lồng.

---

## 12. Settings

Hàng `flex justify-between gap-3 rounded-xl border-border/50 px-3 py-2`: label trái, switch phải. Nhóm trong Card. Callout: `bg-cream-50/80` hoặc `border-primary/15 bg-sage-soft/30`.

---

## 13. File / media list

List trong card, hành động outline sm. Lỗi upload → toast, không banner đỏ full. Empty 🍃 khi chưa có mục.

---

## 14. Số liệu / chart

Tabs khoảng thời gian → stat row → card chart `h-72`. Disclaimer `text-xs muted` nếu số dễ hiểu nhầm. Một series primary.

---

## 15. Bài viết / docs

`max-w-3xl`. H2 Fraunces `text-xl`. Body `text-sm` hoặc `text-base` nếu đọc dài. Link primary. Ảnh `rounded-2xl`. Không sidebar ads.

---

## 16. Loading & lỗi

- Boot: spinner `h-8 w-8 text-primary` giữa viewport
- Không tìm thấy: Fraunces `text-2xl` + một nút về home
- Lỗi form: `text-sm text-destructive` cạnh field
- Error page: empty dashed + CTA, không illustration phức tạp

---

## 17. Tạo nhanh (dialog)

Dialog chuẩn. Nếu AI/gợi ý: **xem trước rồi mới ghi**. Primary “Lưu” chỉ khi form hợp lệ.

---

## Ngân sách màu theo loại trang

| Loại | Họ nhấn |
| --- | --- |
| Home / hero | Kem + peach nhẹ + sage/sky stat |
| List / bảng | Cream cells; coral khi quá ngưỡng |
| Tập trung | Sage gradient |
| Cảnh báo nhẹ | Rose soft |
| Số liệu | Primary numbers |
| Docs / help | Sage intro + peach tip |
| Auth | Blob 3 màu brand |
| Settings | Kem + một callout sage |

Một trang không sơn cả 8 pastel.
