import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateAuthProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  clearDemoState,
  createId,
  createSeedState,
  ensureDemoState,
  loadDemoState,
  nowIso,
  saveDemoState,
  today,
  type DemoState,
} from "@/data/demo-store";
import type {
  ErrorLog,
  Program,
  ReviewItem,
  StudySession,
  StudyTask,
  Subject,
  Topic,
  UserProfile,
} from "@/types/domain";
import type { CreateTaskInput, OnboardingProfileInput } from "@/schemas/domain";
import { canTransitionTaskStatus, nextReviewIntervalDays } from "@/lib/scoring";
import { getFirebaseAuth, getFirestoreDb, isDemoMode } from "@/lib/firebase";
import { addDays } from "date-fns";

type Listener = () => void;
const listeners = new Set<Listener>();

let memoryState: DemoState | null = null;
let firebaseUid: string | null = null;
let firebaseWriteQueue = Promise.resolve();

function createEmptyState(): DemoState {
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
    syncStatus: "pending",
  };
}

function getState(): DemoState {
  if (!memoryState) {
    memoryState = isDemoMode ? ensureDemoState() : createEmptyState();
  }
  return memoryState;
}

function setState(next: DemoState) {
  memoryState = { ...next, syncStatus: "synced" };
  if (isDemoMode) {
    saveDemoState(memoryState);
  } else if (firebaseUid) {
    const uid = firebaseUid;
    const snapshot = JSON.parse(JSON.stringify(memoryState)) as DemoState;
    firebaseWriteQueue = firebaseWriteQueue
      .catch(() => undefined)
      .then(() => setDoc(doc(getFirestoreDb(), "users", uid), snapshot))
      .catch(() => {
        if (firebaseUid === uid && memoryState) {
          memoryState = { ...memoryState, syncStatus: "failed" };
          listeners.forEach((l) => l());
        }
      });
  }
  listeners.forEach((l) => l());
}

