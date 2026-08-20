# 01 — Nguyên tắc thiết kế

Năm nguyên tắc này quyết định mọi lựa chọn UI. Khi hai ý tưởng xung đột, ưu tiên nguyên tắc phía trên.

## 1. Dịu dàng trước, hiệu năng cảm xúc sau

StudyOS phục vụ học sinh ôn thi — đã đủ áp lực. Giao diện **không được la hét**.

- Nền kem ấm, không trắng tinh hay xám lạnh.
- Primary là sage (xanh sage trầm), không xanh điện hay cam báo động.
- Cảnh báo dùng rose/butter *nhạt*, chữ mực nâu — không banner đỏ fulminant.
- Motion chậm, biên độ nhỏ (`8px` fade-up, `4px` float).

Cảm giác đúng: như bàn học buổi chiều, giấy vở, ánh đèn ấm. Không phải phòng lab, không phải app productivity Silicon Valley.

## 2. Tối giản có chủ đích

Tối giản ở đây không phải “ít element đến mức khô”. Là **mỗi phần tử phải kiếm được chỗ đứng**.

- Một trang = một tiêu đề display + một mô tả ngắn + nội dung.
- Card không có trang trí thừa (gradient mạnh, icon lớn lung tung, illustration stock).
- Badge chỉ khi cần phân loại (ưu tiên, trạng thái, môn). Không gắn badge cho mọi dòng.
- Empty state một icon/emoji, một câu, một CTA — không paragraph dài.

Nếu bỏ đi mà không mất nghĩa — bỏ.

## 3. Dễ dùng hơn là “trông hay”

Thứ tự ưu tiên khi conflict: **rõ hành động > đọc được > đẹp**.

- Nút chính đủ lớn (`h-11` mặc định, `h-12` khi CTA lớn).
- Trên mobile: bottom nav 5 mục, nút Add nổi — không nhồi 11 mục như desktop.
- Form: label luôn hiện, placeholder không thay label.
- Focus ring sage luôn thấy được (`ring-2 ring-ring`).
- Copy tiếng Việt ngắn, động từ rõ: “Bắt đầu”, “Lưu”, “Dời sang ngày mai”.

Đẹp là hệ quả của thứ tự, khoảng trắng và màu đúng — không phải hiệu ứng.

## 4. Ấm và mềm, không trẻ con

Pastel StudyOS là **pastel trưởng thành**: bão hoà thấp, nền cream, chữ nâu.

| Đúng | Sai |
| --- | --- |
| Sage `#6b8f71` trên kem | Lime, mint neon |
| Peach nhạt cho countdown | Cam gradient “sale off” |
| Bo `1.25rem–2rem` | Bo `9999px` mọi thứ hoặc `2px` sắc |
| Shadow nâu 8–12% opacity | Shadow đen 40% hoặc glow màu |
| Emoji lá 🍃 ở empty state, tiết chế | Confetti, mascot nhảy, sticker dày đặc |

Mềm ≠ dễ thương quá lố. Mục tiêu: **an tâm**, không **kawaii**.

## 5. Một hệ thống, hai mật độ

Desktop và mobile dùng cùng token, khác **mật độ và điều hướng**.

- Desktop (`lg+`): sidebar 256px, nội dung thoáng, nhiều mục nav.
- Mobile: header sticky + bottom nav + padding đáy `pb-24`.
- Cùng radius, cùng màu, cùng type scale — chỉ layout đổi.

Không tạo “theme mobile” riêng. Không thu nhỏ chữ dưới `12px` để nhồi thêm.

---

## Kiểm tra nhanh (definition of done cho UI)

Trước khi merge một màn hình mới, hỏi:

1. Nền có phải cream/card, chữ có phải ink — hay đang trôi về xám/đen/trắng lạnh?
2. Có đúng **một** nút primary không?
3. Tiêu đề có dùng Fraunces, body có dùng Nunito không?
4. Bo góc có thuộc thang `sm → 2xl` không?
5. Bóng có phải `shadow-soft` / `shadow-lift` không?
6. Trên mobile, nội dung có bị che bởi bottom nav không?
7. Empty / loading / error đã có chưa?
8. Focus keyboard và reduced-motion còn hoạt động không?

Nếu một câu trả lời “không” — chưa phải StudyOS.
