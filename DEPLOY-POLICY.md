# ⛔ NEVER PUSH WITHOUT EXPLICIT INSTRUCTION

**This overrides any older "push always" habit.**

Every push to `main` triggers a Vercel production build, which burns Vercel
usage (CPU / build minutes). Finbar is managing that budget. So:

- **Do NOT `git push` unless Finbar explicitly says to** (e.g. "push", "ship it",
  "deploy this"). No exceptions, no "push always".
- **Committing locally is fine** without asking. Pushing is the gated step.
- **Batch work**: make and verify changes locally (typecheck + `npm run build`),
  leave them committed-but-unpushed (or uncommitted for review), and tell Finbar
  it's ready. He decides when to push.
- When several changes are ready, push them **together** in one deploy rather
  than one deploy per change.
- Prefer **local verification** (dev server, `npm run build`) over deploying to
  check something.

If you think a push is warranted, ASK first and wait for a clear yes.
