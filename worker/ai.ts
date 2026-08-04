import { requireUser } from "./auth";
import { errorJson, json } from "./cors";
import type { Env } from "./types";

/** Cost-optimized OpenRouter defaults for StudyOS AI. */
export const AI_MODEL = "openai/gpt-5.6-luna";
export const AI_SERVICE_TIER = "flex" as const;
export const AI_REASONING_EFFORT = "high" as const;

/**
 * Stable system prompt — keep text identical across requests so OpenRouter /
 * provider prompt-cache can hit (prefix caching + sticky routing).
 */
const WEEKLY_PLAN_SYSTEM = `You are StudyOS, a study planner for grade-12 and IELTS.

Return ONLY valid JSON with this exact shape:
{"days":[{"date":"yyyy-MM-dd","tasks":[{"title":string,"estimatedMinutes":number,"type":string,"subject":string}]}],"summary":string}

Rules:
- Respect target weekly hours and balance rest days.
- Prefer Vietnamese titles when user notes or locale imply Vietnamese.
- Types may be: learn_theory, practice, review, mock_exam, writing, speaking, listening, reading, memorization, custom.
- Do not invent subjects outside the provided list unless the list is empty.
- Keep tasks concrete and time-boxed (15–120 minutes each).`;

/**
 * POST /api/ai/weekly-plan
 * AI runs only on the Worker (never from the browser).
 * Model: openai/gpt-5.6-luna · reasoning.effort=high · service_tier=flex · prompt cache.
 */
export async function handleWeeklyPlan(
  request: Request,
  env: Env,
): Promise<Response> {
  const user = await requireUser(request, env);

  let body: {
    weekStart?: string;
    targetHours?: number;
    subjects?: string[];
    notes?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return errorJson(request, env, "JSON không hợp lệ.", 400);
  }

  const weekStart = body.weekStart?.trim();
  const targetHours = Number(body.targetHours ?? 0);
  if (!weekStart) {
    return errorJson(request, env, "Thiếu weekStart (yyyy-MM-dd).", 400);
  }
  if (!Number.isFinite(targetHours) || targetHours < 1 || targetHours > 80) {
    return errorJson(request, env, "targetHours phải trong 1–80.", 400);
  }

  if (!env.OPENROUTER_API_KEY) {
    return json(request, env, {
      preview: true,
      uid: user.uid,
      weekStart,
      targetHours,
      days: [],
      model: AI_MODEL,
      service_tier: AI_SERVICE_TIER,
      reasoning: { effort: AI_REASONING_EFFORT },
      message:
        "AI planning sẵn sàng khi set secret OPENROUTER_API_KEY trên Worker. Người dùng phải xác nhận trước khi ghi task.",
    });
  }

  const subjects = (body.subjects ?? []).slice(0, 20);
  // Variable payload only — system prompt stays fixed for cache hits.
  const userPrompt = JSON.stringify({
    weekStart,
    targetHours,
    subjects,
    notes: body.notes ?? "",
  });

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://studyos.app",
      "X-Title": "StudyOS",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      // Cheaper, higher latency tier (OpenRouter → OpenAI flex).
      service_tier: AI_SERVICE_TIER,
      reasoning: {
        effort: AI_REASONING_EFFORT,
        // JSON plan only — drop reasoning text from the response payload.
        exclude: true,
      },
      response_format: { type: "json_object" },
      // Prefer cache-friendly routing when the provider supports prompt cache.
      provider: {
        require_parameters: true,
      },
      usage: { include: true },
      messages: [
        {
          role: "system",
          // Multipart + cache_control: OpenRouter forwards to providers that support it;
          // OpenAI also benefits from a stable large prefix for automatic prompt cache.
          content: [
            {
              type: "text",
              text: WEEKLY_PLAN_SYSTEM,
              cache_control: { type: "ephemeral" },
            },
          ],
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return errorJson(request, env, "OpenRouter lỗi.", 502, {
      detail: text.slice(0, 800),
      model: AI_MODEL,
      service_tier: AI_SERVICE_TIER,
    });
  }

  const completion = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
      prompt_tokens_details?: {
        cached_tokens?: number;
        cache_write_tokens?: number;
      };
      completion_tokens_details?: {
        reasoning_tokens?: number;
      };
      cost?: number;
    };
    model?: string;
  };

  const content = completion.choices?.[0]?.message?.content ?? "{}";

  let plan: unknown;
  try {
    plan = JSON.parse(content);
  } catch {
    return errorJson(request, env, "AI trả về JSON không parse được.", 502, {
      raw: content.slice(0, 400),
    });
  }

  const cached = completion.usage?.prompt_tokens_details?.cached_tokens ?? 0;

  return json(request, env, {
    preview: true,
    uid: user.uid,
    weekStart,
    targetHours,
    ...((plan as object) ?? {}),
    model: completion.model ?? AI_MODEL,
    service_tier: AI_SERVICE_TIER,
    reasoning: { effort: AI_REASONING_EFFORT },
    usage: completion.usage ?? null,
    cache: {
      cached_tokens: cached,
      hit: cached > 0,
    },
    message: "Xem trước kế hoạch — xác nhận trước khi tạo task.",
  });
}

