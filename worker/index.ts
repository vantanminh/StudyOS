/**
 * StudyOS Cloudflare Worker
 * - Serves SPA static assets
 * - /api/* : R2 storage + AI (paid Firebase features live here instead of Cloud Functions)
 */

import { AuthError } from "./auth";
import { handleWeeklyPlan } from "./ai";
import { errorJson, json, withCors } from "./cors";
import {
  handleDeleteObject,
  handleGetObject,
  handlePresign,
  handlePutObject,
} from "./storage";
import type { Env } from "./types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env, url);
      }

      // Static SPA (production deploy). Local `wrangler dev` without build may lack ASSETS.
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response(
        "StudyOS API is running. Build the SPA (`bun run build`) and deploy with assets, or use Vite for UI.",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
    } catch (err) {
      if (err instanceof AuthError) {
        return errorJson(request, env, err.message, err.status);
      }
      console.error(err);
      return errorJson(request, env, "Lỗi máy chủ.", 500);
    }
  },
};

async function handleApi(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return withCors(request, env, new Response(null, { status: 204 }));
  }

  if (url.pathname === "/api/health" && request.method === "GET") {
    return json(request, env, {
      ok: true,
      service: "studyos-worker",
      r2: Boolean(env.DOCUMENTS),
      firebaseProject: Boolean(env.FIREBASE_PROJECT_ID),
      ai: Boolean(env.OPENROUTER_API_KEY),
    });
  }

  if (url.pathname === "/api/storage/presign" && request.method === "POST") {
    return handlePresign(request, env);
  }

  if (url.pathname === "/api/storage/objects") {
    if (request.method === "PUT") return handlePutObject(request, env);
    if (request.method === "GET") return handleGetObject(request, env);
    if (request.method === "DELETE") return handleDeleteObject(request, env);
  }

  // Back-compat aliases used by older client stubs
  if (url.pathname === "/api/storage/upload" && request.method === "PUT") {
    return handlePutObject(request, env);
  }
  if (url.pathname === "/api/storage/download" && request.method === "GET") {
    return handleGetObject(request, env);
  }

  if (url.pathname === "/api/ai/weekly-plan" && request.method === "POST") {
    return handleWeeklyPlan(request, env);
  }

  return errorJson(request, env, "Không tìm thấy API.", 404);
}
