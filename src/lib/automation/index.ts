/**
 * Phase 4 automation engines — pure functions, no I/O.
 * DataProvider / UI apply results after user context is available.
 */

import { addDays, format, parseISO, startOfWeek } from "date-fns";
import type {
  ErrorLog,
  ReviewItem,
  StudyPreferences,
  StudyTask,
  Subject,
  Topic,
  UserProfile,
} from "@/types/domain";
import { canTransitionTaskStatus } from "@/lib/scoring";

const TERMINAL: StudyTask["status"][] = [
  "completed",
  "cancelled",
  "archived",
  "skipped",
];

function todayKey(now = new Date()): string {
  return format(now, "yyyy-MM-dd");
}

function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** Tasks past deadline or scheduled date that should become overdue. */
export function findOverdueTasks(
  tasks: StudyTask[],
  now = new Date(),
): StudyTask[] {
  const today = todayKey(now);
  return tasks.filter((t) => {
    if (TERMINAL.includes(t.status) || t.status === "overdue") return false;
    if (t.status === "in_progress") return false;
    const deadlineDay = t.deadlineAt
      ? format(parseISO(t.deadlineAt), "yyyy-MM-dd")
      : undefined;
    if (deadlineDay && deadlineDay < today) return true;
    if (t.scheduledDate && t.scheduledDate < today) return true;
    return false;
  });
}

/** Return a new tasks array with overdue statuses applied. */
export function applyAutoOverdue(
  tasks: StudyTask[],
  now = new Date(),
): { tasks: StudyTask[]; changedIds: string[] } {
  const overdue = new Set(findOverdueTasks(tasks, now).map((t) => t.id));
  if (overdue.size === 0) return { tasks, changedIds: [] };
  const changedIds: string[] = [];
  const next = tasks.map((t) => {
    if (!overdue.has(t.id)) return t;
    if (!canTransitionTaskStatus(t.status, "overdue")) return t;
    changedIds.push(t.id);
    return { ...t, status: "overdue" as const, updatedAt: now.toISOString() };
  });
  return { tasks: next, changedIds };
}

export interface RescheduleMove {
  taskId: string;
  title: string;
  fromDate: string;
  toDate: string;
  estimatedMinutes: number;
  reason: string;
}

export interface SmartRescheduleResult {
  overloadedDates: string[];
  moves: RescheduleMove[];
  maxMinutesPerDay: number;
}

/**
 * Suggest moving lowest-priority flexible tasks off overloaded days
 * onto lighter weekdays (respecting rest days).
 */
export function planSmartReschedule(input: {
  tasks: StudyTask[];
  weekStart: Date | string;
  maxMinutesPerDay: number;
  restDays?: number[];
}): SmartRescheduleResult {
  const weekStart =
    typeof input.weekStart === "string"
      ? parseISO(input.weekStart)
      : startOfWeek(input.weekStart, { weekStartsOn: 1 });
  const rest = new Set(input.restDays ?? [0]);
  const max = Math.max(30, input.maxMinutesPerDay);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dayKeys = days.map(dateKey);

  const active = input.tasks.filter(
    (t) =>
      t.scheduledDate &&
      dayKeys.includes(t.scheduledDate) &&
      !TERMINAL.includes(t.status),
  );

  const byDay = new Map<string, StudyTask[]>();
  for (const key of dayKeys) byDay.set(key, []);
  for (const t of active) {
    byDay.get(t.scheduledDate!)!.push(t);
  }

  const minutes = (list: StudyTask[]) =>
    list.reduce((s, t) => s + t.estimatedMinutes, 0);

  const overloadedDates = dayKeys.filter((k) => minutes(byDay.get(k)!) > max);
  const moves: RescheduleMove[] = [];
  const plannedLoad = new Map(
    dayKeys.map((k) => [k, minutes(byDay.get(k)!)] as const),
  );

  // Prefer moving lower-priority, longer tasks first from overloaded days.
  const priorityRank: Record<string, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  };

  for (const fromDate of overloadedDates) {
    const list = [...(byDay.get(fromDate) ?? [])].sort((a, b) => {
      const pr = priorityRank[a.priority] - priorityRank[b.priority];
      if (pr !== 0) return pr;
      return b.estimatedMinutes - a.estimatedMinutes;
    });

    for (const task of list) {
      if ((plannedLoad.get(fromDate) ?? 0) <= max) break;
      // Don't move critical / already overdue away automatically as first choice
      // unless still overloaded — skip critical.
      if (task.priority === "critical") continue;

      let best: { date: string; load: number } | null = null;
      for (const day of days) {
        const key = dateKey(day);
        if (key === fromDate) continue;
        if (rest.has(day.getDay())) continue;
        const load = plannedLoad.get(key) ?? 0;
        if (load + task.estimatedMinutes > max) continue;
        if (!best || load < best.load) best = { date: key, load };
      }
      if (!best) continue;

      moves.push({
        taskId: task.id,
        title: task.title,
        fromDate,
        toDate: best.date,
        estimatedMinutes: task.estimatedMinutes,
        reason: `Ngày ${fromDate} quá tải (>${max}p) → chuyển sang ${best.date}`,
      });
      plannedLoad.set(
        fromDate,
        (plannedLoad.get(fromDate) ?? 0) - task.estimatedMinutes,
      );
      plannedLoad.set(
        best.date,
        (plannedLoad.get(best.date) ?? 0) + task.estimatedMinutes,
      );
      // Remove from local day list so we don't move twice
      byDay.set(
        fromDate,
        (byDay.get(fromDate) ?? []).filter((t) => t.id !== task.id),
      );
      byDay.set(best.date, [...(byDay.get(best.date) ?? []), task]);
    }
  }

  return { overloadedDates, moves, maxMinutesPerDay: max };
}

