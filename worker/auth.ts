/**
 * Verify Firebase ID tokens on Cloudflare Workers (no firebase-admin / Blaze).
 * Uses Google JWKS + Web Crypto — free Firebase Auth only.
 */

import type { AuthUser, Env } from "./types";

const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

interface Jwk {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  n: string;
  e: string;
}

interface JwksCache {
  keys: Map<string, CryptoKey>;
  fetchedAt: number;
}

let jwksCache: JwksCache | null = null;
const JWKS_TTL_MS = 60 * 60 * 1000;

function b64urlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJsonPart<T>(part: string): T {
  const text = new TextDecoder().decode(b64urlToBytes(part));
  return JSON.parse(text) as T;
}

async function getCryptoKey(kid: string): Promise<CryptoKey | null> {
  const now = Date.now();
  if (!jwksCache || now - jwksCache.fetchedAt > JWKS_TTL_MS) {
    const res = await fetch(JWKS_URL, {
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    if (!res.ok) throw new Error("Không tải được Firebase JWKS.");
    const body = (await res.json()) as { keys: Jwk[] };
    const keys = new Map<string, CryptoKey>();
    for (const jwk of body.keys) {
      const key = await crypto.subtle.importKey(
        "jwk",
        {
          kty: jwk.kty,
          n: jwk.n,
          e: jwk.e,
          alg: "RS256",
          ext: true,
        },
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      );
      keys.set(jwk.kid, key);
    }
    jwksCache = { keys, fetchedAt: now };
  }
  return jwksCache.keys.get(kid) ?? null;
}

interface FirebaseIdTokenPayload {
  aud: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  auth_time?: number;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    sign_in_provider?: string;
  };
}

export async function verifyFirebaseIdToken(
  token: string,
  env: Env,
): Promise<AuthUser> {
  const projectId = env.FIREBASE_PROJECT_ID?.trim();
  if (!projectId) {
    throw new AuthError("Thiếu FIREBASE_PROJECT_ID trên Worker.", 500);
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthError("Token không hợp lệ.", 401);
  }

  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
  const header = decodeJsonPart<{ alg: string; kid: string }>(headerB64);
  if (header.alg !== "RS256" || !header.kid) {
    throw new AuthError("Thuật toán token không được hỗ trợ.", 401);
  }

  let verifyKey = await getCryptoKey(header.kid);
  if (!verifyKey) {
    // Force refresh once if kid missing (key rotation).
    jwksCache = null;
    verifyKey = await getCryptoKey(header.kid);
  }
  if (!verifyKey) throw new AuthError("Không tìm thấy khóa ký token.", 401);

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const signature = b64urlToBytes(sigB64);
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    verifyKey,
    signature,
    data,
  );
  if (!ok) throw new AuthError("Chữ ký token không hợp lệ.", 401);

  const payload = decodeJsonPart<FirebaseIdTokenPayload>(payloadB64);
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) throw new AuthError("Token đã hết hạn.", 401);
  if (payload.iat > now + 60) throw new AuthError("Token chưa có hiệu lực.", 401);
  if (payload.aud !== projectId) {
    throw new AuthError("Token không thuộc project này.", 401);
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new AuthError("Issuer token không hợp lệ.", 401);
  }
  if (!payload.sub) throw new AuthError("Token thiếu uid.", 401);

  const provider = payload.firebase?.sign_in_provider;
  if (provider === "anonymous") {
    throw new AuthError("Không cho phép tài khoản ẩn danh.", 403);
  }

  return {
    uid: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
  };
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function requireUser(
  request: Request,
  env: Env,
): Promise<AuthUser> {
  const header = request.headers.get("Authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match?.[1]) {
    throw new AuthError("Cần đăng nhập (Bearer token).", 401);
  }
  return verifyFirebaseIdToken(match[1], env);
}
