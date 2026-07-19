# Journal (blog) — DONE ✅ (set up 19 Jul 2026)

The Journal is fully wired and live. Nothing left to configure. This doc is now
just a reference for how to use it and what's under the hood.

## Where you write

**https://finbar-journal.sanity.studio** — bookmark it. Log in with your Sanity
account. That's the Studio (the writing UI).

### Writing a post
Post → **New** → fill in:
- **Title** (required)
- **Slug** — click "Generate" (auto from title). This is the URL: `/journal/<slug>`.
- **Published at** (defaults to now)
- **Excerpt** — 1–2 sentences (shows on the index + as the search/social description)
- **Cover image** — optional; alt text required if you add one
- **Body** — rich text (headings, quote, lists, links, inline images)
- **Tags** / **SEO overrides** — optional

Hit **Publish**. It appears on **finbar.studio/journal within a few seconds** (a
webhook tells the site to refetch — no redeploy needed).

## What's wired (reference)

| Piece | Value |
|---|---|
| Sanity project | **Finbar Studio Journal** — id `ipu3xv9e` (its own project, separate free-tier quota from the client work) |
| Dataset | `production`, public (published posts only) |
| Studio | `finbar-journal.sanity.studio` (hosted) |
| Vercel env | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET` — set on Production, Preview, Development |
| CORS | `https://www.finbar.studio` + `http://localhost:3000` |
| Webhook | on every change → `POST /api/revalidate?secret=…` (busts the `/journal` cache) |
| Local dev | the three vars are also in `.env.local` (gitignored), so the journal shows when you run the site locally |

## The Studio lives outside this repo

The Studio project is at `../journal-studio` (i.e.
`finbar.studio/journal-studio`), kept separate so the website repo stays lean.
To change the post fields or redeploy the Studio:

```bash
cd ../journal-studio
# edit schemaTypes/post.ts (keep field names in sync with the site's reader)
npx sanity deploy
```

The site's reader expects the field names in `sanity-schema/post.ts` (this repo)
— if you rename a field in the Studio, update that reader too.

## The secret

`SANITY_REVALIDATE_SECRET` lives in Vercel + `.env.local`. Don't commit it. If it
ever leaks, generate a new one (`openssl rand -hex 32`), update it in Vercel and
in the Sanity webhook URL (Manage → API → Webhooks → edit "Journal revalidate").
