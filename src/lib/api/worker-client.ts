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

export interface WeeklyPlanResponse {
  preview: boolean;
  uid?: string;
  weekStart?: string;
  targetHours?: number;
  days?: Array<{
    date: string;
    tasks: Array<{
      title: string;
      estimatedMinutes: number;
      type?: string;
      subject?: string;
    }>;
  }>;
  summary?: string;
  message?: string;
  model?: string;
  service_tier?: string;
  reasoning?: { effort?: string };
  usage?: Record<string, unknown> | null;
  cache?: { cached_tokens?: number; hit?: boolean };
}

export function generateWeeklyPlan(
  input: WeeklyPlanRequest,
): Promise<WeeklyPlanResponse> {
  return workerJson<WeeklyPlanResponse>("/api/ai/weekly-plan", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function workerHealth(): Promise<{
  ok: boolean;
  r2?: boolean;
  ai?: boolean;
}> {
  return workerJson("/api/health");
}
