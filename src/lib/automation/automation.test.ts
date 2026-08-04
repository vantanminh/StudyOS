import { describe, expect, it } from "vitest";
import {
  applyAutoOverdue,
  buildAutoReviewsFromErrors,
  buildAutoReviewsFromWeakTopics,
  buildStudyReminders,
  planSmartReschedule,
  runAutomationPass,
} from "@/lib/automation";
import { defaultStudyPreferences } from "@/lib/preferences";
import { canTransitionTaskStatus } from "@/lib/scoring";
import type {
  ErrorLog,
  ReviewItem,
  StudyTask,
  Topic,
  UserProfile,
} from "@/types/domain";

function task(partial: Partial<StudyTask> & Pick<StudyTask, "id" | "title">): StudyTask {
  const ts = "2026-08-01T00:00:00.000Z";
  return {
    type: "practice",
    status: "planned",
    priority: "medium",
    estimatedMinutes: 60,
    actualMinutes: 0,
    progress: 0,
    source: "manual",
    needsReview: false,
    createdAt: ts,
    updatedAt: ts,
    ...partial,
  };
}

describe("auto-overdue", () => {
  it("marks past scheduledDate as overdue", () => {
    const now = new Date("2026-08-04T12:00:00");
    const { tasks, changedIds } = applyAutoOverdue(
      [
        task({ id: "a", title: "A", scheduledDate: "2026-08-01" }),
        task({ id: "b", title: "B", scheduledDate: "2026-08-04" }),
        task({ id: "c", title: "C", status: "completed", scheduledDate: "2026-08-01" }),
      ],
      now,
    );
    expect(changedIds).toEqual(["a"]);
    expect(tasks.find((t) => t.id === "a")?.status).toBe("overdue");
    expect(tasks.find((t) => t.id === "b")?.status).toBe("planned");
  });

  it("marks inbox tasks past deadline as overdue", () => {
    expect(canTransitionTaskStatus("inbox", "overdue")).toBe(true);
    const now = new Date("2026-08-04T12:00:00");
    const { tasks, changedIds } = applyAutoOverdue(
      [
        task({
          id: "inbox-late",
          title: "Inbox late",
          status: "inbox",
          deadlineAt: "2026-08-01T00:00:00.000Z",
        }),
      ],
      now,
    );
    expect(changedIds).toEqual(["inbox-late"]);
    expect(tasks[0]?.status).toBe("overdue");
  });

  it("skips in_progress tasks", () => {
    const now = new Date("2026-08-04T12:00:00");
    const { changedIds } = applyAutoOverdue(
      [
        task({
          id: "busy",
          title: "Busy",
          status: "in_progress",
          scheduledDate: "2026-08-01",
        }),
      ],
      now,
    );
    expect(changedIds).toEqual([]);
  });
});

describe("smart reschedule", () => {
  it("moves flexible tasks off overloaded days", () => {
    const weekStart = "2026-08-03"; // Monday
    const tasks = [
      task({
        id: "1",
        title: "Flexible",
        scheduledDate: "2026-08-03",
        estimatedMinutes: 90,
        priority: "low",
      }),
      task({
        id: "2",
        title: "Keep",
        scheduledDate: "2026-08-03",
        estimatedMinutes: 90,
        priority: "high",
      }),
      task({
        id: "3",
        title: "Light",
        scheduledDate: "2026-08-04",
        estimatedMinutes: 30,
        priority: "medium",
      }),
    ];
    const result = planSmartReschedule({
      tasks,
      weekStart,
      maxMinutesPerDay: 120,
      restDays: [0],
    });
    expect(result.overloadedDates).toContain("2026-08-03");
    expect(result.moves.length).toBeGreaterThan(0);
    // Prefer moving lower-priority task first
    expect(result.moves[0]!.taskId).toBe("1");
    expect(result.moves[0]!.toDate).not.toBe("2026-08-03");
  });
});

