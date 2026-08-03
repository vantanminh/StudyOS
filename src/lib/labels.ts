import type { Priority, TaskStatus, TopicStatus, TaskType } from "@/types/domain";

export const TOPIC_STATUS_LABELS: Record<TopicStatus, string> = {
  not_started: "Chưa học",
  learning: "Đang học",
  practicing: "Đang luyện tập",
  needs_review: "Cần ôn lại",
  mastered: "Đã vững",
  archived: "Đã lưu trữ",
};

export const TOPIC_STATUS_COLORS: Record<TopicStatus, string> = {
  not_started: "bg-muted text-muted-foreground",
  learning: "bg-sky-soft text-ink-800",
  practicing: "bg-butter-soft text-ink-800",
  needs_review: "bg-rose-soft text-destructive",
  mastered: "bg-sage-soft text-primary",
  archived: "bg-secondary text-muted-foreground",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  critical: "Khẩn cấp",
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  learn_theory: "Học lý thuyết",
  practice: "Luyện tập",
  review: "Ôn tập",
  mock_exam: "Thi thử",
  correct_mistakes: "Chữa lỗi",
  writing: "Writing",
  speaking: "Speaking",
  listening: "Listening",
  reading: "Reading",
  memorization: "Ghi nhớ",
  custom: "Tuỳ chỉnh",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  inbox: "Hộp thư",
  planned: "Đã lên lịch",
  in_progress: "Đang làm",
  completed: "Hoàn thành",
  skipped: "Bỏ qua",
  overdue: "Quá hạn",
  cancelled: "Đã huỷ",
  archived: "Lưu trữ",
};

export const SUBJECT_COLOR_MAP: Record<string, string> = {
  sage: "bg-sage-soft text-ink-800 border-sage/40",
  sky: "bg-sky-soft text-ink-800 border-sky/40",
  lavender: "bg-lavender-soft text-ink-800 border-lavender/40",
  peach: "bg-peach-soft text-ink-800 border-peach/40",
  rose: "bg-rose-soft text-ink-800 border-rose/40",
  mint: "bg-mint-soft text-ink-800 border-mint/40",
  butter: "bg-butter-soft text-ink-800 border-butter/40",
  coral: "bg-coral-soft text-ink-800 border-coral/40",
};

export const DEFAULT_SUBJECT_SUGGESTIONS = [
  "Toán",
  "Vật lý",
  "Hóa học",
  "Ngữ văn",
  "Ngoại ngữ",
  "IELTS Listening",
  "IELTS Reading",
  "IELTS Writing",
  "IELTS Speaking",
];

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}
