import type { Env } from "./types";

const DEFAULT_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Authorization, Content-Type, Content-Length, X-File-Name",
  "Access-Control-Max-Age": "86400",
};

export function corsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get("Origin");
  const allowed = (env.CORS_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const headers: Record<string, string> = { ...DEFAULT_HEADERS };

  if (origin && (allowed.length === 0 || allowed.includes(origin) || allowed.includes("*"))) {
    // Same-origin SPA usually has no Origin on navigation; API from Vite dev needs explicit list.
    if (allowed.includes("*")) {
      headers["Access-Control-Allow-Origin"] = "*";
    } else if (allowed.length === 0) {
      // Reflect origin in dev-friendly default when unset (wrangler local + vite proxy rarely needs CORS).
      headers["Access-Control-Allow-Origin"] = origin;
    } else if (allowed.includes(origin)) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers["Vary"] = "Origin";
    }
  }

  return headers;
}

export function withCors(
  request: Request,
  env: Env,
  response: Response,
): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(corsHeaders(request, env))) {
    headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function json(
  request: Request,
  env: Env,
  data: unknown,
  status = 200,
): Response {
  return withCors(
    request,
    env,
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    }),
  );
}

export function errorJson(
  request: Request,
  env: Env,
  message: string,
  status: number,
  extra?: Record<string, unknown>,
): Response {
  return json(request, env, { error: message, ...extra }, status);
}
