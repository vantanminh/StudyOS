import { useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createId, nowIso } from "@/data/demo-store";
import { toast } from "sonner";
import type { ExamAttempt } from "@/types/domain";

export function ExamsPage() {
  const { state } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(6);
  const [correct, setCorrect] = useState(24);
  const [total, setTotal] = useState(40);
  const [attempts, setAttempts] = useState<ExamAttempt[]>(state.examAttempts);

  return (
    <div>
      <PageHeader
        title="Exams"
        description="Ghi kết quả đề thi, mock test và bài IELTS theo kỹ năng."
        actions={<Button onClick={() => setOpen(true)}>Ghi kết quả</Button>}
      />

      {attempts.length === 0 ? (
        <EmptyState
          title="Chưa có bài thi"
          description="Lưu kết quả sau mỗi đề để theo dõi readiness."
          action={<Button onClick={() => setOpen(true)}>Ghi kết quả</Button>}
        />
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <Card key={attempt.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">Attempt · {attempt.examId}</p>
                  <p className="text-sm text-muted-foreground">
                    {attempt.correctCount}/{attempt.totalQuestions} đúng ·{" "}
                    {attempt.actualMinutes} phút
                  </p>
                </div>
                <p className="text-2xl font-semibold text-primary">
                  {attempt.bandScore ?? attempt.score ?? "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ghi kết quả bài thi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Tên đề</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label>Đúng</Label>
                <Input
                  type="number"
                  value={correct}
                  onChange={(e) => setCorrect(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tổng</Label>
                <Input
                  type="number"
                  value={total}
                  onChange={(e) => setTotal(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Band/Điểm</Label>
                <Input
                  type="number"
                  step={0.5}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                const ts = nowIso();
                const attempt: ExamAttempt = {
                  id: createId("att"),
                  examId: name || "Đề tuỳ chỉnh",
                  completedAt: ts,
                  actualMinutes: 60,
                  totalQuestions: total,
                  correctCount: correct,
                  wrongCount: Math.max(total - correct, 0),
                  blankCount: 0,
                  bandScore: score,
                  createdAt: ts,
                  updatedAt: ts,
                };
                setAttempts((prev) => [attempt, ...prev]);
                toast.success("Đã lưu kết quả bài thi");
                setOpen(false);
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
