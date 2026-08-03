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

Demo mode is enabled by default. See `docs/ARCHITECTURE.md` for schema, security, and deploy notes.
