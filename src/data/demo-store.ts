import type {
  DailyStats,
  ErrorLog,
  Exam,
  ExamAttempt,
  Program,
  ReviewItem,
  StudySession,
  StudyTask,
  Subject,
  Topic,
  UserProfile,
} from "@/types/domain";
import { format, startOfWeek } from "date-fns";

/** Bumped so older localStorage seed data is not reused. */
const STORAGE_KEY = "studyos-demo-v2";

export interface DemoState {
  profile: UserProfile | null;
  programs: Program[];
  subjects: Subject[];
  topics: Topic[];
  tasks: StudyTask[];
  sessions: StudySession[];
  errorLogs: ErrorLog[];
  reviewItems: ReviewItem[];
  exams: Exam[];
  examAttempts: ExamAttempt[];
  dailyStats: DailyStats[];
  syncStatus: "synced" | "pending" | "failed";
}

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function today() {
  return format(new Date(), "yyyy-MM-dd");
}

/** Empty workspace — user adds all data themselves. */
export function createEmptyState(): DemoState {
  return {
    profile: null,
    programs: [],
    subjects: [],
    topics: [],
    tasks: [],
    sessions: [],
    errorLogs: [],
    reviewItems: [],
    exams: [],
    examAttempts: [],
    dailyStats: [],
    syncStatus: "synced",
  };
}

/**
 * Fresh account shell: only a profile (onboarding incomplete), no sample content.
 */
export function createInitialState(
  displayName = "Học sinh",
  options?: { uid?: string; email?: string; photoURL?: string },
): DemoState {
  const ts = nowIso();
  return {
    ...createEmptyState(),
    profile: {
      uid: options?.uid ?? "demo-user",
      email: options?.email ?? "ban@studyos.local",
      displayName,
      photoURL: options?.photoURL,
      timezone: "Asia/Ho_Chi_Minh",
      locale: "vi",
      onboardingCompleted: false,
      weeklyTargetHours: 20,
      dailyStudyWindowStart: "19:00",
      dailyStudyWindowEnd: "22:00",
      defaultSessionMinutes: 45,
      breakMinutes: 10,
      restDays: [0],
      aiEnabled: false,
      createdAt: ts,
      updatedAt: ts,
    },
  };
}

/** @deprecated Use createInitialState — kept as alias for call-site clarity. */
export const createSeedState = createInitialState;

export function loadDemoState(): DemoState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoState;
  } catch {
    return null;
  }
}

export function saveDemoState(state: DemoState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearDemoState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Load persisted state or empty shell (no auto-filled sample data). */
export function ensureDemoState(): DemoState {
  const existing = loadDemoState();
  if (existing) return existing;
  return createEmptyState();
}

export function weekIdFor(date = new Date()): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return format(start, "yyyy-'W'II");
}

export { id as createId, nowIso, today };
