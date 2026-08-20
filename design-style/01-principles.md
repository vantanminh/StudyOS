# 01 — Nguyên tắc thiết kế

Năm nguyên tắc này đi cùng hệ **Giấy ấm**. Khi hai ý tưởng xung đột, ưu tiên nguyên tắc phía trên. Áp dụng cho mọi loại website dùng hệ này.

## 1. Dịu dàng trước

Giao diện **không được la hét**. Dù website bán hàng, đọc tin, hay quản lý việc — cảm xúc mặc định là an tâm.

- Nền kem ấm, không trắng tinh hay xám lạnh.
- Primary là sage trầm, không xanh điện hay cam báo động.
- Cảnh báo dùng rose/butter *nhạt*, chữ mực nâu — không banner đỏ fulminant.
- Motion chậm, biên độ nhỏ (`8px` fade-up, `4px` float).

Cảm giác đúng: giấy, gỗ nhạt, ánh đèn ấm. Không phòng lab, không skin “productivity” Silicon Valley.

## 2. Tối giản có chủ đích

Tối giản không phải khô. Là **mỗi phần tử phải kiếm được chỗ đứng**.

- Một trang = một tiêu đề display + một mô tả ngắn + nội dung.
- Card không trang trí thừa (gradient mạnh, illustration stock, icon lớn lung tung).
- Badge chỉ khi cần phân loại. Không gắn badge cho mọi dòng.
- Empty state: một icon/emoji, một câu, một CTA.

Nếu bỏ đi mà không mất nghĩa — bỏ.

## 3. Dễ dùng hơn là “trông hay”

Thứ tự khi conflict: **rõ hành động > đọc được > đẹp**.

- Nút chính đủ lớn (`h-11` mặc định, `h-12` khi CTA lớn).
- Mobile: ít mục nav hơn desktop; cùng token, khác mật độ.
- Form: label luôn hiện, placeholder không thay label.
- Focus ring sage luôn thấy (`ring-2 ring-ring`).
- Copy ngắn, động từ rõ: “Lưu”, “Tiếp tục”, “Huỷ”.

Đẹp là hệ quả của thứ tự, khoảng trắng và màu đúng.

## 4. Ấm và mềm, không trẻ con

Pastel Giấy ấm là **pastel trưởng thành**: bão hoà thấp, nền cream, chữ nâu.

| Đúng | Sai |
| --- | --- |
| Sage `#6b8f71` trên kem | Lime, mint neon |
| Peach nhạt cho nhấn ấm | Cam gradient “sale off” |
| Bo `1.25rem–2rem` | Bo `9999px` mọi thứ hoặc `2px` sắc |
| Shadow nâu 8–12% opacity | Shadow đen 40% hoặc glow màu |
| Emoji lá 🍃 ở empty, tiết chế | Confetti, mascot nhảy, sticker dày |

Mềm ≠ kawaii. Mục tiêu: **an tâm**.

## 5. Một hệ thống, hai mật độ

Desktop và mobile dùng cùng token, khác **mật độ và điều hướng**.

- Desktop (`lg+`): sidebar hoặc top nav thoáng, nhiều mục hơn.
- Mobile: header sticky; nếu có bottom nav thì `pb-24` + safe area.
- Cùng radius, màu, type scale — chỉ layout đổi.

Không tạo theme mobile riêng. Không thu chữ dưới `12px` để nhồi (ngoại lệ label bottom nav `10px`).

---

## Kiểm tra nhanh

Trước khi ship một màn hình:

1. Nền cream/card, chữ ink — chưa trôi xám/đen/trắng lạnh?
2. Đúng **một** nút primary?
3. Tiêu đề Fraunces, body Nunito?
4. Bo góc thuộc thang `sm → 2xl`?
5. Bóng `shadow-soft` / `shadow-lift`?
6. Mobile không che nội dung (nav, safe area)?
7. Empty / loading / error đã có?
8. Focus keyboard và reduced-motion ổn?

Một câu “không” — chưa phải Giấy ấm.
