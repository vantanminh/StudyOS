import { useData } from "@/providers/data-provider";
import { PageHeader, EmptyState } from "@/components/shared/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ReviewPage() {
  const { state, completeReview } = useData();
  const pending = state.reviewItems.filter((r) => r.status === "pending");

  return (
    <div>
      <PageHeader
        title="Review"
        description="Ôn lại lỗi sai, chuyên đề yếu và nội dung đến hạn theo spaced repetition."
      />

      {pending.length === 0 ? (
        <EmptyState
          title="Hàng đợi ôn trống"
          description="Khi bạn ghi lỗi hoặc đánh dấu cần ôn, mục sẽ xuất hiện ở đây."
        />
      ) : (
        <div className="space-y-3">
          {pending.map((item) => {
            const subject = state.subjects.find((s) => s.id === item.subjectId);
            return (
              <Card key={item.id}>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{item.sourceType}</Badge>
                        {subject ? <Badge variant="success">{subject.name}</Badge> : null}
                        <Badge variant="outline">Lần {item.reviewCount + 1}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["forgot", "Quên"],
                        ["partial", "Nhớ một phần"],
                        ["uncertain", "Chưa chắc"],
                        ["good", "Nhớ tốt"],
                        ["mastered", "Đã vững"],
                      ] as const
                    ).map(([value, label]) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={value === "mastered" ? "default" : "secondary"}
                        onClick={() => {
                          completeReview(item.id, value);
                          toast.success("Đã cập nhật lịch ôn");
                        }}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
