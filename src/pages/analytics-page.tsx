import { useMemo, useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader } from "@/components/shared/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMinutes } from "@/lib/utils";
import {
  calculateReadinessScore,
  readinessLabel,
} from "@/lib/scoring";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { subDays, format } from "date-fns";

export function AnalyticsPage() {
  const { state } = useData();
  const [range, setRange] = useState<"7" | "30" | "90">("7");
  const days = Number(range);

  const chartData = useMemo(() => {
    return Array.from({ length: days }, (_, i) => {
      const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");
      const stat = state.dailyStats.find((d) => d.date === date);
      return {
        date: format(subDays(new Date(), days - 1 - i), "dd/MM"),
        minutes: stat?.totalStudyMinutes ?? 0,
        tasks: stat?.completedTasks ?? 0,
      };
    });
  }, [days, state.dailyStats]);

  const totalMinutes = chartData.reduce((s, d) => s + d.minutes, 0);
  const completedTasks = chartData.reduce((s, d) => s + d.tasks, 0);

  const readiness = state.subjects
    .filter((s) => s.isActive)
    .map((subject) => {
      const score = calculateReadinessScore({
        recentExamScore: (subject.currentScore ?? 5) * 10,
        masteryAverage: subject.masteryScore,
        reviewRetention: 70,
        planCompletion: 65,
        scoreStability: 60,
        timePrepared: Math.min(subject.masteryScore, 80),
      });
      return { subject, score };
    });

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Dựa trên daily stats tổng hợp — không quét toàn bộ lịch sử thô."
      />

      <Tabs value={range} onValueChange={(v) => setRange(v as "7" | "30" | "90")}>
        <TabsList>
          <TabsTrigger value="7">7 ngày</TabsTrigger>
          <TabsTrigger value="30">30 ngày</TabsTrigger>
          <TabsTrigger value="90">90 ngày</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Tổng thời gian học</p>
            <p className="text-2xl font-semibold">{formatMinutes(totalMinutes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Task hoàn thành</p>
            <p className="text-2xl font-semibold">{completedTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Phiên học</p>
            <p className="text-2xl font-semibold">{state.sessions.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Thời gian học theo ngày</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2d0b8" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="minutes" fill="#6b8f71" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="mb-2 font-display text-xl font-semibold">Exam Readiness</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Chỉ số tham khảo, không phải dự đoán chắc chắn kết quả thi.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readiness.map(({ subject, score }) => (
            <Card key={subject.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{subject.name}</p>
                <p className="mt-1 text-3xl font-semibold text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">{readinessLabel(score)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
