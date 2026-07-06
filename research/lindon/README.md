# Lindon Homes — Site Archive

Full rip of **https://lindonhomes.com.au/** captured **2026-06-21** for use in
the site redevelopment. The live site is WordPress (Yoast SEO, custom
`lindonhomes` theme).

## What's here

| Folder / file | Contents |
|---|---|
| `site_mirror/` | Complete recursive `wget` mirror — **262 MB**, **409 HTML pages**, **790 images** (jpg/png/webp/svg), plus all CSS/JS. Links rewritten to work offline. Open `site_mirror/lindonhomes.com.au/index.html` in a browser to browse the whole site locally. |
| `content/` | **201 clean Markdown files** — one per real page, with front-matter (`url`, `title`, `meta_description`, `og_image`), the page copy converted to Markdown, and a list of every image used on that page. Mirrors the URL structure. |
| `content/_index.json` | Machine-readable index of every page: url, title, h1, meta description, og:image, image count. Good starting point for migration scripts. |
| `content/home-fulltext.txt` | Plain-text dump of the homepage (its bespoke section layout doesn't convert cleanly to Markdown, so this is the fallback). |
| `_meta/all_urls_raw.txt` | Every URL pulled from the Yoast sitemaps, grouped by type (post, page, project, team, testimonial, category, tag). |
| `extract_content.py` | The script that generated `content/` from the mirror. Re-runnable. |
| `site_mirror/wget_mirror.log` | Full download log. |

## Site structure (content types)

- **Pages** — Home, About Us (+ Meet the Team, History, Awards), What We Do,
  Why Choose Lindon, Portfolio, Contact, Free Consultation, Stages of
  Construction, Site Boards (QR landing pages).
- **What We Do (services)** — Custom Homes (Design & Build / Architect
  Designed), Knock Down Rebuild, Difficult Sites / Sloping Blocks, Major
  Renovations, Swimming Pools.
- **Why Choose Lindon** — 32 Years Experience, Superior Selections Process,
  We Design & Build, Impeccable Quality, Exceptional Service, Build with
  Confidence.
- **Projects** (`project/`) — ~22 portfolio projects (Kate Circuit, Norman
  Park, Arrol Street, Beachcrest Road, Sydney Ave/House, Morehead, Gordon St,
  Tranters, Audrey St, Bonaventure, etc.).
- **Team** (`team/`) — 9 staff bios (Trent Lindon, Ashley Lindon, Lynn Lindon,
  Nadine Chapman, Bryce Warner, Mick Power, Stacey de Vries, Madison Law,
  Lachlan Campbell).
- **Testimonials** (`testimonial/`) — 20 client testimonials.
- **News** (`news/`) — ~48 blog posts (2013–present) plus category/tag archives.

## Image library

All originals and WordPress-generated thumbnails live under
`site_mirror/lindonhomes.com.au/wp-content/uploads/<year>/<month>/`.
For redevelopment use the largest (non-suffixed) version of each file — the
`-136x136`, `-300x200`, etc. variants are resized derivatives.

## Notes for the rebuild

- The `wget` run exited code 6 on a single auth-gated asset; everything else
  downloaded fully (log confirms `FINISHED ... Downloaded: 1494 files, 252M`).
- Brand positioning from meta: *"Brisbane's Trusted Custom & Luxury Home
  Builder … building in South East Queensland for over 32 years."*
- Awards signals present: HIA winners, Best of Houzz, Courier Mail "Brisbane's
  Best Builder".
- To regenerate the Markdown after re-mirroring: `python3 extract_content.py`.
