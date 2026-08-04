import { useMemo, useState } from "react";
import { format, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { useData } from "@/providers/data-provider";
import {
  generateWeeklyPlan,
  type WeeklyPlanResponse,
  type WeeklyPlanTaskPreview,
} from "@/lib/api/worker-client";
import type { CreateTaskInput } from "@/schemas/domain";
import type { TaskType, Priority } from "@/types/domain";
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
import { Badge } from "@/components/ui/badge";
import { formatMinutes } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";

const TASK_TYPES = new Set<string>([
  "learn_theory",
  "practice",
  "review",
  "mock_exam",
  "correct_mistakes",
  "writing",
  "speaking",
  "listening",
  "reading",
  "memorization",
  "custom",
]);

function asTaskType(value?: string): TaskType {
  if (value && TASK_TYPES.has(value)) return value as TaskType;
  return "custom";
}

export function WeeklyPlanDialog({
  open,
  onOpenChange,
  weekStart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekStart: Date;
}) {
  const { state, createTasksFromPlan } = useData();
  const profile = state.profile;
  const [targetHours, setTargetHours] = useState(
    profile?.weeklyTargetHours ?? 20,
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<WeeklyPlanResponse | null>(null);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const weekKey = format(weekStart, "yyyy-MM-dd");
  const subjectNames = useMemo(
    () => state.subjects.filter((s) => s.isActive).map((s) => s.name),
    [state.subjects],
  );

  const flatTasks = useMemo(() => {
    const rows: Array<{
      key: string;
      date: string;
      task: WeeklyPlanTaskPreview;
    }> = [];
    for (const day of plan?.days ?? []) {
      day.tasks.forEach((task, i) => {
        rows.push({ key: `${day.date}:${i}`, date: day.date, task });
      });
    }
    return rows;
  }, [plan]);

  async function generate() {
    if (!profile?.aiEnabled) {
      toast.error("Bật AI trong Settings trước khi lập kế hoạch.");
      return;
    }
    setLoading(true);
    setPlan(null);
    try {
      const result = await generateWeeklyPlan({
        weekStart: weekKey,
        targetHours,
        subjects: subjectNames,
        notes: notes.trim() || undefined,
      });
      setPlan(result);
      const next: Record<string, boolean> = {};
      for (const day of result.days ?? []) {
        day.tasks.forEach((_, i) => {
          next[`${day.date}:${i}`] = true;
        });
      }
      setSelected(next);
      if (!(result.days?.length)) {
        toast.message(result.message ?? "Chưa có gợi ý task.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không gọi được AI");
    } finally {
      setLoading(false);
    }
  }

  function confirmCreate() {
    const items: CreateTaskInput[] = [];
    for (const row of flatTasks) {
      if (!selected[row.key]) continue;
      const subject = state.subjects.find(
        (s) =>
          s.isActive &&
          row.task.subject &&
          s.name.toLowerCase() === row.task.subject.toLowerCase(),
      );
      items.push({
        title: row.task.title,
        type: asTaskType(row.task.type),
        priority: "medium" as Priority,
        estimatedMinutes: Math.min(
          480,
          Math.max(15, Math.round(row.task.estimatedMinutes || 45)),
        ),
        scheduledDate: row.date,
        subjectId: subject?.id,
        source: "ai",
      });
    }
    if (items.length === 0) {
      toast.message("Chọn ít nhất một task để tạo.");
      return;
    }
    createTasksFromPlan(items);
    toast.success(`Đã tạo ${items.length} task từ AI (source: ai)`);
    onOpenChange(false);
    setPlan(null);
    setNotes("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Lập kế hoạch tuần
          </DialogTitle>
          <DialogDescription>
            AI đề xuất lịch học qua Cloudflare Worker. Bạn phải xác nhận trước
            khi ghi task.
          </DialogDescription>
        </DialogHeader>

        {!profile?.aiEnabled ? (
          <p className="rounded-xl bg-rose-soft/50 px-3 py-2 text-sm">
            AI đang tắt. Bật “AI assistant” trong Settings để tiếp tục.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tuần bắt đầu</Label>
                <Input value={weekKey} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Giờ mục tiêu</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={80}
                  value={targetHours}
                  onChange={(e) => setTargetHours(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú cho AI</Label>
              <Textarea
                id="notes"
                placeholder="Ưu tiên Toán + IELTS Reading; nghỉ Chủ nhật…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lập kế hoạch…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Tạo preview
                </>
              )}
            </Button>
          </div>
        )}

        {plan ? (
          <div className="space-y-3 border-t border-border/60 pt-3">
            {plan.summary ? (
              <p className="text-sm text-muted-foreground">{plan.summary}</p>
            ) : null}
            {plan.message ? (
              <p className="text-xs text-muted-foreground">{plan.message}</p>
            ) : null}
            {flatTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Không có task trong preview.</p>
            ) : (
              <ul className="max-h-64 space-y-2 overflow-y-auto">
                {flatTasks.map(({ key, date, task }) => (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-border/50 bg-cream-50/80 p-2 text-sm">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={selected[key] ?? false}
                        onChange={(e) =>
                          setSelected((s) => ({ ...s, [key]: e.target.checked }))
                        }
                      />
                      <span className="min-w-0 flex-1">
                        <span className="font-semibold">{task.title}</span>
                        <span className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="outline">{date}</Badge>
                          <Badge variant="secondary">
                            {formatMinutes(task.estimatedMinutes)}
                          </Badge>
                          {task.subject ? (
                            <Badge variant="success">{task.subject}</Badge>
                          ) : null}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={confirmCreate}
            disabled={!plan || flatTasks.length === 0}
          >
            Xác nhận tạo task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function weekStartMonday(anchor = new Date()) {
  return startOfWeek(anchor, { weekStartsOn: 1 });
}
