# Journal (blog) — your setup steps

The site code is done and live-ready, but gated: until the env vars below exist,
`/journal` just shows an empty state and nothing errors. Do these once and it
lights up. ~15 minutes, no coding.

## 1. Make a NEW Sanity project (keep it separate from client work)

In a scratch folder on your machine:

```bash
npm create sanity@latest -- --template clean --create-project "Finbar Studio Journal" --dataset production
```

- Log in when prompted, let it create the project.
- When it asks about output path, put it somewhere OUTSIDE the website repo
  (e.g. `~/sanity/finbar-journal`). This is the Studio — it stays separate so
  the website repo never carries the heavy Studio dependency.
- **Why a new project:** free-tier limits are per project, so the journal gets
  its own clean bandwidth and can never cross into Lows/Lola. (Those two sharing
  one project is the reason their emails cross — separate them the same way.)

## 2. Drop in the post schema

In the new Studio project, create `schemaTypes/post.ts` with the content from
`sanity-schema/post.ts` in this repo (I wrote it for you — copy it verbatim),
then register it in `schemaTypes/index.ts`:

```ts
import { post } from "./post";
export const schemaTypes = [post];
```

Run `npm run dev` in the Studio folder to check it loads, then deploy it so you
can write from anywhere:

```bash
npx sanity deploy
```

Pick a hostname (e.g. `finbar-journal`) → your Studio lives at
`https://finbar-journal.sanity.studio`. Bookmark it. That's where you write.

## 3. Tell the site which project to read

Get your **Project ID** from the Studio project (it's in `sanity.config.ts`,
or sanity.io/manage). Add these to the website's env — locally in
`.env.local`, and on Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=any_long_random_string_you_make_up
```

Redeploy the site (env vars bake in at build).

## 4. Let the site read from the browser (CORS)

sanity.io/manage → your project → **API → CORS origins → Add**:
- `https://www.finbar.studio`
- `http://localhost:3000`

(No credentials needed — leave "Allow credentials" off. The dataset is public,
published content only.)

## 5. Auto-update on publish (webhook)

So a new post appears without redeploying: sanity.io/manage → your project →
**API → Webhooks → Create webhook**:
- URL: `https://www.finbar.studio/api/revalidate?secret=THE_SAME_SECRET_FROM_STEP_3`
- Dataset: `production`, Trigger on: create / update / delete
- Filter: `_type == "post"`
- HTTP method: POST

Now: write in the Studio → Publish → the site refreshes within seconds.

## Writing a post

In the Studio: **Post → New**. Fill Title, Slug (auto), Published at, a short
Excerpt (shows on the index + as the search/social description), a Cover image
(drag in — **always add alt text**), and the Body (headings, text, quotes,
images, links). Publish. Done. It shows at `/journal` and each post at
`/journal/its-slug`.

## Notes
- Images: drag them into the Body or Cover; the site pulls optimised, cached
  versions automatically, so your Sanity image bandwidth stays tiny.
- SEO: leave the optional SEO fields blank and it uses the title + excerpt. Fill
  them only when you want a different search title/description for a post.
- Nothing here touches the client projects.
