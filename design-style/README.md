# StudyOS Design Style Guide

Bộ tài liệu này **đóng gói toàn bộ ngôn ngữ hình ảnh** của StudyOS: màu sắc, typography, khoảng trắng, chuyển động, component và các mẫu màn hình.

StudyOS không phải dashboard học tập lạnh. Đây là **không gian học tập dịu dàng** — ấm, gọn, tối giản, dễ dùng, đủ mềm để ngồi học lâu mà không bị căng.

## Mục đích

- Giữ UI **nhất quán** khi thêm màn hình, component hoặc trạng thái mới.
- Làm nguồn sự thật cho màu, chữ, bo góc, bóng, motion và giọng văn.
- Nâng cấp ngôn ngữ hiện có thành hệ thống **chỉn chu hơn**: có vai trò ngữ nghĩa, có thang đo, có quy tắc dùng — không chỉ là tập class Tailwind rải rác.
- Giúp người mới (hoặc agent) hiểu *cảm giác* của sản phẩm trước khi viết UI.

Đây là **tài liệu thiết kế**, không phải mã nguồn. Token đang sống trong `src/index.css`. Component đang sống trong `src/components/ui/` và `src/components/shared/`. Guide này mô tả *cách dùng chúng cho đúng tinh thần StudyOS*, kèm lớp tinh chỉnh nên tuân theo khi làm UI mới.

## Tinh thần trong một câu

> Giấy kem, mực nâu ấm, sage dịu, bóng mềm, chữ serif cho tiêu đề, Nunito cho thao tác — mọi thứ tròn, thưa, chậm, rõ.

Không neon. Không xám lạnh. Không góc nhọn. Không đổ bóng đen đậm. Không chữ dày đặc.

## Cách đọc

Đọc theo thứ tự nếu lần đầu vào hệ thống. Nhảy tới file cụ thể nếu đang implement.

| File | Khi nào cần |
| --- | --- |
| [01-principles.md](./01-principles.md) | Quyết định “có thuộc StudyOS không?” |
| [02-brand.md](./02-brand.md) | Logo, tên, cảm xúc thương hiệu |
| [03-color.md](./03-color.md) | Palette, token, semantic, màu môn học |
| [04-typography.md](./04-typography.md) | Font, thang chữ, hierarchy |
| [05-layout.md](./05-layout.md) | Spacing, radius, grid, shell |
| [06-elevation-motion.md](./06-elevation-motion.md) | Bóng, blur, animation |
| [07-components.md](./07-components.md) | Button, card, form, badge, dialog… |
| [08-patterns.md](./08-patterns.md) | Page header, empty, nav, toast, session |
| [09-iconography.md](./09-iconography.md) | Lucide, kích thước, ngữ cảnh |
| [10-voice.md](./10-voice.md) | Giọng văn tiếng Việt, microcopy |
| [11-accessibility.md](./11-accessibility.md) | Focus, contrast, reduced motion |
| [12-tokens.md](./12-tokens.md) | Catalog token đầy đủ để copy |
| [13-do-dont.md](./13-do-dont.md) | Việc nên làm / không nên làm |
| [14-polish.md](./14-polish.md) | Lớp chỉn chu: chi tiết nâng tầm UI |

## Nguồn sự thật trong code

| Layer | Nơi sống |
| --- | --- |
| Token màu, radius, shadow, font, keyframes | `src/index.css` |
| Font load + theme-color | `index.html` |
| shadcn config (New York, Lucide) | `components.json` |
| Primitives | `src/components/ui/` |
| Page chrome (header, empty, skeleton) | `src/components/shared/page.tsx` |
| App shell (sidebar, bottom nav) | `src/components/layout/app-shell.tsx` |
| Màu môn / trạng thái topic | `src/lib/labels.ts` |
| Toast | `src/App.tsx` (Sonner) |

Khi token trong CSS đổi, **cập nhật guide này cùng lúc** — đặc biệt `03-color.md` và `12-tokens.md`.

## Stack hình ảnh

- **Tailwind CSS v4** với `@theme` (không dùng `tailwind.config` cổ điển).
- **shadcn/ui** style New York, đã “ủ ấm”: cream, sage, radius lớn, shadow mềm.
- **Radix** cho dialog, tabs, select, switch, label.
- **Lucide** cho icon.
- **Fraunces** (display) + **Nunito** (UI).
- **Recharts** cho analytics — cùng palette, không màu chart mặc định lạnh.

## Phạm vi

Guide này bao phủ **toàn bộ UI hiện có** (login, onboarding, Today, Planner, Tasks, Subjects, Review, Exams, Error Log, Analytics, Documents, Help, Settings, Session, More) và các pattern dùng lại.

Không bao gồm: kiến trúc backend, Firestore, Cloudflare Worker. Xem `docs/ARCHITECTURE.md` cho phần đó.

## Nguyên tắc bảo trì

1. Token trước, class tuỳ biến sau. Đừng hard-code hex nếu đã có token.
2. Màu pastel (`sage`, `peach`, `sky`…) dùng cho **nhấn nhẹ / phân loại**, không dùng làm nền trang chính.
3. Một màn hình chỉ có **một hành động chính** màu primary.
4. Nếu một UI mới trông “sạch nhưng lạnh” — sai palette. Nếu trông “dễ thương nhưng rối” — sai spacing và hierarchy.
5. Mọi animation phải tôn trọng `prefers-reduced-motion` (đã có trong `src/index.css`).
