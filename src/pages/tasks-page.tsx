import { useMemo, useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABELS, TASK_STATUS_LABELS, TASK_TYPE_LABELS } from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";
import { QuickAddDialog } from "@/components/tasks/quick-add-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { StudyTask } from "@/types/domain";

export function TasksPage() {
  const { state, completeTask } = useData();
  const [open, setOpen] = useState(false);
  const [completing, setCompleting] = useState<StudyTask | null>(null);
  const [progress, setProgress] = useState(100);
  const [actualMinutes, setActualMinutes] = useState(45);
  const [focus, setFocus] = useState(4);
  const [needsReview, setNeedsReview] = useState(false);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("active");

  const tasks = useMemo(() => {
    return state.tasks.filter((t) => {
      if (filter === "completed") return t.status === "completed";
      if (filter === "active")
        return !["completed", "cancelled", "archived"].includes(t.status);
      return true;
    });
  }, [state.tasks, filter]);

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Quản lý việc học theo từng task nhỏ, có thể hoàn thành."
        actions={
          <Button onClick={() => setOpen(true)}>Thêm task</Button>
        }
      />

      <div className="mb-4 flex gap-2">
        {(["active", "completed", "all"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "secondary"}
            onClick={() => setFilter(f)}
          >
            {f === "active" ? "Đang mở" : f === "completed" ? "Đã xong" : "Tất cả"}
          </Button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          title="Chưa có task"
          description="Thêm task đầu tiên để bắt đầu vòng lặp học tập."
          action={<Button onClick={() => setOpen(true)}>Quick Add</Button>}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const subject = state.subjects.find((s) => s.id === task.subjectId);
            return (
              <Card key={task.id} className="animate-fade-up">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink-900">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">{TASK_TYPE_LABELS[task.type]}</Badge>
                      <Badge variant="outline">{TASK_STATUS_LABELS[task.status]}</Badge>
                      <Badge>{PRIORITY_LABELS[task.priority]}</Badge>
                      <Badge variant="outline">{formatMinutes(task.estimatedMinutes)}</Badge>
                      {subject ? <Badge variant="success">{subject.name}</Badge> : null}
                    </div>
                  </div>
                  {task.status !== "completed" ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setCompleting(task);
                        setActualMinutes(task.estimatedMinutes);
                        setProgress(100);
                      }}
                    >
                      Hoàn thành
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <QuickAddDialog open={open} onOpenChange={setOpen} />

      <Dialog open={Boolean(completing)} onOpenChange={(v) => !v && setCompleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ghi nhận kết quả</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="progress">Hoàn thành (%)</Label>
              <Input
                id="progress"
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual">Thời gian thực tế (phút)</Label>
              <Input
                id="actual"
                type="number"
                value={actualMinutes}
                onChange={(e) => setActualMinutes(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Tập trung (1–5)</Label>
              <Input
                id="focus"
                type="number"
                min={1}
                max={5}
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú / phần chưa hiểu</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={needsReview}
                onChange={(e) => setNeedsReview(e.target.checked)}
              />
              Cần ôn lại
            </label>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCompleting(null)}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                if (!completing) return;
                completeTask(completing.id, {
                  progress,
                  actualMinutes,
                  focusRating: focus as 1 | 2 | 3 | 4 | 5,
                  needsReview,
                  notes,
                });
                toast.success("Đã lưu kết quả học tập");
                setCompleting(null);
              }}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
