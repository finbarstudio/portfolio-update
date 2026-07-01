# RELOCATE / HANDOFF

Everything a fresh Claude Code (or a human) needs to pick this project up in a new
location and keep working the way we've been working. If you're a new Claude:
**read this whole file first**, then `CLAUDE.md` (which pulls in `AGENTS.md`).

> Note: the old `README.md` says "static export friendly, no server-side data."
> That is out of date. This app runs **server-side middleware** (`proxy.ts`) and a
> few dynamic routes, so it is **server-rendered on Vercel, not a static export.**
> This file is the source of truth for deploy + process.

---

## 1. Moving the repo to a new place

The repo is fully self-contained (git history, `node_modules` rebuildable, all
assets in `/public`). To relocate:

```bash
# 1. Move the folder wherever you want it (Finder, or:)
mv "/Users/finbar/Desktop/Portfolio Update" "/Users/finbar/Code/finbar-studio"

# 2. In the new location:
cd "/Users/finbar/Code/finbar-studio"
npm install            # rebuild node_modules
npm run dev            # sanity check → http://localhost:3000
```

Git, the remote, and the branch all travel with the folder. Remote is
`https://github.com/finbarstudio/portfolio-update.git`, default branch `main`.

### Carry the Claude memory (recommended, optional)

Claude Code keeps a **persistent memory folder outside the repo**, keyed to the
project's absolute path. It won't follow the files automatically — a fresh Claude
at a new path starts with an empty memory. This file captures the essentials so
you don't strictly need it, but for full continuity copy it over:

```bash
OLD_MEM="$HOME/.claude/projects/-Users-finbar-Desktop-Portfolio-Update-/memory"
NEW_DIR="/Users/finbar/Code/finbar-studio"                 # the new repo path
NEW_SLUG=$(printf '%s' "$NEW_DIR" | sed 's#[ /]#-#g')      # path → memory slug
mkdir -p "$HOME/.claude/projects/$NEW_SLUG"
cp -R "$OLD_MEM" "$HOME/.claude/projects/$NEW_SLUG/memory"
```

(The slug is just the absolute path with every `/` and space turned into `-`.)
`MEMORY.md` inside that folder is the index Claude loads each session; the other
`.md` files are one fact each.

### Then start Claude in the new spot

```bash
cd "/Users/finbar/Code/finbar-studio"
claude
```

First thing, tell it: **"read RELOCATE.md"**. That plus `CLAUDE.md`/`AGENTS.md`
gets it fully oriented.

---

## 2. What this project actually is

It's not just the portfolio. Four surfaces live in one Next.js app / one Vercel
deploy:

1. **The live portfolio** — `finbar.studio` (canonical `https://www.finbar.studio`).
   Routes under `app/(site)/`. This is the real, public site.
2. **Builder redesign demos** — spec-built "here's your site, rebuilt" demos we
   send to prospective clients (home builders/developers). Each has a chromeless
   demo site + a pitch page + an outreach email. Currently 12 (8 recent + 4
   earlier). See §6.
3. **The Sandbox** — `sandbox.finbar.studio`, a set of interactive tools
   (phone/mac mockup exporter, bezier tool, effects library). Same app, served on
   a subdomain via a host rewrite in `proxy.ts`. Routes under `app/sandbox/`.
4. **Private one-offs** — `/imogen` (a friend's travel guide), `/builders` (a
   password-gated index of all the demos + their emails, for your own nav).

---

## 3. Stack

- **Next.js 16** (App Router, Turbopack) — this is NOT the Next you may remember;
  breaking changes vs older versions. `AGENTS.md` says it, and it's true: check
  `node_modules/next/dist/docs/` before using an unfamiliar API. Middleware is a
  file called `proxy.ts` (renamed from `middleware.ts`), exporting `proxy()`.
  `params`/`searchParams` are async.
