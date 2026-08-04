import { AuthError, requireUser } from "./auth";
import { errorJson, json, withCors } from "./cors";
import type { Env, Folder } from "./types";

const MAX_BYTES = 25 * 1024 * 1024;
const FOLDERS = new Set<Folder>(["documents", "images", "audio"]);

function sanitizeFileName(name: string): string {
  return name
    .replace(/[/\\?%*:|"<>]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180) || "file";
}

function assertOwnedKey(uid: string, key: string): void {
  if (!key.startsWith(`${uid}/`)) {
    throw new AuthError("Không có quyền với object này.", 403);
  }
  if (key.includes("..") || key.includes("//")) {
    throw new AuthError("storageKey không hợp lệ.", 400);
  }
}

/** POST /api/storage/presign — mint a worker-mediated upload target. */
export async function handlePresign(
  request: Request,
  env: Env,
): Promise<Response> {
  const user = await requireUser(request, env);
  let body: {
    fileName?: string;
    contentType?: string;
    sizeBytes?: number;
    folder?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return errorJson(request, env, "JSON không hợp lệ.", 400);
  }

  const fileName = sanitizeFileName(body.fileName ?? "");
  const contentType = (body.contentType ?? "application/octet-stream").slice(0, 120);
  const sizeBytes = Number(body.sizeBytes ?? 0);
  const folder = (body.folder ?? "documents") as Folder;

  if (!fileName) return errorJson(request, env, "Thiếu fileName.", 400);
  if (!FOLDERS.has(folder)) {
    return errorJson(request, env, "folder không hợp lệ.", 400);
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return errorJson(request, env, "sizeBytes không hợp lệ.", 400);
  }
  if (sizeBytes > MAX_BYTES) {
    return errorJson(request, env, "File vượt quá 25MB.", 413);
  }

  const storageKey = `${user.uid}/${folder}/${Date.now()}-${fileName}`;
  const uploadUrl = `/api/storage/objects?key=${encodeURIComponent(storageKey)}`;

  return json(request, env, {
    storageKey,
    provider: "r2",
    method: "PUT",
    uploadUrl,
    maxBytes: MAX_BYTES,
    headers: {
      "Content-Type": contentType,
    },
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  });
}

/** PUT /api/storage/objects?key= — stream body into R2. */
export async function handlePutObject(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.DOCUMENTS) {
    return errorJson(
      request,
      env,
      "R2 binding DOCUMENTS chưa cấu hình.",
      503,
    );
  }

  const user = await requireUser(request, env);
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return errorJson(request, env, "Thiếu key.", 400);

  assertOwnedKey(user.uid, key);

  const contentType =
    request.headers.get("Content-Type") ?? "application/octet-stream";
  const lengthHeader = request.headers.get("Content-Length");
  if (lengthHeader && Number(lengthHeader) > MAX_BYTES) {
    return errorJson(request, env, "File vượt quá 25MB.", 413);
  }
  if (!request.body) {
    return errorJson(request, env, "Thiếu body file.", 400);
  }

  await env.DOCUMENTS.put(key, request.body, {
    httpMetadata: { contentType },
    customMetadata: {
      uid: user.uid,
      uploadedAt: new Date().toISOString(),
    },
  });

  return json(request, env, {
    ok: true,
    storageKey: key,
    provider: "r2",
  });
}

/** GET /api/storage/objects?key= — stream object (owner only). */
export async function handleGetObject(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.DOCUMENTS) {
    return errorJson(request, env, "R2 binding DOCUMENTS chưa cấu hình.", 503);
  }

  const user = await requireUser(request, env);
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return errorJson(request, env, "Thiếu key.", 400);
  assertOwnedKey(user.uid, key);

  const object = await env.DOCUMENTS.get(key);
  if (!object) return errorJson(request, env, "Không tìm thấy file.", 404);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set(
    "Cache-Control",
    "private, max-age=0, must-revalidate",
  );

  return withCors(
    request,
    env,
    new Response(object.body, { status: 200, headers }),
  );
}

/** DELETE /api/storage/objects?key= */
export async function handleDeleteObject(
  request: Request,
  env: Env,
): Promise<Response> {
  if (!env.DOCUMENTS) {
    return errorJson(request, env, "R2 binding DOCUMENTS chưa cấu hình.", 503);
  }

  const user = await requireUser(request, env);
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key) return errorJson(request, env, "Thiếu key.", 400);
  assertOwnedKey(user.uid, key);

  await env.DOCUMENTS.delete(key);
  return json(request, env, { ok: true, storageKey: key });
}
