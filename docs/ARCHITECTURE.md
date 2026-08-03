# StudyOS

Personal study operating system for grade-12 exam prep and IELTS.

## Stack

- **Frontend:** Vite + React + TypeScript + React Router + Tailwind CSS + shadcn/ui
- **Data:** Firebase Auth / Firestore / Cloud Functions (demo mode uses local persistence)
- **Package manager:** [Bun](https://bun.sh) (`bun install` / `bun run`)
- **Deploy:** Cloudflare Workers Static Assets via Wrangler (`bun run deploy:worker`)
- **Files:** `StorageProvider` abstraction (Cloudflare R2 default, Firebase Storage optional)

## Quick start

```bash
bun install
cp .env.example .env
# Fill VITE_FIREBASE_* then keep VITE_DEMO_MODE=false
bun run dev
```

**Login is required.** Guest / anonymous use is disabled. Set `VITE_DEMO_MODE=true` only for offline local UI work.

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run dev` | Local Vite server |
| `bun run build` | Typecheck + production build |
| `bun run test` | Unit tests (scoring, schemas) |
| `bun run typecheck` | TypeScript only |
| `bun run deploy:worker` | Build + deploy the SPA to a Cloudflare Worker |
| `bun run emulators` | Firebase Emulator Suite |

## Routes

`/login` `/onboarding` `/today` `/planner` `/tasks` `/subjects` `/review` `/exams` `/errors` `/analytics` `/documents` `/settings` `/session/:id`

## Architecture notes

- Frontend may read/write simple Firestore CRUD; complex logic (AI, aggregation, review scheduling, signed uploads) goes through Cloud Functions.
- All Firestore queries must use `limit` + pagination — see `firebase/firestore.indexes.json`.
- Security rules live in `firebase/firestore.rules` (`users/{uid}/...` owner-only; anonymous auth denied).
- App routes require a signed-in non-anonymous user; `/onboarding` is also auth-gated.
- Scoring utilities: priority, mastery, readiness, review intervals — `src/lib/scoring`.

## Firebase setup

1. Create a Firebase project (Blaze for Functions).
2. Fill `VITE_FIREBASE_*` in `.env`.
3. Keep `VITE_DEMO_MODE=false` (required for production — no guest access).
4. Enable **Email/Password** and **Google** sign-in (Console → Authentication → Sign-in method), or deploy auth config: `bunx firebase-tools deploy --only auth`.
   Anonymous auth must stay **disabled**.
5. Add every host domain (e.g. `localhost`, production host) under Authentication → Settings → **Authorized domains**.
6. Deploy rules/indexes: `bunx firebase-tools deploy --only firestore,storage`.
7. Optional emulator: `VITE_USE_FIREBASE_EMULATOR=true` + `bun run emulators`.
8. Cloud Functions (`functions/`): `cd functions && bun install && bun run build`.

## Cloudflare

```bash
bunx wrangler login
bun run deploy:worker
```

## MVP phases

1. Foundation — auth, onboarding, subjects/topics/tasks, Today, Planner, settings ✅ (demo)
2. Study tracking — timer, sessions, daily/weekly stats
3. Exams / Error Log / Review / readiness
4. Automation — notifications, smart reschedule
5. AI — weekly plan, NL quick add (Functions only)

## Design

Warm cream neutrals, soft pastels per subject, rounded surfaces, Nunito + Fraunces, gentle motion. Calm enough for long study sessions.
