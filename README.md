# finbar.studio

Finbar Skitini's portfolio, at [www.finbar.studio](https://www.finbar.studio). Two subdomains,
sandbox.finbar.studio and web.finbar.studio, are served from the same Next.js app: `proxy.ts`
rewrites their hosts into `app/sandbox/` and `app/web/` respectively, so it's one codebase and
one Vercel deploy for all three.

---

## Stack

- **Next.js 16.2.6** (App Router, Turbopack), **React 19.2.4**, **TypeScript 5**.
- **Tailwind CSS 4**, CSS-first config via `@theme` in `app/globals.css`. No `tailwind.config.ts`.
- Fonts, all via `next/font/google` in `app/layout.tsx`:
  - `Archivo` (variable weight, `--font-archivo`), loaded site-wide but not referenced in
    `app/globals.css` itself; only consumed by satellite demo stylesheets.
  - `Space_Mono` (`--font-space-mono`), the small-detail mono face: dates, tags, links.
  - `Host_Grotesk` (`--font-host`), the display face for big titles and uppercase labels.
    Archivo Narrow was removed; labels now sit on Host Grotesk.
  - `Noto_Sans_Symbols_2` (`--font-dingbat`), inline dingbat glyphs on the home page, not
    preloaded (it's the heaviest font on the site).
  - Adobe Typekit and Bookmania were removed entirely; nothing loads them any more.
- Motion and 3D: GSAP, Lenis (smooth scroll), Tempus (one shared rAF loop), three.js with
  `@react-three/fiber`, and `@splinetool/react-spline`.
- `@calcom/embed-react`, used only on `/free-redesign`. No other page has a booking embed.
- No state-management library, no CMS. Content lives in flat TypeScript data files.
- **Server-rendered on Vercel, not a static export.** `proxy.ts` (host rewrites) and dynamic
  routes require it. Never add `output: "export"` to `next.config.ts`.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, must be clean
```

`npm install` also runs `prepare`, which points git at `.githooks/`. That installs the
media hooks described below, see "Media and Cloudflare R2".

---

## Repo map

```
app/
  (site)/               the live portfolio chrome: home, about, work, pricing,
                         web-design, graphic-design, terms, privacy,
                         case-studies/[slug]/page.tsx
  contact/               standalone contact page (nav and copyright only, no footer,
                         no booking pin, this page IS the booking/contact surface)
  web/                   web.finbar.studio catalogue (served via the proxy.ts rewrite)
  sandbox/               sandbox.finbar.studio tools (mockup exporters, bezier, library)
  asia/                  a friend's travel guide, gate-passworded
  free-redesign/         Meta ad landing page (the one page with a Cal booking embed)
  redesign/               sandbox/prospect redesign pages
  embed/                 chromeless embeds, framable on any origin
  wallpaper/              standalone page
  globals.css, layout.tsx, sitemap.ts, robots.ts, manifest.ts

components/              shared UI: TopNav.tsx and LayoutShell.tsx (nav and chrome),
                         ProjectCard variants, per-project showcase components, etc.

content/
  projects.ts            single source of truth for every project's copy, dates, tags,
                         images, and case-study content
  filters.ts, imogen.ts, web-sites.ts

lib/                     media.ts (the media(), mediaDeep(), and absoluteMedia() helpers),
                         json-ld.ts, meta.ts, og.ts, scroll.ts

scripts/                 media-check.mjs, media-manifest.mjs, media-sync.sh, and
                         one-off image/asset processing scripts

public/
  media/                 every heavy asset the site serves, see "Media and Cloudflare R2"
  downloads/              files served with a save dialog (CV, CursorMania extension)

archive/                 old demos and campaigns pulled off the live deploy (gitignored,
                         local only, git add a folder back to restore it)
research/                local research and outreach dossiers, never shipped (gitignored)
```

---

## Editing content

Project content lives in one file: `content/projects.ts`. Edit copy, dates, tags, or add a
project there; you rarely need to touch a component.

**Case studies** render at `app/(site)/case-studies/[slug]/page.tsx`, one template shared by
every `featured` and `full` tier project. The URL is `/case-studies/<slug>` (kept from the
old Framer site's indexed URLs, not `/work/<slug>`).

**Add a project**: copy an existing project object in `content/projects.ts`, set a new
`slug` (URL-safe, kebab-case), a `rank` (lower sits higher on the page), and a `tier`:

- `"featured"`, full-width card, full case study page, can have a `depth` section.
- `"full"`, half-width card, has a case study page.
- `"gallery"`, third-width card, no case study page.

**Add media** for a project under `public/media/images/<slug>/`. File names are lowercase
kebab-case, no spaces. Reference it in `content/projects.ts` as
`/media/images/<slug>/file.webp`. `content/projects.ts` runs its whole tree through
`mediaDeep()`, so that path needs nothing extra to resolve in dev or in production.

---

## Media and Cloudflare R2

Every heavy file (images, video, 3D models, PDFs) lives under `public/media/` and is served
from a Cloudflare R2 bucket in production, not from Vercel. This is a hard rule enforced by
git hooks and the build. Full detail, including the helper functions, the manifest sync, and
the commands (`npm run media:manifest`, `npm run media:sync`, `npm run media:check`), is in
`AGENTS.md`, "The media rule". Read that before touching anything under `public/media/`.

---

## Deploy

- **Vercel**, connected to the GitHub repo. Every push to `main` triggers a production build.
- **www.finbar.studio is the primary domain.** The apex `finbar.studio` redirects to it.
- DNS is on Cloudflare.
- **Never push without Finbar's explicit instruction.** Every push is a paid Vercel build.
  Commit locally, verify locally (`npm run build`), and leave the work unpushed until he
  says go. See `AGENTS.md`, "Never push without instruction".

---

## Environment variables

There is no `.env.example`. Key names currently in the local, gitignored `.env.local`
(`cut -d= -f1 .env.local` to check without printing values):

- `VERCEL_OIDC_TOKEN`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_REVALIDATE_SECRET`,
  leftover from the /journal blog and its Sanity integration, removed from the app in
  Aug 2026. Nothing in the codebase reads them any more.

Also relevant, not in the local file:

- `NEXT_PUBLIC_MEDIA_URL`, the Cloudflare R2 hostname. Set only in Vercel. Left unset
  locally on purpose, so `media()` is a no-op and Next serves `public/media` straight off
  disk in dev.

---

## Gotchas

- **Don't run `npm run build` while the dev server is running.** It can serve stale CSS.
  Stop the dev server and `rm -rf .next` if styles look wrong.
- **Tailwind scans `/public`.** Uploaded photos there can produce garbage utility classes
  during the CSS build. `app/globals.css` has `@source not "../public";` to stop it, keep
  that line, and keep large source photos out of `public/` outside `public/media/`.
- **Middleware is `proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the convention; the
  exported function is `proxy()`, and `params`/`searchParams` in routes are async.
- **`archive/` and `research/` are gitignored.** They exist on disk but nothing in them
  ships. To bring an archived demo back onto the live site, `git add` its folder again.

---

## Unverified notes carried over

From the old `RELOCATE.md`, kept here because they can't be confirmed by reading the
codebase and might still be true:

- **Local image pipeline.** Photos for the site were upscaled with Upscayl
  (`/Applications/Upscayl.app/Contents/Resources/bin/upscayl-bin`, model
  `high-fidelity-4x`) when the source's long edge was under 1920px, then finished with
  ImageMagick (`/opt/homebrew/bin/magick`, resize to max 1920px, `-quality 82`,
  unsharp mask). `scripts/sharpen-images.sh` exists in this repo and looks related, but
  its current contents weren't checked against this description.
- **Shell environment on this Mac.** macOS ships bash 3.2 (no associative arrays), and
  `PATH` can come back unset inside some tool-run shells, so absolute paths
  (`/usr/bin/curl`, `/opt/homebrew/bin/magick`, etc.) were preferred in scripts. Worth
  confirming before writing a new script that assumes a modern bash or a populated `PATH`.
