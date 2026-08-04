/** Cloudflare Worker bindings for StudyOS API + static assets. */

export interface Env {
  /** R2 bucket for user documents / images / audio. */
  DOCUMENTS: R2Bucket;
  /** Vite SPA static assets (optional when only running API locally). */
  ASSETS?: Fetcher;
  /** Firebase project id — used to verify ID tokens (aud/iss). */
  FIREBASE_PROJECT_ID: string;
  /** Optional OpenRouter key for AI endpoints (secret). */
  OPENROUTER_API_KEY?: string;
  /** Allowed browser origins for CORS (comma-separated). Empty = same-origin only. */
  CORS_ORIGINS?: string;
}

export type Folder = "documents" | "images" | "audio";

export interface AuthUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}