describe("auto review", () => {
  const prefs = defaultStudyPreferences();

  it("creates review from unlinked errors when enabled", () => {
    const errors: ErrorLog[] = [
      {
        id: "e1",
        title: "Sai công thức",
        type: "knowledge_gap",
        severity: "high",
        status: "new",
        repeatCount: 1,
        detectedAt: "2026-08-01T00:00:00.000Z",
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
    ];
    const drafts = buildAutoReviewsFromErrors(errors, [], prefs);
    expect(drafts).toHaveLength(1);
    expect(drafts[0]!.sourceType).toBe("error");
  });

  it("skips when preference off", () => {
    const drafts = buildAutoReviewsFromErrors(
      [
        {
          id: "e1",
          title: "x",
          type: "other",
          severity: "low",
          status: "new",
          repeatCount: 1,
          detectedAt: "2026-08-01T00:00:00.000Z",
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-01T00:00:00.000Z",
        },
      ],
      [],
      { ...prefs, autoReviewFromErrors: false },
    );
    expect(drafts).toHaveLength(0);
  });

  it("skips errors already linked to a review", () => {
    const errors: ErrorLog[] = [
      {
        id: "e1",
        title: "x",
        type: "other",
        severity: "low",
        status: "new",
        repeatCount: 1,
        detectedAt: "2026-08-01T00:00:00.000Z",
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
    ];
    const existing: ReviewItem[] = [
      {
        id: "r1",
        sourceType: "error",
        sourceId: "e1",
        title: "Ôn lỗi: x",
        dueAt: "2026-08-05T00:00:00.000Z",
        intervalDays: 1,
        priority: "medium",
        status: "pending",
        reviewCount: 0,
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
    ];
    expect(buildAutoReviewsFromErrors(errors, existing, prefs)).toHaveLength(0);
  });

  it("creates review for weak topics", () => {
    const topics: Topic[] = [
      {
        id: "t1",
        subjectId: "s1",
        name: "Đạo hàm",
        order: 0,
        status: "needs_review",
        masteryScore: 20,
        totalQuestions: 10,
        correctQuestions: 2,
        totalStudyMinutes: 30,
        createdAt: "2026-08-01T00:00:00.000Z",
        updatedAt: "2026-08-01T00:00:00.000Z",
      },
    ];
    const drafts = buildAutoReviewsFromWeakTopics(
      topics,
      [{ id: "s1", name: "Toán", order: 0, masteryScore: 40, isActive: true, createdAt: "", updatedAt: "" }],
      [] as ReviewItem[],
      prefs,
    );
    expect(drafts).toHaveLength(1);
    expect(drafts[0]!.sourceType).toBe("topic");
  });

  it("respects maxReviewsPerDay cap across error + weak topic drafts", () => {
    const now = new Date("2026-08-04T12:00:00");
    const errors: ErrorLog[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      title: `Err ${i}`,
      type: "other" as const,
      severity: "medium" as const,
      status: "new" as const,
      repeatCount: 1,
      detectedAt: "2026-08-01T00:00:00.000Z",
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    }));
    const topics: Topic[] = Array.from({ length: 5 }, (_, i) => ({
      id: `t${i}`,
      subjectId: "s1",
      name: `Topic ${i}`,
      order: i,
      status: "needs_review" as const,
      masteryScore: 10,
      totalQuestions: 5,
      correctQuestions: 0,
      totalStudyMinutes: 10,
      createdAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    }));
    const result = runAutomationPass({
      profile: {
        notificationsEnabled: false,
      } as UserProfile,
      preferences: { ...prefs, maxReviewsPerDay: 3 },
      tasks: [],
      topics,
      subjects: [
        {
          id: "s1",
          name: "Toán",
          order: 0,
          masteryScore: 40,
          isActive: true,
          createdAt: "",
          updatedAt: "",
        },
      ],
      errorLogs: errors,
      reviewItems: [],
      now,
    });
    expect(result.reviewDrafts.length).toBeLessThanOrEqual(3);
  });
});

describe("reminders (nhắc học)", () => {
  it("returns empty when notifications disabled", () => {
    const profile = {
      notificationsEnabled: false,
      dailyStudyWindowStart: "00:00",
      dailyStudyWindowEnd: "23:59",
    } as UserProfile;
    expect(
      buildStudyReminders({
        profile,
        tasks: [task({ id: "1", title: "A", scheduledDate: "2026-08-04" })],
        reviewItems: [],
        now: new Date("2026-08-04T12:00:00"),
      }),
    ).toHaveLength(0);
  });

  it("includes study window and task reminders when enabled", () => {
    const profile = {
      notificationsEnabled: true,
      dailyStudyWindowStart: "00:00",
      dailyStudyWindowEnd: "23:59",
    } as UserProfile;
    const reminders = buildStudyReminders({
      profile,
      tasks: [task({ id: "1", title: "Học toán", scheduledDate: "2026-08-04" })],
      reviewItems: [],
      now: new Date("2026-08-04T12:00:00"),
    });
    expect(reminders.some((r) => r.kind === "study_window")).toBe(true);
    expect(reminders.some((r) => r.kind === "task_due")).toBe(true);
  });

  it("includes overdue and review_due kinds", () => {
    const profile = {
      notificationsEnabled: true,
      dailyStudyWindowStart: "19:00",
      dailyStudyWindowEnd: "22:00",
    } as UserProfile;
    const reminders = buildStudyReminders({
      profile,
      tasks: [
        task({ id: "1", title: "Late", status: "overdue", scheduledDate: "2026-08-01" }),
      ],
      reviewItems: [
        {
          id: "r1",
          sourceType: "manual",
          title: "Ôn",
          dueAt: "2026-08-04T00:00:00.000Z",
          intervalDays: 1,
          priority: "medium",
          status: "pending",
          reviewCount: 0,
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-01T00:00:00.000Z",
        },
      ],
      now: new Date("2026-08-04T12:00:00"),
    });
    expect(reminders.some((r) => r.kind === "overdue")).toBe(true);
    expect(reminders.some((r) => r.kind === "review_due")).toBe(true);
  });
});

describe("runAutomationPass", () => {
  it("applies overdue, drafts reviews, and builds reminders together", () => {
    const now = new Date("2026-08-04T20:00:00");
    const prefs = defaultStudyPreferences();
    const result = runAutomationPass({
      profile: {
        notificationsEnabled: true,
        dailyStudyWindowStart: "19:00",
        dailyStudyWindowEnd: "22:00",
      } as UserProfile,
      preferences: prefs,
      tasks: [
        task({ id: "late", title: "Late", scheduledDate: "2026-08-01" }),
        task({ id: "today", title: "Today", scheduledDate: "2026-08-04" }),
      ],
      topics: [
        {
          id: "t1",
          subjectId: "s1",
          name: "Weak",
          order: 0,
          status: "needs_review",
          masteryScore: 15,
          totalQuestions: 4,
          correctQuestions: 0,
          totalStudyMinutes: 10,
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-01T00:00:00.000Z",
        },
      ],
      subjects: [
        {
          id: "s1",
          name: "Toán",
          order: 0,
          masteryScore: 20,
          isActive: true,
          createdAt: "",
          updatedAt: "",
        },
      ],
      errorLogs: [
        {
          id: "e1",
          title: "Gap",
          type: "knowledge_gap",
          severity: "high",
          status: "new",
          repeatCount: 1,
          detectedAt: "2026-08-01T00:00:00.000Z",
          createdAt: "2026-08-01T00:00:00.000Z",
          updatedAt: "2026-08-01T00:00:00.000Z",
        },
      ],
      reviewItems: [],
      now,
    });

    expect(result.overdueIds).toContain("late");
    expect(result.tasks.find((t) => t.id === "late")?.status).toBe("overdue");
    expect(result.reviewDrafts.length).toBeGreaterThanOrEqual(2);
    expect(result.reminders.some((r) => r.kind === "overdue")).toBe(true);
    expect(result.reminders.some((r) => r.kind === "study_window")).toBe(true);
  });
});