const PARSE_TASK_SYSTEM = `You are StudyOS, parsing natural-language study task requests for grade-12 and IELTS.

Return ONLY valid JSON with this exact shape:
{"title":string,"estimatedMinutes":number,"type":string,"subject":string|null,"scheduledDate":"yyyy-MM-dd"|null,"scheduledStartAt":string|null,"priority":"low"|"medium"|"high"|"critical","notes":string|null}

Rules:
- Prefer Vietnamese titles when the user writes Vietnamese.
- Types may be: learn_theory, practice, review, mock_exam, writing, speaking, listening, reading, memorization, custom.
- Match subject to one name from the provided list when possible; otherwise null.
- Resolve relative dates (hôm nay, mai, thứ bảy, …) using the given "today" (yyyy-MM-dd).
- scheduledStartAt may be ISO datetime or null; estimatedMinutes 15–180.
- Do not invent facts beyond the user text.`;

/**
 * POST /api/ai/parse-task
 * NL quick-add — preview only; client must confirm before createTask.
 */
export async function handleParseTask(
  request: Request,
  env: Env,
): Promise<Response> {
  const user = await requireUser(request, env);

  let body: {
    text?: string;
    subjects?: string[];
    today?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return errorJson(request, env, "JSON không hợp lệ.", 400);
  }

  const text = body.text?.trim() ?? "";
  if (text.length < 2 || text.length > 500) {
    return errorJson(request, env, "text phải dài 2–500 ký tự.", 400);
  }

  const today = body.today?.trim() || new Date().toISOString().slice(0, 10);
  const subjects = (body.subjects ?? []).slice(0, 30);

  if (!env.OPENROUTER_API_KEY) {
    return json(request, env, {
      preview: true,
      uid: user.uid,
      task: heuristicParseTask(text, subjects, today),
      model: AI_MODEL,
      service_tier: AI_SERVICE_TIER,
      reasoning: { effort: AI_REASONING_EFFORT },
      message:
        "Heuristic parse (chưa có OPENROUTER_API_KEY). Xác nhận trước khi tạo task.",
    });
  }

  const userPrompt = JSON.stringify({ text, subjects, today });

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://studyos.app",
      "X-Title": "StudyOS",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      service_tier: AI_SERVICE_TIER,
      reasoning: {
        effort: AI_REASONING_EFFORT,
        exclude: true,
      },
      response_format: { type: "json_object" },
      provider: { require_parameters: true },
      usage: { include: true },
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: PARSE_TASK_SYSTEM,
              cache_control: { type: "ephemeral" },
            },
          ],
        },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return errorJson(request, env, "OpenRouter lỗi.", 502, {
      detail: detail.slice(0, 800),
      model: AI_MODEL,
    });
  }

  const completion = (await res.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
    usage?: Record<string, unknown>;
    model?: string;
  };

  const content = completion.choices?.[0]?.message?.content ?? "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return errorJson(request, env, "AI trả về JSON không parse được.", 502, {
      raw: content.slice(0, 400),
    });
  }

  return json(request, env, {
    preview: true,
    uid: user.uid,
    task: parsed,
    model: completion.model ?? AI_MODEL,
    service_tier: AI_SERVICE_TIER,
    reasoning: { effort: AI_REASONING_EFFORT },
    usage: completion.usage ?? null,
    message: "Xem trước task — xác nhận trước khi lưu.",
  });
}

/** Fallback when OpenRouter secret is missing (also used by demo client). */
export function heuristicParseTask(
  text: string,
  subjects: string[],
  today: string,
): {
  title: string;
  estimatedMinutes: number;
  type: string;
  subject: string | null;
  scheduledDate: string | null;
  scheduledStartAt: string | null;
  priority: string;
  notes: string | null;
} {
  const lower = text.toLowerCase();
  let type = "custom";
  if (/\b(reading|đọc)\b/.test(lower)) type = "reading";
  else if (/\b(writing|viết)\b/.test(lower)) type = "writing";
  else if (/\b(listening|nghe)\b/.test(lower)) type = "listening";
  else if (/\b(speaking|nói)\b/.test(lower)) type = "speaking";
  else if (/ôn|review/.test(lower)) type = "review";
  else if (/luyện|practice|bài tập/.test(lower)) type = "practice";
  else if (/học|lý thuyết|theory/.test(lower)) type = "learn_theory";

  const minutesMatch = text.match(/(\d+)\s*(phút|ph|min|m\b)/i);
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
  } else if (/thứ bảy|saturday/.test(lower)) {
    const day = base.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    base.setDate(base.getDate() + diff);
    scheduledDate = base.toISOString().slice(0, 10);
  } else if (/chủ nhật|sunday/.test(lower)) {
    const day = base.getDay();
    const diff = (0 - day + 7) % 7 || 7;
    base.setDate(base.getDate() + diff);
    scheduledDate = base.toISOString().slice(0, 10);
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

  const subject =
    subjects.find((s) => lower.includes(s.toLowerCase())) ?? null;

  let priority = "medium";
  if (/gấp|khẩn|urgent|critical/.test(lower)) priority = "high";

  return {
    title: text.slice(0, 120).trim() || "Task mới",
    estimatedMinutes,
    type,
    subject,
    scheduledDate,
    scheduledStartAt,
    priority,
    notes: null,
  };
}