export function applyRescheduleMoves(
  tasks: StudyTask[],
  moves: RescheduleMove[],
  now = new Date(),
): StudyTask[] {
  if (moves.length === 0) return tasks;
  const map = new Map(moves.map((m) => [m.taskId, m.toDate]));
  return tasks.map((t) => {
    const to = map.get(t.id);
    if (!to) return t;
    return {
      ...t,
      scheduledDate: to,
      status: t.status === "overdue" || t.status === "inbox" ? "planned" : t.status,
      updatedAt: now.toISOString(),
    };
  });
}

export type ReminderKind =
  | "study_window"
  | "task_due"
  | "review_due"
  | "overdue"
  | "overload";

export interface StudyReminder {
  id: string;
  kind: ReminderKind;
  title: string;
  body: string;
  href?: string;
}

function parseHm(hm: string, base: Date): Date {
  const [h, m] = hm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h ?? 0, m ?? 0, 0, 0);
  return d;
}

/** Build in-app reminders for Today / notification tray. */
export function buildStudyReminders(input: {
  profile: UserProfile | null;
  tasks: StudyTask[];
  reviewItems: ReviewItem[];
  maxMinutesPerDay?: number;
  now?: Date;
}): StudyReminder[] {
  const now = input.now ?? new Date();
  const reminders: StudyReminder[] = [];
  if (!input.profile?.notificationsEnabled) return reminders;

  const today = todayKey(now);
  const windowStart = input.profile.dailyStudyWindowStart ?? "19:00";
  const windowEnd = input.profile.dailyStudyWindowEnd ?? "22:00";
  const start = parseHm(windowStart, now);
  const end = parseHm(windowEnd, now);
  const inWindow = now >= start && now <= end;
  const nearStart =
    now < start && start.getTime() - now.getTime() <= 30 * 60_000;

  const todayTasks = input.tasks.filter(
    (t) =>
      t.scheduledDate === today &&
      !TERMINAL.includes(t.status) &&
      t.status !== "overdue",
  );
  const overdue = input.tasks.filter((t) => t.status === "overdue");
  const dueReviews = input.reviewItems.filter(
    (r) => r.status === "pending" && new Date(r.dueAt) <= now,
  );

  if ((inWindow || nearStart) && todayTasks.length > 0) {
    reminders.push({
      id: `study_window_${today}`,
      kind: "study_window",
      title: inWindow ? "Đến giờ học" : "Sắp đến khung giờ học",
      body: `${windowStart}–${windowEnd}: ${todayTasks.length} task · ${todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0)} phút`,
      href: "/today",
    });
  }

  if (todayTasks.length > 0) {
    reminders.push({
      id: `task_due_${today}`,
      kind: "task_due",
      title: "Task hôm nay",
      body: todayTasks
        .slice(0, 3)
        .map((t) => t.title)
        .join(" · "),
      href: "/today",
    });
  }

  if (dueReviews.length > 0) {
    reminders.push({
      id: `review_due_${today}`,
      kind: "review_due",
      title: "Review đến hạn",
      body: `${dueReviews.length} mục cần ôn`,
      href: "/review",
    });
  }

  if (overdue.length > 0) {
    reminders.push({
      id: `overdue_${today}`,
      kind: "overdue",
      title: "Task quá hạn",
      body: `${overdue.length} task cần xử lý`,
      href: "/today",
    });
  }

  const max = input.maxMinutesPerDay ?? 240;
  const load = todayTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  if (load > max) {
    reminders.push({
      id: `overload_${today}`,
      kind: "overload",
      title: "Hôm nay quá tải",
      body: `${load} phút kế hoạch (ngưỡng ${max}p) — cân nhắc dời lịch`,
      href: "/planner",
    });
  }

  return reminders;
}

export type ReviewDraft = Omit<
  ReviewItem,
  "id" | "createdAt" | "updatedAt" | "reviewCount"
>;

