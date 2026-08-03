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

export function QuickAddDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, createTask } = useData();
  const [natural, setNatural] = useState("");
  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: "",
      type: "custom",
      priority: "medium",
      estimatedMinutes: 45,
      scheduledDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  function parseNatural(text: string) {
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
    if (lower.includes("thứ bảy") || lower.includes("saturday")) {
      const d = new Date();
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      scheduledDate = format(d, "yyyy-MM-dd");
    }

    const subject = state.subjects.find((s) =>
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
    });
    toast.message("Đã phân tích câu lệnh. Hãy kiểm tra trước khi lưu.");
  }

  function onSubmit(values: CreateTaskInput) {
    try {
      createTask(values);
      toast.success("Đã tạo task");
      onOpenChange(false);
      form.reset();
      setNatural("");
    } catch {
      toast.error("Không thể lưu task lúc này. Dữ liệu vẫn đang được giữ trên màn hình.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
          <DialogDescription>
            Tạo task nhanh bằng form hoặc câu mô tả tự nhiên (không cần AI).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="natural">Câu mô tả</Label>
            <Textarea
              id="natural"
              placeholder="Làm Cambridge 18 Reading Test 2 vào tối thứ bảy trong 60 phút"
              value={natural}
              onChange={(e) => setNatural(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => parseNatural(natural)}
              disabled={!natural.trim()}
            >
              Phân tích câu
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
                <Input id="date" type="date" {...form.register("scheduledDate")} />
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
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
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
