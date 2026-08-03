/**
 * Service-layer placeholders for Firebase-backed operations.
 * Demo mode uses DataProvider; swap implementations when wiring Firestore.
 */

import type { StudyTask } from "@/types/domain";
import { calculatePriorityScore } from "@/lib/scoring";
import type { Subject } from "@/types/domain";

export function rankTasksForToday(
  tasks: StudyTask[],
  subjects: Subject[],
  limit = 3,
): StudyTask[] {
  return [...tasks]
    .map((task) => {
      const subject = subjects.find((s) => s.id === task.subjectId);
      const score = calculatePriorityScore({
        hoursUntilDeadline: task.deadlineAt
          ? (new Date(task.deadlineAt).getTime() - Date.now()) / 36e5
          : undefined,
        examImportance: task.priority === "critical" ? 1 : 0.6,
        weaknessScore: subject ? (100 - subject.masteryScore) / 100 : 0.3,
        isOverdue: task.status === "overdue",
        isReviewDue: task.type === "review",
        estimatedMinutes: task.estimatedMinutes,
        priority: task.priority,
      });
      return { task, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.task);
}
