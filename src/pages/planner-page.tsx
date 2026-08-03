import { addDays, format, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo, useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader } from "@/components/shared/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SUBJECT_COLOR_MAP } from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";
import { toast } from "sonner";

export function PlannerPage() {
  const { state, rescheduleTask } = useData();
  const [anchor, setAnchor] = useState(new Date());
  const weekStart = startOfWeek(anchor, { weekStartsOn: 1 });
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const backlog = state.tasks.filter(
    (t) => !t.scheduledDate && !["completed", "cancelled", "archived"].includes(t.status),
  );
  const unscheduled = state.tasks.filter(
    (t) => t.status === "inbox" || (!t.scheduledStartAt && t.scheduledDate),
  );

  function dropToDay(taskId: string, date: string) {
    rescheduleTask(taskId, date);
    toast.success("Đã xếp task vào ngày đã chọn");
  }

  return (
    <div>
      <PageHeader
        title="Planner"
        description="Xem lịch học theo tuần, ngày và backlog. Kéo thả bằng cách chọn ngày đích."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAnchor(addDays(anchor, -7))}>
              Tuần trước
            </Button>
            <Button variant="secondary" onClick={() => setAnchor(new Date())}>
              Tuần này
            </Button>
            <Button variant="secondary" onClick={() => setAnchor(addDays(anchor, 7))}>
              Tuần sau
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
          <TabsTrigger value="unscheduled">Unscheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="week">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const tasks = state.tasks.filter(
                (t) =>
                  t.scheduledDate === key &&
                  !["cancelled", "archived"].includes(t.status),
              );
              const total = tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
              const overloaded = total > (state.profile?.weeklyTargetHours ?? 20) * 60 / 5;
              return (
                <Card key={key} className={overloaded ? "border-coral/50" : undefined}>
                  <CardContent className="p-3">
                    <div className="mb-2">
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        {format(day, "EEE", { locale: vi })}
                      </p>
                      <p className="font-display text-lg font-semibold">
                        {format(day, "d/M")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatMinutes(total)}
                        {overloaded ? " · quá tải" : ""}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {tasks.map((task) => {
                        const subject = state.subjects.find((s) => s.id === task.subjectId);
                        return (
                          <div
                            key={task.id}
                            className="rounded-xl border border-border/50 bg-cream-50 p-2 text-xs"
                          >
                            <p className="font-semibold leading-snug">{task.title}</p>
                            {subject ? (
                              <span
                                className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 ${SUBJECT_COLOR_MAP[subject.colorToken ?? "sage"]}`}
                              >
                                {subject.shortName ?? subject.name}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                      {backlog[0] ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full text-xs"
                          onClick={() => dropToDay(backlog[0]!.id, key)}
                        >
                          + Xếp từ backlog
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="font-semibold">
                {format(anchor, "EEEE d/M/yyyy", { locale: vi })}
              </p>
              {state.tasks
                .filter((t) => t.scheduledDate === format(anchor, "yyyy-MM-dd"))
                .map((task) => (
                  <div key={task.id} className="rounded-xl bg-secondary/60 p-3">
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMinutes(task.estimatedMinutes)} · {task.status}
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">
                Month view MVP: dùng Week để sắp xếp chi tiết. Tổng task tháng:{" "}
                {
                  state.tasks.filter((t) =>
                    t.scheduledDate?.startsWith(format(anchor, "yyyy-MM")),
                  ).length
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backlog">
          <div className="space-y-2">
            {backlog.length === 0 ? (
              <p className="text-sm text-muted-foreground">Backlog trống.</p>
            ) : (
              backlog.map((task) => (
                <Card key={task.id}>
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <Badge variant="secondary">{formatMinutes(task.estimatedMinutes)}</Badge>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        dropToDay(task.id, format(new Date(), "yyyy-MM-dd"))
                      }
                    >
                      Xếp hôm nay
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="unscheduled">
          <div className="space-y-2">
            {unscheduled.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {task.scheduledDate
                      ? `Ngày ${task.scheduledDate} · chưa có giờ`
                      : "Chưa lên lịch"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
