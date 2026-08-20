# Giấy ấm — Design Style Guide

Bộ tài liệu này là **hệ thống thiết kế độc lập**: đóng gói màu sắc, chữ, khoảng trắng, chuyển động, component và pattern UI. Dùng được cho **bất kỳ website nào** — landing, blog, cửa hàng, dashboard, SaaS — miễn là giữ đúng ngôn ngữ hình ảnh.

Không gắn với một sản phẩm, một ngành, hay một bộ tính năng. Tên, logo, nội dung, luồng nghiệp vụ do website đích tự điền.

## Tinh thần trong một câu

> Giấy kem, mực nâu ấm, sage dịu, bóng mềm, chữ serif cho tiêu đề, Nunito cho thao tác — mọi thứ tròn, thưa, chậm, rõ.

Không neon. Không xám lạnh. Không góc nhọn. Không đổ bóng đen đậm. Không chữ dày đặc. Không hustle.

Cảm giác: bàn giấy buổi chiều, ánh đèn ấm, dễ ngồi lâu. Không phòng lab, không dashboard zinc, không landing gradient tím.

## Dùng cho website khác như thế nào

1. Đọc [01-principles.md](./01-principles.md) — nếu UI mới không qua 5 nguyên tắc, đừng dùng hệ này.
2. Copy token từ [12-tokens.md](./12-tokens.md) vào CSS của project mới (Tailwind v4 `@theme`, CSS thuần, hoặc map sang token engine khác).
3. Gắn **tên + logo + tagline** của website mới theo khuôn [02-brand.md](./02-brand.md). Không mang theo copy hay màn hình của sản phẩm gốc.
4. Dựng UI bằng [07-components.md](./07-components.md) + [08-patterns.md](./08-patterns.md) — pattern là *khuôn hình*, không phải *tính năng*.
5. Review bằng [13-do-dont.md](./13-do-dont.md) và checklist [14-polish.md](./14-polish.md).

Stack gợi ý (không bắt buộc): Tailwind CSS v4, shadcn/ui (New York đã ủ ấm), Radix, Lucide. Có thể triển khai bằng CSS Modules, vanilla CSS, hay framework khác — miễn token và quy tắc giữ nguyên.

## Cách đọc

| File | Khi nào cần |
| --- | --- |
| [01-principles.md](./01-principles.md) | Quyết định “có thuộc Giấy ấm không?” |
| [02-brand.md](./02-brand.md) | Gắn tên, logo, tagline website của bạn |
| [03-color.md](./03-color.md) | Palette, semantic, pastel phân loại |
| [04-typography.md](./04-typography.md) | Font, thang chữ, hierarchy |
| [05-layout.md](./05-layout.md) | Spacing, radius, grid, shell marketing/app |
| [06-elevation-motion.md](./06-elevation-motion.md) | Bóng, blur, animation |
| [07-components.md](./07-components.md) | Button, card, form, badge, dialog… |
| [08-patterns.md](./08-patterns.md) | Khuôn trang generic (auth, list, settings…) |
| [09-iconography.md](./09-iconography.md) | Lucide, kích thước, vai trò |
| [10-voice.md](./10-voice.md) | Giọng văn, microcopy |
| [11-accessibility.md](./11-accessibility.md) | Focus, contrast, reduced motion |
| [12-tokens.md](./12-tokens.md) | Catalog + CSS copy-paste |
| [13-do-dont.md](./13-do-dont.md) | Việc nên làm / không nên làm |
| [14-polish.md](./14-polish.md) | Chi tiết nâng tầm UI |

## Phạm vi

**Có:** màu, chữ, layout, elevation, motion, component, pattern hình, giọng, a11y, token.

**Không có:** kiến trúc backend, API, domain nghiệp vụ, copy sản phẩm cụ thể, dark mode.

## Nguyên tắc bảo trì khi áp dụng

1. Token trước, hex tuỳ biến sau.
2. Pastel dùng để **nhấn / phân loại**, không làm nền trang.
3. Mỗi view chỉ **một** CTA `primary`.
4. UI “sạch nhưng lạnh” = sai palette. UI “dễ thương nhưng rối” = sai spacing.
5. Mọi animation tôn trọng `prefers-reduced-motion`.
6. Đổi tên sản phẩm, icon, nội dung — **không** đổi cream / ink / sage / Fraunces / Nunito nếu vẫn muốn là Giấy ấm.
