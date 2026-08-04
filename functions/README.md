# Deprecated — use Cloudflare Worker

StudyOS **no longer deploys Firebase Cloud Functions** (Blaze plan).

Paid / server-side features live in:

| Feature | Location |
|---------|----------|
| Document upload/download | `worker/storage.ts` + R2 binding `DOCUMENTS` |
| AI weekly plan | `worker/ai.ts` (`OPENROUTER_API_KEY` Worker secret) |
| Auth for APIs | Firebase **ID token** verified in `worker/auth.ts` (Auth free tier) |

```bash
bun run r2:create
# set FIREBASE_PROJECT_ID in wrangler.toml / .dev.vars
bunx wrangler secret put OPENROUTER_API_KEY   # optional AI
bun run deploy:worker
```

This `functions/` folder is kept only as historical reference and can be deleted.