- **React 19**, **TypeScript 5**.
- **Tailwind CSS v4** — CSS-first config. No `tailwind.config.ts`. Design tokens
  live in `@theme` inside `app/globals.css`. Custom colours are used as
  `text-pink`, `bg-bg`, `border-line`, and as `var(--pink)` / `var(--ink)`.
- **Fonts** (`app/layout.tsx`): Archivo Narrow + Archivo + Space Mono +
  Noto Sans Symbols 2 via `next/font/google`; Bookmania (display serif) via Adobe
  Typekit `<link>`.
- **Motion/3D**: GSAP + ScrollTrigger, Lenis (smooth scroll), three.js +
  @react-three/fiber (the TMYR phone mockup, sandbox tools). No other animation
  library — plain CSS/GSAP only.
- No state-management library, no CMS. Content lives in flat data files.

---

## 4. Repo map

```
app/
  (site)/            THE LIVE PORTFOLIO (inherits the sidebar/nav/footer chrome)
    page.tsx           home
    about/             about + contact (contact merged in)
    case-studies/[slug]/  case study template  (URL is /case-studies/… for SEO)
    builders/          PRIVATE index of all demos + emails (password-gated, §6)
    web-design/ store/ world-cup/ privacy/ …
  <builder>/site/    CHROMELESS demo sites (foundation-homes, resolve-construction,
                     ross-hogno, david-radic, gto-building, hm-developments,
                     mbc-prestige, bppd, braeden, a-rolley, lindon, oj-pippin)
  (site)/<builder>/  each demo's PITCH page (public-facing sell, portfolio chrome)
  sandbox/           the Sandbox tools (served at sandbox.finbar.studio)
  imogen/            private travel guide (chromeless, noindex)
  embed/             chromeless embeds for sandbox exports (framable anywhere)
  api/               route handlers (store checkout, waitlist)
  globals.css        design tokens (@theme), keyframes, component classes
  layout.tsx         root layout, fonts, chrome wrapper
  sitemap.ts robots.ts manifest.ts   metadata (sitemap is a manual allowlist!)

components/
  Sidebar.tsx ProjectCard.tsx ParallaxImage.tsx PhoneCarousel.tsx …  (main site)
  DemoPreloader.tsx                                    (shared demo preloader)
  <builder>/…        per-demo kit: sections/, SmoothScroll, ViewCursor, etc.

content/
  projects.ts        SINGLE SOURCE OF TRUTH for all live portfolio projects
  store.ts imogen.ts …

lib/                 json-ld, lemonsqueezy, helpers
proxy.ts             middleware: sandbox subdomain rewrite + /builders password gate
next.config.ts       security headers, image config, /contact→/about redirect
```

Rule of thumb: **the live site is `app/(site)/**` + the shared `components/*.tsx`.
Everything under `app/<builder>/site/` and `components/<builder>/` is demo work,
scoped and isolated.**

---

## 5. How we deploy

