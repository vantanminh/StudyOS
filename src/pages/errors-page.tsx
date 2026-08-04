import { useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import type { ErrorType, Severity } from "@/types/domain";
import { addDays } from "date-fns";

export function ErrorsPage() {
  const { state, createErrorLog } = useData();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ErrorType>("knowledge_gap");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [solution, setSolution] = useState("");
  const autoReview = state.preferences?.autoReviewFromErrors ?? true;

  return (
    <div>
      <PageHeader
        title="Error Log"
        description="Ghi lỗi sai để tránh lặp lại và tự lên lịch ôn."
        actions={<Button onClick={() => setOpen(true)}>Thêm lỗi</Button>}
      />

      {state.errorLogs.length === 0 ? (
        <EmptyState title="Chưa có lỗi nào" description="Ghi lại lỗi ngay khi phát hiện." />
      ) : (
        <div className="space-y-3">
          {state.errorLogs.map((error) => {
            const subject = state.subjects.find((s) => s.id === error.subjectId);
            return (
              <Card key={error.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{error.title}</p>
                    <Badge
                      variant={
                        error.severity === "critical" || error.severity === "high"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {error.severity}
                    </Badge>
                    <Badge variant="outline">{error.type}</Badge>
                    <Badge>{error.status}</Badge>
                    {subject ? <Badge variant="success">{subject.name}</Badge> : null}
                  </div>
                  {error.solution ? (
                    <p className="text-sm text-muted-foreground">{error.solution}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    Lặp lại: {error.repeatCount} lần
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm lỗi sai</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Loại</Label>
                <Select value={type} onValueChange={(v) => setType(v as ErrorType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="knowledge_gap">Thiếu kiến thức</SelectItem>
                    <SelectItem value="misread_question">Đọc sai đề</SelectItem>
                    <SelectItem value="calculation_error">Tính toán</SelectItem>
                    <SelectItem value="careless_mistake">Sơ suất</SelectItem>
                    <SelectItem value="strategy_error">Chiến lược</SelectItem>
                    <SelectItem value="grammar">Ngữ pháp</SelectItem>
                    <SelectItem value="vocabulary">Từ vựng</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mức độ</Label>
                <Select
                  value={severity}
                  onValueChange={(v) => setSeverity(v as Severity)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="critical">Nghiêm trọng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Môn</Label>
              <Select
                value={subjectId ?? "none"}
                onValueChange={(v) => setSubjectId(v === "none" ? undefined : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {state.subjects.filter((s) => s.isActive).map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cách khắc phục</Label>
              <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!title.trim()) return;
                createErrorLog({
                  title: title.trim(),
                  type,
                  severity,
                  status: "new",
                  subjectId,
                  solution,
                  nextReviewAt: addDays(new Date(), 1).toISOString(),
                });
                toast.success(
                  autoReview
                    ? "Đã ghi lỗi và tạo review"
                    : "Đã ghi lỗi (auto-review tắt — bật trong Settings)",
                );
                setOpen(false);
                setTitle("");
                setSolution("");
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
