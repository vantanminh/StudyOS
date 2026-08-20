# 09 — Iconography

Ưu tiên **Lucide** (outline, stroke 2). SVG 1 màu cùng quy tắc size/màu cũng được. Không Font Awesome nhiều màu, không icon 3D, không bộ icon thứ hai trên cùng một website.

Ngoại lệ: logo nhà cung cấp OAuth (Google, v.v.) giữ màu gốc.

## Kích thước

| Size | px | Ngữ cảnh |
| --- | --- | --- |
| `h-3.5 w-3.5` | 14 | Trong badge |
| `h-4 w-4` | 16 | **Mặc định** — nút, nav desktop, close, chevron |
| `h-5 w-5` | 20 | Nav mobile, brand compact, OAuth |
| `h-6 w-6` | 24 | Tile tray, FAB, nút lg |
| `h-8 w-8` | 32 | Auth wordmark |

Nút mặc định: SVG 16px. Nút `lg` có thể 20px.

Stroke 2. Không `1` (mảnh trên kem), không `2.5`. Màu = `currentColor`.

## Màu

| Ngữ cảnh | Màu |
| --- | --- |
| Trong nút | `currentColor` |
| Nav inactive | `muted-foreground` |
| Nav active / tile / nhấn | `text-primary` |
| Brand mark trong ô sage-soft | `text-primary` |
| Destructive | kem (`primary-foreground`) |

Không tô 8 pastel cho 8 icon trên một thanh nav.

## Vai trò generic (map icon theo *website đích*)

Giữ **ổn định trong một sản phẩm**. Đổi nhãn — đừng đổi icon mỗi sprint.

| Vai trò | Gợi ý Lucide |
| --- | --- |
| Tổng quan / home | `LayoutDashboard` hoặc `House` |
| Lịch | `CalendarDays` |
| Danh sách việc | `CheckSquare` |
| Thư mục / tài liệu | `FolderOpen` / `FileText` |
| Biểu đồ | `ChartColumn` |
| Trợ giúp | `CircleHelp` |
| Cài đặt | `Settings` |
| Thêm / overflow | `MoreHorizontal` |
| Tạo mới | `Plus` |
| Brand mark | một glyph (ổn định) trong ô sage-soft |
| Phát / tạm / dừng | `Play` / `Pause` / `Square` |
| Nhắc | `Bell` |
| Cảnh báo nhẹ | `AlertTriangle` |
| Đóng | `X` |
| Loading | `Loader2` + `animate-spin` |
| Gợi ý / AI | `Sparkles` |

Chọn một brand mark và dùng xuyên header + auth.

## Quy tắc

- Trang trí (🍃, sparkles): `aria-hidden`.
- Nút chỉ icon: `aria-label` ngôn ngữ website.
- Không icon + emoji cùng CTA.
- Outline đồng bộ — không mix filled.
- Chevron phụ: `opacity-60`.

## Emoji

Cho phép **một** ở empty (🍃). Không emoji trong nav hay H1. Trạng thái dùng icon/badge, không 🔥💯.
