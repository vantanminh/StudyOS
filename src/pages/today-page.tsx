import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { greetingForHour, PRIORITY_LABELS, SUBJECT_COLOR_MAP } from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";
import { calculatePriorityScore } from "@/lib/scoring";
import { Flame, Play, Check, CalendarClock, AlertTriangle, CircleHelp } from "lucide-react";
import { toast } from "sonner";
import { today } from "@/data/demo-store";
import { addDays } from "date-fns";
import { Link } from "react-router-dom";

export function TodayPage() {
  const { state, completeTask, rescheduleTask, startSession } = useData();
  const navigate = useNavigate();
  const date = today();
  const hour = new Date().getHours();
  const name = state.profile?.displayName ?? "bạn";

  const todayTasks = state.tasks.filter(
    (t) =>
      t.scheduledDate === date &&
      !["completed", "cancelled", "archived"].includes(t.status),
  );
  const overdueTasks = state.tasks.filter((t) => t.status === "overdue");
  const dueReviews = state.reviewItems.filter(
    (r) => r.status === "pending" && new Date(r.dueAt) <= new Date(),
  );
  const daily = state.dailyStats.find((d) => d.date === date);
  const plannedMinutes = todayTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
  const completedToday = state.tasks.filter(
    (t) => t.status === "completed" && t.completedAt?.startsWith(date),
  ).length;
  const completionRate =
    todayTasks.length + completedToday === 0
      ? 0
      : Math.round(
          (completedToday / (todayTasks.length + completedToday)) * 100,
        );

  const streak = (() => {
    let count = 0;
    for (let i = 1; i <= 30; i++) {
      const d = format(addDays(new Date(), -i), "yyyy-MM-dd");
      const stat = state.dailyStats.find((s) => s.date === d);
      if (stat && stat.totalStudyMinutes > 0) count += 1;
      else break;
    }
    if ((daily?.totalStudyMinutes ?? 0) > 0) count += 1;
    return count;
  })();

  const priorities = [...todayTasks]
    .map((task) => {
      const subject = state.subjects.find((s) => s.id === task.subjectId);
      const score = calculatePriorityScore({
        hoursUntilDeadline: task.deadlineAt
          ? (new Date(task.deadlineAt).getTime() - Date.now()) / 36e5
          : undefined,
        examImportance: task.priority === "critical" ? 1 : 0.5,
        weaknessScore: subject ? (100 - subject.masteryScore) / 100 : 0.3,
        isOverdue: task.status === "overdue",
        isReviewDue: task.type === "review",
        estimatedMinutes: task.estimatedMinutes,
        priority: task.priority,
      });
      return { task, score, subject };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const timeline = [...todayTasks]
    .filter((t) => t.scheduledStartAt)
    .sort((a, b) =>
      (a.scheduledStartAt ?? "").localeCompare(b.scheduledStartAt ?? ""),
    );

  return (
    <div className="space-y-6">
      <section className="animate-fade-up rounded-[1.75rem] border border-border/60 bg-card/80 p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              {greetingForHour(hour)}, {name}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">
              Hôm nay cần học gì?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {format(new Date(), "EEEE, d MMMM yyyy", { locale: vi })}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="warn" className="gap-1">
                <Flame className="h-3.5 w-3.5" />
                Streak {streak} ngày
              </Badge>
              <Badge variant="secondary">
                Đã học {formatMinutes(daily?.totalStudyMinutes ?? 0)}
              </Badge>
              <Badge variant="outline">
                Dự kiến {formatMinutes(plannedMinutes)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const top = priorities[0]?.task;
                const session = startSession(top?.id);
                navigate(`/session/${session.id}`);
              }}
            >
              <Play className="h-4 w-4" />
              Start Focus Session
            </Button>
            <Button asChild variant="outline">
              <Link to="/help">
                <CircleHelp className="h-4 w-4" />
                Hướng dẫn
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: "60ms" }}>
        {state.programs
          .filter((p) => p.status === "active" && p.targetDate)
          .slice(0, 3)
          .map((program) => {
            const days = differenceInCalendarDays(
              parseISO(program.targetDate!),
              new Date(),
            );
            return (
              <Card key={program.id} className="bg-peach-soft/40">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Đếm ngược
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink-900">
                    Còn {Math.max(days, 0)} ngày
                  </p>
                  <p className="text-sm text-ink-700">đến {program.name}</p>
                </CardContent>
              </Card>
            );
          })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <CardTitle>Top Priorities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Không có task ưu tiên hôm nay. Hãy thêm một việc nhỏ để bắt đầu.
                </p>
              ) : (
                priorities.map(({ task, subject }) => (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-border/60 bg-cream-50/80 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-ink-900">{task.title}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {subject ? (
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${SUBJECT_COLOR_MAP[subject.colorToken ?? "sage"]}`}
                            >
                              {subject.name}
                            </span>
                          ) : null}
                          <Badge variant="outline">
                            {formatMinutes(task.estimatedMinutes)}
                          </Badge>
                          <Badge
                            variant={
                              task.priority === "critical" || task.priority === "high"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {PRIORITY_LABELS[task.priority]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            const session = startSession(task.id);
                            navigate(`/session/${session.id}`);
                          }}
                          aria-label={`Bắt đầu ${task.title}`}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            completeTask(task.id, {
                              progress: 100,
                              actualMinutes: task.estimatedMinutes,
                              focusRating: 4,
                            });
                            toast.success("Đã hoàn thành task");
                          }}
                          aria-label={`Hoàn thành ${task.title}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            rescheduleTask(
                              task.id,
                              format(addDays(new Date(), 1), "yyyy-MM-dd"),
                            );
                            toast.message("Đã dời sang ngày mai");
                          }}
                          aria-label={`Dời lịch ${task.title}`}
                        >
                          <CalendarClock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "140ms" }}>
            <CardHeader>
              <CardTitle>Timeline hôm nay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có khung giờ. Mở Planner để sắp xếp.
                </p>
              ) : (
                timeline.map((task) => {
                  const start = task.scheduledStartAt
                    ? format(parseISO(task.scheduledStartAt), "HH:mm")
                    : "--:--";
                  const end = task.scheduledEndAt
                    ? format(parseISO(task.scheduledEndAt), "HH:mm")
                    : "--:--";
                  const subject = state.subjects.find((s) => s.id === task.subjectId);
                  return (
                    <div key={task.id} className="flex gap-3">
                      <div className="w-24 shrink-0 text-sm font-semibold text-muted-foreground">
                        {start}–{end}
                      </div>
                      <div className="flex-1 rounded-xl bg-secondary/70 px-3 py-2">
                        <p className="text-sm font-semibold">{task.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {subject?.name ?? "Chưa gán môn"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="animate-fade-up" style={{ animationDelay: "120ms" }}>
            <CardHeader>
              <CardTitle>Daily Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Hoàn thành kế hoạch</span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
                <Progress value={completionRate} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-sage-soft/60 p-3">
                  <p className="text-muted-foreground">Task xong</p>
                  <p className="text-xl font-semibold">{completedToday}</p>
                </div>
                <div className="rounded-xl bg-sky-soft/60 p-3">
                  <p className="text-muted-foreground">Thời gian</p>
                  <p className="text-xl font-semibold">
                    {daily?.totalStudyMinutes ?? 0}p
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <CardHeader>
              <CardTitle>Review Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dueReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có mục cần ôn.</p>
              ) : (
                dueReviews.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate("/review")}
                    className="w-full rounded-xl border border-border/60 bg-butter-soft/50 px-3 py-2 text-left text-sm font-semibold hover:bg-butter-soft"
                  >
                    {item.title}
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-up" style={{ animationDelay: "180ms" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdueTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tuyệt vời, không có task quá hạn.</p>
              ) : (
                overdueTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-rose/30 bg-rose-soft/40 p-3">
                    <p className="text-sm font-semibold">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          rescheduleTask(task.id, date);
                          toast.success("Đã đưa vào hôm nay");
                        }}
                      >
                        Làm hôm nay
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          rescheduleTask(
                            task.id,
                            format(addDays(new Date(), 1), "yyyy-MM-dd"),
                          )
                        }
                      >
                        Dời ngày khác
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