- **Host: Vercel.** The GitHub repo is connected; **every push to `main`
  auto-deploys.** (We work directly on `main` on this project — see §7 "push
  always".) You can also deploy manually with the Vercel CLI (`vercel --prod`) or
  the `/vercel:deploy` skill.
- **Server-rendered, not static export.** `proxy.ts` middleware and the dynamic
  routes require it. Don't add `output: "export"` to `next.config.ts` — it would
  break the sandbox subdomain and the `/builders` gate.
- **Domains (set in Vercel → Project → Settings → Domains):**
  - Primary: **`www.finbar.studio`** (this is what Google indexed — keep it www).
  - Apex `finbar.studio` → 308 redirect to `www`.
  - **`sandbox.finbar.studio`** → add as a domain on the *same* project, DNS
    CNAME to Vercel. `proxy.ts` rewrites that host's paths into `app/sandbox/`.
- **Env vars** (Vercel → Settings → Environment Variables; see `.env.example`):
  - `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_VARIANT_ID` —
    the `/store`. Until set, the store shows "coming soon".
  - `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID` — the launch waitlist. Until set,
    the form tells people to email instead.
  - `BUILDERS_PASSWORD` — optional override for the `/builders` gate. If unset it
    defaults to `hellofin`.
- **Build/verify locally:** `npm run build` (must build clean), `npm run lint`.
  The site pre-renders most pages; demos/sandbox are server routes.

---

## 6. The builder demo system (how we make + ship a demo)

Each builder gets three things:

1. **A chromeless demo site** at `app/<slug>/site/**` — a full working redesign of
   their site, based on **their own** brand (real logo, their fonts, an
   appropriate palette), not a house template. Styling is scoped under a
   `.<slug>-site` wrapper. Built by cloning the **Lindon** demo kit
   (`components/lindon/…` + `app/lindon/site/…`) and reskinning. There's a helper:
   `scratchpad/clone-demo.sh <slug>` (cp + sed to namespace everything).
2. **A pitch page** at `app/(site)/<slug>/page.tsx` — public-facing, inherits the
   portfolio chrome, reuses `.lindon-cta` / `.lindon-demo-card` classes, links to
   the demo. "Good site, gone a bit stale, here's what I'd do" framing.
3. **An outreach email** — stored on the `/builders` page.

Shared demo pieces:
- **`DemoPreloader`** (`components/DemoPreloader.tsx`) — session-gated clip-wipe
  preloader on every demo (`sessionStorage` key `<slug>:preloaded`; plays once per
  browser session, never on refresh). Prop `bg` (white default, dark for BPPD).
- **`ProjectShowcase`** (per demo, `components/<slug>/sections/`) — full-bleed
  100vh parallax hero per featured project **with a thumbnail switcher that only
  renders when `project.images.length > 1`.** So a featured project needs 2–3
  real photos to get the switcher. Photos come from the builder's own site.

Demos must stay **noindex** and **out of `app/sitemap.ts`** (which is a manual
allowlist, not a crawl) and **unlinked from the nav**. They're private links you
send.

**`/builders`** is your private index of all 12 demos, their pitch/demo links, and
the outreach email for each. It's **password-gated** (HTTP Basic Auth in
`proxy.ts`): any username + password `hellofin`. It server-renders the emails, so
it's gated in middleware (a client-side box would leak the content).

Deeper demo rules (roster, per-client research, inspiration galleries, quality
bar) are in the Claude memory files `demo-build-playbook.md` and
`reference-galleries.md`.

---

## 7. How we work (process + conventions)

These are firm. They come from Finbar's standing instructions.

