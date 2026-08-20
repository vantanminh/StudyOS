# 02 — Thương hiệu

## Tên

**StudyOS** — hệ điều hành học tập. Không viết `Study OS`, `studyos`, `StudyDash` trên UI (tên package npm là `studydash`, chỉ dùng nội bộ).

Tagline chính thức:

> Không gian học tập dịu dàng

Mô tả dài (login, meta description):

> Hệ điều hành học tập dịu dàng cho kỳ thi lớp 12 và IELTS.

Không dùng slogan kiểu “học thông minh hơn”, “crush your goals”, “10x productivity”.

## Tính cách

StudyOS là **người bạn học điềm đạm**: biết việc, không hối thúc, nói ngắn, luôn để lối thoát.

| Trục | Vị trí |
| --- | --- |
| Ấm ←→ Lạnh | Rất ấm |
| Mềm ←→ Sắc | Mềm, vẫn có cấu trúc |
| Học thuật ←→ Casual | Học thuật nhẹ, không formal |
| Playful ←→ Nghiêm | 15% playful (lá, float), 85% điềm |
| Dense ←→ Airy | Airy |

## Dấu hiệu nhận diện

Bộ nhận diện tối thiểu xuất hiện trên login, sidebar, mobile header:

1. **Ô icon** — hình vuông bo lớn (`rounded-2xl` hoặc `rounded-3xl`), nền `sage-soft`, icon Lucide `FileText` hoặc `BookOpen` màu `primary`.
2. **Wordmark** — `font-display` (Fraunces), semibold, `text-ink-900`, không letter-spacing rộng.
3. **Tagline** — Nunito `text-xs` `text-muted-foreground`.

Không vẽ logo phức tạp, không wordmark gradient, không icon 3D.

Kích thước ô icon:

| Ngữ cảnh | Ô | Icon |
| --- | --- | --- |
| Mobile header | 32×32 (`h-8 w-8`), `rounded-xl` | 16px |
| Sidebar | 40×40 (`h-10 w-10`), `rounded-2xl` | 20px |
| Login hero | 64×64 (`h-16 w-16`), `rounded-3xl` | 32px |

Login được phép `animate-float` nhẹ trên ô icon. Sidebar/header **không** float liên tục.

## Theme color & favicon

- `theme-color`: `#f7f1e8` (`cream-100` / `background`) — thanh trình duyệt mobile ấm, khớp nền.
- Favicon: SVG tối giản, cùng họ màu sage trên kem. Không đổi sang đen/trắng tương phản cao nếu chưa redesign bộ nhận diện.

## Bề mặt thương hiệu: “tờ giấy ấm”

Toàn app nằm trên một **tấm kem cố định** với ba vệt radial rất nhạt (sage trái, peach phải, sky đáy). Đây là “không khí” của brand — không phải illustration.

```
radial sage  25% opacity  → góc trên-trái
radial peach 20% opacity  → góc trên-phải
radial sky   15% opacity  → đáy giữa
background-attachment: fixed
```

Login tăng cường bằng ba blob `blur-3xl` (sage / peach / sky). Các trang trong app **không** thêm blob mới — chỉ hưởng nền global.

## Giọng thương hiệu (tóm tắt)

Chi tiết copy xem [10-voice.md](./10-voice.md).

- Xưng “bạn”. Chào theo giờ: “Chào buổi sáng / chiều / tối”.
- Động từ ngắn, không tiếng Anh không cần thiết. Ngoại lệ: tên mục nav đã ổn định (`Today`, `Planner`, `Tasks`…) có thể giữ song ngữ nhẹ vì đã quen trong product.
- Thành công: ấm, không reo hò. Lỗi: chỉ đường sửa, không đổ lỗi.

## Ảnh & illustration

Hiện tại **không dùng ảnh stock, không dùng illustration phức tạp**. Điểm nhấn thị giác:

- Gradient blob (login)
- Icon Lucide trong ô sage-soft
- Emoji tiết chế ở empty state (🍃)
- Màu subject token (8 pastel)

Nếu sau này thêm illustration: line art ấm, nét tròn, không outline đen dày, nền trong suốt, cùng palette. Không 3D render, không anime, không isometric phức tạp.
