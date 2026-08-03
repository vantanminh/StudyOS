import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEFAULT_SUBJECT_SUGGESTIONS } from "@/lib/labels";
import type { Priority, ProgramType } from "@/types/domain";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function OnboardingPage() {
  const { completeOnboarding, state } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState(state.profile?.displayName ?? "");
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [windowStart, setWindowStart] = useState("19:00");
  const [windowEnd, setWindowEnd] = useState("22:00");
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(10);

  type ExamDraft = {
    name: string;
    type: ProgramType;
    priority: Priority;
    targetDate: string;
    targetBand?: number;
  };

  const EXAM_TEMPLATES: ExamDraft[] = [
    {
      name: "Kỳ thi tốt nghiệp THPT",
      type: "grade_12",
      priority: "critical",
      targetDate: "",
    },
    {
      name: "IELTS",
      type: "ielts",
      priority: "high",
      targetBand: 6.5,
      targetDate: "",
    },
  ];

  // Empty by default — user opts in to programs/subjects.
  const [exams, setExams] = useState<ExamDraft[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState("");
  const [customExamName, setCustomExamName] = useState("");

  function toggleExamTemplate(template: ExamDraft) {
    setExams((prev) => {
      const exists = prev.some((e) => e.name === template.name);
      if (exists) return prev.filter((e) => e.name !== template.name);
      return [...prev, { ...template }];
    });
  }

  function toggleSubject(name: string) {
    setSubjects((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );
  }

  function finish() {
    if (!displayName.trim()) {
      toast.error("Hãy nhập tên hiển thị");
      setStep(1);
      return;
    }
    if (subjects.length === 0) {
      toast.error("Hãy chọn ít nhất một môn");
      setStep(3);
      return;
    }
    completeOnboarding(
      {
        displayName: displayName.trim(),
        timezone: "Asia/Ho_Chi_Minh",
        locale: "vi",
        weeklyTargetHours: weeklyHours,
        dailyStudyWindowStart: windowStart,
        dailyStudyWindowEnd: windowEnd,
        defaultSessionMinutes: sessionMinutes,
        breakMinutes,
      },
      exams.map((e) => ({
        name: e.name,
        type: e.type,
        priority: e.priority,
        targetDate: e.targetDate || undefined,
        targetBand: "targetBand" in e ? e.targetBand : undefined,
      })),
      subjects,
    );
    toast.success("Thiết lập xong. Chúc bạn học vui!");
    navigate("/today");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center animate-fade-up">
        <p className="text-sm font-semibold text-primary">Bước {step}/4</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">
          Thiết lập StudyOS
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Chỉ vài phút để hệ thống biết bạn cần học gì.
        </p>
        <div className="mx-auto mt-4 flex max-w-xs gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                s <= step ? "bg-primary" : "bg-secondary",
              )}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Múi giờ</Label>
                <Input value="Asia/Ho_Chi_Minh" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <Input value="Tiếng Việt" readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Giờ học mục tiêu / tuần</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                max={80}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
              />
            </div>
            <Button className="w-full" onClick={() => setStep(2)}>
              Tiếp tục
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Kỳ thi mục tiêu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Chọn kỳ thi bạn đang hướng tới (có thể bỏ trống và thêm sau).
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAM_TEMPLATES.map((template) => {
                const active = exams.some((e) => e.name === template.name);
                return (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => toggleExamTemplate(template)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-semibold transition-all",
                      active
                        ? "bg-sage-soft text-ink-900 shadow-soft"
                        : "bg-secondary text-muted-foreground hover:bg-cream-300",
                    )}
                  >
                    {template.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Thêm kỳ thi tuỳ chỉnh"
                value={customExamName}
                onChange={(e) => setCustomExamName(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const name = customExamName.trim();
                  if (!name) return;
                  if (exams.some((e) => e.name === name)) {
                    setCustomExamName("");
                    return;
                  }
                  setExams((prev) => [
                    ...prev,
                    {
                      name,
                      type: "custom" as ProgramType,
                      priority: "medium",
                      targetDate: "",
                    },
                  ]);
                  setCustomExamName("");
                }}
              >
                Thêm
              </Button>
            </div>
            {exams.map((exam, index) => (
              <div key={exam.name} className="rounded-xl border border-border/70 bg-cream-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{exam.name}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExams((prev) => prev.filter((_, i) => i !== index))}
                  >
                    Gỡ
                  </Button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Ngày thi</Label>
                    <Input
                      type="date"
                      value={exam.targetDate}
                      onChange={(e) => {
                        const next = [...exams];
                        next[index] = { ...exam, targetDate: e.target.value };
                        setExams(next);
                      }}
                    />
                  </div>
                  {exam.targetBand != null ? (
                    <div className="space-y-2">
                      <Label>Mục tiêu band</Label>
                      <Input
                        type="number"
                        step={0.5}
                        value={exam.targetBand}
                        onChange={(e) => {
                          const next = [...exams];
                          next[index] = {
                            ...exam,
                            targetBand: Number(e.target.value),
                          };
                          setExams(next);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Ưu tiên</Label>
                      <Input value={exam.priority === "critical" ? "Khẩn cấp" : "Trung bình"} readOnly />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Quay lại
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Tiếp tục
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Môn học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Chọn gợi ý hoặc thêm môn của bạn — mặc định không chọn sẵn.
            </p>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUBJECT_SUGGESTIONS.map((name) => {
                const active = subjects.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleSubject(name)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-semibold transition-all",
                      active
                        ? "bg-sage-soft text-ink-900 shadow-soft"
                        : "bg-secondary text-muted-foreground hover:bg-cream-300",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Thêm môn tuỳ chỉnh"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (!customSubject.trim()) return;
                  setSubjects((prev) => [...prev, customSubject.trim()]);
                  setCustomSubject("");
                }}
              >
                Thêm
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Quay lại
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Tiếp tục
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Khung giờ học</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bắt đầu</Label>
                <Input
                  type="time"
                  value={windowStart}
                  onChange={(e) => setWindowStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Kết thúc</Label>
                <Input
                  type="time"
                  value={windowEnd}
                  onChange={(e) => setWindowEnd(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Phiên mặc định (phút)</Label>
                <Input
                  type="number"
                  value={sessionMinutes}
                  onChange={(e) => setSessionMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nghỉ giữa phiên</Label>
                <Input
                  type="number"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setStep(3)}>
                Quay lại
              </Button>
              <Button className="flex-1" onClick={finish}>
                Bắt đầu học
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
