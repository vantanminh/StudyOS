# StudyOS

Study Dashboard for grade-12 and IELTS prep — Vite, React Router, Tailwind, shadcn/ui, **Firebase Auth/Firestore (free tier)**, **Cloudflare Worker + R2** for files and AI.

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

### Local API (R2 / AI Worker)

```bash
cp .dev.vars.example .dev.vars   # set FIREBASE_PROJECT_ID
bun run r2:create                # once
bun run dev:api                  # :8787 — Vite proxies /api
```

### Deploy SPA + Worker + R2

```bash
bunx wrangler login
bun run deploy:worker
```

**No Firebase Blaze / Cloud Functions.** Storage and AI run on Cloudflare. See `docs/ARCHITECTURE.md`.

**Cloudflare Git auto-deploy:** `VITE_FIREBASE_*` must exist at **build** time. Local deploys use `.env`; automatic builds use committed `.env.production` (or Cloudflare Build env vars).

Demo mode is **off** by default. Sign in with Google or email is required (no guest access).

To try the UI offline without Firebase, set `VITE_DEMO_MODE=true` in `.env` (local only).
