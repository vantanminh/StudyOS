import { clamp } from "@/lib/utils";
import type { Priority } from "@/types/domain";

export const PRIORITY_WEIGHTS = {
  urgencyWeight: 25,
  examImportanceWeight: 20,
  weaknessWeight: 20,
  overdueWeight: 25,
  reviewDueWeight: 15,
  estimatedEffortPenaltyPerHour: 5,
} as const;

export interface PriorityScoreInput {
  hoursUntilDeadline?: number;
  examImportance: number;
  weaknessScore: number;
  isOverdue: boolean;
  isReviewDue: boolean;
  estimatedMinutes: number;
  priority: Priority;
}

const priorityBoost: Record<Priority, number> = {
  low: 0,
  medium: 5,
  high: 12,
  critical: 20,
};

export function calculatePriorityScore(input: PriorityScoreInput): number {
  const urgency =
    input.hoursUntilDeadline === undefined
      ? 0
      : clamp(PRIORTY_URGENCY(input.hoursUntilDeadline), 0, PRIORITY_WEIGHTS.urgencyWeight);

  const exam =
    clamp(input.examImportance, 0, 1) * PRIORITY_WEIGHTS.examImportanceWeight;
  const weakness =
    clamp(input.weaknessScore, 0, 1) * PRIORITY_WEIGHTS.weaknessWeight;
  const overdue = input.isOverdue ? PRIORITY_WEIGHTS.overdueWeight : 0;
  const review = input.isReviewDue ? PRIORITY_WEIGHTS.reviewDueWeight : 0;
  const effortPenalty =
    (input.estimatedMinutes / 60) *
    PRIORITY_WEIGHTS.estimatedEffortPenaltyPerHour;

  return (
    urgency +
    exam +
    weakness +
    overdue +
    review +
    priorityBoost[input.priority] -
    effortPenalty
  );
}

function PRIORTY_URGENCY(hoursUntilDeadline: number): number {
  if (hoursUntilDeadline <= 0) return PRIORITY_WEIGHTS.urgencyWeight;
  if (hoursUntilDeadline <= 24) return PRIORITY_WEIGHTS.urgencyWeight * 0.9;
  if (hoursUntilDeadline <= 72) return PRIORITY_WEIGHTS.urgencyWeight * 0.6;
  if (hoursUntilDeadline <= 168) return PRIORITY_WEIGHTS.urgencyWeight * 0.35;
  return PRIORITY_WEIGHTS.urgencyWeight * 0.1;
}

export interface MasteryScoreInput {
  accuracy: number;
  reviewRetention: number;
  recentExamPerformance: number;
  completionRate: number;
  confidenceScore: number;
}

export function calculateMasteryScore(input: MasteryScoreInput): number {
  const score =
    input.accuracy * 0.4 +
    input.reviewRetention * 0.25 +
    input.recentExamPerformance * 0.2 +
    input.completionRate * 0.1 +
    input.confidenceScore * 0.05;
  return clamp(Math.round(score * 100), 0, 100);
}

export function canMarkMastered(params: {
  accuracy: number;
  reviewCount: number;
  hasRecentCriticalError: boolean;
  stableSessions: number;
}): boolean {
  return (
    params.accuracy >= 0.8 &&
    params.reviewCount >= 2 &&
    !params.hasRecentCriticalError &&
    params.stableSessions >= 3
  );
}

export interface ReadinessScoreInput {
  recentExamScore: number;
  masteryAverage: number;
  reviewRetention: number;
  planCompletion: number;
  scoreStability: number;
  timePrepared: number;
}

export function calculateReadinessScore(input: ReadinessScoreInput): number {
  const score =
    input.recentExamScore * 0.35 +
    input.masteryAverage * 0.25 +
    input.reviewRetention * 0.15 +
    input.planCompletion * 0.1 +
    input.scoreStability * 0.1 +
    input.timePrepared * 0.05;
  return clamp(Math.round(score), 0, 100);
}

export function readinessLabel(score: number): string {
  if (score <= 39) return "Chưa sẵn sàng";
  if (score <= 59) return "Cần cải thiện nhiều";
  if (score <= 74) return "Đang tiến bộ";
  if (score <= 89) return "Khá sẵn sàng";
  return "Sẵn sàng cao";
}

export const DEFAULT_REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export type ReviewResultKey =
  | "forgot"
  | "partial"
  | "uncertain"
  | "good"
  | "mastered";

const RESULT_INTERVAL_FACTOR: Record<ReviewResultKey, number> = {
  forgot: 0.5,
  partial: 0.75,
  uncertain: 1,
  good: 1.25,
  mastered: 1.75,
};

export function nextReviewIntervalDays(
  reviewCount: number,
  result: ReviewResultKey,
  intervals: readonly number[] = DEFAULT_REVIEW_INTERVALS,
): number {
  const base =
    intervals[Math.min(reviewCount, intervals.length - 1)] ??
    intervals[intervals.length - 1]!;
  return Math.max(1, Math.round(base * RESULT_INTERVAL_FACTOR[result]));
}

export const TASK_STATUS_TRANSITIONS: Record<string, string[]> = {
  inbox: ["planned", "in_progress", "cancelled", "archived"],
  planned: ["in_progress", "completed", "skipped", "overdue", "cancelled"],
  in_progress: ["completed", "skipped", "planned", "cancelled"],
  overdue: ["planned", "in_progress", "completed", "cancelled", "archived"],
  completed: ["archived"],
  skipped: ["planned", "archived"],
  cancelled: ["archived", "inbox"],
  archived: [],
};

export function canTransitionTaskStatus(
  from: string,
  to: string,
): boolean {
  return TASK_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
