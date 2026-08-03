# StudyOS

Study Dashboard for grade-12 and IELTS prep — Vite, React Router, Tailwind, shadcn/ui, Firebase, Cloudflare Wrangler.

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
```

To deploy the Vite SPA to Cloudflare Workers:

```bash
bunx wrangler login
bun run deploy:worker
```

Demo mode is **off** by default. Sign in with Google or email is required (no guest access).
See `docs/ARCHITECTURE.md` for schema, security, and deploy notes.

To try the UI offline without Firebase, set `VITE_DEMO_MODE=true` in `.env` (local only).
