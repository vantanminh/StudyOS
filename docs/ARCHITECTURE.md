# StudyOS

Personal study operating system for grade-12 exam prep and IELTS.

## Stack

| Layer | Technology | Cost note |
|-------|------------|-----------|
| Frontend | Vite + React + TypeScript + Tailwind + shadcn/ui | — |
| Auth + structured data | **Firebase Auth + Firestore only** | Free Spark tier (within quotas) |
| Files | **Cloudflare R2** via Worker binding | Cloudflare R2 (not Firebase Storage) |
| Server logic / AI | **Cloudflare Worker** (`worker/`) | Not Firebase Cloud Functions |
| Package manager | [Bun](https://bun.sh) | — |
| Deploy SPA + API | Cloudflare Workers Static Assets + Wrangler | — |

**Design rule:** anything that would force Firebase **Blaze** (Cloud Functions, paid Storage paths, AI gateways) runs on **Cloudflare Worker + R2** instead.

## Free Firebase vs Cloudflare

| Concern | Where | Why |
|---------|--------|-----|
| Email / Google sign-in | Firebase Auth | Free; ID tokens verified on Worker |
| Tasks, sessions, reviews… | Firestore | Free tier CRUD; owner rules |
| Upload PDF / audio | Worker → **R2** | Avoid Firebase Storage + Functions |
| AI weekly plan | Worker + OpenRouter secret | Avoid Cloud Functions (Blaze) |
| Host SPA | Worker assets | Already on Cloudflare |

You can keep the Firebase project on the **Spark (free)** plan as long as you stay within Auth/Firestore quotas. Do **not** deploy `functions/` or enable Blaze for StudyOS features.

## Quick start

```bash
bun install
cp .env.example .env
# Fill VITE_FIREBASE_* (Auth + Firestore only)
# Keep VITE_DEMO_MODE=false
bun run dev
```

**API locally (R2 + AI):**

```bash
cp .dev.vars.example .dev.vars
# Set FIREBASE_PROJECT_ID to the same project as VITE_FIREBASE_PROJECT_ID
bun run r2:create          # once
bun run dev:api            # Worker on :8787
# Vite proxies /api → :8787
```

**Login is required.** Guest / anonymous use is disabled. Set `VITE_DEMO_MODE=true` only for offline local UI work (documents use in-memory storage).

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Local Vite server (proxies `/api` → Worker) |
| `bun run dev:api` | Local Worker + R2 (`wrangler dev` :8787) |
| `bun run build` | Typecheck + production SPA build |
| `bun run test` | Unit tests (scoring, schemas) |
| `bun run deploy:worker` | Build SPA + deploy Worker (assets + API + R2) |
| `bun run r2:create` | Create R2 bucket `studyos-documents` |
| `bun run emulators` | Firebase Auth + Firestore emulators only |

## Routes (SPA)

`/login` `/onboarding` `/today` `/planner` `/tasks` `/subjects` `/review` `/exams` `/errors` `/analytics` `/documents` `/help` `/settings` `/session/:id` `/more`

## Worker API

Base path `/api/*` (same origin in production). All mutating routes require:

```http
Authorization: Bearer <Firebase ID token>
```

| Method | Path | Role |
|--------|------|------|
| GET | `/api/health` | Liveness + whether R2/AI secrets exist |
| POST | `/api/storage/presign` | Mint R2 object key + PUT URL |
| PUT | `/api/storage/objects?key=` | Stream file into R2 (owner prefix `uid/…`) |
| GET | `/api/storage/objects?key=` | Download (owner only) |
| DELETE | `/api/storage/objects?key=` | Delete (owner only) |
| POST | `/api/ai/weekly-plan` | AI plan preview — model `openai/gpt-5.6-luna`, `reasoning.effort=high`, `service_tier=flex`, prompt cache (OpenRouter secret) |
| POST | `/api/ai/parse-task` | NL quick-add preview — same model defaults; client must confirm before `createTask` |

Implementation: `worker/index.ts`, `worker/storage.ts`, `worker/ai.ts`, `worker/auth.ts`.

Frontend clients: `src/lib/api/worker-client.ts`, `src/lib/storage/provider.ts`.

Automation (client-side, Phase 4): `src/lib/automation` — auto-overdue (incl. inbox + deadline), smart reschedule preview/apply, in-app reminders / nhắc học (`dailyStudyWindow` / due tasks / reviews / overdue; `AutomationHost` refreshes periodically), auto-review from errors & weak topics (prefs + `maxReviewsPerDay` cap; `createErrorLog` respects `autoReviewFromErrors`). Hooked via `AutomationHost` + DataProvider `runAutomation`.

## Architecture notes

- Frontend may read/write simple Firestore CRUD; **complex logic (AI, signed/mediated uploads) goes through the Cloudflare Worker**, never Cloud Functions.
- Max upload size: **25MB**. Keys always `/{uid}/{folder}/{timestamp}-{fileName}`.
- Anonymous Firebase users are rejected by the Worker (same policy as the app).
- Scoring utilities: priority, mastery, readiness, review intervals — `src/lib/scoring`.
- AI weekly plan / NL parse always return **preview**; user confirms in UI before tasks are written (`source: "ai"`).
- `aiEnabled` on profile gates Planner “Lập kế hoạch tuần” and NL AI parse; Settings copy refers to **Cloudflare Worker**, not Cloud Functions.
- `functions/` is **deprecated** (see `functions/README.md`).

## Firebase setup (Spark-friendly)

1. Create a Firebase project (**Spark is enough** — no Blaze required for StudyOS).
2. Fill `VITE_FIREBASE_*` in `.env` (local). Keep `.env.production` in sync for Cloudflare/CI builds.
3. Set Worker `FIREBASE_PROJECT_ID` (wrangler `[vars]` or `.dev.vars`) to the **same** project id.
4. Keep `VITE_DEMO_MODE=false` in production.
5. Enable **Email/Password** and **Google** sign-in. Anonymous must stay **disabled**.
6. Add every host domain (e.g. `localhost`, production Worker host) under Authentication → **Authorized domains**.
7. Deploy rules/indexes only: `bunx firebase-tools deploy --only firestore`.
8. Optional emulator: `VITE_USE_FIREBASE_EMULATOR=true` + `bun run emulators`.

## Cloudflare setup

```bash
bunx wrangler login
bun run r2:create
# Edit wrangler.toml [vars].FIREBASE_PROJECT_ID
# Optional AI:
bunx wrangler secret put OPENROUTER_API_KEY
bun run deploy:worker
```

### Automatic deploy (Cloudflare Git)

Vite embeds `VITE_*` **at build time**. Cloudflare’s Git build does **not** see local `.env`.

Ship committed **`.env.production`** with public Firebase web client config, or set the same keys as **Build environment variables**.

| Variable | Required |
|----------|----------|
| `VITE_FIREBASE_API_KEY` | yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes |
| `VITE_FIREBASE_PROJECT_ID` | yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | yes |
| `VITE_FIREBASE_APP_ID` | yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | unused (legacy placeholder) |
| `VITE_FIREBASE_MEASUREMENT_ID` | optional |
| `VITE_DEMO_MODE` | `false` |
| `VITE_API_BASE_URL` | empty for same-origin Worker |

Worker runtime vars/secrets (dashboard or CLI), not Vite:

| Binding / secret | Purpose |
|------------------|---------|
| `DOCUMENTS` (R2) | File objects |
| `FIREBASE_PROJECT_ID` | Verify ID tokens |
| `OPENROUTER_API_KEY` | AI weekly plan (optional) |
| `CORS_ORIGINS` | Only if SPA and API differ by origin |

## MVP phases

1. Foundation — auth, onboarding, subjects/topics/tasks, Today, Planner, settings ✅
2. Study tracking — timer, sessions, daily/weekly stats ✅
3. Exams / Error Log / Review / readiness ✅
4. Automation — notifications (in-app), smart reschedule, auto-overdue, auto-review prefs ✅
5. AI — weekly plan UI + confirm, NL quick add (**Worker only**, not Functions) ✅

## Design

Warm cream neutrals, soft pastels per subject, rounded surfaces, Nunito + Fraunces, gentle motion. Calm enough for long study sessions.
