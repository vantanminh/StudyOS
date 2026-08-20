# 10 — Giọng văn & microcopy

Hệ Giấy ấm nói **ngắn, ấm, rõ, không hối**. Ngôn ngữ do website đích chọn (Việt, Anh, …) — giọng giữ nguyên.

## Tính cách chữ

Như người bạn điềm đạm.

| Có | Không |
| --- | --- |
| “Không thể đăng nhập. Kiểm tra email rồi thử lại.” | `AUTH_500` / stack trace |
| “Đã lưu.” | “Operation completed successfully!!!” |
| “Chưa có mục nào. Tạo mục đầu tiên.” | “Your pipeline is empty. Let’s crush it 🚀” |
| “Hãy nhập tên hiển thị.” | `ValidationError: displayName` |

Xưng “bạn” (Việt) hoặc trung tính lịch sự. Greeting theo giờ được phép trên home: “Chào buổi sáng / chiều / tối”.

Tránh dấu chấm than. Tối đa một câu cảm thán khi hoàn tất wizard.

## Cấu trúc

- Nút: 1–4 từ, động từ — “Lưu”, “Tiếp tục”, “Huỷ”, “Xoá”.
- Empty: title ngắn + một câu + CTA.
- Toast success: đã xong việc gì. Toast error: chuyện gì + bước tiếp.
- Helper: `text-xs muted`, không nhắc lại title.

## Lỗi

1. Một câu sự thật.
2. Một câu hướng xử lý nếu user làm được.

Không đổ lỗi “bạn đã sai”. Không mã nội bộ trên UI.

## Gợi ý tự động / AI

Chỉ **đề xuất**. Copy phải nói xem trước / xác nhận trước khi ghi.

Đúng: “Xem trước — xác nhận trước khi lưu.”  
Sai: “Hệ thống đã tạo 12 mục.” (khi chưa confirm)

## Số liệu nhạy

Disclaimer `text-xs muted` nếu chỉ số dễ hiểu như cam kết. Banner nhắc: butter, không “bạn đang thất bại”.

## Việt / Anh

Một website một quy ước nhãn nav. Câu hướng dẫn thống nhất ngôn ngữ trang (`lang` trên `html`). Không trộn trong cùng một câu nếu không cần.

## Chữ trên pastel

`ink-800`, hoặc `primary` / `destructive` theo semantic. Không chữ trắng. Không muted dài trên peach-soft.

## Độ dài

| Loại | Độ dài |
| --- | --- |
| Button | 1–4 từ |
| Page description | ≤ 120 ký tự |
| Empty description | 1 câu |
| Toast | ≤ 90 ký tự |
| Dialog description | 1–2 câu |

## Slot copy website đích tự viết

- Tagline (một dòng, ấm)
- Empty: “Chưa có…”, mời một hành động
- Trạng thái hệ thống: xong / đang chờ / thất bại — map badge success / warn / danger
