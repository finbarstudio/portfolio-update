# finbar✶studio — Design System Reference

This is the authoritative design-system document for the studio portfolio (not the demo/sandbox/pitch satellite sites — see section 11). Every value below is copied verbatim from source, primarily `app/globals.css`. Where a comment disagrees with the code, the code wins; discrepancies are logged at the end.

Sources read: `app/globals.css`, `AGENTS.md`, `app/layout.tsx`, `components/BrandMark.tsx`, `components/brand-mark.ts`, `components/BrandWordmark.tsx`, `components/BrandWordmarkText.tsx`, `components/NavLogo.tsx`, `components/ui/loader.tsx`, `components/SiteFooter.tsx`, `components/FooterCopyright.tsx`, `components/BookCall.tsx`, `components/ContactPanel.tsx`, `components/ContactDirect.tsx`, `components/ContactNoteForm.tsx`, `components/Testimonial.tsx`, `components/TopNav.tsx`.

---

## 1. The palette

The whole site is built from exactly four colours, declared in `app/globals.css` `:root` (lines 51–90):

| Token | Hex | Job |
|---|---|---|
| `--bg` | `#FDF9F9` | The ground. "near-white ground with the faintest pink cast" |
| `--pink-deep` | `#510415` | The dark pink, from the mark's centre dot |
| `--pink` | `#E96D89` | The main pink, from the mark's tips (★ CORE) |
| `--ink` | `#211E1A` | Warm near-black, primary text |

`--pink-deep` and `--ink` are BOTH dark, and do different jobs (globals.css comment, verbatim intent):
- `--pink-deep` is the brand's own dark — the logo, H1-tier display headings that speak as the brand.
- `--ink` is the reading colour — body, H2 and below, UI. Default to `--ink` unless the thing being coloured IS the brand speaking.

