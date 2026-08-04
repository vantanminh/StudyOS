/** Core domain types for StudyOS / Study Dashboard */

export type ProgramType = "grade_12" | "ielts" | "custom";
export type Priority = "low" | "medium" | "high" | "critical";
export type ProgramStatus = "active" | "completed" | "paused" | "archived";

export type TopicStatus =
  | "not_started"
  | "learning"
  | "practicing"
  | "needs_review"
  | "mastered"
  | "archived";

export type TaskType =
  | "learn_theory"
  | "practice"
  | "review"
  | "mock_exam"
  | "correct_mistakes"
  | "writing"
  | "speaking"
  | "listening"
  | "reading"
  | "memorization"
  | "custom";

export type TaskStatus =
  | "inbox"
  | "planned"
  | "in_progress"
  | "completed"
  | "skipped"
  | "overdue"
  | "cancelled"
  | "archived";

export type TaskSource = "manual" | "ai" | "system";

export type SessionMode = "stopwatch" | "countdown" | "pomodoro";
export type SessionStatus = "active" | "paused" | "completed" | "abandoned";

export type ErrorType =
  | "knowledge_gap"
  | "misread_question"
  | "calculation_error"
  | "careless_mistake"
  | "time_management"
  | "grammar"
  | "vocabulary"
  | "pronunciation"
  | "listening_miss"
  | "strategy_error"
  | "other";

export type ErrorStatus =
  | "new"
  | "reviewing"
  | "improving"
  | "resolved"
  | "repeated"
  | "archived";

export type ReviewSourceType =
  | "error"
  | "topic"
  | "task"
  | "exam"
  | "manual"
  | "ai";

export type ReviewResult =
  | "forgot"
  | "partial"
  | "uncertain"
  | "good"
  | "mastered";

export type ReviewStatus = "pending" | "completed" | "snoozed" | "archived";

export type GoalLevel = "long_term" | "monthly" | "weekly" | "daily";

export type ExamType =
  | "school_test"
  | "topic_test"
  | "mock_exam"
  | "national_exam_practice"
  | "ielts_full_test"
  | "ielts_skill_test"
  | "custom";

export type Severity = "low" | "medium" | "high" | "critical";

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  timezone: string;
  locale: string;
  onboardingCompleted: boolean;
  weeklyTargetHours: number;
  dailyStudyWindowStart?: string;
  dailyStudyWindowEnd?: string;
  defaultSessionMinutes: number;
  breakMinutes: number;
  restDays: number[];
  aiEnabled: boolean;
  /** In-app (and optional browser) study reminders. */
  notificationsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  type: ProgramType;
  targetDate?: string;
  targetScore?: number;
  targetBand?: number;
  priority: Priority;
  status: ProgramStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  programId?: string;
  name: string;
  shortName?: string;
  icon?: string;
  colorToken?: string;
  order: number;
  targetScore?: number;
  currentScore?: number;
  masteryScore: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  parentTopicId?: string;
  name: string;
  description?: string;
  order: number;
  status: TopicStatus;
  masteryScore: number;
  totalQuestions: number;
  correctQuestions: number;
  accuracy?: number;
  totalStudyMinutes: number;
  lastStudiedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  description?: string;
  programId?: string;
  subjectId?: string;
  topicId?: string;
  lessonId?: string;
  type: TaskType;
  status: TaskStatus;
  priority: Priority;
  difficulty?: Rating;
  scheduledDate?: string;
  scheduledStartAt?: string;
  scheduledEndAt?: string;
  deadlineAt?: string;
  estimatedMinutes: number;
  actualMinutes: number;
  progress: number;
  targetValue?: number;
  actualValue?: number;
  targetUnit?: string;
  source: TaskSource;
  needsReview: boolean;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  taskId?: string;
  subjectId?: string;
  topicId?: string;
  mode: SessionMode;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  focusMinutes: number;
  breakMinutes: number;
  pauseMinutes: number;
  focusRating?: Rating;
  energyRating?: Rating;
  difficultyRating?: Rating;
  notes?: string;
  resultSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorLog {
  id: string;
  subjectId?: string;
  topicId?: string;
  examAttemptId?: string;
  taskId?: string;
  title: string;
  description?: string;
  type: ErrorType;
  severity: Severity;
  status: ErrorStatus;
  question?: string;
  userAnswer?: string;
  correctAnswer?: string;
  rootCause?: string;
  solution?: string;
  repeatCount: number;
  detectedAt: string;
  lastRepeatedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItem {
  id: string;
  sourceType: ReviewSourceType;
  sourceId?: string;
  subjectId?: string;
  topicId?: string;
  title: string;
  content?: string;
  dueAt: string;
  intervalDays: number;
  reviewCount: number;
  lastResult?: ReviewResult;
  priority: Priority;
  status: ReviewStatus;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  name: string;
  type: ExamType;
  programId?: string;
  subjectId?: string;
  source?: string;
  timeLimitMinutes?: number;
  totalQuestions?: number;
  documentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  subjectId?: string;
  completedAt: string;
  actualMinutes: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  score?: number;
  bandScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  level: GoalLevel;
  programId?: string;
  subjectId?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadlineAt?: string;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface DailyStats {
  date: string;
  totalStudyMinutes: number;
  totalTasks: number;
  completedTasks: number;
  sessionCount: number;
  averageFocus?: number;
  minutesBySubject: Record<string, number>;
  questionsAttempted: number;
  questionsCorrect: number;
  reviewsCompleted: number;
}

export interface WeeklyStats {
  weekId: string;
  totalStudyMinutes: number;
  completedTasks: number;
  incompleteTasks: number;
  averageFocus?: number;
  reviewsCompleted: number;
  topWeakTopics: string[];
}

export interface StudyPreferences {
  weeklyTargetHours: number;
  maxHoursPerDay: number;
  maxTaskMinutes: number;
  minBreakMinutes: number;
  noScheduleAfter?: string;
  restDays: number[];
  pomodoroFocus: number;
  pomodoroShortBreak: number;
  pomodoroLongBreak: number;
  pomodoroSessionsBeforeLong: number;
  reviewIntervals: number[];
  maxReviewsPerDay: number;
  autoReviewFromErrors: boolean;
  autoReviewFromWeakTopics: boolean;
}

export interface AppDocument {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  provider: "r2" | "firebase";
  subjectId?: string;
  topicId?: string;
  createdAt: string;
  updatedAt: string;
}
