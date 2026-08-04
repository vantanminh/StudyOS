import { describe, expect, it } from "vitest";
import {
  calculateMasteryScore,
  calculatePriorityScore,
  calculateReadinessScore,
  canMarkMastered,
  canTransitionTaskStatus,
  nextReviewIntervalDays,
  readinessLabel,
} from "@/lib/scoring";

describe("priority score", () => {
  it("boosts overdue and high priority tasks", () => {
    const low = calculatePriorityScore({
      examImportance: 0.2,
      weaknessScore: 0.2,
      isOverdue: false,
      isReviewDue: false,
      estimatedMinutes: 60,
      priority: "low",
    });
    const high = calculatePriorityScore({
      hoursUntilDeadline: 2,
      examImportance: 1,
      weaknessScore: 0.8,
      isOverdue: true,
      isReviewDue: true,
      estimatedMinutes: 30,
      priority: "critical",
    });
    expect(high).toBeGreaterThan(low);
  });
});

describe("mastery score", () => {
  it("weights accuracy highest", () => {
    const score = calculateMasteryScore({
      accuracy: 1,
      reviewRetention: 0,
      recentExamPerformance: 0,
      completionRate: 0,
      confidenceScore: 0,
    });
    expect(score).toBe(40);
  });

  it("requires stable evidence for mastered", () => {
    expect(
      canMarkMastered({
        accuracy: 0.85,
        reviewCount: 2,
        hasRecentCriticalError: false,
        stableSessions: 3,
      }),
    ).toBe(true);
    expect(
      canMarkMastered({
        accuracy: 0.9,
        reviewCount: 1,
        hasRecentCriticalError: false,
        stableSessions: 3,
      }),
    ).toBe(false);
  });
});

describe("readiness score", () => {
  it("returns label bands", () => {
    const score = calculateReadinessScore({
      recentExamScore: 80,
      masteryAverage: 70,
      reviewRetention: 70,
      planCompletion: 60,
      scoreStability: 65,
      timePrepared: 50,
    });
    expect(score).toBeGreaterThan(60);
    expect(readinessLabel(20)).toBe("Chưa sẵn sàng");
    expect(readinessLabel(95)).toBe("Sẵn sàng cao");
  });
});

describe("review intervals", () => {
  it("shortens interval when forgotten", () => {
    expect(nextReviewIntervalDays(0, "forgot")).toBe(1);
    expect(nextReviewIntervalDays(2, "good")).toBeGreaterThan(
      nextReviewIntervalDays(2, "forgot"),
    );
  });
});

describe("task status transitions", () => {
  it("allows planned -> in_progress -> completed", () => {
    expect(canTransitionTaskStatus("planned", "in_progress")).toBe(true);
    expect(canTransitionTaskStatus("in_progress", "completed")).toBe(true);
    expect(canTransitionTaskStatus("completed", "planned")).toBe(false);
  });

  it("allows inbox -> overdue for auto-overdue", () => {
    expect(canTransitionTaskStatus("inbox", "overdue")).toBe(true);
  });
});