**Tier note (AGENTS.md, Finbar's call):** H1 is `--ink` (the reading colour — a page title is the first thing you read); section-title H2s are `--pink-deep` (the brand dark). This is the opposite emphasis from what the globals.css block above implies in isolation ("H1 display headings") — AGENTS.md is more specific and current; see Discrepancies.

Tertiary ramp (gradient-only, never UI — reach for `--pink` or `--pink-deep` instead if tempted):

| Token | Hex |
|---|---|
| `--pink-2` | `#CB5872` |
| `--pink-3` | `#AC435B` |
| `--pink-4` | `#8E2E43` |
| `--pink-5` | `#6F192C` |

```css
--brand-gradient: linear-gradient(160deg, #E96D89 0%, #CB5872 22%, #AC435B 44%, #8E2E43 64%, #6F192C 82%, #510415 100%);
```

Other core tokens (`:root`, lines 51–118):

| Token | Hex / value | Comment in source |
|---|---|---|
| `--ink-soft` | `#6E675C` | warm grey, secondary text (AA on cream) |
| `--line` | `#E2D8C5` | warm hairline borders |
| `--pink-soft` | `#F6C9D1` | light wash of the accent (reveals, fills) |
| `--teal` | `#6FAE9F` | SECONDARY, dusty sage-teal |
| `--accent-blue` | `#6E8CB0` | dusty blue (pill colour-coding) |
| `--accent-mustard` | `#E0B24A` | mustard (pill colour-coding) |
| `--accent-orange` | `#DD8A5C` | terracotta (pill colour-coding) |
| `--surface` | `#FDF9F9` | page + chrome ground (matches `--bg`) |
| `--surface-raised` | `#FBF6EC` | cards, media tiles, panels (light cream) |
| `--surface-sunken` | `#F3F1ED` | grouped / inset regions |
| `--thumb-bg` | `#EAE0CC` | shared background behind all thumbnails |
| `--elev-1` | `0 1px 2px rgba(20,20,20,.03), 0 2px 8px rgba(20,20,20,.04)` | |
| `--elev-2` | `0 2px 6px rgba(20,20,20,.05), 0 10px 28px rgba(20,20,20,.07)` | |
| `--elev-3` | `0 6px 16px rgba(20,20,20,.07), 0 22px 48px rgba(20,20,20,.10)` | |

**NOT studio tokens** even though declared in the same `:root` (OJ Pippin demo palette, lines 59–66): `--bone #f4eee3`, `--bone-2 #ece1d1`, `--cream #fbf7ef`, `--clay #b35a33`, `--clay-soft #c47a55`, `--olive #6e6e62`, `--sand #d8c8b1`, `--umber #221c16`. These exist only so `@theme` colour utilities resolve for `app/oj-pippin/site` and `.ojpippin-site` — never use them as studio colours.

The Tailwind bridge (`@theme` block, lines 192–219) maps `--color-bg`, `--color-ink`, `--color-ink-soft`, `--color-line`, `--color-pink`, `--color-pink-deep`, `--color-teal`, `--color-surface(-raised/-sunken)` straight to the `:root` values above, giving utilities `bg-bg`, `text-ink`, `text-pink`, `border-line`, `text-teal`, etc.

---

## 2. Logos & marks

### The gradient logomark (`BrandMark.tsx` + `brand-mark.ts`)

`viewBox="0 0 831.88 831.88"`. Six shapes, listed in **paint order** (first painted = bottom/largest, last = top/smallest — the centre dot):

| Order | Shape | Fill hex |
|---|---|---|
| 1 | polygon (8-spoke asterisk outline) | `#E96D89` |
| 2 | path | `#CB5872` |
| 3 | path | `#AC435B` |
| 4 | path | `#8E2E43` |
| 5 | path | `#6F192C` |
| 6 | circle, `cx="415.94" cy="415.94" r="32.14"` | `#510415` |

Extracted verbatim from Finbar's supplied artwork ("Brand/SVG/Gradient Logomark.svg"), not redrawn — "five nested eight-spoke asterisks stepping from the light pink at the tips down to the dark centre, plus the centre dot." `BRAND_RAMP` in `brand-mark.ts` exports the same six hexes light-to-dark; `RAMP[0]` = main (`#E96D89`), `RAMP[5]` = secondary/deepest (`#510415`).

Each shape carries `--layer` = distance from the centre dot (0 at centre, 5 at the outermost tip), set as an inline style — inert by itself, consumed by the pulse animations (section 5).

The mark does **NOT** take `currentColor`. It carries its own six-step ramp and cannot be recoloured by its parent — this is deliberate (comment: "it's the brand").

### The wordmark lockup

`BrandWordmark.tsx` renders `FINBARSTUDIO` (literal string, no space) + the gradient `BrandMark` on the end, wrapped in `.brand-wordmark`:

```css
.brand-wordmark {
  font-family: var(--font-host), "Host Grotesk", system-ui, sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
```

The mark sits in `.brand-wordmark-mark` (`font-size: 0.72em`, `color: var(--pink)`, tuned to the cap/x-height of the text) wrapping `.brand-wordmark-asterisk` (`width: 1em; height: 1em`). This is the canonical logo lockup — used in the nav (`NavLogo.tsx` → `.nav-logo`), the main site footer's giant wordmark, the favicon, and OG images.

### `BrandWordmarkText` — demo credits only

Renders `FINBARSTUDIO` + Space Mono's own literal `*` character (`.brand-wordmark-star`, `font-family: var(--font-mono)`, `color: var(--pink, #e96d89)`) instead of the SVG mark. Used **only** for the small "Concept site by" credits in demo-site footers (A Rolley / Braeden / Lindon / OJ Pippin), where the inline SVG asterisk threw off baseline + letter-spacing at ~9–11px. Component doc-comment: "The main site keeps `BrandWordmark`... don't swap that one."

### NEVER rules

- Never a ✶ or ★ Unicode star glyph anywhere. The mark is always the six-shape gradient SVG (main UI) or Space Mono's literal `*` (demo credits only).
- The gradient mark ignores `currentColor` / parent colour — it always renders its own baked-in ramp.

---

## 3. Typography

### Loaded faces (`app/layout.tsx`, `next/font/google`)

| Import | CSS variable | Weights | Role |
|---|---|---|---|
| `Archivo` | `--font-archivo` | variable weight | Loaded site-wide but **not referenced anywhere in `app/globals.css`** — only consumed by satellite surfaces (`app/imogen/imogen.css`, `app/norths-devils/norths-devils-site.css`, `app/toombul/toombul-site.css`, `app/toombul/layout.tsx`). Not part of the studio system's own type stack. |
| `Space_Mono` | `--font-space-mono` | 400, 700 | Small-detail mono face: dates, badges/tags, the contact email, editorial links |
| `Host_Grotesk` | `--font-host` | 400, 500, 600, 700 | Display grotesque for big titles — hero, site-list rows, H1, most display classes |
| `Noto_Sans_Symbols_2` | `--font-dingbat` | 400 | Inline dingbat glyphs in the home disciplines wall (`.home-disc-icon`). `display: "block"` (not `swap`) and `preload: false` — the glyph slot stays invisible until ready rather than flashing tofu; it's the heaviest font on the site (~230KB) so it's never preloaded ahead of text fonts. |

No Bookmania/Typekit is loaded. `app/layout.tsx` comment: "Bookmania (Typekit) was removed: `--font-display` is referenced nowhere and HeroHeadline is unmounted, so the render-blocking third-party stylesheet was pure LCP cost on every page."

### Font tokens (`:root`, globals.css lines 27–44)

| Token | Value | Consumed by |
|---|---|---|
| `--font-primary` | `var(--font-host), "Host Grotesk", ui-sans-serif, system-ui, sans-serif` | Body copy, headings, display text (comment says "Both use Host Grotesk" for primary+label — see Discrepancies) |
| `--font-label` | `var(--font-host), "Host Grotesk", ui-sans-serif, system-ui, sans-serif` | Uppercase caps labels, nav, tags. Comment: "Labels consolidated onto Host Grotesk (Archivo Narrow removed 18 Jul 2026)" |
| `--font-display` | `Georgia, "Times New Roman", serif` | Fallback stack only — "Bookmania/Typekit was removed as unused"; nothing in the live CSS actually renders this except `.quote-box-mark`'s serif quote mark |
| `--font-host` (the Google-loaded variable, referenced directly in many component classes) | Host Grotesk | `h1`, `.home-hero-display`, `.home-display`, `.home-display-sm`, `.home-disc`, `.contact-title`, `.book-call-pill`, `.brand-wordmark`, `.site-footer-mark-inner` |
| `--font-mono` (set in `@theme`, `var(--font-space-mono), ui-monospace, SFMono-Regular, Menlo, monospace`) | Space Mono | `.tag`, `.sticker-pill`, `.hero-pill`, `.mono-h3`, `.contact-link`, `.contact-col-label`, `.nav-tip`, `.home-link`, `.brand-wordmark-star`, `.home-disc-icon` fallback |
| `--font-dingbat` | Noto Sans Symbols 2 | `.home-disc-icon` only |

### Type hierarchy

- **H1** — `--ink` (base `@layer base` rule, globals.css ~line 304): `font-family: var(--font-host)`, `text-transform: uppercase`, `letter-spacing: -0.02em`, `line-height: var(--leading-tight)` (1.04).
- **Section-title H2s** — `--pink-deep`, via `.display-brand` (for inline-styled H2s) or the display-H2 classes that already bake it in: `.contact-title`, `.outcomes-title`, `.delivered-title`, `.kinaya-section-name`. Small mono H2s (`.mono-heading` — privacy sections, project-card titles) stay `--ink`; they're labels, not section titles.

```css
.display-brand { color: var(--pink-deep); }
```

### Named display/label classes, exact values

| Class | Font | Weight | Size (clamp) | Tracking | Case | Line-height |
|---|---|---|---|---|---|---|
| `.home-hero-display` | Host Grotesk | 600 | `clamp(2.3rem, 6.2vw, 5.9rem)` | `-0.02em` | none | 1.08 |
| `.home-display` | Host Grotesk | 600 | `clamp(2.4rem, 7.5vw, 5.6rem)` | `-0.02em` | uppercase | 0.98 |
| `.home-display-sm` | Host Grotesk | 600 | `clamp(1.7rem, 4vw, 2.9rem)` | `0.01em` | uppercase | 1.0 |
| `.mono-heading` | Host Grotesk (`--font-label`) | 700 | `0.75rem` (12px) | `0.16em` | uppercase | 1.4 |
| `.mono-label` | Host Grotesk (`--font-label`) | 700 | `var(--text-label)` = `0.6875rem` (11px) | `0.14em` | uppercase | 1.4 |
| `.mono-h3` | Space Mono (`--font-mono`) | 500 | `clamp(0.95rem, 2.2vw, 1.45rem)` | `0.16em` | uppercase | 1.2 |
| `.contact-title` | Host Grotesk | 600 | `clamp(1.9rem, 5.2vw, 2.7rem)` (popup: `clamp(1.5rem, 3vw, 2.2rem)`) | `0.005em` | uppercase | 1.02 |
| `.outcomes-title` / `.delivered-title` / `.kinaya-section-name` | `--font-primary` (Host Grotesk) | 700 | `clamp(1.125rem, 2.4vw, 1.625rem)` | `-0.005em` | uppercase | 1.05, colour `--pink-deep` |
| `.home-disc` | Host Grotesk | 600 | `clamp(1.6rem, 5.5vw, 4.5rem)` | `0.01em` | uppercase | 1.04 |
| `.meta-mono` | Host Grotesk (`--font-label`) | 700 | inherits | `0.12em` | uppercase | 1.4 |

Base type scale tokens (`:root`, lines 133–145): `--text-display: clamp(2.25rem,5.5vw,4rem)`, `--text-h1: clamp(1.5rem,3vw,2.25rem)`, `--text-h2: clamp(1.25rem,2vw,1.5rem)`, `--text-h3: 1.125rem`, `--text-body: 0.9375rem` (15px), `--text-small: 0.875rem` (14px), `--text-caption: 0.75rem` (12px), `--text-label: 0.6875rem` (11px), `--text-tag: 0.625rem` (10px). Leading tokens: `--leading-tight: 1.04`, `--leading-snug: 1.25`, `--leading-normal: 1.6`.

---

## 4. Buttons & mini tokens

### `.tag` (the base pill token, globals.css lines 1091–1131)

```css
.tag {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: var(--text-tag);      /* 10px */
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.4em 0.5em;
  border-radius: 3px;
  border: 1px solid var(--ink);
  display: inline-block;
  line-height: 1;
  background: transparent;
  color: var(--ink);
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
}
```

Variants:
- `.tag-default` — `border-color: var(--ink); color: var(--ink)` (hover → pink, both text and border)
- `.tag-skill` — `border-color: var(--accent-blue); color: var(--accent-blue)`
- `.tag-teal` — `border-color: var(--teal); color: var(--teal)`
- `.tag-mustard` — `border-color: var(--accent-mustard); color: var(--accent-mustard)`
- `.tag-pink` — `background: var(--pink); border-color: var(--pink); color: var(--bg)` (filled)
- `.tag-num` — `font-family: var(--font-label)` (Archivo/Host Grotesk numerals, not mono — "mono numerals read badly"), `letter-spacing: 0.1em`
- `.tag-ext` — `display: inline-flex; gap: 0; padding-right: 0.4em` (pairs with `.nav-ext-bubble`, a filled circle holding an external-link arrow)

Touch devices (`pointer: coarse`): padding bumps to `0.8em 1em` with an invisible `::after` hit-area extending `inset: -6px`, to reach ~44px without changing the desktop look.

### `.sticker-pill` (globals.css lines 597–623)

```css
.sticker-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  border: 1px solid var(--ink);
  border-radius: 3px;
  padding: 0.46em 0.95em;
  font-family: var(--font-mono);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: var(--text-label);   /* 11px */
  line-height: 1;
  color: var(--ink);
  background: var(--bg);
}
```
`.is-pink` variant: `border-color: var(--pink); color: var(--pink)`; on hover it fills (`background: var(--pink); color: var(--bg)`).

### `.book-call-pill` (globals.css lines 5163–5185, unlayered)

```css
.book-call-pill {
  background: var(--pink-deep);
  border-color: var(--pink-deep);
  color: var(--bg);
  font-family: var(--font-host), "Host Grotesk", system-ui, sans-serif;
  letter-spacing: 0.02em;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.8em 1.5em;
}
/* hover (hover:hover only) */
button.book-call-pill:hover { background: var(--pink); border-color: var(--pink); color: var(--bg); }
```
Composed as `<button className="sticker-pill book-call-pill">` — the sticker-pill silhouette, filled pink-deep by default (static, no pulsing — "the animated versions read as noise"), hover lifts to the main pink. Host Grotesk instead of the base pill's mono, because "it's a headline act, not a label." Declared unlayered on purpose so it beats `.sticker-pill:hover`'s layered outline rule without `!important`.

### `.pitch-cta` family (pitch/prospect pages only — NOT the studio system proper)

`.pitch-cta` / `.lindon-cta` (co-selectors, globals.css lines 5012–5046): `font-family: var(--font-mono)`, weight 700, `border-radius: 999px` (fully pill), `border: 1px solid var(--ink)`, `padding: 0.95em 1.7em`, `font-size: 0.9rem`. `.pitch-cta-pink` fills `var(--pink)`; `.pitch-cta-ghost` is transparent, hovers to pink border+text. Used on `/qldpools` and archived `/lindon` only.

### `.hero-pill` / `.home-cap-pill`

`.hero-pill` (home-hero nav pills): Space Mono, `clamp(0.8rem, 1vw, 0.95rem)`, `border-radius: 3px`, `border: 1px solid var(--ink)`, `padding: 0.55em 1em`; hover fills ink. `.hero-pill-social` variant borders/colours pink instead of ink.

`.home-cap-pill` ("How I help businesses" capability pills, globals.css lines 4162–4176): `border: 1px solid var(--ink)`, `border-radius: 3px`, `padding: 0.16em 0.62em 0.22em`; hover (hover-capable only) fills pink with `--bg` text.

### `.nav-tip` dropdown (globals.css lines 4471–4505)

The nav social icons' hover/focus label. Uses the **same token as `.tag`**: `background: var(--bg)`, `color: var(--ink)`, `border: 1px solid var(--ink)`, `border-radius: 3px`, `padding: 0.4em 0.5em`, `font-family: var(--font-mono)`, `font-weight: 400`, `font-size: var(--text-tag)`. Positioned `top: calc(100% + 9px)` below the icon.

---

## 5. The pulse — THE animation token

`:root` (globals.css lines 93–97):
```css
--brand-loader-dur: 1.6s;      /* one full bloom-hold-collapse cycle */
--brand-loader-stagger: 0.12s; /* delay from one layer to the next   */
```
Comment: "one clock for every pulsing mark (loaders, the 404 zeros, the footer asterisk) and the Book-a-call colour swing. Edit here, everything moves together."

### `@keyframes brand-loader-pulse` (inner layers, globals.css lines 1293–1299)

```css
@keyframes brand-loader-pulse {
  0%   { transform: scale(0);   opacity: 0; }
  36%  { transform: scale(1.1); opacity: 1; }  /* back.out-style overshoot */
  46%  { transform: scale(1); }
  72%  { transform: scale(1);   opacity: 1; }  /* hold assembled */
  100% { transform: scale(0);   opacity: 0; }  /* collapse into the next beat */
}
```

### `@keyframes brand-loader-pulse-outer` (outermost layer only, lines 1304–1309)

```css
@keyframes brand-loader-pulse-outer {
  0%   { transform: scale(0); opacity: 0; }
  36%  { transform: scale(1); opacity: 1; }
  72%  { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}
```
Comment: "The outermost layer (first in paint order, the primary-pink silhouette) DEFINES the mark's final size, so it never swells past it — overshooting made the whole mark read too big before settling."

### Consumers

- **`BrandLoader`** (`components/ui/loader.tsx`, alias `LoaderThree`) — THE loading icon everywhere: image placeholders (ClientImage), route `loading.tsx` skeletons, 3D/model loaders. Renders the six `MARK_SHAPES` at `size` (default 46px, or `"fluid"` to fill a positioned parent) inside `.brand-loader`, driven by the CSS keyframes above at `var(--brand-loader-dur)` = 1.6s.
- **404 zeros** (`.mark-pulse`) — the decorative cousin, same centre-out pulse on a bare `BrandMark`, offset per-mark via `--mark-delay`.
- **Footer asterisk** (`.site-footer-mark-inner .brand-wordmark-asterisk > *`) — runs the SAME keyframe at **8s** (literal, comment: "the shared pulse choreography at 5x" — 1.6s × 5 = 8s), "slowed right down so it reads as a living logo rather than a spinner." Literal per-`nth-child` delays: child 1 = `3s`, child 2 = `2.4s`, child 3 = `1.8s`, child 4 = `1.2s`, child 5 = `0.6s`, child 6 = `0s`. First child gets `animation-name: brand-loader-pulse-outer`.

Per-layer delays for the 46px loader (calc-based, safe because it's `time + time` not `number × time`):
```css
:nth-child(1) { animation-delay: calc(0.6s  + var(--mark-delay, 0s)); }
:nth-child(2) { animation-delay: calc(0.48s + var(--mark-delay, 0s)); }
:nth-child(3) { animation-delay: calc(0.36s + var(--mark-delay, 0s)); }
:nth-child(4) { animation-delay: calc(0.24s + var(--mark-delay, 0s)); }
:nth-child(5) { animation-delay: calc(0.12s + var(--mark-delay, 0s)); }
:nth-child(6) { animation-delay: calc(0s    + var(--mark-delay, 0s)); }
```

### iOS RULE

Never `calc(number × time)` in animation-delays — iOS Safari drops it, collapsing every stagger to zero. `time + time` (e.g. `calc(0.6s + var(--mark-delay, 0s))`) is safe. Anywhere a stagger needs a literal multiple (the footer asterisk's 8s cycle, the contact panel's ring delays, the contact reveal's per-slot delays), the values are hand-written literals per `nth-child`/class, not computed.

`prefers-reduced-motion: reduce` kills all pulse animation site-wide: `.brand-loader svg > *, .mark-pulse svg > *`, and the footer asterisk block, both set `animation: none; transform: none; opacity: 1;` under the media query.

---

## 6. Motion vocabulary

### Reveal patterns

`clip-path: inset(...)` wipes are the standard reveal mechanism (not `transform`/opacity fades) for mask-style entrances:

```css
.contact-reveal { clip-path: inset(0 0 100% 0); }
.contact-panel.is-open .contact-reveal {
  animation: contact-reveal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes contact-reveal-in {
  from { clip-path: inset(0 0 100% 0); }
  to   { clip-path: inset(0 0 0 0); }
}
```
Used identically on the standing `/contact` page (`.contact-skin .rv-*`) and the popup (`.contact-panel .rv-*`).

### Contact popup choreography timeline (`ContactPanel.tsx` + globals.css `.contact-*`)

The whole sequence, in order:

1. **Trace** (`.contact-trace-rect`) — a 1px `stroke: var(--pink-deep)` outline of the sheet's frame draws itself in via `stroke-dashoffset 1 → 0` over **0.55s**, `cubic-bezier(0.4, 0, 0.2, 1)`.
2. **6 ramp rings, centre-out** (`.contact-fill-ring`, one per `BRAND_RAMP` step) — each blooms in with `contact-ring-in 0.45s cubic-bezier(0.16,1,0.3,1)`, at literal per-ring delays from **0.6s to 1.48s** in **0.22s** steps (`--fill-step: 0.22s`):
   - ring 1 (innermost, `inset: 42%`) delay `0.6s`, colour `var(--pink)`
   - ring 2 (`inset: 33.6%`) delay `0.82s`, colour `var(--pink-2)`
   - ring 3 (`inset: 25.2%`) delay `1.04s`, colour `var(--pink-3)`
   - ring 4 (`inset: 16.8%`) delay `1.26s`, colour `var(--pink-4)`
   - ring 5 (`inset: 8.4%`) delay `1.48s`, colour `var(--pink-5)`
   - ring 6 (outermost, `inset: 0`) delay `1.7s`, colour `var(--pink-deep)`, animates with `contact-ring-in-outer` (no overshoot) instead — it defines the final silhouette and is the one ring that stays.
   - **z-order is inverted**: the smallest (innermost) ring has the highest `z-index` (`z-index: 6` down to `z-index: 1` for the outermost), so the ramp stays visible as bands as each later ring paints over the last.
3. **Inner rings fade** — rings 1–5 additionally run `contact-ring-fade 0.45s ease-out` all starting at **2.25s**, fading to `opacity: 0` and leaving only the outer `--pink-deep` ring as the panel's colour.
4. **Content reveals** — `.contact-reveal` items (`.rv-0` … `.rv-4`) mask-wipe in via `contact-reveal-in 0.5s cubic-bezier(0.16,1,0.3,1)`, starting at **2.7s** and stepping by roughly **0.08s**: `rv-0` (title) `2.7s`, `rv-1` (lede) `2.78s`, `rv-2` (direct) `2.86s`, `rv-3` (note form) `2.94s`, `rv-4` (Cal column) `3.02s`.
5. **Close button** — `.rv-close` reveals at **0.7s**, deliberately FIRST of everything (comment: "a way out must never wait 3s").

All of the above use literal per-child/per-class delays, not `calc()` multiplication, for the iOS Safari reason in section 5.

### Lenis smooth scroll

Referenced via `window.__lenis` throughout (`SiteFooter.tsx`, `FooterCopyright.tsx`, `BookCall.tsx`, `ContactPanel.tsx` calling `.stop()`/`.start()` while the popup is open). One shared rAF loop (`TempusKernel`, mounted in `app/layout.tsx`) "absorbs every native `requestAnimationFrame` — Lenis, canvas effects, R3F, GSAP — into a single ordered loop."

### Compositor-only rule

Transitions in the design system consistently animate `transform`/`opacity`/`clip-path` (never `width`/`height`/layout properties) for the main interactive states — e.g. `.card-zoom-inner { transition: transform 620ms var(--ease); will-change: transform; }`, `.hr-item` mask reveals, `.sticker-pill`/`.tag` colour+border transitions. The one deliberate layout-affecting exception is `.notfound-zeros { transition: width 0.9s ... }` (the 404 hover unmask), justified by its short, one-off, low-frequency use.

### GSAP vs CSS split

GSAP drives orchestrated, JS-controlled sequences: the footer rule's scaleX scrub-in (`SiteFooter.tsx`), the capabilities auto-scrolling slider (`.cap-track`/`.cap-slider`), the home hero star's parallax. CSS keyframes/transitions drive self-contained micro-interactions and loops: the pulse (section 5), hover states, the contact reveal choreography.

### Motion tokens (`:root`)

```css
--ease:      cubic-bezier(0.22, 0.61, 0.36, 1);  /* the curve, used everywhere */
--dur-fast:  140ms;   /* small state flips: colour, opacity */
--dur:       240ms;   /* default: most transitions */
--dur-slow:  420ms;   /* larger moves: card lift, sidebar expand */
```

---

## 7. Whitespace & alignment

### Page gutter

The standard content gutter pattern, used across `app/(site)/page.tsx`, `app/not-found.tsx`, `app/redesign/page.tsx`, and referenced by name in a `.top-nav` comment: **`px-5 md:px-10`** (20px mobile → 40px desktop). `.top-nav`'s own padding matches it explicitly: `padding: 0 20px` at rest, `0 40px` at `min-width: 768px` (comment: "Match the page gutter (px-5 / md:px-10) so the pills line up with content").

### Spacing scale (`:root`, base-8 with base-4 halves)

| Token | rem | px |
|---|---|---|
| `--space-1` | 0.25rem | 4 |
| `--space-2` | 0.5rem | 8 |
| `--space-3` | 0.75rem | 12 |
| `--space-4` | 1rem | 16 |
| `--space-5` | 1.5rem | 24 |
| `--space-6` | 2rem | 32 |
| `--space-7` | 3rem | 48 |
| `--space-8` | 4rem | 64 |
| `--space-9` | 6rem | 96 |
| `--space-10` | 8rem | 128 |

Semantic: `--space-section: var(--space-9)` (96px, gap between major sections), `--image-pad: var(--space-6)` (32px, breathing room around media). Minimum interactive hit zone: `--hit: 44px`.

### `--menubar-h`

`48px` at rest, `56px` from `min-width: 768px` up (`@media` override directly under `:root`). Other OS-chrome tokens (declared but for the retro-chrome aesthetic, not core layout): `--sidebar-w: 0px` (legacy — "content no longer reflows for a rail"), `--statusbar-h: 22px`, `--titlebar-h: 22px`.

### Footer gutters vs page gutters

The footer's info row uses its own gutter: `padding: 0 clamp(20px, 3vw, 40px) ...` (`.site-footer-info`). The giant wordmark row is deliberately **tighter** than that: `.site-footer-mark { padding: 0 clamp(16px, 2.6vw, 34px) clamp(8px, 1.2vw, 16px); }` — comment: "the wordmark is meant to read large, near the edges."

### Radii in use

| Radius | Where |
|---|---|
| `3px` | Buttons/pills — `.tag`, `.sticker-pill`, `.hero-pill`, `.home-cap-pill`, `.nav-tip`, `.contact-input` |
| `6px` | Popup/card surfaces — `.contact-sheet`, `.contact-fill`, `.contact-fill-ring`, `.contact-trace-rect` (`rx: 6px`), `.contact-cal`, `.quote-box` |
| `14px` | Larger media/cards — `.store-media`, card thumbnails (`.card-thumb` and related, lines ~2015/2168/2361), `.sb-panel`, `.pitch-demo-card` |
| `999px` | Full pill — `.pitch-cta`/`.lindon-cta` |
| `50%` | Circles — `.status-badge::before` dot, `.sidebar-toggle`, `.store-media-placeholder` icon wells |

### Z-scale actually in use (not the generic 10/20/30/40 convention — this site's real values)

| z-index | Element |
|---|---|
| 41 | `.sidebar-toggle` |
| 45 | miscellaneous pinned chips (×3 occurrences) |
| 50 | `.top-nav` |
| 60 | `.nav-logo`, one other |
| 65 / 70 | intro-zone layers |
| 80 | `.contact-drawer-root` (legacy drawer, superseded by the popup) |
| 95 | near-top overlay |
| 110 | intro menu btn container |
| 120 | `.grain-overlay` |
| 200 | `.skip-link` (focused state) |
| 300 | `.contact-panel` (the popup — highest of the "real" UI layers) |
| 9999 | one sandbox-only element (`app/sandbox` tooling, not studio UI) |

Sticky pins (bottom-right, docking into the footer): `.sf-copyright-pin { bottom: 16px }`, `.sf-cta-pin { bottom: 42px }` (Book-a-call sits 26px above the copyright).

---

## 8. Footer style

`.site-footer` (globals.css lines 4223–4244):

```css
.site-footer {
  min-height: 560px;
  height: 100svh;       /* mobile + tablet */
}
@media (min-width: 1024px) {
  .site-footer {
    min-height: 420px;
    height: 50svh;       /* desktop */
  }
}
```
`overflow: hidden` (clips the wordmark along the bottom), one uniform `color: var(--ink)` for everything inside, `padding-top: calc(var(--menubar-h) + 6px)` to clear the fixed nav.

### Anatomy, top to bottom

1. **`.site-footer-rule`** — a 1px `background: var(--ink)` hairline, `margin: 0 clamp(20px,3vw,40px)`, GSAP-scrubbed `scaleX` from the left as the footer enters.
2. **`.site-footer-info`** — a grid pushed to the bottom (`margin-top: auto`) with the info columns:
   - `.sf-col-aus` — `FooterClock` (Brisbane time)
   - `.sf-col-eng` — `ENG/LON` label + flag + `LiveTime tz="Europe/London"`
   - `.sf-contact` — "Hiring or have a project?" + email + phone
   - `.sf-col-end` — `BookCall`, `FooterCopyright`, "Design & build finbarstudio"
   
   Mobile: `grid-template-columns: repeat(2, 1fr)`. Desktop (`min-width: 768px`): `repeat(4, 1fr)`. Column labels are ink (`.sf-label`), values are pink (`.sf-value`).
3. **`.site-footer-mark`** — the giant wordmark, `BrandWordmark` JS-fit (see `SiteFooter.tsx`'s `useLayoutEffect`) to exactly fill the row edge-to-edge via an iterative font-size convergence loop (starts at a 100px reference, converges in up to 4 passes, then overshoots by `×1.009` so the edges "kiss the gutters"). Letters are ink; the asterisk carries the gradient and pulses at 8s (section 5). `overflow: hidden` masks the slide-up reveal.
4. **`.site-footer-asterisk`** (mobile only, `max-width: 767px`) — replaces the giant wordmark with a full-bleed pink asterisk, `height: 50vw`, cropped at its horizontal midline (only the top half shows via `overflow: hidden`).

### Reveal mechanics

A sentinel + scroll-position check (not IntersectionObserver — "robust, unlike a sentinel that can sit below the clipped 100svh footer") flips `.is-armed` → `.is-revealed` once the footer has scrolled well into view (`remaining < innerHeight * 0.22` from the bottom). Armed state hides the rule (`scaleX(0)`) and slides the wordmark down (`translateY(120%)`); revealed state transitions them in over `1s` (rule) and `1.15s` (wordmark) on the shared `cubic-bezier(0.16, 1, 0.3, 1)` curve, with `0.15s`/`1.0s` delays respectively.

### Sticky pins / dock behaviour

Both `FooterCopyright` and `BookCall` render twice: a hidden placeholder that reserves the real slot in `.site-footer-info`, and a `position: fixed` pin that floats bottom-right while scrolling. Each pin tracks its own placeholder's `getBoundingClientRect()` against the fixed pin's resting `bottom` offset (`16px` copyright, `42px` Book-a-call) and adds `.is-docked` the instant the real slot rises to meet it — "a smooth slot-in, no disappear/reappear." On the home page both are gated behind `scrollY > innerHeight * 0.7` (hidden until the hero has scrolled past); on every other page they show from the start.

---

## 9. Loading system

**`BrandLoader`** (`components/ui/loader.tsx`, exported alias `LoaderThree` for legacy call sites) is THE one loading icon — "the preloader in miniature." Every loading state on the site routes through it: image placeholders, route `loading.tsx` skeletons, 3D/model loaders. Amend timing in exactly one place: the `--brand-loader-*` tokens (section 5).

### `.skeleton` vs `.skel-line`

```css
.skeleton {           /* ABSOLUTE FILL — needs a positioned parent with real height */
  position: absolute;
  inset: 0;
  background: var(--surface-sunken);
  overflow: hidden;
  animation: skeleton-pulse 1.6s var(--ease) infinite;
}
/* + a ::after sweep: translateX(-100%) -> 100%, skeleton-sweep 1.6s */

.skel-line {           /* IN-FLOW — sizes itself, contributes real height/width */
  display: block;
  border-radius: 4px;
  background: var(--surface-sunken);
  animation: skeleton-pulse 1.6s var(--ease) infinite;
}
```
`.skeleton` contributes no height on its own (it's `absolute`) — use it for image/media placeholders inside an aspect-ratio'd or otherwise sized parent. `.skel-line` is for text-line/chip placeholders in a route skeleton, where the placeholder needs to occupy its own space in a flex/block flow.

`BrandLoader` centres itself (`.brand-loader { position: absolute; inset: 0; display: grid; place-items: center; }`) — designed to sit inside a `.skeleton` placeholder as the loading affordance on top of it.

---

## 10. The contact surfaces

The contact popup (`ContactPanel.tsx`, triggered by any `window.dispatchEvent(new CustomEvent("contact:open", ...))`) and the standing `/contact` page share the same building blocks — `ContactDirect.tsx` and `ContactNoteForm.tsx` are literally shared components ("so the two can never drift").

### The sheet

`.contact-sheet` — `position: absolute; inset: var(--contact-inset)` where `--contact-inset: clamp(10px, 2.2vw, 32px)`, `border-radius: 6px`, transparent background (colour arrives via the ring animation, section 6). Two-column grid: `minmax(250px, 300px) minmax(0, 1fr)` (contact rail, then the Cal booker), collapsing to a single scrolling flex column under `max-width: 860px`.

### Cal embed rules

- **Brand colour only** — reskinning the booker's internals through Cal's UI vars "caused hover glitches," so only the brand colour is themed; the embed keeps its own default look inside a `border-radius: 6px` inset card.
- **Month view needs `min-width` around 950px** in practice (the popup deliberately keeps the insets/padding tight so the booker column stays wide enough — "starve it and Cal silently degrades to the one-column scroller").
- **Badge clipped, 68px band**: `.contact-cal iframe { clip-path: inset(0 0 68px 0); margin-bottom: -68px; }` — Cal's plan gate ignores `hideBranding` and the badge is cross-origin (no CSS reaches it directly), so the fix clips the iframe's bottom band wherever it happens to end, and pulls the margin back so the clipped band doesn't reserve scroll space.
- **Mobile (`max-width: 860px`) = no embed**: swapped for a plain `Pick a time ↗` link to `https://cal.com/finbar.studio/intro` (`.sticker-pill book-call-pill.contact-cal-link`) — "their mobile layout, not our iframe wrestling it." Cal's tall mobile column inside the fixed popup sheet was fighting nested scroll.

### Deep-pink sheet build order (recap of section 6)

Trace (0.55s) → 6 concentric rings bloom centre-out (0.6s–1.7s, `0.22s` steps) → inner 5 rings fade at 2.25s leaving `--pink-deep` as the panel colour → content reveals from 2.7s (close button first, at 0.7s).

---

## 11. Satellite surfaces (not studio tokens)

The following routes/prefixes carry their **own** design system, independent of everything above. Do not treat their classes or CSS variables as studio tokens:

- `app/qldpools/` — `.qpi-*`, `.qf-*` classes; own `qpi-site.css` token set
- `app/sandbox/` — `.sb-*` classes; internal tool chrome
- `app/redesign/` — reuses some studio classes directly (it's a live-home variant) but is a working sandbox route, not the shipped system
- `archive/` — retired builder-outreach campaign (lindon, /builders, 11 builder demos, partners), restorable via `git mv`
- `app/imogen*` — `.im-*` classes; SE Asia travel guide, own content file
- `app/toombul*` / `app/norths-devils/` — `.nd-*` (Norths Devils), Toombul's own site CSS; both consume `--font-archivo` which the main studio system does not
- `.pitch-*` / `.lindon-*` classes — private prospect pitch pages (`/qldpools`, archived `/lindon`); co-selector naming kept so archived pages restore without edits
- OJ Pippin demo palette (`--bone`, `--bone-2`, `--cream`, `--clay`, `--clay-soft`, `--olive`, `--sand`, `--umber`) and `.ojpippin-site` scope

---

## Discrepancies found (globals.css / component code wins over comments or AGENTS.md where they conflict)

1. **H1 colour framing.** The `:root` comment block (globals.css ~line 76–79) frames `--pink-deep` as "the logo, H1 display headings" without qualification, which reads as if H1 should be pink-deep. The actual base rule (`h1 { ... }`, `@layer base`) does **not** set colour — H1 inherits `color: var(--ink)` from `body`. AGENTS.md is explicit and matches the code: "H1 is ink, H2 is dark red (Finbar's call)." This document follows AGENTS.md + the code; the `:root` comment is the stale/ambiguous one.
2. **`--font-primary` and `--font-label` are identical values.** Both resolve to Host Grotesk (`var(--font-host)`). The comment above them still describes them as if they were two different faces ("Both use Host Grotesk... To swap: change the fallback or load a new font"), which is accurate but easy to misread as implying two distinct type families — they are the same font-stack today, kept as two tokens for semantic separation (body/display vs. label usage), not visual difference.
3. **`--font-display` is dead weight in the live design.** It still exists as a token (`Georgia, "Times New Roman", serif`) and is referenced by exactly one class in the whole file (`.quote-box-mark`, the testimonial's serif quote mark) — every other display class in the system uses `--font-host`/Host Grotesk directly, not `--font-primary`/`--font-display`. Bookmania/Typekit, which this token used to point to, was removed entirely.
4. **`--font-archivo` is loaded globally but architecturally a satellite token.** `app/layout.tsx` loads Archivo on every page (the variable lands on `<html>`), but no rule in `app/globals.css` ever consumes `var(--font-archivo)` — only `app/imogen/imogen.css`, `app/norths-devils/norths-devils-site.css`, and `app/toombul/toombul-site.css` reference it. It should not be documented as part of the core studio type stack even though it is technically present on every page's `<html>` class list.
