# StudyOS

Personal study operating system for grade-12 exam prep and IELTS.

## Stack

- **Frontend:** Vite + React + TypeScript + React Router + Tailwind CSS + shadcn/ui
- **Data:** Firebase Auth / Firestore / Cloud Functions (demo mode uses local persistence)
- **Deploy:** Cloudflare Workers Static Assets via Wrangler (`npm run deploy:worker`)
- **Files:** `StorageProvider` abstraction (Cloudflare R2 default, Firebase Storage optional)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Demo mode is on by default (`VITE_DEMO_MODE=true`). Open the app, enter a name, and explore seeded data.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local Vite server |
| `npm run build` | Typecheck + production build |
| `npm run test` | Unit tests (scoring, schemas) |
| `npm run typecheck` | TypeScript only |
| `npm run deploy:worker` | Build + deploy the SPA to a Cloudflare Worker |
| `npm run emulators` | Firebase Emulator Suite |

## Routes

`/login` `/onboarding` `/today` `/planner` `/tasks` `/subjects` `/review` `/exams` `/errors` `/analytics` `/documents` `/settings` `/session/:id`

## Architecture notes

- Frontend may read/write simple Firestore CRUD; complex logic (AI, aggregation, review scheduling, signed uploads) goes through Cloud Functions.
- All Firestore queries must use `limit` + pagination — see `firebase/firestore.indexes.json`.
- Security rules live in `firebase/firestore.rules` (`users/{uid}/...` owner-only).
- Scoring utilities: priority, mastery, readiness, review intervals — `src/lib/scoring`.

## Firebase setup

1. Create a Firebase project (Blaze for Functions).
2. Fill `VITE_FIREBASE_*` in `.env`.
3. Set `VITE_DEMO_MODE=false`.
4. Deploy rules/indexes: `firebase deploy --only firestore`.
5. Optional emulator: `VITE_USE_FIREBASE_EMULATOR=true` + `npm run emulators`.

## Cloudflare

```bash
npx wrangler login
npm run deploy:worker
```

## MVP phases

1. Foundation — auth, onboarding, subjects/topics/tasks, Today, Planner, settings ✅ (demo)
2. Study tracking — timer, sessions, daily/weekly stats
3. Exams / Error Log / Review / readiness
4. Automation — notifications, smart reschedule
5. AI — weekly plan, NL quick add (Functions only)

## Design

Warm cream neutrals, soft pastels per subject, rounded surfaces, Nunito + Fraunces, gentle motion. Calm enough for long study sessions.
