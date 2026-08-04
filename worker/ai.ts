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
