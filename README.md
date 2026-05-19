# finbar✶studio

Personal portfolio for [finbar.studio](https://finbar.studio).

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**.
Deploy target: **Vercel** (static export friendly, no server-side data).

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Editing content

**All project content lives in one file: `/content/projects.ts`**

You never need to touch a component to update copy, dates, tags, images, or add/remove projects. Just edit this file.

### Update copy on an existing project

Open `/content/projects.ts`, find the project by name, and edit the fields:

```ts
{
  name: "Salesmasters",
  date: "2023–2024",          // ← change the date
  oneLiner: "...",             // ← one-line summary shown on cards
  role: "...",                 // ← case study meta
  problem: "...",              // ← case study meta
  outcome: "...",              // ← case study meta
  // ...
}
```

### Replace placeholder images

Every `src` field that starts with `https://placehold.co/` is a placeholder.
Replace it with a real image URL or a path to a local file in `/public/`:

```ts
// Before:
heroImage: {
  src: "https://placehold.co/1600x900/...",
  alt: "TMYR hero image",
}

// After (local file in /public/images/):
heroImage: {
  src: "/images/tmyr-hero.jpg",
  alt: "The Moment You Realise, campaign still",
}
```

If you use a new external domain for images, add it to `next.config.ts` under `images.remotePatterns`.

### Find all placeholders

Search for `// PLACEHOLDER` in `/content/projects.ts` to find every field that needs real content (dates, outcomes, metrics, images).

### Add a new project

Copy any existing project object, change the `slug` (URL-safe, kebab-case), set `rank` to where it should appear (lower = higher on the page), and set `tier`:
- `"featured"`, full-width card, has a full case study page
- `"full"`, half-width card, has a case study page
- `"gallery"`, third-width card, no case study page

### Add depth sections (Featured projects only)

Featured projects (tier: `"featured"`) can have an optional Process/Detail section on their case study page. Set `hasDepth: true` and populate the `depth` array:

```ts
hasDepth: true,
depth: [
  {
    heading: "Research & Writing",
    body: "One or two paragraphs, keep it short, let images carry the story.",
    images: [
      { src: "/images/...", alt: "Alt text", caption: "Short caption." },
    ],
  },
],
```

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Vercel detects Next.js automatically, no configuration needed.
4. Set your custom domain to `finbar.studio` in the Vercel project settings.

Every `git push` to `main` auto-deploys.

---

## File structure

```
app/
  globals.css          Design tokens, Tailwind theme, base styles
  layout.tsx           Root layout, fonts, sidebar, main wrapper
  page.tsx             Home page (hero + work grid)
  about/page.tsx       About page
  contact/page.tsx     Contact page
  work/[slug]/page.tsx Case study template (all featured + full projects)

components/
  Sidebar.tsx          Persistent left sidebar + mobile menu
  ProjectCard.tsx      Card variants: FeaturedCard, FullCard, GalleryCard

content/
  projects.ts          ← THE ONE FILE TO EDIT
```

---

## Tech

| Dependency | Purpose |
|---|---|
| `next` 16 | Framework, App Router, next/font, next/image |
| `react` 19 | UI |
| `tailwindcss` 4 | Styling (CSS-first config via `@theme` in globals.css) |
| `typescript` | Type safety |

No state management library. No CMS. No animation library. No other runtime dependencies.
