# 09 — Iconography

Chỉ **Lucide React**. Config: `"iconLibrary": "lucide"` trong `components.json`. Không Font Awesome, không Heroicons, không SVG illustration tuỳ hứng trừ logo Google trên login (brand mark bắt buộc).

## Kích thước

| Token | px | Ngữ cảnh |
| --- | --- | --- |
| `h-3.5 w-3.5` | 14 | Icon trong badge (flame streak) |
| `h-4 w-4` | 16 | **Mặc định** nút, nav desktop, dialog close, select chevron |
| `h-5 w-5` | 20 | Mobile nav, Help feature, login Google, sidebar brand |
| `h-6 w-6` | 24 | More tiles, FAB plus, session play/pause nếu lg |
| `h-8 w-8` | 32 | Login wordmark icon |

Nút đã ép `[&_svg]:size-4`. Đừng override trừ size `lg` cần 20px.

Stroke: mặc định Lucide (2px). Không `strokeWidth={1}` quá mảnh trên kem, không `strokeWidth={2.5}` đậm. Màu kế thừa `currentColor`.

## Màu

| Ngữ cảnh | Màu |
| --- | --- |
| Trong nút | `currentColor` (foreground của variant) |
| Nav inactive | `muted-foreground` (cùng chữ) |
| Nav / More / Help accent | `text-primary` |
| Brand mark trong ô sage-soft | `text-primary` |
| Destructive button | kem (`primary-foreground`) |

Không tô 8 màu pastel cho 8 icon trên cùng thanh nav.

## Bộ icon sản phẩm (ổn định)

Giữ map này để não bộ user không phải học lại:

| Mục | Icon |
| --- | --- |
| Today | `LayoutDashboard` |
| Planner | `CalendarDays` |
| Tasks | `CheckSquare` |
| Subjects | `BookOpen` |
| Review | `RefreshCw` |
| Exams | `ClipboardList` |
| Error Log | `AlertCircle` |
| Analytics | `ChartColumn` |
| Documents | `FolderOpen` |
| Help | `CircleHelp` |
| Settings | `Settings` |
| More | `MoreHorizontal` |
| Add / Quick Add | `Plus` |
| Brand mark | `FileText` (shell) / `BookOpen` (login) |
| Session start | `Play` |
| Pause / Stop | `Pause` / `Square` |
| Streak | `Flame` |
| AI | `Sparkles` |
| Reminder | `Bell` |
| Overdue / alert nhẹ | `AlertTriangle` / `CalendarClock` |
| Close | `X` |
| Loading | `Loader2` + `animate-spin` |

Đừng đổi Today sang `Sun` hay Tasks sang `ListTodo` chỉ vì “hay hơn”. Nhận diện > mới.

Hai brand mark (`FileText` vs `BookOpen`) chấp nhận được: shell = sổ, login = sách. Khi unify, ưu tiên `BookOpen` + ô sage-soft.

## Quy tắc

- Icon **trang trí** (empty 🍃, sparkles help): `aria-hidden`.
- Icon **là nút** không chữ: `aria-label` tiếng Việt (`"Thêm task"`, `"Đóng"`, `"Tạm dừng"`).
- Không icon + emoji cùng một CTA.
- Không icon filled và outline lẫn trong một hàng — Lucide default outline.
- Chevron select `opacity-60` — phụ, không cạnh tranh với value.

## Emoji

Cho phép **một** emoji empty state (🍃). Streak dùng icon Flame, không 🔥. Không emoji trong nav, không emoji trong H1.
