# 10 — Giọng văn & microcopy

UI chủ yếu **tiếng Việt**. Tên mục điều hướng có thể giữ tiếng Anh ngắn đã quen (Today, Planner, Tasks, Settings). Câu hướng dẫn, toast, empty, lỗi: Việt.

## Tính cách chữ

Như người bạn học điềm đạm: **rõ, ngắn, ấm, không hối**.

| Có | Không |
| --- | --- |
| “Hôm nay cần học gì?” | “LET’S GO 🚀 Crush today’s grind” |
| “Thiết lập xong. Chúc bạn học vui!” | “Onboarding completed successfully.” |
| “Đã dời sang ngày mai” | “Task rescheduled to T+1” |
| “Hãy chọn ít nhất một môn” | “Validation Error: subjects[] empty” |
| “Không thể đăng nhập.” + lý do | “Auth/internal/500” |

Xưng **bạn**. Greeting theo giờ: “Chào buổi sáng / chiều / tối, {tên}”.

## Cấu trúc câu

- Nút: động từ hoặc cụm ngắn — “Lưu”, “Thêm lỗi”, “Start Focus Session”, “Về Today”.
- Empty: title ngắn + description một câu + CTA.
- Toast success: đã xong việc gì. Toast error: chuyện gì + làm gì tiếp.
- Helper: `text-xs muted`, không giải thích lại title.

Tránh dấu chấm than. Tối đa một câu cảm thán khi hoàn thành onboarding.

## Lỗi

Map thân thiện (login đã làm mẫu): đóng popup, chặn popup, domain chưa phép, mật khẩu yếu… — **tiếng người**, không mã Firebase.

Pattern:

1. Một câu sự thật.
2. Một câu hướng xử lý nếu user làm được.

Ví dụ: “Trình duyệt chặn popup. Hãy cho phép popup rồi thử lại.”

Không đổ lỗi “bạn đã làm sai”. Không stack trace trên UI.

## AI & automation

AI chỉ **đề xuất**. Copy phải nói “xem trước”, “xác nhận trước khi lưu/tạo”.

Đúng: “Xem trước task — xác nhận trước khi lưu.”  
Sai: “AI đã tạo 12 task.” (nếu chưa confirm)

Reminder butter: nhắc giờ học, không “Bạn đang trễ tiến độ”.

Analytics readiness: luôn có disclaimer “chỉ số tham khảo, không phải dự đoán chắc chắn”.

## Trộn Việt / Anh

Giữ Anh khi là **tên riêng trong product**: Today, Planner, Quick Add, Focus Session, Error Log, Knowledge Map, More.

Viết câu thì Việt: “Bấm Quick Add để tạo việc học”. Không “Please click Quick Add to create a new learning task”.

## Chữ trên pastel

`text-ink-800` hoặc `text-primary` / `text-destructive` theo semantic. Không chữ trắng. Không chữ `muted-foreground` dài trên peach-soft (khó đọc).

## Độ dài khuyến nghị

| Loại | Độ dài |
| --- | --- |
| Button | 1–4 từ |
| Page description | ≤ 120 ký tự |
| Empty description | 1 câu |
| Toast | ≤ 90 ký tự |
| Dialog description | 1–2 câu |

## Danh sách copy chuẩn đã có

Dùng lại, đừng paraphrase mỗi lần:

- Tagline: “Không gian học tập dịu dàng”
- Empty mặc định cảm xúc: yên, “chưa có…”, mời một hành động
- Sync: “Đã đồng bộ” / “Đang chờ” / “Thất bại”
- Nav Help: “Hướng dẫn”