- **Push always.** After committing on this project, push to `main`. We commit and
  push directly to `main` (that's the established workflow here).
- **Never touch the live main site without being asked.** Don't modify the nav,
  home, footer, or shared components on a whim. Demos are the work area. If a
  shared-component change is needed for a demo, fork a demo-only variant. (Finbar's
  words: "don't ever touch main site without me telling you.")
- **No em dashes (—) in user-facing copy. Ever.** Use commas/periods. Code and
  commit messages are exempt.
- **Run the humanizer on user-facing copy** (`/the-humanizer` or `/humanizer`) —
  strip AI tells before shipping any prose (emails, page copy).
- **Brand mark = `FINBARSTUDIO*`** — Space Mono caps with a pink asterisk after.
  Never a ✶/★ star glyph. Two renderers: `BrandWordmark` (SVG, main site/nav) and
  `BrandWordmarkText` (demo footer credits only).
- **Commit footer:** end commit messages with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Content lives in flat data files** (`content/projects.ts`, etc.). Finbar edits
  content himself — keep it editable in one place, don't scatter copy into
  components.
- **Motion is CSS/GSAP only.** For simple reveals prefer IntersectionObserver + CSS
  (GSAP ScrollTrigger once broke the footer). No animation library beyond GSAP.
- **SEO continuity:** canonical host is `https://www.finbar.studio`; case studies
  live at `/case-studies/<slug>` to match existing backlinks. Per-project SEO
  overrides live in `content/projects.ts`.

---

## 8. Image pipeline (demo/site photos)

We upscale + sharpen every demo photo. Tools are local macOS apps:

- **Upscayl** (local app) for AI upscaling when a source is small:
  - binary: `/Applications/Upscayl.app/Contents/Resources/bin/upscayl-bin`
  - models: `/Applications/Upscayl.app/Contents/Resources/models`, model
    `high-fidelity-4x`
  - flags: `-i <in> -o <out> -s 4 -n high-fidelity-4x -m <models>`
  - **needs the sandbox disabled** when run from a tool (GPU + `/Applications`).
- **ImageMagick** (`/opt/homebrew/bin/magick`) to finish:
  `magick <src> -resize 1920x1920\> -strip -quality 82 -unsharp 0x0.7+0.6+0.008 out.webp`
- Rule: if the source's long edge is **< 1920px → Upscayl 4× first**, then resize;
  **≥ 1920px → just downscale** (upscaling a big image only softens it).
- The reusable batch script pattern is in `scratchpad/` (e.g.
  `process-featured.sh`). Raw source images get staged under `scratchpad/<slug>-*`.

**Tailwind + `/public` gotcha:** uploaded photos in `/public` can poison the CSS
build (garbage utility classes). Fixed with `@source not "../public"` in
`globals.css`. Keep it. Downscale huge photos before committing.

---

## 9. Environment gotchas (save yourself the headache)

- **macOS ships bash 3.2** — no associative arrays (`declare -A` fails). Write
  bash-3.2-safe scripts (use a temp file or plain arrays).
- **PATH is sometimes unset** inside tool-run shells — `sort`, `ls`, `curl`,
  `magick` come back "command not found". Use **absolute paths**: `/usr/bin/curl`,
  `/usr/bin/sort`, `/bin/ls`, `/opt/homebrew/bin/magick`.
- **Preview screenshots mis-render the Lenis demo pages** (narrow column / blank).
  Verify demos by: measuring horizontal overflow via `preview_eval`
  (`documentElement.scrollWidth` vs `innerWidth`), `npm run build`, and `curl`, not
  by trusting the screenshot. `preview_resize` first if `innerWidth` is 0.
- **Don't run `npm run build` while the preview dev server is running** — it serves
  stale CSS. If CSS looks wrong: stop dev, `rm -rf .next`, restart.
- Dev-server first compile of a demo route in Turbopack can take 10–50s. It's slow,
  not broken.

---

## 10. Everyday commands

```bash
npm run dev            # local dev, http://localhost:3000
npm run build          # production build — must be clean before you ship
npm run lint           # eslint
git add -A && git commit -m "…"   # (footer: Co-Authored-By: Claude Opus 4.8 …)
git push origin main   # push always → auto-deploys on Vercel
```

Sandbox locally: it's served on the subdomain in prod, but on `localhost` the
`/sandbox/*` paths work directly (the canonical redirect is env-gated off).

---

## 11. Where the deeper knowledge lives

The Claude memory folder (see §1 to carry it) has the fine detail, one fact per
file. Highlights:

- `demo-build-playbook.md` — canonical rules for building a demo.
- `reference-galleries.md` — the inspiration list to scrub per project.
- `brand-logo.md`, `feedback-*.md` — brand mark + the working rules in §7.
- `sandbox-tools.md`, `sandbox-library.md` — the Sandbox architecture.
- `next16-proxy-rename.md`, `tailwind-public-scan-gotcha.md`,
  `dev-build-cache-gotcha.md`, `preview-*.md` — the gotchas in §9.
- `imogen-guide.md`, `lindon-pitch-page.md`, per-builder notes — the one-offs.

If you're a new Claude and the memory folder wasn't copied over, this file is
enough to work safely. Re-derive anything else from the code, and write new
memories as you learn.
```
