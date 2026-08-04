import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskInputSchema, type CreateTaskInput } from "@/schemas/domain";
import { useData } from "@/providers/data-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_TYPE_LABELS } from "@/lib/labels";
import { toast } from "sonner";
import { format } from "date-fns";
import type { TaskType, Priority } from "@/types/domain";
import { parseNaturalTask } from "@/lib/api/worker-client";
import { Loader2, Sparkles } from "lucide-react";

const TASK_TYPES = new Set(Object.keys(TASK_TYPE_LABELS));

function asTaskType(value?: string): TaskType {
  if (value && TASK_TYPES.has(value)) return value as TaskType;
  return "custom";
}

function asPriority(value?: string): Priority {
  if (value === "low" || value === "medium" || value === "high" || value === "critical") {
    return value;
  }
  return "medium";
}

export function QuickAddDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, createTask } = useData();
  const [natural, setNatural] = useState("");
  const [parsing, setParsing] = useState(false);
  const [aiSource, setAiSource] = useState(false);
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: "",
      type: "custom",
      priority: "medium",
      estimatedMinutes: 45,
      scheduledDate: format(new Date(), "yyyy-MM-dd"),
      source: "manual",
    },
  });

  async function parseWithAi() {
    const text = natural.trim();
    if (!text) return;

    if (state.profile?.aiEnabled) {
      setParsing(true);
      try {
        const res = await parseNaturalTask({
          text,
          subjects: state.subjects.filter((s) => s.isActive).map((s) => s.name),
          today: format(new Date(), "yyyy-MM-dd"),
        });
        const task = res.task;
        if (!task) {
          toast.error("AI không trả về task.");
          return;
        }
        const subject = state.subjects.find(
          (s) =>
            task.subject &&
            s.name.toLowerCase() === task.subject.toLowerCase(),
        );
        form.reset({
          title: task.title || text.slice(0, 120),
          type: asTaskType(task.type),
          priority: asPriority(task.priority),
          estimatedMinutes: task.estimatedMinutes || 45,
          scheduledDate:
            task.scheduledDate ?? format(new Date(), "yyyy-MM-dd"),
          scheduledStartAt: task.scheduledStartAt ?? undefined,
          subjectId: subject?.id,
          source: "ai",
        });
        setAiSource(true);
        toast.message(res.message ?? "Đã phân tích bằng AI. Kiểm tra trước khi lưu.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Parse AI thất bại");
      } finally {
        setParsing(false);
      }
      return;
    }

    // Local heuristic when AI is off
    const lower = text.toLowerCase();
    let type: TaskType = "custom";
    if (lower.includes("reading")) type = "reading";
    else if (lower.includes("writing")) type = "writing";
    else if (lower.includes("listening")) type = "listening";
    else if (lower.includes("speaking")) type = "speaking";
    else if (lower.includes("ôn") || lower.includes("review")) type = "review";
    else if (lower.includes("luyện") || lower.includes("practice")) type = "practice";

    const minutesMatch = text.match(/(\d+)\s*phút/);
    const estimatedMinutes = minutesMatch ? Number(minutesMatch[1]) : 45;

    let scheduledDate = format(new Date(), "yyyy-MM-dd");
    if (lower.includes("mai") || lower.includes("tomorrow")) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      scheduledDate = format(d, "yyyy-MM-dd");
    } else if (lower.includes("thứ bảy") || lower.includes("saturday")) {
      const d = new Date();
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      scheduledDate = format(d, "yyyy-MM-dd");
    }

    const subject = state.subjects.find(
      (s) =>
        lower.includes(s.name.toLowerCase()) ||
        (s.shortName && lower.includes(s.shortName.toLowerCase())),
    );

    form.reset({
      title: text.slice(0, 120) || "Task mới",
      type,
      priority: "medium",
      estimatedMinutes,
      scheduledDate,
      subjectId: subject?.id,
      source: "manual",
    });
    setAiSource(false);
    toast.message(
      "Đã phân tích heuristic (AI tắt). Bật AI trong Settings để dùng Worker.",
    );
  }

  function onSubmit(values: CreateTaskInput) {
    try {
      createTask({
        ...values,
        source: aiSource ? "ai" : values.source ?? "manual",
      });
      toast.success("Đã tạo task");
      onOpenChange(false);
      form.reset();
      setNatural("");
      setAiSource(false);
    } catch {
      toast.error(
        "Không thể lưu task lúc này. Dữ liệu vẫn đang được giữ trên màn hình.",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
          <DialogDescription>
            Form hoặc câu mô tả tự nhiên.
            {state.profile?.aiEnabled
              ? " AI parse qua Cloudflare Worker — xác nhận trước khi lưu."
              : " Heuristic local (bật AI trong Settings để dùng NL qua Worker)."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="natural">Câu mô tả</Label>
            <Textarea
              id="natural"
              placeholder="Học toán 45p mai 19h"
              value={natural}
              onChange={(e) => setNatural(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={parseWithAi}
              disabled={!natural.trim() || parsing}
            >
              {parsing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang phân tích…
                </>
              ) : state.profile?.aiEnabled ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Phân tích bằng AI
                </>
              ) : (
                "Phân tích câu"
              )}
            </Button>
          </div>

          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input id="title" {...form.register("title")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(v) => form.setValue("type", v as TaskType)}
                >
                  <SelectTrigger aria-label="Loại task">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ưu tiên</Label>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(v) => form.setValue("priority", v as Priority)}
                >
                  <SelectTrigger aria-label="Độ ưu tiên">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="critical">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="date">Ngày</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register("scheduledDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">Phút</Label>
                <Input
                  id="minutes"
                  type="number"
                  min={1}
                  max={480}
                  {...form.register("estimatedMinutes", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select
                value={form.watch("subjectId") ?? "none"}
                onValueChange={(v) =>
                  form.setValue("subjectId", v === "none" ? undefined : v)
                }
              >
                <SelectTrigger aria-label="Môn học">
                  <SelectValue placeholder="Chọn môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {state.subjects
                    .filter((s) => s.isActive)
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button type="submit">Lưu task</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
