import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pause, Play, Square } from "lucide-react";

const ACTIVE_SESSION_KEY = "studyos-active-session";

export function SessionPage() {
  const { sessionId } = useParams();
  const { state, pauseSession, resumeSession, endSession } = useData();
  const navigate = useNavigate();
  const session = state.sessions.find((s) => s.id === sessionId);
  const task = state.tasks.find((t) => t.id === session?.taskId);

  const [elapsed, setElapsed] = useState(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [pauseAccum, setPauseAccum] = useState(0);
  const [mode] = useState(session?.mode ?? "pomodoro");
  const focusTarget = state.profile?.defaultSessionMinutes
    ? state.profile.defaultSessionMinutes * 60
    : 25 * 60;
  const [endOpen, setEndOpen] = useState(false);
  const [focusRating, setFocusRating] = useState(4);
  const [energyRating, setEnergyRating] = useState(3);
  const [notes, setNotes] = useState("");
  const [completeTaskFlag, setCompleteTaskFlag] = useState(true);
  const [resumePrompt, setResumePrompt] = useState(false);

  useEffect(() => {
    if (!session) return;
    const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          sessionId: string;
          startedAt: string;
        };
        if (parsed.sessionId === session.id) {
          setResumePrompt(true);
        }
      } catch {
        /* ignore */
      }
    } else {
      localStorage.setItem(
        ACTIVE_SESSION_KEY,
        JSON.stringify({ sessionId: session.id, startedAt: session.startedAt }),
      );
    }
  }, [session]);

  useEffect(() => {
    if (!session || session.status !== "active" || resumePrompt) return;
    const timer = window.setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [session, resumePrompt]);

  const display = useMemo(() => {
    const total =
      mode === "countdown" || mode === "pomodoro"
        ? Math.max(focusTarget - elapsed, 0)
        : elapsed;
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(total % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }, [elapsed, focusTarget, mode]);

  if (!session) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="font-display text-2xl">Không tìm thấy phiên học</p>
        <Button className="mt-4" onClick={() => navigate("/today")}>
          Về Today
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-lg flex-col items-center justify-center px-4">
      <Card className="w-full overflow-hidden border-none bg-gradient-to-b from-sage-soft/80 to-card shadow-lift">
        <CardContent className="space-y-6 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Focus Session · {mode}
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            {task?.title ?? "Phiên học tự do"}
          </h1>
          <p className="font-display text-6xl font-semibold tabular-nums text-ink-900 animate-fade-up">
            {display}
          </p>
          <p className="text-sm text-muted-foreground">
            Mục tiêu: tập trung vào một việc, ghi chú nhanh nếu cần.
          </p>

          <div className="flex justify-center gap-3">
            {session.status === "active" ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  pauseSession(session.id);
                  setPausedAt(Date.now());
                }}
                aria-label="Tạm dừng"
              >
                <Pause />
                Pause
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  if (pausedAt) {
                    setPauseAccum((p) => p + Math.round((Date.now() - pausedAt) / 1000));
                    setPausedAt(null);
                  }
                  resumeSession(session.id);
                }}
                aria-label="Tiếp tục"
              >
                <Play />
                Resume
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={() => setEndOpen(true)}
              aria-label="Kết thúc"
            >
              <Square />
              End
            </Button>
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="quickNote">Ghi chú nhanh</Label>
            <Textarea
              id="quickNote"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Điều vừa hiểu / còn vướng..."
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={resumePrompt} onOpenChange={setResumePrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tiếp tục phiên học?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Trình duyệt từng đóng khi đang học. Thời gian đóng cửa sổ không được tính
            tự động là thời gian học.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem(ACTIVE_SESSION_KEY);
                setResumePrompt(false);
                navigate("/today");
              }}
            >
              Bỏ phiên
            </Button>
            <Button
              onClick={() => {
                setResumePrompt(false);
                resumeSession(session.id);
              }}
            >
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tổng kết phiên học</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Phút tập trung (có thể sửa)</Label>
              <Input
                type="number"
                value={Math.max(1, Math.round(elapsed / 60))}
                onChange={(e) => setElapsed(Number(e.target.value) * 60)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tập trung 1–5</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={focusRating}
                  onChange={(e) => setFocusRating(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Năng lượng 1–5</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={energyRating}
                  onChange={(e) => setEnergyRating(Number(e.target.value))}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={completeTaskFlag}
                onChange={(e) => setCompleteTaskFlag(e.target.checked)}
              />
              Đánh dấu task đã hoàn thành
            </label>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                endSession(session.id, {
                  focusMinutes: Math.max(1, Math.round(elapsed / 60)),
                  breakMinutes: 0,
                  pauseMinutes: Math.round(pauseAccum / 60),
                  focusRating: focusRating as 1 | 2 | 3 | 4 | 5,
                  energyRating: energyRating as 1 | 2 | 3 | 4 | 5,
                  notes,
                  completeTask: completeTaskFlag && Boolean(task),
                });
                localStorage.removeItem(ACTIVE_SESSION_KEY);
                toast.success("Đã lưu phiên học");
                navigate("/today");
              }}
            >
              Lưu và thoát
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