async function loadFirebaseState(user: User): Promise<DemoState> {
  const stateRef = doc(getFirestoreDb(), "users", user.uid);
  const snapshot = await getDoc(stateRef);
  if (snapshot.exists()) {
    return {
      ...(snapshot.data() as DemoState),
      syncStatus: "synced",
    };
  }

  const seeded = createSeedState(user.displayName || "Học sinh");
  const state: DemoState = {
    ...seeded,
    profile: seeded.profile
      ? {
          ...seeded.profile,
          uid: user.uid,
          email: user.email ?? "",
          photoURL: user.photoURL ?? undefined,
        }
      : null,
  };
  await setDoc(stateRef, JSON.parse(JSON.stringify(state)));
  return state;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function useDemoStore(): DemoState {
  return useSyncExternalStore(subscribe, getState, getState);
}

interface DataContextValue {
  state: DemoState;
  isAuthenticated: boolean;
  loginDemo: (name?: string) => void;
  loginFirebase: (
    email: string,
    password: string,
    displayName: string,
    register: boolean,
  ) => Promise<void>;
  logout: () => void;
  completeOnboarding: (
    profile: OnboardingProfileInput,
    exams: Array<Omit<Program, "id" | "createdAt" | "updatedAt" | "status">>,
    subjectNames: string[],
  ) => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  createSubject: (input: { name: string; colorToken?: string; programId?: string }) => Subject;
  updateSubject: (id: string, patch: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  createTopic: (input: { subjectId: string; name: string; description?: string }) => Topic;
  updateTopic: (id: string, patch: Partial<Topic>) => void;
  createTask: (input: CreateTaskInput) => StudyTask;
  updateTask: (id: string, patch: Partial<StudyTask>) => void;
  completeTask: (
    id: string,
    data: {
      progress: number;
      actualMinutes: number;
      focusRating?: 1 | 2 | 3 | 4 | 5;
      needsReview?: boolean;
      notes?: string;
    },
  ) => void;
  rescheduleTask: (id: string, scheduledDate: string) => void;
  startSession: (taskId?: string, mode?: StudySession["mode"]) => StudySession;
  pauseSession: (id: string) => void;
  resumeSession: (id: string) => void;
  endSession: (
    id: string,
    data: {
      focusMinutes: number;
      breakMinutes: number;
      pauseMinutes: number;
      focusRating?: 1 | 2 | 3 | 4 | 5;
      energyRating?: 1 | 2 | 3 | 4 | 5;
      notes?: string;
      completeTask?: boolean;
    },
  ) => void;
  createErrorLog: (input: Omit<ErrorLog, "id" | "createdAt" | "updatedAt" | "repeatCount" | "detectedAt">) => ErrorLog;
  createReviewItem: (input: Omit<ReviewItem, "id" | "createdAt" | "updatedAt" | "reviewCount">) => ReviewItem;
  completeReview: (id: string, result: ReviewItem["lastResult"]) => void;
  resetDemo: () => void;
  exportJson: () => string;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const state = useDemoStore();
  const [, bump] = useState(0);
  const refresh = useCallback(() => bump((n) => n + 1), []);

  useEffect(() => {
    if (isDemoMode) return;

    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        firebaseUid = null;
        memoryState = createEmptyState();
        listeners.forEach((listener) => listener());
        return;
      }

      firebaseUid = user.uid;
      try {
        memoryState = await loadFirebaseState(user);
      } catch {
        memoryState = { ...createEmptyState(), syncStatus: "failed" };
      }
      listeners.forEach((listener) => listener());
    });
  }, []);

  const loginDemo = useCallback((name = "Minh") => {
    const seeded = createSeedState(name);
    setState(seeded);
    refresh();
  }, [refresh]);

  const loginFirebase = useCallback(
    async (email: string, password: string, displayName: string, register: boolean) => {
      const auth = getFirebaseAuth();
      const credential = register
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      if (register && displayName.trim()) {
        await updateAuthProfile(credential.user, { displayName: displayName.trim() });
      }
    },
    [],
  );

  const logout = useCallback(() => {
    if (!isDemoMode) {
      void signOut(getFirebaseAuth());
      return;
    }
    clearDemoState();
    memoryState = {
      ...createSeedState(),
      profile: null,
    };
    saveDemoState(memoryState);
    listeners.forEach((l) => l());
    refresh();
  }, [refresh]);

  const completeOnboarding = useCallback(
    (
      profileInput: OnboardingProfileInput,
      exams: Array<Omit<Program, "id" | "createdAt" | "updatedAt" | "status">>,
      subjectNames: string[],
    ) => {
      const ts = nowIso();
      const colors = ["sage", "sky", "lavender", "peach", "rose", "mint", "butter", "coral"];
      const programs: Program[] = exams.map((e) => ({
        ...e,
        id: createId("prog"),
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      }));
      const subjects: Subject[] = subjectNames.map((name, index) => ({
        id: createId("sub"),
        name,
        shortName: name.slice(0, 12),
        colorToken: colors[index % colors.length],
        order: index,
        masteryScore: 0,
        isActive: true,
        programId: programs[0]?.id,
        createdAt: ts,
        updatedAt: ts,
      }));
      const profile: UserProfile = {
        uid: "demo-user",
        email: "ban@studyos.local",
        displayName: profileInput.displayName,
        timezone: profileInput.timezone,
        locale: profileInput.locale,
        onboardingCompleted: true,
        weeklyTargetHours: profileInput.weeklyTargetHours,
        dailyStudyWindowStart: profileInput.dailyStudyWindowStart,
        dailyStudyWindowEnd: profileInput.dailyStudyWindowEnd,
        defaultSessionMinutes: profileInput.defaultSessionMinutes,
        breakMinutes: profileInput.breakMinutes,
        restDays: [0],
        aiEnabled: false,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({
        ...getState(),
        profile,
        programs,
        subjects,
        topics: [],
        tasks: [],
        sessions: [],
        errorLogs: [],
        reviewItems: [],
        exams: [],
        examAttempts: [],
        dailyStats: [],
      });
      refresh();
    },
    [refresh],
  );

  const updateProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      const current = getState();
      if (!current.profile) return;
      setState({
        ...current,
        profile: { ...current.profile, ...patch, updatedAt: nowIso() },
      });
      refresh();
    },
    [refresh],
  );

  const createSubject = useCallback(
    (input: { name: string; colorToken?: string; programId?: string }) => {
      const ts = nowIso();
      const subject: Subject = {
        id: createId("sub"),
        name: input.name,
        shortName: input.name.slice(0, 12),
        colorToken: input.colorToken ?? "sage",
        programId: input.programId,
        order: getState().subjects.length,
        masteryScore: 0,
        isActive: true,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({ ...getState(), subjects: [...getState().subjects, subject] });
      refresh();
      return subject;
    },
    [refresh],
  );

  const updateSubject = useCallback(
    (subjectId: string, patch: Partial<Subject>) => {
      setState({
        ...getState(),
        subjects: getState().subjects.map((s) =>
          s.id === subjectId ? { ...s, ...patch, updatedAt: nowIso() } : s,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const deleteSubject = useCallback(
    (subjectId: string) => {
      setState({
        ...getState(),
        subjects: getState().subjects.map((s) =>
          s.id === subjectId ? { ...s, isActive: false, updatedAt: nowIso() } : s,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const createTopic = useCallback(
    (input: { subjectId: string; name: string; description?: string }) => {
      const ts = nowIso();
      const topic: Topic = {
        id: createId("top"),
        subjectId: input.subjectId,
        name: input.name,
        description: input.description,
        order: getState().topics.filter((t) => t.subjectId === input.subjectId).length,
        status: "not_started",
        masteryScore: 0,
        totalQuestions: 0,
        correctQuestions: 0,
        totalStudyMinutes: 0,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({ ...getState(), topics: [...getState().topics, topic] });
      refresh();
      return topic;
    },
    [refresh],
  );

  const updateTopic = useCallback(
    (topicId: string, patch: Partial<Topic>) => {
      setState({
        ...getState(),
        topics: getState().topics.map((t) =>
          t.id === topicId ? { ...t, ...patch, updatedAt: nowIso() } : t,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const createTask = useCallback(
    (input: CreateTaskInput) => {
      const ts = nowIso();
      const task: StudyTask = {
        id: createId("task"),
        title: input.title,
        description: input.description,
        subjectId: input.subjectId,
        topicId: input.topicId,
        type: input.type ?? "custom",
        status: input.scheduledDate ? "planned" : "inbox",
        priority: input.priority ?? "medium",
        scheduledDate: input.scheduledDate,
        scheduledStartAt: input.scheduledStartAt,
        deadlineAt: input.deadlineAt,
        estimatedMinutes: input.estimatedMinutes ?? 45,
        actualMinutes: 0,
        progress: 0,
        source: "manual",
        needsReview: false,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({ ...getState(), tasks: [task, ...getState().tasks] });
      refresh();
      return task;
    },
    [refresh],
  );

  const updateTask = useCallback(
    (taskId: string, patch: Partial<StudyTask>) => {
      if (patch.status) {
        const current = getState().tasks.find((t) => t.id === taskId);
        if (current && !canTransitionTaskStatus(current.status, patch.status)) {
          throw new Error(`Không thể chuyển trạng thái từ ${current.status} sang ${patch.status}`);
        }
      }
      setState({
        ...getState(),
        tasks: getState().tasks.map((t) =>
          t.id === taskId ? { ...t, ...patch, updatedAt: nowIso() } : t,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const completeTask = useCallback(
    (
      taskId: string,
      data: {
        progress: number;
        actualMinutes: number;
        focusRating?: 1 | 2 | 3 | 4 | 5;
        needsReview?: boolean;
        notes?: string;
      },
    ) => {
      const current = getState();
      const date = today();
      const tasks = current.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "completed" as const,
              progress: data.progress,
              actualMinutes: data.actualMinutes,
              needsReview: data.needsReview ?? false,
              notes: data.notes,
              completedAt: nowIso(),
              updatedAt: nowIso(),
            }
          : t,
      );

      let dailyStats = [...current.dailyStats];
      const existing = dailyStats.find((d) => d.date === date);
      if (existing) {
        dailyStats = dailyStats.map((d) =>
          d.date === date
            ? {
                ...d,
                completedTasks: d.completedTasks + 1,
                totalStudyMinutes: d.totalStudyMinutes + data.actualMinutes,
                averageFocus: data.focusRating ?? d.averageFocus,
              }
            : d,
        );
      } else {
        dailyStats.push({
          date,
          totalStudyMinutes: data.actualMinutes,
          totalTasks: 1,
          completedTasks: 1,
          sessionCount: 0,
          averageFocus: data.focusRating,
          minutesBySubject: {},
          questionsAttempted: 0,
          questionsCorrect: 0,
          reviewsCompleted: 0,
        });
      }

      let reviewItems = current.reviewItems;
      if (data.needsReview) {
        const task = current.tasks.find((t) => t.id === taskId);
        if (task) {
          reviewItems = [
            {
              id: createId("rev"),
              sourceType: "task",
              sourceId: task.id,
              subjectId: task.subjectId,
              topicId: task.topicId,
              title: `Ôn lại: ${task.title}`,
              dueAt: addDays(new Date(), 1).toISOString(),
              intervalDays: 1,
              reviewCount: 0,
              priority: task.priority,
              status: "pending",
              createdAt: nowIso(),
              updatedAt: nowIso(),
            },
            ...reviewItems,
          ];
        }
      }

      setState({ ...current, tasks, dailyStats, reviewItems });
      refresh();
    },
    [refresh],
  );

  const rescheduleTask = useCallback(
    (taskId: string, scheduledDate: string) => {
      setState({
        ...getState(),
        tasks: getState().tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                scheduledDate,
                status: "planned",
                updatedAt: nowIso(),
              }
            : t,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const startSession = useCallback(
    (taskId?: string, mode: StudySession["mode"] = "pomodoro") => {
      const ts = nowIso();
      const task = taskId ? getState().tasks.find((t) => t.id === taskId) : undefined;
      const session: StudySession = {
        id: createId("ses"),
        taskId,
        subjectId: task?.subjectId,
        topicId: task?.topicId,
        mode,
        status: "active",
        startedAt: ts,
        focusMinutes: 0,
        breakMinutes: 0,
        pauseMinutes: 0,
        createdAt: ts,
        updatedAt: ts,
      };
      if (taskId) {
        setState({
          ...getState(),
          sessions: [session, ...getState().sessions],
          tasks: getState().tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: "in_progress", updatedAt: ts }
              : t,
          ),
        });
      } else {
        setState({
          ...getState(),
          sessions: [session, ...getState().sessions],
        });
      }
      refresh();
      return session;
    },
    [refresh],
  );

  const pauseSession = useCallback(
    (sessionId: string) => {
      setState({
        ...getState(),
        sessions: getState().sessions.map((s) =>
          s.id === sessionId ? { ...s, status: "paused", updatedAt: nowIso() } : s,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const resumeSession = useCallback(
    (sessionId: string) => {
      setState({
        ...getState(),
        sessions: getState().sessions.map((s) =>
          s.id === sessionId ? { ...s, status: "active", updatedAt: nowIso() } : s,
        ),
      });
      refresh();
    },
    [refresh],
  );

  const endSession = useCallback(
    (
      sessionId: string,
      data: {
        focusMinutes: number;
        breakMinutes: number;
        pauseMinutes: number;
        focusRating?: 1 | 2 | 3 | 4 | 5;
        energyRating?: 1 | 2 | 3 | 4 | 5;
        notes?: string;
        completeTask?: boolean;
      },
    ) => {
      const current = getState();
      const session = current.sessions.find((s) => s.id === sessionId);
      const sessions = current.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: "completed" as const,
              endedAt: nowIso(),
              focusMinutes: data.focusMinutes,
              breakMinutes: data.breakMinutes,
              pauseMinutes: data.pauseMinutes,
              focusRating: data.focusRating,
              energyRating: data.energyRating,
              notes: data.notes,
              updatedAt: nowIso(),
            }
          : s,
      );

      let tasks = current.tasks;
      if (data.completeTask && session?.taskId) {
        tasks = tasks.map((t) =>
          t.id === session.taskId
            ? {
                ...t,
                status: "completed",
                actualMinutes: data.focusMinutes,
                progress: 100,
                completedAt: nowIso(),
                updatedAt: nowIso(),
              }
            : t,
        );
      }

      const date = today();
      let dailyStats = [...current.dailyStats];
      const existing = dailyStats.find((d) => d.date === date);
      if (existing) {
        dailyStats = dailyStats.map((d) =>
          d.date === date
            ? {
                ...d,
                sessionCount: d.sessionCount + 1,
                totalStudyMinutes: d.totalStudyMinutes + data.focusMinutes,
                averageFocus: data.focusRating ?? d.averageFocus,
              }
            : d,
        );
      } else {
        dailyStats.push({
          date,
          totalStudyMinutes: data.focusMinutes,
          totalTasks: 0,
          completedTasks: 0,
          sessionCount: 1,
          averageFocus: data.focusRating,
          minutesBySubject: {},
          questionsAttempted: 0,
          questionsCorrect: 0,
          reviewsCompleted: 0,
        });
      }

      setState({ ...current, sessions, tasks, dailyStats });
      refresh();
    },
    [refresh],
  );

  const createErrorLog = useCallback(
    (
      input: Omit<
        ErrorLog,
        "id" | "createdAt" | "updatedAt" | "repeatCount" | "detectedAt"
      >,
    ) => {
      const ts = nowIso();
      const entry: ErrorLog = {
        ...input,
        id: createId("err"),
        repeatCount: 1,
        detectedAt: ts,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({ ...getState(), errorLogs: [entry, ...getState().errorLogs] });
      refresh();
      return entry;
    },
    [refresh],
  );

  const createReviewItem = useCallback(
    (
      input: Omit<ReviewItem, "id" | "createdAt" | "updatedAt" | "reviewCount">,
    ) => {
      const ts = nowIso();
      const item: ReviewItem = {
        ...input,
        id: createId("rev"),
        reviewCount: 0,
        createdAt: ts,
        updatedAt: ts,
      };
      setState({
        ...getState(),
        reviewItems: [item, ...getState().reviewItems],
      });
      refresh();
      return item;
    },
    [refresh],
  );

  const completeReview = useCallback(
    (reviewId: string, result: ReviewItem["lastResult"]) => {
      const current = getState();
      const reviewItems = current.reviewItems.map((r) => {
        if (r.id !== reviewId) return r;
        const interval = nextReviewIntervalDays(
          r.reviewCount + 1,
          result ?? "good",
        );
        return {
          ...r,
          reviewCount: r.reviewCount + 1,
          lastResult: result,
          lastReviewedAt: nowIso(),
          intervalDays: interval,
          nextReviewAt: addDays(new Date(), interval).toISOString(),
          dueAt: addDays(new Date(), interval).toISOString(),
          status:
            result === "mastered"
              ? ("completed" as const)
              : ("pending" as const),
          updatedAt: nowIso(),
        };
      });
      const date = today();
      let dailyStats = [...current.dailyStats];
      const existing = dailyStats.find((d) => d.date === date);
      if (existing) {
        dailyStats = dailyStats.map((d) =>
          d.date === date
            ? { ...d, reviewsCompleted: d.reviewsCompleted + 1 }
            : d,
        );
      }
      setState({ ...current, reviewItems, dailyStats });
      refresh();
    },
    [refresh],
  );

  const resetDemo = useCallback(() => {
    const seeded = createSeedState(getState().profile?.displayName ?? "Minh");
    setState(seeded);
    refresh();
  }, [refresh]);

  const exportJson = useCallback(() => {
    return JSON.stringify(getState(), null, 2);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      state,
      isAuthenticated: Boolean(state.profile),
      loginDemo,
      loginFirebase,
      logout,
      completeOnboarding,
      updateProfile,
      createSubject,
      updateSubject,
      deleteSubject,
      createTopic,
      updateTopic,
      createTask,
      updateTask,
      completeTask,
      rescheduleTask,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      createErrorLog,
      createReviewItem,
      completeReview,
      resetDemo,
      exportJson,
    }),
    [
      state,
      loginDemo,
      loginFirebase,
      logout,
      completeOnboarding,
      updateProfile,
      createSubject,
      updateSubject,
      deleteSubject,
      createTopic,
      updateTopic,
      createTask,
      updateTask,
      completeTask,
      rescheduleTask,
      startSession,
      pauseSession,
      resumeSession,
      endSession,
      createErrorLog,
      createReviewItem,
      completeReview,
      resetDemo,
      exportJson,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

// Ensure seed exists on first import in browser
if (typeof window !== "undefined" && !loadDemoState()) {
  // leave empty until login — no auto seed without profile
}
