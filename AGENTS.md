<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes, APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# The palette is four colours

`--bg` (the ground), `--pink-deep` (the dark pink), `--pink` (the main pink),
`--ink` (the near-black). That's the whole system.

The two darks do different jobs: **`--pink-deep` is the brand speaking** (the
logo, and section-title H2s), **`--ink` is for reading** (body, H1s, small
labels, UI). Default to `--ink` unless the thing you're colouring IS the brand.

Note the tier: **H1 is ink, H2 is dark red** (Finbar's call). A page title is
the first thing you read, so it wants the reading colour; the section titles
under it carry the brand dark.

`--pink-2` … `--pink-5` are **tertiary**: they exist to build the logomark and
`--brand-gradient`, not to colour UI. Reaching for one of them for a heading or
a border means you actually want `--pink` or `--pink-deep`.

# Design tokens & canonical classes

Repeated design treatments on this site live as named classes in
`app/globals.css`, not as ad-hoc utility/inline-style clusters. **Before
styling anything, check this table and grep globals.css for an existing
class.** When you find yourself repeating a treatment a second time, promote
it to a named class in globals.css and add it to this table.

Two mechanics to know:

- **Unlayered on purpose.** New element-level classes go UNLAYERED at the end
  of globals.css — Tailwind v4 tree-shakes custom classes declared inside
  `@layer components` unless the class name appears in scanned content.
- **Compose with utilities.** Tokens carry the identity of the treatment
  (structure, borders, marks); contextual sizing/colour still comes from
  Tailwind utilities alongside them.

| Class | What it is | Where it's used |
|---|---|---|
| `.quote-box` + `.quote-box-mark` | THE testimonial treatment: outlined 6px-radius box, pink serif `“` breaking the top border via a bg-masked gap. Attribution goes OUTSIDE the box (`.mono-label text-ink-soft mt-3 text-center`). | Home site list, /qldpools pitch — use for every pull-quote/testimonial |
| `.sticker-pill` (+ `.is-pink`) | Main-site pill button/link (URL + case-study buttons) | Home site list, case-study "Visit live site" |
| `.pitch-cta`, `.pitch-cta-pink`, `.pitch-cta-ghost` | CTA pills on private prospect pitch pages (`.lindon-*` co-selectors kept for archived pages) | /qldpools, archived /lindon |
| `.pitch-demo-card` | Pink-tinted outlined call-out panel around a demo link | Pitch pages |
| `.mono-label` / `.mono-heading` | Space Mono small-caps labels (11px/12px) | Everywhere |
| `.home-display` / `.home-display-sm` / `.home-hero-display` | Display headings (Host Grotesk, uppercase) | Home, pitch pages, service pages |
| `.display-brand` | Colours a section title the brand dark (`--pink-deep`). **H2, not H1** — H1s stay `--ink`. The display-H2 tier already takes it via its own classes (`.contact-title`, `.outcomes-title`, `.delivered-title`, `.kinaya-section-name`); use the class for inline-styled H2s. Small mono H2s (`.mono-heading`) stay ink. | Service-landing H2s |
| `.hero-pill` (+ `.hero-pill-social`) | Home-hero nav pills (pages ink, socials pink) | Home hero |
| `.home-cap-pill` | "How I help businesses" capability pills | Home, /about |
| `.tag` (+ `.tag-default`, `.tag-ext`) | Small tag chips | Case studies, work filters, contact |
| `.brand-tile` + `.brand-tile-logo/-swatches` | Brand-filter card: client logo + colour palette | /work brand filter |
| `.reveal-open` | Forces hover-reveal project cards to read expanded by default | /web-design, /graphic-design grids |

Demo sites under `app/<client>/site` are scoped exceptions: each carries its
own token set (e.g. `.qpi-site` vars + `.qf-*` footer classes in
`app/qldpools/site/qpi-site.css`) so client demos never inherit portfolio
styling — but the same rule applies inside them: name the treatment, reuse it.

# Copy rules (user-facing text)

- Never use em dashes in copy (code comments exempt).
- Run the humanizer pass (`/the-humanizer`) over any new user-facing copy.
- Testimonials are verbatim quotes: shorten only with `…` or `[]`, never
  reword.
