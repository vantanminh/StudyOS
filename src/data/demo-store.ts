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
import { format, startOfWeek, addDays, subDays } from "date-fns";

const STORAGE_KEY = "studyos-demo-v1";

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

export function createSeedState(displayName = "Học sinh"): DemoState {
  const ts = nowIso();
  const date = today();
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

  const programGrade: Program = {
    id: id("prog"),
    name: "Kỳ thi tốt nghiệp THPT",
    type: "grade_12",
    targetDate: format(addDays(new Date(), 120), "yyyy-MM-dd"),
    priority: "critical",
    status: "active",
    createdAt: ts,
    updatedAt: ts,
  };

  const programIelts: Program = {
    id: id("prog"),
    name: "IELTS",
    type: "ielts",
    targetDate: format(addDays(new Date(), 85), "yyyy-MM-dd"),
    targetBand: 6.5,
    priority: "high",
    status: "active",
    createdAt: ts,
    updatedAt: ts,
  };

  const subjects: Subject[] = [
    {
      id: id("sub"),
      programId: programGrade.id,
      name: "Toán",
      shortName: "Toán",
      icon: "calculator",
      colorToken: "sage",
      order: 0,
      targetScore: 8,
      currentScore: 6.5,
      masteryScore: 58,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programGrade.id,
      name: "Vật lý",
      shortName: "Lý",
      icon: "atom",
      colorToken: "sky",
      order: 1,
      targetScore: 8,
      currentScore: 6.2,
      masteryScore: 52,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programGrade.id,
      name: "Hóa học",
      shortName: "Hóa",
      icon: "flask",
      colorToken: "lavender",
      order: 2,
      masteryScore: 48,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programIelts.id,
      name: "IELTS Reading",
      shortName: "Reading",
      icon: "book",
      colorToken: "peach",
      order: 3,
      targetScore: 6.5,
      currentScore: 5.5,
      masteryScore: 55,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programIelts.id,
      name: "IELTS Writing",
      shortName: "Writing",
      icon: "pen",
      colorToken: "rose",
      order: 4,
      targetScore: 6.0,
      currentScore: 5.0,
      masteryScore: 42,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programIelts.id,
      name: "IELTS Listening",
      shortName: "Listening",
      icon: "headphones",
      colorToken: "mint",
      order: 5,
      masteryScore: 60,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("sub"),
      programId: programIelts.id,
      name: "IELTS Speaking",
      shortName: "Speaking",
      icon: "mic",
      colorToken: "butter",
      order: 6,
      masteryScore: 45,
      isActive: true,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const [toan, ly, , reading, writing] = subjects;

  const topics: Topic[] = [
    {
      id: id("top"),
      subjectId: ly!.id,
      name: "Dao động cơ",
      order: 0,
      status: "practicing",
      masteryScore: 62,
      totalQuestions: 80,
      correctQuestions: 52,
      accuracy: 0.65,
      totalStudyMinutes: 240,
      lastStudiedAt: ts,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("top"),
      subjectId: ly!.id,
      name: "Điện xoay chiều",
      order: 1,
      status: "learning",
      masteryScore: 38,
      totalQuestions: 40,
      correctQuestions: 18,
      accuracy: 0.45,
      totalStudyMinutes: 90,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("top"),
      subjectId: toan!.id,
      name: "Số phức",
      order: 0,
      status: "needs_review",
      masteryScore: 55,
      totalQuestions: 60,
      correctQuestions: 36,
      accuracy: 0.6,
      totalStudyMinutes: 150,
      nextReviewAt: ts,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("top"),
      subjectId: reading!.id,
      name: "True/False/Not Given",
      order: 0,
      status: "practicing",
      masteryScore: 50,
      totalQuestions: 100,
      correctQuestions: 58,
      accuracy: 0.58,
      totalStudyMinutes: 200,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("top"),
      subjectId: writing!.id,
      name: "Task 2 Opinion",
      order: 0,
      status: "learning",
      masteryScore: 40,
      totalQuestions: 8,
      correctQuestions: 0,
      totalStudyMinutes: 180,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const tasks: StudyTask[] = [
    {
      id: id("task"),
      title: "IELTS Reading — Cambridge 18 Test 2",
      subjectId: reading!.id,
      topicId: topics[3]!.id,
      type: "reading",
      status: "planned",
      priority: "high",
      scheduledDate: date,
      scheduledStartAt: `${date}T19:00:00`,
      scheduledEndAt: `${date}T20:00:00`,
      estimatedMinutes: 60,
      actualMinutes: 0,
      progress: 0,
      source: "manual",
      needsReview: false,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("task"),
      title: "Chữa bài Reading Test 2",
      subjectId: reading!.id,
      type: "correct_mistakes",
      status: "planned",
      priority: "high",
      scheduledDate: date,
      scheduledStartAt: `${date}T20:15:00`,
      scheduledEndAt: `${date}T21:00:00`,
      estimatedMinutes: 45,
      actualMinutes: 0,
      progress: 0,
      source: "system",
      needsReview: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("task"),
      title: "Vật lý — Điện xoay chiều",
      subjectId: ly!.id,
      topicId: topics[1]!.id,
      type: "learn_theory",
      status: "planned",
      priority: "medium",
      scheduledDate: date,
      scheduledStartAt: `${date}T21:10:00`,
      scheduledEndAt: `${date}T22:00:00`,
      estimatedMinutes: 50,
      actualMinutes: 0,
      progress: 0,
      source: "manual",
      needsReview: false,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("task"),
      title: "Ôn Số phức — 20 câu",
      subjectId: toan!.id,
      topicId: topics[2]!.id,
      type: "review",
      status: "overdue",
      priority: "critical",
      scheduledDate: yesterday,
      deadlineAt: `${yesterday}T22:00:00`,
      estimatedMinutes: 40,
      actualMinutes: 0,
      progress: 0,
      source: "system",
      needsReview: true,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("task"),
      title: "Writing Task 2 — Environment",
      subjectId: writing!.id,
      topicId: topics[4]!.id,
      type: "writing",
      status: "planned",
      priority: "medium",
      scheduledDate: tomorrow,
      estimatedMinutes: 60,
      actualMinutes: 0,
      progress: 0,
      source: "manual",
      needsReview: false,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("task"),
      title: "Luyện 30 câu Dao động cơ",
      subjectId: ly!.id,
      topicId: topics[0]!.id,
      type: "practice",
      status: "inbox",
      priority: "medium",
      estimatedMinutes: 45,
      actualMinutes: 0,
      progress: 0,
      source: "manual",
      needsReview: false,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const errorLogs: ErrorLog[] = [
    {
      id: id("err"),
      subjectId: reading!.id,
      topicId: topics[3]!.id,
      title: "Nhầm Not Given với False",
      type: "strategy_error",
      severity: "high",
      status: "new",
      rootCause: "Suy diễn ngoài bài đọc",
      solution: "Chỉ đánh False khi mâu thuẫn trực tiếp với bài",
      repeatCount: 2,
      detectedAt: ts,
      nextReviewAt: ts,
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("err"),
      subjectId: ly!.id,
      topicId: topics[1]!.id,
      title: "Quên công thức hiệu điện thế hiệu dụng",
      type: "knowledge_gap",
      severity: "medium",
      status: "reviewing",
      repeatCount: 1,
      detectedAt: yesterday,
      nextReviewAt: date,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const reviewItems: ReviewItem[] = [
    {
      id: id("rev"),
      sourceType: "error",
      sourceId: errorLogs[0]!.id,
      subjectId: reading!.id,
      topicId: topics[3]!.id,
      title: "Ôn TFNG — tránh suy diễn",
      dueAt: ts,
      intervalDays: 1,
      reviewCount: 0,
      priority: "high",
      status: "pending",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: id("rev"),
      sourceType: "topic",
      sourceId: topics[2]!.id,
      subjectId: toan!.id,
      topicId: topics[2]!.id,
      title: "Ôn Số phức — căn bậc hai",
      dueAt: ts,
      intervalDays: 3,
      reviewCount: 1,
      priority: "medium",
      status: "pending",
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  return {
    profile: {
      uid: "demo-user",
      email: "ban@studyos.local",
      displayName,
      timezone: "Asia/Ho_Chi_Minh",
      locale: "vi",
      onboardingCompleted: true,
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
    programs: [programGrade, programIelts],
    subjects,
    topics,
    tasks,
    sessions: [
      {
        id: id("ses"),
        taskId: tasks[0]!.id,
        subjectId: reading!.id,
        mode: "pomodoro",
        status: "completed",
        startedAt: `${yesterday}T19:00:00`,
        endedAt: `${yesterday}T19:50:00`,
        focusMinutes: 45,
        breakMinutes: 5,
        pauseMinutes: 0,
        focusRating: 4,
        createdAt: ts,
        updatedAt: ts,
      },
    ],
    errorLogs,
    reviewItems,
    exams: [],
    examAttempts: [],
    dailyStats: [
      {
        date: yesterday,
        totalStudyMinutes: 45,
        totalTasks: 3,
        completedTasks: 1,
        sessionCount: 1,
        averageFocus: 4,
        minutesBySubject: { [reading!.id]: 45 },
        questionsAttempted: 40,
        questionsCorrect: 24,
        reviewsCompleted: 0,
      },
      {
        date,
        totalStudyMinutes: 0,
        totalTasks: 3,
        completedTasks: 0,
        sessionCount: 0,
        minutesBySubject: {},
        questionsAttempted: 0,
        questionsCorrect: 0,
        reviewsCompleted: 0,
      },
    ],
    syncStatus: "synced",
  };
}

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

export function ensureDemoState(): DemoState {
  const existing = loadDemoState();
  if (existing) return existing;
  const seeded = createSeedState();
  saveDemoState(seeded);
  return seeded;
}

export function weekIdFor(date = new Date()): string {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return format(start, "yyyy-'W'II");
}

export { id as createId, nowIso, today };
