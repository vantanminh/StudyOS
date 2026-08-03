import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high", "critical"]);
export const ratingSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const programSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  type: z.enum(["grade_12", "ielts", "custom"]),
  targetDate: z.string().optional(),
  targetScore: z.number().min(0).max(10).optional(),
  targetBand: z.number().min(0).max(9).optional(),
  priority: prioritySchema,
  status: z.enum(["active", "completed", "paused", "archived"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const subjectSchema = z.object({
  id: z.string().min(1),
  programId: z.string().optional(),
  name: z.string().min(1).max(80),
  shortName: z.string().max(20).optional(),
  icon: z.string().optional(),
  colorToken: z.string().optional(),
  order: z.number().int().min(0),
  targetScore: z.number().optional(),
  currentScore: z.number().optional(),
  masteryScore: z.number().min(0).max(100),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const topicSchema = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1),
  parentTopicId: z.string().optional(),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  order: z.number().int().min(0),
  status: z.enum([
    "not_started",
    "learning",
    "practicing",
    "needs_review",
    "mastered",
    "archived",
  ]),
  masteryScore: z.number().min(0).max(100),
  totalQuestions: z.number().int().min(0),
  correctQuestions: z.number().int().min(0),
  accuracy: z.number().min(0).max(1).optional(),
  totalStudyMinutes: z.number().min(0),
  lastStudiedAt: z.string().optional(),
  nextReviewAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskTypeSchema = z.enum([
  "learn_theory",
  "practice",
  "review",
  "mock_exam",
  "correct_mistakes",
  "writing",
  "speaking",
  "listening",
  "reading",
  "memorization",
  "custom",
]);

export const taskStatusSchema = z.enum([
  "inbox",
  "planned",
  "in_progress",
  "completed",
  "skipped",
  "overdue",
  "cancelled",
  "archived",
]);

export const studyTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  programId: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  lessonId: z.string().optional(),
  type: taskTypeSchema,
  status: taskStatusSchema,
  priority: prioritySchema,
  difficulty: ratingSchema.optional(),
  scheduledDate: z.string().optional(),
  scheduledStartAt: z.string().optional(),
  scheduledEndAt: z.string().optional(),
  deadlineAt: z.string().optional(),
  estimatedMinutes: z.number().int().min(1).max(480),
  actualMinutes: z.number().min(0),
  progress: z.number().min(0).max(100),
  targetValue: z.number().optional(),
  actualValue: z.number().optional(),
  targetUnit: z.string().optional(),
  source: z.enum(["manual", "ai", "system"]),
  needsReview: z.boolean(),
  notes: z.string().max(4000).optional(),
  completedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTaskInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  type: taskTypeSchema,
  priority: prioritySchema,
  scheduledDate: z.string().optional(),
  scheduledStartAt: z.string().optional(),
  estimatedMinutes: z.number().int().min(1).max(480),
  deadlineAt: z.string().optional(),
});

export const onboardingProfileSchema = z.object({
  displayName: z.string().min(1).max(80),
  timezone: z.string().default("Asia/Ho_Chi_Minh"),
  locale: z.string().default("vi"),
  weeklyTargetHours: z.number().min(1).max(80).default(20),
  dailyStudyWindowStart: z.string().default("19:00"),
  dailyStudyWindowEnd: z.string().default("22:00"),
  defaultSessionMinutes: z.number().int().min(15).max(180).default(45),
  breakMinutes: z.number().int().min(0).max(60).default(10),
});

export const onboardingExamSchema = z.object({
  name: z.string().min(1).max(120),
  type: z.enum(["grade_12", "ielts", "custom"]),
  targetDate: z.string().optional(),
  targetScore: z.number().optional(),
  targetBand: z.number().optional(),
  priority: prioritySchema.default("high"),
});

export const taskCompletionSchema = z.object({
  progress: z.number().min(0).max(100),
  actualMinutes: z.number().min(0).max(600),
  resultSummary: z.string().max(2000).optional(),
  focusRating: ratingSchema.optional(),
  difficultyRating: ratingSchema.optional(),
  needsReview: z.boolean().default(false),
  unclearParts: z.string().max(2000).optional(),
});

export const studySessionSchema = z.object({
  id: z.string(),
  taskId: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  mode: z.enum(["stopwatch", "countdown", "pomodoro"]),
  status: z.enum(["active", "paused", "completed", "abandoned"]),
  startedAt: z.string(),
  endedAt: z.string().optional(),
  focusMinutes: z.number().min(0),
  breakMinutes: z.number().min(0),
  pauseMinutes: z.number().min(0),
  focusRating: ratingSchema.optional(),
  energyRating: ratingSchema.optional(),
  difficultyRating: ratingSchema.optional(),
  notes: z.string().max(4000).optional(),
  resultSummary: z.string().max(4000).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const errorLogSchema = z.object({
  id: z.string(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  examAttemptId: z.string().optional(),
  taskId: z.string().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  type: z.enum([
    "knowledge_gap",
    "misread_question",
    "calculation_error",
    "careless_mistake",
    "time_management",
    "grammar",
    "vocabulary",
    "pronunciation",
    "listening_miss",
    "strategy_error",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum([
    "new",
    "reviewing",
    "improving",
    "resolved",
    "repeated",
    "archived",
  ]),
  question: z.string().optional(),
  userAnswer: z.string().optional(),
  correctAnswer: z.string().optional(),
  rootCause: z.string().optional(),
  solution: z.string().optional(),
  repeatCount: z.number().int().min(0),
  detectedAt: z.string(),
  lastRepeatedAt: z.string().optional(),
  nextReviewAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reviewItemSchema = z.object({
  id: z.string(),
  sourceType: z.enum(["error", "topic", "task", "exam", "manual", "ai"]),
  sourceId: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  title: z.string().min(1).max(200),
  content: z.string().max(4000).optional(),
  dueAt: z.string(),
  intervalDays: z.number().int().min(1),
  reviewCount: z.number().int().min(0),
  lastResult: z
    .enum(["forgot", "partial", "uncertain", "good", "mastered"])
    .optional(),
  priority: prioritySchema,
  status: z.enum(["pending", "completed", "snoozed", "archived"]),
  lastReviewedAt: z.string().optional(),
  nextReviewAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;
export type TaskCompletionInput = z.infer<typeof taskCompletionSchema>;
