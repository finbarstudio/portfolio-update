# Builders outreach — archived (15 Jul 2026)

The full builders-outreach campaign, pulled off the live site but kept intact
in case any of it gets picked back up. Nothing here routes or deploys: the
folder sits outside `app/` and is excluded from typechecking in `tsconfig.json`.

What lives here:

- `app-site/` — the pitch pages that lived under `app/(site)/`:
  `/builders` (password-gated roster), `/lindon`, and the per-builder and
  partner pitch pages (a-rolley, braeden, cal-turner, david-radic,
  foundation-homes, gto-building, hm-developments, lucas-muro, mbc-prestige,
  oj-pippin, resolve-construction, ross-hogno).
- `app/` — the chromeless demo sites that lived at `app/<builder>/site`.
- `components/` — the per-builder component folders plus the shared
  `DemoPreloader.tsx` (only the builder demos used it).
- `public/` — each demo's static assets (fonts, images).

To restore one, `git mv` its folders back to their original locations. The
builder-specific classes in `app/globals.css` (lindon-cta etc.) were left in
place, so a restored page picks its styles straight back up.
