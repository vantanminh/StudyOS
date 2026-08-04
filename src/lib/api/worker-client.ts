/**
 * Client for StudyOS Cloudflare Worker APIs (R2 + AI).
 * Auth: Firebase ID token (free Auth) — never send service keys from the browser.
 */

import { getFirebaseAuth, isDemoMode } from "@/lib/firebase";

export function apiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!raw) return "";
  return raw.replace(/\/$/, "");
}

export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (isDemoMode) return null;
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

export async function authHeaders(
  extra?: HeadersInit,
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    ...(extra as Record<string, string> | undefined),
  };
  const token = await getIdToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export class WorkerApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function workerFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${apiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init.headers);
  if (!headers.has("Authorization")) {
    const token = await getIdToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...init, headers });
}

export async function workerJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await workerFetch(path, { ...init, headers });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `API ${res.status}`;
    throw new WorkerApiError(message, res.status, data);
  }
  return data as T;
}

export interface WeeklyPlanRequest {
  weekStart: string;
  targetHours: number;
  subjects?: string[];
  notes?: string;
}

export interface WeeklyPlanTaskPreview {
  title: string;
  estimatedMinutes: number;
  type?: string;
  subject?: string;
}

export interface WeeklyPlanResponse {
  preview: boolean;
  uid?: string;
  weekStart?: string;
  targetHours?: number;
  days?: Array<{
    date: string;
    tasks: WeeklyPlanTaskPreview[];
  }>;
  summary?: string;
  message?: string;
  model?: string;
  service_tier?: string;
  reasoning?: { effort?: string };
  usage?: Record<string, unknown> | null;
  cache?: { cached_tokens?: number; hit?: boolean };
}

export interface ParseTaskRequest {
  text: string;
  subjects?: string[];
  today?: string;
}

export interface ParsedTaskPreview {
  title: string;
  estimatedMinutes: number;
  type?: string;
  subject?: string | null;
  scheduledDate?: string | null;
  scheduledStartAt?: string | null;
  priority?: string;
  notes?: string | null;
}

export interface ParseTaskResponse {
  preview: boolean;
  uid?: string;
  task?: ParsedTaskPreview;
  message?: string;
  model?: string;
}

function demoHeuristicParse(
  text: string,
  subjects: string[],
  today: string,
): ParsedTaskPreview {
  const lower = text.toLowerCase();
  let type = "custom";
  if (lower.includes("reading") || lower.includes("đọc")) type = "reading";
  else if (lower.includes("writing") || lower.includes("viết")) type = "writing";
  else if (lower.includes("listening") || lower.includes("nghe")) type = "listening";
  else if (lower.includes("speaking") || lower.includes("nói")) type = "speaking";
  else if (lower.includes("ôn") || lower.includes("review")) type = "review";
  else if (lower.includes("luyện") || lower.includes("practice")) type = "practice";
  else if (lower.includes("học")) type = "learn_theory";

  const minutesMatch = text.match(/(\d+)\s*(phút|ph|min)/i);
  const estimatedMinutes = minutesMatch
    ? Math.min(180, Math.max(15, Number(minutesMatch[1])))
    : 45;

  let scheduledDate: string | null = today;
  const base = new Date(`${today}T12:00:00`);
  if (/mai|tomorrow/.test(lower)) {
    base.setDate(base.getDate() + 1);
    scheduledDate = base.toISOString().slice(0, 10);
  } else if (/hôm nay|today/.test(lower)) {
    scheduledDate = today;
  }

  let scheduledStartAt: string | null = null;
  const timeMatch = text.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/);
  if (timeMatch && scheduledDate) {
    const h = Number(timeMatch[1]);
    const m = Number(timeMatch[2] ?? 0);
    if (h >= 0 && h <= 23) {
      scheduledStartAt = `${scheduledDate}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    }
  }

  const subject = subjects.find((s) => lower.includes(s.toLowerCase())) ?? null;

  return {
    title: text.slice(0, 120).trim() || "Task mới",
    estimatedMinutes,
    type,
    subject,
    scheduledDate,
    scheduledStartAt,
    priority: /gấp|khẩn|urgent/.test(lower) ? "high" : "medium",
    notes: null,
  };
}

function demoWeeklyPlan(input: WeeklyPlanRequest): WeeklyPlanResponse {
  const subjects = input.subjects?.length
    ? input.subjects
    : ["Toán", "Anh", "Lý"];
  const start = new Date(`${input.weekStart}T12:00:00`);
  const minutesPerDay = Math.round((input.targetHours * 60) / 5);
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const subject = subjects[i % subjects.length]!;
    return {
      date,
      tasks: [
        {
          title: `Ôn ${subject} · buổi ${i + 1}`,
          estimatedMinutes: Math.min(120, Math.max(30, Math.round(minutesPerDay * 0.6))),
          type: "practice",
          subject,
        },
        {
          title: `Review nhanh ${subject}`,
          estimatedMinutes: Math.min(60, Math.max(20, Math.round(minutesPerDay * 0.4))),
          type: "review",
          subject,
        },
      ],
    };
  });
  return {
    preview: true,
    weekStart: input.weekStart,
    targetHours: input.targetHours,
    days,
    summary: "Kế hoạch demo (không gọi Worker). Xác nhận trước khi tạo task.",
    message: "Demo preview — bật Firebase + Worker để dùng model thật.",
    model: "demo-heuristic",
  };
}

export async function generateWeeklyPlan(
  input: WeeklyPlanRequest,
): Promise<WeeklyPlanResponse> {
  if (isDemoMode) return demoWeeklyPlan(input);
  return workerJson<WeeklyPlanResponse>("/api/ai/weekly-plan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function parseNaturalTask(
  input: ParseTaskRequest,
): Promise<ParseTaskResponse> {
  const today = input.today ?? new Date().toISOString().slice(0, 10);
  const subjects = input.subjects ?? [];
  if (isDemoMode) {
    return {
      preview: true,
      task: demoHeuristicParse(input.text, subjects, today),
      message: "Demo parse — xác nhận trước khi lưu.",
      model: "demo-heuristic",
    };
  }
  return workerJson<ParseTaskResponse>("/api/ai/parse-task", {
    method: "POST",
    body: JSON.stringify({ ...input, today, subjects }),
  });
}

export async function workerHealth(): Promise<{
  ok: boolean;
  r2?: boolean;
  ai?: boolean;
}> {
  return workerJson("/api/health");
}
