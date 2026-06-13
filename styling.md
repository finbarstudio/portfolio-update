# finbar✶studio — Design System & Styling Spec

A complete, portable description of the visual language used on finbar.studio.
Hand this file to a Claude agent when starting a **new** app and ask it to match
the styling as closely as the new architecture allows. It captures the tokens,
type scale, spacing, colour, motion, hover behaviour, and component recipes —
not the specific page layouts.

> **Stack note:** the original is Next.js 16 (App Router) + React 19 + Tailwind
> CSS 4 (CSS-first `@theme`, no `tailwind.config`). The tokens below are plain
> CSS custom properties and work in any framework. Where something is
> Tailwind-v4-specific it's called out; translate freely.

---

## 1. Design philosophy

- **Swiss / International Typographic Style.** Restrained, type-driven, lots of
  whitespace. The work (content/imagery) leads; chrome recedes.
- **Separation by surface + elevation, not borders.** The page sits on a soft
  off-white; cards/media sit on pure white and lift with soft shadow. Hairlines
  exist but are barely-there. Avoid heavy intersecting rules.
- **One accent, used sparingly.** Magenta-pink is the only strong colour;
  everything else is near-black ink on off-white. A cool blue is a rare
  secondary (status/"open for work").
- **One easing curve, one base duration** drive every transition for a unified,
  premium feel. Motion is CSS-only — no animation libraries.