/** Create review drafts from error logs not yet linked to a pending review. */
export function buildAutoReviewsFromErrors(
  errorLogs: ErrorLog[],
  reviewItems: ReviewItem[],
  prefs: StudyPreferences,
  now = new Date(),
): ReviewDraft[] {
  if (!prefs.autoReviewFromErrors) return [];
  const linked = new Set(
    reviewItems
      .filter((r) => r.sourceType === "error" && r.sourceId)
      .map((r) => r.sourceId!),
  );
  const pendingCap = Math.max(
    0,
    prefs.maxReviewsPerDay -
      reviewItems.filter(
        (r) =>
          r.status === "pending" &&
          format(parseISO(r.dueAt), "yyyy-MM-dd") <= todayKey(now),
      ).length,
  );

  const drafts: ReviewDraft[] = [];
  for (const err of errorLogs) {
    if (drafts.length >= pendingCap) break;
    if (err.status === "resolved" || err.status === "archived") continue;
    if (linked.has(err.id)) continue;
    drafts.push({
      sourceType: "error",
      sourceId: err.id,
      subjectId: err.subjectId,
      topicId: err.topicId,
      title: `Ôn lỗi: ${err.title}`,
      content: err.solution,
      dueAt: addDays(now, 1).toISOString(),
      intervalDays: prefs.reviewIntervals[0] ?? 1,
      priority:
        err.severity === "critical" || err.severity === "high"
          ? "high"
          : "medium",
      status: "pending",
    });
  }
  return drafts;
}

const WEAK_MASTERY = 50;

/** Create review drafts for weak / needs_review topics. */
export function buildAutoReviewsFromWeakTopics(
  topics: Topic[],
  subjects: Subject[],
  reviewItems: ReviewItem[],
  prefs: StudyPreferences,
  now = new Date(),
): ReviewDraft[] {
  if (!prefs.autoReviewFromWeakTopics) return [];
  const linked = new Set(
    reviewItems
      .filter((r) => r.sourceType === "topic" && r.sourceId)
      .map((r) => r.sourceId!),
  );
  const pendingToday = reviewItems.filter(
    (r) =>
      r.status === "pending" &&
      format(parseISO(r.dueAt), "yyyy-MM-dd") <= todayKey(now),
  ).length;
  let remaining = Math.max(0, prefs.maxReviewsPerDay - pendingToday);

  const weak = topics
    .filter(
      (t) =>
        t.status !== "archived" &&
        t.status !== "mastered" &&
        (t.status === "needs_review" || t.masteryScore < WEAK_MASTERY) &&
        !linked.has(t.id),
    )
    .sort((a, b) => a.masteryScore - b.masteryScore);

  const drafts: ReviewDraft[] = [];
  for (const topic of weak) {
    if (remaining <= 0) break;
    const subject = subjects.find((s) => s.id === topic.subjectId);
    drafts.push({
      sourceType: "topic",
      sourceId: topic.id,
      subjectId: topic.subjectId,
      topicId: topic.id,
      title: `Ôn chủ đề yếu: ${topic.name}`,
      content: subject ? `Môn ${subject.name}` : undefined,
      dueAt: (topic.nextReviewAt
        ? parseISO(topic.nextReviewAt)
        : addDays(now, 1)
      ).toISOString(),
      intervalDays: prefs.reviewIntervals[0] ?? 1,
      priority: topic.masteryScore < 30 ? "high" : "medium",
      status: "pending",
    });
    remaining -= 1;
  }
  return drafts;
}

export interface AutomationPassResult {
  tasks: StudyTask[];
  overdueIds: string[];
  reviewDrafts: ReviewDraft[];
  reminders: StudyReminder[];
}

/** One client-side automation tick (overdue + auto-review drafts + reminders). */
export function runAutomationPass(input: {
  profile: UserProfile | null;
  preferences: StudyPreferences;
  tasks: StudyTask[];
  topics: Topic[];
  subjects: Subject[];
  errorLogs: ErrorLog[];
  reviewItems: ReviewItem[];
  now?: Date;
}): AutomationPassResult {
  const now = input.now ?? new Date();
  const { tasks, changedIds } = applyAutoOverdue(input.tasks, now);
  const fromErrors = buildAutoReviewsFromErrors(
    input.errorLogs,
    input.reviewItems,
    input.preferences,
    now,
  );
  const withErrorDrafts = [
    ...input.reviewItems,
    ...fromErrors.map((d, i) => ({
      ...d,
      id: `draft_err_${i}`,
      reviewCount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    })),
  ];
  const fromTopics = buildAutoReviewsFromWeakTopics(
    input.topics,
    input.subjects,
    withErrorDrafts,
    input.preferences,
    now,
  );
  const reminders = buildStudyReminders({
    profile: input.profile,
    tasks,
    reviewItems: input.reviewItems,
    maxMinutesPerDay: Math.round(input.preferences.maxHoursPerDay * 60),
    now,
  });
  return {
    tasks,
    overdueIds: changedIds,
    reviewDrafts: [...fromErrors, ...fromTopics],
    reminders,
  };
}
