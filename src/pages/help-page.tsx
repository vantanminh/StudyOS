import { Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  ChartColumn,
  CheckSquare,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  Plus,
  RefreshCw,
  Settings,
  Sparkles,
  Timer,
} from "lucide-react";

type GuideSection = {
  id: string;
  title: string;
  icon: typeof LayoutDashboard;
  to?: string;
  steps: string[];
  tip?: string;
};

const QUICK_START = [
  {
    n: "1",
    title: "Thiết lập hồ sơ",
    body: "Sau khi đăng nhập, hoàn thành onboarding: tên, kỳ thi, môn học và khung giờ học.",
  },
  {
    n: "2",
    title: "Thêm task học",
    body: "Bấm Quick Add (nút +) để tạo việc học theo môn, thời lượng và hạn.",
  },
  {
    n: "3",
    title: "Xếp lịch tuần",
    body: "Vào Planner kéo task vào ngày, hoặc dùng AI lập kế hoạch tuần (nếu đã bật AI).",
  },
  {
    n: "4",
    title: "Học & ôn lại",
    body: "Từ Today bấm Bắt đầu phiên. Ghi lỗi ở Error Log — Review sẽ nhắc ôn theo lịch.",
  },
];

const SECTIONS: GuideSection[] = [
  {
    id: "today",
    title: "Today — hôm nay học gì",
    icon: LayoutDashboard,
    to: "/today",
    steps: [
      "Xem task đã xếp hôm nay, việc quá hạn và review đến hạn.",
      "Ưu tiên Top 3 được tính theo deadline, độ yếu môn và loại task.",
      "Bấm Bắt đầu để mở phiên học (timer) hoặc đánh dấu hoàn thành trực tiếp.",
      "Dời task sang ngày khác nếu lịch bị lệch.",
    ],
    tip: "Hôm nay là màn hình chính — mở app mỗi ngày từ đây.",
  },
  {
    id: "tasks",
    title: "Tasks & Quick Add",
    icon: CheckSquare,
    to: "/tasks",
    steps: [
      "Quick Add (nút + trên thanh điều hướng) tạo task nhanh mọi lúc.",
      "Có thể nhập tự nhiên nếu bật AI — xem trước rồi xác nhận trước khi lưu.",
      "Mỗi task gắn môn, loại (lý thuyết / luyện / ôn…), thời lượng ước tính và ưu tiên.",
      "Khi hoàn thành, ghi phút thực tế và mức tập trung để Analytics chính xác hơn.",
    ],
  },
  {
    id: "planner",
    title: "Planner — lịch tuần",
    icon: CalendarDays,
    to: "/planner",
    steps: [
      "Backlog chứa task chưa xếp ngày; kéo hoặc gán vào từng ngày trong tuần.",
      "Smart Reschedule gợi ý dời task khi ngày quá tải so với giới hạn giờ/ngày.",
      "Lập kế hoạch tuần bằng AI tạo bản xem trước — bạn xác nhận trước khi tạo task.",
      "Bật AI trong Settings trước khi dùng các nút có biểu tượng Sparkles.",
    ],
    tip: "AI chỉ gợi ý; mọi thay đổi đều cần bạn xác nhận.",
  },
  {
    id: "session",
    title: "Phiên học (Session)",
    icon: Timer,
    steps: [
      "Từ Today chọn Bắt đầu trên một task để mở timer tập trung.",
      "Có thể tạm dừng / tiếp tục; app nhớ phiên đang mở nếu bạn tải lại trang.",
      "Khi kết thúc, đánh giá focus/energy, ghi chú và chọn có hoàn thành task hay không.",
      "Thời lượng phiên mặc định lấy từ Settings / onboarding.",
    ],
  },
  {
    id: "subjects",
    title: "Subjects — bản đồ kiến thức",
    icon: BookOpen,
    to: "/subjects",
    steps: [
      "Mỗi môn có điểm mastery và danh sách chuyên đề (topics).",
      "Vào chi tiết môn để thêm topic, cập nhật trạng thái (đang học / cần ôn / đã vững).",
      "Topic yếu hoặc needs_review có thể tự vào hàng đợi Review (nếu bật trong Settings).",
    ],
  },
  {
    id: "review",
    title: "Review — ôn spaced repetition",
    icon: RefreshCw,
    to: "/review",
    steps: [
      "Hàng đợi gồm mục đến hạn từ lỗi sai, topic yếu hoặc khi bạn đánh dấu cần ôn.",
      "Sau mỗi lần ôn, chọn mức nhớ: Quên → Đã vững. Lịch lần sau tự điều chỉnh.",
      "Today cũng hiện số review đến hạn để bạn không bỏ sót.",
    ],
  },
  {
    id: "errors",
    title: "Error Log — sổ lỗi",
    icon: AlertCircle,
    to: "/errors",
    steps: [
      "Ghi lỗi ngay khi làm sai: loại lỗi, mức độ, môn và cách chữa.",
      "Nếu bật auto-review từ lỗi, hệ thống tạo mục Review tương ứng.",
      "Dùng lại sổ lỗi trước kỳ thi để tránh lặp lại cùng một sai lầm.",
    ],
  },
  {
    id: "exams",
    title: "Exams — kết quả đề thi",
    icon: ClipboardList,
    to: "/exams",
    steps: [
      "Lưu điểm mock / đề thật (số câu đúng, phút làm, band IELTS nếu có).",
      "Kỳ thi mục tiêu được tạo lúc onboarding — có thể bổ sung sau.",
      "Analytics dùng dữ liệu này để ước lượng readiness.",
    ],
  },
  {
    id: "documents",
    title: "Documents — tài liệu",
    icon: FolderOpen,
    to: "/documents",
    steps: [
      "Upload PDF / file học (tối đa 25MB) lưu trên Cloudflare R2.",
      "Tải xuống hoặc xoá khi không còn cần.",
      "Cần đăng nhập; chế độ demo chỉ lưu tạm trên máy.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics — tiến độ",
    icon: ChartColumn,
    to: "/analytics",
    steps: [
      "Xem phút học và số task hoàn thành theo 7 / 30 / 90 ngày.",
      "Readiness ước lượng mức sẵn sàng dựa trên mastery, ôn tập và kết quả thi.",
      "Streak trên Today đếm các ngày có phút học > 0.",
    ],
  },
  {
    id: "settings",
    title: "Settings & tự động hoá",
    icon: Settings,
    to: "/settings",
    steps: [
      "Chỉnh giờ mục tiêu/tuần, tối đa giờ/ngày và khung giờ học hàng ngày.",
      "Bật nhắc học in-app (và tuỳ chọn thông báo trình duyệt).",
      "Bật AI assistant để dùng weekly plan và Quick Add bằng ngôn ngữ tự nhiên.",
      "Auto-review từ lỗi / topic yếu; Export JSON hoặc xoá dữ liệu để bắt đầu lại.",
    ],
    tip: "Nhắc học dựa trên khung giờ và task/review đến hạn khi bạn mở app.",
  },
];

export function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Hướng dẫn sử dụng"
        description="Cách dùng StudyOS từ ngày đầu đến vòng lặp học — ôn — thi thử."
      />

      <Card className="mb-6 animate-fade-up border-primary/20 bg-sage-soft/40">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle className="text-lg">StudyOS làm gì?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-ink-800">
          <p>
            StudyOS là không gian học tập cá nhân cho ôn tốt nghiệp THPT và IELTS:
            quản lý task, xếp lịch tuần, phiên tập trung, sổ lỗi, ôn lặp lại và theo
            dõi tiến độ — đồng bộ theo tài khoản đăng nhập của bạn.
          </p>
          <p className="text-muted-foreground">
            Trên máy tính dùng menu bên trái; trên điện thoại dùng thanh dưới và mục{" "}
            <Link to="/more" className="font-semibold text-primary underline-offset-2 hover:underline">
              More
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <section className="mb-8 animate-fade-up" aria-labelledby="quick-start">
        <h2 id="quick-start" className="mb-3 font-display text-xl font-semibold text-ink-900">
          Bắt đầu nhanh
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {QUICK_START.map((item) => (
            <li
              key={item.n}
              className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft"
            >
              <Badge variant="success" className="mb-2">
                Bước {item.n}
              </Badge>
              <p className="font-semibold text-ink-900">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/today">
              <LayoutDashboard className="h-4 w-4" />
              Về Today
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/tasks">
              <Plus className="h-4 w-4" />
              Thêm task
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/settings">
              <Settings className="h-4 w-4" />
              Mở Settings
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="features">
        <h2 id="features" className="font-display text-xl font-semibold text-ink-900">
          Từng phần trong app
        </h2>
        {SECTIONS.map((section) => (
          <Card key={section.id} id={section.id} className="animate-fade-up scroll-mt-24">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-soft text-primary">
                    <section.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <CardTitle className="text-base sm:text-lg">{section.title}</CardTitle>
                </div>
                {section.to ? (
                  <Button asChild size="sm" variant="ghost">
                    <Link to={section.to}>Mở trang</Link>
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-800">
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {section.tip ? (
                <p className="rounded-xl bg-peach-soft/50 px-3 py-2 text-sm text-ink-800">
                  <span className="font-semibold">Mẹo: </span>
                  {section.tip}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mt-8 border-dashed">
        <CardContent className="space-y-2 p-5 text-sm text-muted-foreground">
          <p className="font-semibold text-ink-900">Vòng lặp đề xuất mỗi ngày</p>
          <p>
            Mở <strong className="text-foreground">Today</strong> → làm / bắt đầu phiên → ghi lỗi
            nếu sai → xử lý <strong className="text-foreground">Review</strong> đến hạn → cuối tuần
            xem <strong className="text-foreground">Planner</strong> &{" "}
            <strong className="text-foreground">Analytics</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