- **Monospaced-feeling caps for labels.** Uppercase, heavily tracked, bold
  labels for nav/meta/tags create the editorial/"OS" texture (the font isn't
  actually mono — it's a condensed sans set in caps with wide letter-spacing).
- **Accessibility is built in:** visible focus rings, a skip link, `(hover:hover)`
  gating so touch never gets stuck hover states, and `prefers-reduced-motion`.

---

## 2. Typography

**Family:** [Archivo Narrow](https://fonts.google.com/specimen/Archivo+Narrow)
for *everything* — body, headings, and the caps labels. A single condensed
grotesque, differentiated by weight, size, tracking, and casing rather than by
mixing families.

- Weights loaded: **400, 500, 600, 700** (plus italics 400/700).
- `display: swap`. Fallback stack: `ui-sans-serif, system-ui, sans-serif`.

Next.js loader (adapt to your framework — the point is `font-display: swap` and
a CSS variable):

```ts
import { Archivo_Narrow } from "next/font/google";
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
// apply archivoNarrow.variable to <html>
```

```css
--font-primary: var(--font-archivo-narrow), ui-sans-serif, system-ui, sans-serif;
--font-label:   var(--font-archivo-narrow), ui-sans-serif, system-ui, sans-serif;
```

### Type scale (geometric ~1.25, fluid with `clamp`)

| Token | Value | Use |
|---|---|---|
| `--text-display` | `clamp(2.25rem, 5.5vw, 4rem)` | hero display |
| `--text-h1` | `clamp(1.5rem, 3vw, 2.25rem)` | page title |
| `--text-h2` | `clamp(1.25rem, 2vw, 1.5rem)` | section headings |
| `--text-h3` | `1.125rem` | sub-headings |
| `--text-body` | `0.9375rem` (15px) | prose |
| `--text-small` | `0.875rem` (14px) | card summaries, meta |
| `--text-caption` | `0.75rem` (12px) | image captions |
| `--text-label` | `0.6875rem` (11px) | uppercase caps labels, nav |
| `--text-tag` | `0.5625rem` (9px) | tag pills |

### Line-heights

| Token | Value | Use |
|---|---|---|
| `--leading-tight` | `1.04` | display + headings (never fragment) |
| `--leading-snug` | `1.25` | sub-headings |
| `--leading-normal` | `1.6` | body copy |

Base: `body` uses `--font-primary`, `--text-body`, `--leading-normal`,
`-webkit-font-smoothing: antialiased`. `h1, h2` use `--leading-tight`;
`h3` uses `--leading-snug`.

### The caps-label treatment (signature texture)

```css
.mono-label {                 /* nav, tags, meta */
  font-family: var(--font-label);
  font-weight: 700;
  font-size: var(--text-label);      /* 11px */
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.4;
}
.mono-heading {               /* card titles, small section heads */
  font-family: var(--font-label);
  font-weight: 700;
  font-size: 0.75rem;                /* 12px */
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.4;
}
```

Display/page titles: bold (`700`), `uppercase`, `letter-spacing: 0.03em`,
`line-height: 1.02`.

---

## 3. Colour

Exact values — the whole palette is intentionally tiny.

| Token | Hex | Role |
|---|---|---|
| `--bg` / `--surface` | `#FAFAF8` | page + chrome ground (soft off-white) |
| `--ink` | `#141414` | primary text (near-black) |
| `--ink-soft` | `#6B6B6B` | secondary text, captions, meta |
| `--line` | `#E8E8E4` | hairline borders, grid lines |
| `--pink` | `#FF1F8F` | **primary accent** — links, hover, tags, focus |
| `--teal` | `#4DA8E0` | secondary — "open for work" badge/dot, teal tags |
| `--surface-raised` | `#ffffff` | cards, media tiles, panels |
| `--surface-sunken` | `#F2F2EF` | grouped/inset regions, skeleton base |
| `--thumb-bg` | `#e0e0e0` | shared background behind all media thumbnails |

**Usage rules**
- Text is `--ink` on `--bg`; secondary text `--ink-soft`. Never pure black/white.
- Pink is the only strong colour — reserve it for interactive state (hover,
  active link, focus ring) and a few brand accents. Don't fill large areas.
- Teal is rarer still: the status badge/dot and the occasional teal tag.
- For tints, prefer `color-mix(in srgb, var(--pink) 20%, transparent)` over new
  hex values (used for hover washes, glows).

### Elevation (soft, low-contrast shadows — the separation system)

```css
--elev-1: 0 1px 2px rgba(20,20,20,0.03), 0 2px 8px rgba(20,20,20,0.04);
--elev-2: 0 2px 6px rgba(20,20,20,0.05), 0 10px 28px rgba(20,20,20,0.07);
--elev-3: 0 6px 16px rgba(20,20,20,0.07), 0 22px 48px rgba(20,20,20,0.10);
```

Rest state of a card = `--elev-1`. Hover = `--elev-2` (+ pink ring, see §7).

---

## 4. Spacing — strict base-8

```css
--space-1: 0.25rem;  /*  4 */   --space-6:  2rem;   /* 32 */
--space-2: 0.5rem;   /*  8 */   --space-7:  3rem;   /* 48 */
--space-3: 0.75rem;  /* 12 */   --space-8:  4rem;   /* 64 */
--space-4: 1rem;     /* 16 */   --space-9:  6rem;   /* 96 */
--space-5: 1.5rem;   /* 24 */   --space-10: 8rem;   /* 128 */
```

Semantic, derived:
- `--space-section: var(--space-9)` — 96px between major sections.
- `--image-pad: var(--space-6)` — 32px breathing room around media.
- `--hit: 44px` — minimum interactive hit zone (touch + cursor).

**Drive every padding / margin / gap from these tokens.** Whitespace is generous
— when in doubt, use the larger step. Page gutters in the reference are
`px-5` (20px) on mobile, `px-10` (40px) desktop.

---

## 5. Radii

- Media tiles / cards: **16px**.
- Small panels / inputs: 8px.
- Tag pills: **2px** (deliberately crisp, not rounded).
- Pills/badges that should read as capsules: `border-radius: 999px`.

---

## 6. Motion

```css
--ease:     cubic-bezier(0.22, 0.61, 0.36, 1);  /* THE curve, everywhere */
--dur-fast: 140ms;   /* colour/opacity flips */
--dur:      240ms;   /* default */
--dur-slow: 420ms;   /* card lift, sidebar expand */
```

Rules:
- Use `--ease` for essentially every transition.
- Colour/opacity → `--dur-fast`; most things → `--dur`; large layout moves →
  `--dur-slow`.
- CSS only. No Framer Motion / GSAP.
- Always honour `@media (prefers-reduced-motion: reduce)` — disable non-essential
  keyframe loops and large transforms.

Signature keyframes:

```css
@keyframes fade-up {            /* card/element entrance */
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-animate { animation: fade-up var(--dur) var(--ease) both; }
/* stagger siblings with inline animation-delay: index * 0.03s */

@keyframes dot-pulse {          /* live status dot */
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.35; transform: scale(0.7); }
}

@keyframes skeleton-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.55 } }
@keyframes skeleton-sweep { from { transform: translateX(-100%) } to { transform: translateX(100%) } }
```

---

## 7. Interaction & hover patterns

**The core rule: gate hover to hover-capable devices, give touch a tap state.**
This avoids stuck-hover glitches on mobile.

```css
@media (hover: hover) {
  .group:hover .card-thumb { box-shadow: var(--elev-2), 0 0 0 6px var(--pink); }
}
/* touch / keyboard: same effect on tap/focus instead of hover */
.group:active .card-thumb,
.group:focus-within .card-thumb { box-shadow: var(--elev-2), 0 0 0 6px var(--pink); }
```

- **Card hover** = elevation rise (`elev-1` → `elev-2`) **plus a 6px pink ring**
  (`0 0 0 6px var(--pink)`). **Do not translate** the card on hover — it makes
  embedded WebGL/canvas content visibly jump; lift via shadow only.
- **Links** flip to pink on hover (`transition: color var(--dur-fast)`), no
  underline animation. Sidebar/nav links: `--ink-soft` → `--pink`; active = pink.
- **Progressive disclosure:** secondary meta (e.g. tags/summary on a card) is
  collapsed (`grid-template-rows: 0fr`) and revealed on hover/focus **only on
  `(hover: hover) and (pointer: fine)`**; touch devices always show it.
- **Focus ring (global):**
  ```css
  :focus-visible { outline: 2px solid var(--pink); outline-offset: 2px; border-radius: 2px; }
  ```
- **Image zoom on hover** (static thumbnails): scale the inner image, not the
  container; share the card's single `.group` hover state.

---

## 8. Component recipes

### Tag pill
```css
.tag {
  font-family: var(--font-label); font-weight: 700;
  font-size: var(--text-tag); letter-spacing: 0.12em;
  text-transform: uppercase; padding: 0.2em 0.6em;
  border-radius: 2px; display: inline-block; line-height: 1.6;
}
.tag-default { background: var(--line); color: var(--ink-soft); }
.tag-teal    { background: var(--teal); color: var(--ink); }
.tag-pink    { background: var(--pink); color: var(--bg); }
```

### "Open for work" status badge (pulsing dot)
Uppercase caps label with a leading teal dot animated via `dot-pulse`
(`::before`, `background: var(--teal)`, 2s loop).

### Media thumbnail
```css
.card-thumb {
  border-radius: 16px; overflow: hidden;
  background: var(--thumb-bg); box-shadow: var(--elev-1);
  transition: box-shadow var(--dur) var(--ease);
}
```
Plus the hover/active ring from §7.

### Skeleton loader (geometry-matching placeholder)
Absolutely-filled element on `--surface-sunken`, `skeleton-pulse` opacity loop +
a `skeleton-sweep` shimmer gradient (`rgba(255,255,255,0.6)`) via `::after`.
Always size the skeleton to the incoming media's aspect ratio so there's no
layout shift.

### Skip link (a11y)
Visually hidden until focused, then pinned top-left over the chrome:
```css
.skip-link { position: fixed; top: 8px; left: 8px; transform: translateY(-150%);
  background: var(--ink); color: var(--bg); padding: 10px 16px; border-radius: 4px;
  font-weight: 700; letter-spacing: 0.04em; transition: transform 0.18s ease; z-index: 200; }
.skip-link:focus { transform: translateY(0); outline: 2px solid var(--pink); outline-offset: 2px; }
```

---

## 9. Brand mark — the star (✶)

A **solid six-pointed star**, point-up, pink (`#FF1F8F`). Used in the wordmark
(`finbar✶studio`), favicon, app icons, OG image, and as the loading spinner.
Don't rely on the Unicode `✶` glyph (renders differently per system font and
`next/og` can't render it) — draw it as an SVG polygon. Outer radius 42, inner
radius 11 on a 0–100 viewBox (tight inner radius = narrow, sharp spikes, *not*
a chunky Star-of-David):

```
points = "50,8 55.5,40.5 86.4,29 61,50 86.4,71 55.5,59.5 50,92 44.5,59.5 13.6,71 39,50 13.6,29 44.5,40.5"
```

```jsx
<svg viewBox="0 0 100 100"><polygon points={STAR_POINTS} fill="currentColor" /></svg>
```

### Loading spinner (the star, self-tracing)
Two stacked polygons: a faint static "track" + a glowing pink stroke that draws
itself on a loop. **No rotation.** CSS-only:

```css
.star-loader-track { fill:none; stroke: color-mix(in srgb, var(--pink) 16%, transparent); stroke-width:5.5; stroke-linejoin:round; }
.star-loader-draw  { fill:none; stroke: var(--pink); stroke-width:5.5; stroke-linejoin:round; stroke-linecap:round;
  stroke-dasharray:1; animation: star-draw 1.5s ease-in-out infinite;
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--pink) 60%, transparent)); }
@keyframes star-draw { 0%{stroke-dashoffset:1} 45%{stroke-dashoffset:0} 55%{stroke-dashoffset:0} 100%{stroke-dashoffset:-1} }
@media (prefers-reduced-motion: reduce){ .star-loader-draw{ animation:none; stroke-dasharray:none; } }
```
Set `pathLength="1"` on the `.star-loader-draw` polygon so the dash math is
geometry-independent. Center it over the skeleton; render it as a **sibling** of
the pulsing skeleton (not a child) so the skeleton's opacity pulse doesn't dim it.

---

## 10. Layout chrome (only if relevant to the new app)

The reference is an "OS-style" shell: a thin fixed top menubar + a persistent
collapsible left sidebar. Tokens:

```css
--menubar-h: 26px;   /* 40px on mobile for a real tap target */
--statusbar-h: 22px;
--sidebar (expanded): 224px;  --sidebar (collapsed): 48px;
```
- Sidebar expand/collapse uses `--dur-slow` on `margin-left` with `--ease`.
- `<main>` carries `overflow-x: clip` to kill incidental horizontal scroll, and
  `id="main-content" tabindex="-1"` as the skip-link target.

Most new apps won't want this exact chrome — skip it and keep the tokens,
type, colour, spacing, motion, and component recipes above.

---

## 11. Tailwind v4 bridge (if using Tailwind v4)

CSS-first config — no `tailwind.config.ts`. Map tokens into `@theme` so utilities
like `bg-bg`, `text-ink`, `text-pink`, `border-line`, `text-teal` exist:

```css
@import "tailwindcss";
@theme {
  --color-bg: var(--bg);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-line: var(--line);
  --color-pink: var(--pink);
  --color-teal: var(--teal);
  --color-surface: var(--surface);
  --color-surface-raised: var(--surface-raised);
  --color-surface-sunken: var(--surface-sunken);
  --font-sans: var(--font-primary);
  --font-mono: var(--font-label);
}
```

Define all the `:root` custom properties from §2–§6 in the same global stylesheet;
everything else reads from them, so restyling = editing the tokens once.

---

## 12. Quick-start checklist for a new app

1. Load Archivo Narrow (400/500/600/700) with `display: swap` → CSS var.
2. Paste the full `:root` token block (fonts, colour, surface/elevation, motion,
   type scale, spacing, radii).
3. Set `body`: `--bg` ground, `--ink` text, `--font-primary`, `--text-body`,
   `--leading-normal`, antialiased.
4. Add the global `:focus-visible` pink ring and the skip link.
5. Build components from the recipes: `.mono-label` / `.mono-heading`, `.tag*`,
   `.card-thumb` (+ hover ring), `.card-animate`, skeleton, star loader.
6. Gate all hover effects behind `@media (hover: hover)`; give touch an
   `:active`/`:focus-within` equivalent.
7. Keep motion on `--ease` + the duration tokens; respect reduced-motion.
8. Use the star polygon for any brand mark / spinner.

Keep it restrained: off-white ground, near-black type, generous whitespace,
pink only for interaction, soft elevation instead of borders.
