import { Link } from "react-router-dom";
import { useState } from "react";
import { useData } from "@/providers/data-provider";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SUBJECT_COLOR_MAP, TOPIC_STATUS_COLORS, TOPIC_STATUS_LABELS } from "@/lib/labels";
import { formatMinutes } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SubjectsPage() {
  const { state, createSubject } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const subjects = state.subjects.filter((s) => s.isActive);

  return (
    <div>
      <PageHeader
        title="Subjects"
        description="Bản đồ kiến thức theo môn — theo dõi tiến độ và chuyên đề yếu."
        actions={<Button onClick={() => setOpen(true)}>Thêm môn</Button>}
      />

      {subjects.length === 0 ? (
        <EmptyState
          title="Chưa có môn học"
          description="Thêm môn để bắt đầu xây knowledge map."
          action={<Button onClick={() => setOpen(true)}>Thêm môn</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => {
            const topics = state.topics.filter((t) => t.subjectId === subject.id);
            const weak = topics.filter(
              (t) => t.status === "needs_review" || t.masteryScore < 50,
            ).length;
            return (
              <Link key={subject.id} to={`/subjects/${subject.id}`} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-lift">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${SUBJECT_COLOR_MAP[subject.colorToken ?? "sage"]}`}
                        >
                          {subject.shortName ?? subject.name}
                        </span>
                        <h2 className="mt-2 font-display text-xl font-semibold">
                          {subject.name}
                        </h2>
                      </div>
                      <p className="text-2xl font-semibold text-primary">
                        {subject.masteryScore}
                      </p>
                    </div>
                    <Progress value={subject.masteryScore} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{topics.length} chuyên đề</span>
                      <span>{weak} cần chú ý</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm môn học</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="subjectName">Tên môn</Label>
            <Input
              id="subjectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Ngữ văn"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button
              onClick={() => {
                if (!name.trim()) return;
                createSubject({ name: name.trim() });
                toast.success("Đã thêm môn");
                setName("");
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

export function SubjectDetailPage({ subjectId }: { subjectId: string }) {
  const { state, createTopic } = useData();
  const subject = state.subjects.find((s) => s.id === subjectId);
  const [open, setOpen] = useState(false);
  const [topicName, setTopicName] = useState("");

  if (!subject) {
    return (
      <EmptyState
        title="Không tìm thấy môn"
        action={
          <Button asChild>
            <Link to="/subjects">Quay lại</Link>
          </Button>
        }
      />
    );
  }

  const topics = state.topics
    .filter((t) => t.subjectId === subject.id)
    .sort((a, b) => a.order - b.order);
  const sessions = state.sessions
    .filter((s) => s.subjectId === subject.id)
    .slice(0, 8);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.focusMinutes, 0);

  return (
    <div>
      <PageHeader
        title={subject.name}
        description="Chi tiết tiến độ, chuyên đề và lịch sử học."
        actions={<Button onClick={() => setOpen(true)}>Thêm topic</Button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Mastery</p>
            <p className="text-2xl font-semibold">{subject.masteryScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Thời gian đã học</p>
            <p className="text-2xl font-semibold">{formatMinutes(totalMinutes)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Điểm hiện tại</p>
            <p className="text-2xl font-semibold">{subject.currentScore ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Mục tiêu</p>
            <p className="text-2xl font-semibold">{subject.targetScore ?? "—"}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 font-display text-xl font-semibold">Knowledge Map</h2>
      {topics.length === 0 ? (
        <EmptyState
          title="Chưa có chuyên đề"
          description="Thêm topic để theo dõi mastery."
          action={<Button onClick={() => setOpen(true)}>Thêm topic</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Card key={topic.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{topic.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TOPIC_STATUS_COLORS[topic.status]}`}
                  >
                    {TOPIC_STATUS_LABELS[topic.status]}
                  </span>
                </div>
                <Progress value={topic.masteryScore} />
                <p className="text-xs text-muted-foreground">
                  Mastery {topic.masteryScore}
                  {topic.accuracy != null
                    ? ` · Accuracy ${Math.round(topic.accuracy * 100)}%`
                    : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm chuyên đề</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="topic">Tên topic</Label>
            <Input
              id="topic"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!topicName.trim()) return;
                createTopic({ subjectId: subject.id, name: topicName.trim() });
                toast.success("Đã thêm topic");
                setTopicName("");
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
