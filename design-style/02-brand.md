# 02 — Thương hiệu (khuôn gắn sản phẩm)

Hệ **Giấy ấm** không sở hữu tên website. File này là **khuôn nhận diện**: website đích điền tên, tagline, icon — giữ nguyên hình khối, màu, chữ.

## Những gì website đích tự điền

| Slot | Quy tắc hình | Ví dụ (bạn thay) |
| --- | --- | --- |
| Tên | Fraunces semibold, `text-ink-900`, không tracking rộng, không gradient chữ | `{Tên sản phẩm}` |
| Tagline | Nunito `text-xs` `text-muted-foreground`, một dòng | câu ngắn, ấm, không hustle |
| Mô tả meta | Một câu, không slogan “10x” / “crush goals” | mô tả việc website làm |
| Icon mark | Lucide (hoặc SVG 1 màu) trong ô sage-soft, `text-primary` | một glyph đơn |

Không đổi cream / sage / Fraunces / Nunito để “khớp ngành”. Ngành thể hiện bằng **nội dung và icon**, không bằng skin mới.

## Tính cách thị giác

Giấy ấm nói bằng hình như **người bạn điềm đạm**: biết việc, không hối, nói ngắn.

| Trục | Vị trí |
| --- | --- |
| Ấm ←→ Lạnh | Rất ấm |
| Mềm ←→ Sắc | Mềm, vẫn có cấu trúc |
| Formal ←→ Casual | Thanh lịch nhẹ, không suit |
| Playful ←→ Nghiêm | 15% playful (lá, float), 85% điềm |
| Dense ←→ Airy | Airy |

## Dấu hiệu nhận diện (bộ tối thiểu)

Xuất hiện header, sidebar, trang chào:

1. **Ô icon** — vuông bo lớn, nền `sage-soft`, glyph `text-primary`.
2. **Wordmark** — `font-display` (Fraunces), semibold, `text-ink-900`.
3. **Tagline** — Nunito `text-xs` `text-muted-foreground` (có thể ẩn trên mobile).

Không logo 3D, không wordmark gradient, không wordmark nhiều màu.

Kích thước ô icon:

| Ngữ cảnh | Ô | Bo | Icon |
| --- | --- | --- | --- |
| Header mobile / compact | 32×32 (`h-8 w-8`) | `rounded-xl` | 16px |
| Sidebar / header desktop | 40×40 (`h-10 w-10`) | `rounded-2xl` | 20px |
| Auth / hero chào | 64×64 (`h-16 w-16`) | `rounded-3xl` | 32px |

Auth/hero được phép `animate-float` trên ô icon. Header/sidebar **không** float liên tục.

## Theme color & favicon

- `theme-color` / thanh trình duyệt: `#f7f1e8` (`background`).
- Favicon: SVG tối giản, sage trên kem (hoặc glyph 1 màu primary). Không invert đen-trắng lạnh nếu vẫn theo hệ này.

## Bề mặt: tờ giấy ấm

Mọi trang nằm trên **tấm kem cố định** với ba vệt radial rất nhạt. Đây là không khí hệ — không phải illustration sản phẩm.

```
radial sage  25% opacity  → góc trên-trái
radial peach 20% opacity  → góc trên-phải
radial sky   15% opacity  → đáy giữa
background-attachment: fixed
```

Công thức CSS: [12-tokens.md](./12-tokens.md).

Trang auth được thêm ba blob `blur-3xl` (sage / peach / sky). Trang trong ứng dụng **không** thêm blob mới.

## Giọng (tóm tắt)

Chi tiết: [10-voice.md](./10-voice.md).

- Xưng “bạn” (hoặc trung tính nếu website B2B — vẫn ngắn, ấm, không hối).
- Thành công: ấm, không reo hò. Lỗi: chỉ đường sửa, không đổ lỗi.
- Tên mục nav: nhất quán trong *website đó*; guide này không áp đặt nhãn.

## Ảnh & illustration

Mặc định **không** ảnh stock, không illustration phức tạp. Điểm nhấn:

- Radial / blob pastel
- Icon Lucide trong ô sage-soft
- Emoji tiết chế ở empty (🍃)
- 8 pastel phân loại (chip, category)

Nếu thêm illustration: line art ấm, nét tròn, không outline đen dày, nền trong suốt, cùng palette. Không 3D, không anime, không isometric phức tạp.

Ảnh chụp (nếu website cần): saturation thấp, ánh sáng ấm, bo `rounded-2xl`, không viền đen. Không phủ overlay xanh lạnh.
