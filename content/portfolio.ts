/**
 * /portfolio — every page of the scrolling PDF portfolio, in order.
 *
 * Page kinds (drawn by app/portfolio/page.tsx):
 *   title    chapter opener: name, discipline, year
 *   text     the project paragraph + team / year
 *   quote    a verbatim client line (shorten with … only, never reword)
 *   index    the list of projects, after the about page
 *   media    one to four images or clips in a row
 *   grid     tiles on a unit grid (see THE NEW IMAGE STANDARD below)
 *   covers   a sheet of A4 covers in rows
 *   logo     a mark centred on a ground
 *
 * THE MEDIA RULE FOR THIS PAGE: inset, never full bleed, never cropped. Every
 * image and clip is framed at its true proportions (m() pulls them from
 * content/portfolio-dims.json; after adding media run
 * `node scripts/portfolio-dims.mjs`). Rows are sized so the whole row fits.
 *
 * THE NEW IMAGE STANDARD (Oct 2026). Finbar makes every portfolio image
 * himself, to one of three shapes so pages grid cleanly: 4:3, 1:1 and 2:1.
 * A 4:3 usually has a page to itself (one()); squares and 2:1s tessellate on
 * a grid page (grid()). His finished files live in the design workspace at
 * Portfolio/<Project>/Final Portfolio Images and go in at FULL source size as
 * WebP under public/media/images/portfolio/<project>/ (the 2560px cap in the
 * media rule is lifted for this page, on his instruction: highest quality).
 * A 2:1 shown on its own takes the same page, at the LARGE margin: one(),
 * the standard inset. That is Finbar's default for a full-size 2:1 (Oct 2026),
 * not full bleed.
 * Lows is done to this standard; the other chapters still use older media
 * until he supplies theirs. Chapter order (his, 12 Oct 2026): Lola Audio, Salesmasters, Lows, Rennen Plus,
 * Packer, The Moment You Realise, TasWater, London Home Show, Plated with Issy, Other.
 *
 * Facts come from Job:CV/London 2026/FINBAR-CONTEXT.md. Media paths resolve
 * through mediaDeep (Cloudflare R2 in production). Copy: no em dashes,
 * humanizer pass, nothing that is not true.
 */
import { mediaDeep } from "@/lib/media";
import DIMS from "./portfolio-dims.json";

export type Media = { src: string; w: number; h: number; video?: boolean; frame?: boolean; alt?: string; /** the file to show instead when the page is in its light theme */ light?: string; /** the Rennen Plus car grid: this page is drawn live by PfCars, and the file is only its measurements */ cars?: boolean; /** The Moment You Realise phones: this page is the live 3D iPhone carousel from the case study (PhoneCarousel), and the file is its poster and measurements */ phones?: boolean; /** a clip with a soundtrack: muted until the reader turns it on */ sound?: boolean; /** shown this much bigger than the standard inset, e.g. 1.1 */ scale?: number; /** a separate file for phones (760px and under), with its own shape: the page swaps to it and takes its proportions */ mobile?: { src: string; w: number; h: number } };
/** One tile of a grid page: where it sits on the unit grid and how many units it spans. */
export type Cell = Media & { c: number; r: number; cs: number; rs: number };
export type Meta = { label: string; value: string; href?: string };
export type Slide =
  | { kind: "cover" }
  | { kind: "cv" }
  | { kind: "index" }
  | { kind: "grid"; cols: number; rows: number; cells: Cell[]; caption?: string }
  | { kind: "title"; id: string; name: string; category: string; year: string }
  | { kind: "text"; name: string; category: string; body: string; meta: Meta[] }
  | { kind: "quote"; name: string; quote: string; by: string }
  | { kind: "media"; items: Media[]; caption?: string; /** a link shown after the caption */ link?: { label: string; href: string }; /** fill the whole page, edge to edge (crops to 16:9) */ bleed?: boolean; /** stack the items in rows of this many, each at its true proportions */ per?: number }
  | { kind: "covers"; /** A4 covers, shown small in rows */ items: Media[]; caption?: string }
  | { kind: "deck"; /** a landscape document to page through: every page in order, and the same pages small */ name: string; pages: string[]; thumbs: string[]; caption?: string }
  | { kind: "logo"; src: string; alt?: string; bg?: string; size?: string; dark?: boolean }
  | { kind: "section"; title: string; subtitle: string; year: string }
  | { kind: "end" };

export const UPDATED = { long: "October 2026", short: "05.10.2026" };

/** The portfolio PDF link on the About page. Off until the file exists (see TopNav). */
export const PORTFOLIO_PDF = false;

/** The opening page's portrait. It is on black, so it sits straight on the page. */

export const CV = {
  email: "finbar@finbar.studio",
  bio: [
    "I’m Finbar, a designer from London with a broad set of skills. I have worked on a lot of different kinds of project across print, screen and motion: brand identities, long brochures and playbooks, social campaigns, event graphics and websites.",
    "I build websites as well as design them, with working HTML and CSS, and I use AI tools every day and keep up with where they are going. I’m as comfortable holding a fifty-page brochure to a tight brief as I am with a loose one that needs an idea. A design generalist role is where I would be most useful to a team.",
  ],
  eligibility: "British citizen, based in London. Open to studio, in-house and hybrid roles.",
  contact: [
    { label: "Mob", long: "Mobile", value: "+44 7876 492551", href: "tel:+447876492551" },
    { label: "Msg", long: "Email", value: "finbar@finbar.studio", href: "mailto:finbar@finbar.studio" },
    { label: "Web", long: "Website", value: "www.finbar.studio", href: "https://www.finbar.studio" },
  ],
  education: [
    { title: "BA (Hons) Graphic Design", lines: ["University of Brighton", "2:1", "2018–2021"] },
    { title: "UAL Foundation Diploma", lines: ["Ravensbourne", "Merit", "2017–2018"] },
  ],
  experience: [
    {
      group: "Freelance",
      items: [
        { title: "Finbar Studio", lines: ["Designer", "2024–now"] },
        { title: "Share to Buy", lines: ["Designer", "2026"] },
      ],
    },
    {
      group: "In-house",
      items: [
        { title: "Packer and Associates, Brisbane", lines: ["Graphic Designer", "Full-time, then contract", "2024–2025"] },
        { title: "Share to Buy, London", lines: ["Junior Designer, then Designer", "Full-time", "2022–2024"] },
      ],
    },
  ],
};

const D = DIMS as unknown as Record<string, [number, number]>;
/** One image or clip, measured. `frame: false` for artwork on transparency. */
/** The phone version of a piece (see Media.mobile), measured like any other. */
const phone = (path: string): Media["mobile"] => {
  const [w, h] = D[path] ?? [4, 5];
  return { src: `/media/images/${path}`, w, h };
};
function m(path: string, o: Partial<Media> = {}): Media {
  const [w, h] = D[path] ?? [16, 9];
  return { src: `/media/images/${path}`, w, h, video: /\.(mp4|webm)$/.test(path), frame: true, ...o };
}
const one = (path: string, caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, o)], caption });
/** One image filling the whole page, edge to edge (cropped to 16:9). */
const bleed = (path: string, caption?: string): Slide => ({ kind: "media", items: [m(path)], bleed: true, caption });
/** A device video on its own page: a 2:1 file (padded with black at the sides) at the standard margin, no outline, with a caption and a link out. */
const linked = (path: string, caption: string, link: { label: string; href: string }, o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, { frame: false, ...o })], caption, link });
const row = (paths: string[], caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: paths.map((p) => m(p, o)), caption });

/** Several rows of images on one page, `per` to a row, none cropped. */
const stack = (paths: string[], per: number, caption?: string): Slide => ({ kind: "media", items: paths.map((p) => m(p)), caption, per });

/** A grid page. Each tile is [path, column, row, columns spanned, rows spanned], 1-based. */
const grid = (cols: number, rows: number, tiles: [string, number, number, number, number][], caption?: string): Slide => ({
  kind: "grid",
  cols,
  rows,
  cells: tiles.map(([p, c, r, cs, rs]) => ({ ...m(p), c, r, cs, rs })),
  caption,
});

const ME = { label: "Team members", value: "Finbar Skitini" };
/** The small link on a project's intro card to its full case study on the studio site. */
const study = (slug: string): Meta => ({ label: "Case study", value: "Read it ↗", href: `https://www.finbar.studio/case-studies/${slug}` });

const RAW: Slide[] = [
  { kind: "cover" },
  { kind: "cv" },
  { kind: "index" },

  /* ── Lola Audio ─────────────────────────────────────────────── */
  { kind: "title", id: "lola", name: "Lola Audio", category: "Logo and Website", year: "2026" },
  {
    kind: "text",
    name: "Lola Audio",
    category: "Logo and Website",
    body:
      "Lola Stoodley is a composer and sound designer, so her site plays like her work. Faders mix the music as you move them, scrolling back rewinds the track, and her name draws itself in pen. Each showreel opens in a full-screen player you can scrub frame by frame.",
    meta: [ME, { label: "Year", value: "2026" }, { label: "Live", value: "lola-audio.com", href: "https://www.lola-audio.com" }, study("lola-audio")],
  },
  one("portfolio/lola-audio/brand.webm", "The brand: her mark, the site and the stills it sits on", { frame: false }),
  linked("portfolio/lola-audio/website.webm", "The website. It has sound, which is off until you turn it on", { label: "lola-audio.com", href: "https://www.lola-audio.com" }, { sound: true }),

  /* ── Rennen Plus ────────────────────────────────────────────── */
  { kind: "title", id: "rennen-plus", name: "Rennen Plus", category: "Website", year: "2026" },
  {
    kind: "text",
    name: "Rennen Plus",
    category: "Website",
    body:
      "Rennen Plus sells performance parts from five brands, and its range was spread across supplier sites, an old Shopify store and a quoting spreadsheet. I designed one catalogue where the car comes first: pick your car, see only the parts that fit it, and get a landed Australian price that changes as you choose options. 228 cars and about 2,500 parts, live in five and a half weeks for the Porsche Club of Queensland Concours.",
    meta: [ME, { label: "Year", value: "2026" }, { label: "Live", value: "rennenplus.com.au", href: "https://rennenplus.com.au" }, study("rennen-plus")],
  },
  linked("portfolio/rennen-plus/website.webm", "The homepage", { label: "rennenplus.com.au", href: "https://rennenplus.com.au" }),
  one("portfolio/rennen-plus/cars.webp", "Every car on the site, each one cut out, faced the same way and sat on one baseline", { frame: false, cars: true }),
  linked("portfolio/rennen-plus/phones.webm", "Designed mobile first, because the visitor stats showed most people browse on a phone: a car page, search and the AI concierge", { label: "rennenplus.com.au", href: "https://rennenplus.com.au" }, { mobile: phone("portfolio/rennen-plus/phones-mobile.webp") }),

  /* ── Lows Design and Build ──────────────────────────────────── */
  { kind: "title", id: "lows", name: "Lows Design + Build", category: "Brand and Website", year: "2026" },
  {
    kind: "text",
    name: "Lows Design + Build",
    category: "Brand and Website",
    body:
      "Lows is a family-run building company in South London. I refined their mark from the client’s own sketches, then designed a website led by the work: big photography, project pages, an estimate tool that turns a visitor into a named lead, and a CMS the team updates themselves. The launch came with a pack of posts for Instagram, LinkedIn and X.",
    meta: [ME, { label: "Year", value: "2023–2026" }, { label: "Live", value: "lowsdesignandbuild.com", href: "https://lowsdesignandbuild.com" }, study("lows-design-build")],
  },
  one("portfolio/lows/logo-zoom.mp4", "The brand", { frame: false, light: `/media/images/${"portfolio/lows/logo-zoom-light.mp4"}` }),
  linked("portfolio/lows/macbook.webm", "The website", { label: "lowsdesignandbuild.com", href: "https://lowsdesignandbuild.com" }),
  linked("portfolio/lows/iphone-instagram.webm", "The Instagram profile", { label: "@lowsdesignandbuild", href: "https://www.instagram.com/lowsdesignandbuild" }),
  one("portfolio/lows/signage-wheel.webm", "The identity on signs, a billboard and a site flag. These are mockups", { frame: false }),
  {
    kind: "quote",
    name: "Lows Design + Build",
    quote: "He has completely transformed our online presence and taken it to the next level.",
    by: "Samuel Low",
  },

  /* ── Plated with Issy ──────────────────────────────────────── */
  { kind: "title", id: "plated", name: "Plated with Issy", category: "Brand and Website", year: "2026" },
  {
    kind: "text",
    name: "Plated with Issy",
    category: "Brand and Website",
    body:
      "Plated with Issy is a candlelit supper club run by Issy Park. The identity sets a flowing script against a sharp serif on deep olive, so it feels like the table itself. The site carries her photography, a polaroid gallery she orders herself and her Instagram, and it went live in under a week.",
    meta: [ME, { label: "Year", value: "2026" }, study("plated-with-issy")],
  },
  { kind: "logo", src: `/media/images/plated-with-issy/wordmark.svg`, alt: "Plated with Issy wordmark", bg: "#3D3E2A", size: "54cqw", dark: true },
  one("plated-with-issy/site-scroll-3d.mp4"),
  row(["plated-with-issy/supper-issy.webp", "plated-with-issy/supper-table.webp", "plated-with-issy/supper-course.webp"], "Photography from the supper club, used across the site"),

  /* ── The Moment You Realise (Share to Buy) ─────────────────── */
  { kind: "title", id: "share-to-buy", name: "The Moment You Realise", category: "Social Campaign for Share to Buy", year: "2022–2023" },
  {
    kind: "text",
    name: "The Moment You Realise",
    category: "Social Campaign for Share to Buy",
    body:
      "The Moment You Realise was a campaign for Share to Buy, the UK’s largest affordable homeownership platform. I made more than thirty motion and still assets in two styles and cut every one for feed, Stories, Reels and LinkedIn. New registrants were up 19.7 percent on the year before.",
    meta: [{ label: "Team members", value: "Share to Buy marketing team" }, { label: "Year", value: "2022–2023" }, study("tmyr")],
  },
  one("tmyr/hero-poster.webp", "The reels on Instagram", { frame: false, phones: true, mobile: { src: "/media/images/tmyr/hero-poster.webp", w: 4, h: 5 } }),
  row(["tmyr/1080x1080-ig-posts/kiran.webm", "tmyr/1080x1080-ig-posts/anthony.webm", "tmyr/1080x1080-ig-posts/molly.webm"], "Feed posts"),

  /* ── TasWater ──────────────────────────────────────────────── */
  { kind: "title", id: "taswater", name: "TasWater", category: "Information Design", year: "2024" },
  {
    kind: "text",
    name: "TasWater",
    category: "Information Design",
    body:
      "TasWater runs water and sewerage for the whole of Tasmania. I designed two large infographics for them in a month, turning a statewide network into something a customer can read at a glance, strictly on brand and signed off by their leadership.",
    meta: [ME, { label: "Studio", value: "Packer and Associates" }, { label: "Year", value: "2024" }, study("taswater")],
  },
  one("portfolio/taswater/map-mockup.webp"),
  one("portfolio/taswater/snake-mockup.webp"),

  /* ── The London Home Show ──────────────────────────────────── */
  { kind: "title", id: "london-home-show", name: "The London Home Show", category: "Event", year: "2023" },
  {
    kind: "text",
    name: "The London Home Show",
    category: "Event",
    body:
      "The London Home Show is the UK’s first affordable homes exhibition, with more than 4,000 visitors. I designed the show’s print and digital: flags and wayfinding, stage graphics, brochures, booklets and tickets, Metro newspaper ads, and the email campaign that drove record ticket sales.",
    meta: [{ label: "Team members", value: "Share to Buy marketing team" }, { label: "Year", value: "2023" }, study("london-home-show")],
  },
  one("portfolio/london-home-show/event-deck.webm", "The London Home Show on the day: flags, wayfinding, ticketing and the brochure", { frame: false, mobile: phone("portfolio/london-home-show/event-deck-mobile.webm") }),

  /* ── Other ─────────────────────────────────────────────────── */
  /* One page each. The full story is on each case study. */
  { kind: "section", title: "Other", subtitle: "Playbooks, print and covers", year: "2022–2026" },
  linked("portfolio/salesmasters/covers-wheel.webm", "Salesmasters. Sales playbooks for nine clients, each in the client’s own brand", { label: "Case study", href: "https://www.finbar.studio/case-studies/salesmasters" }),
  linked("portfolio/packer/capability-statement.webm", "Packer and Associates. The capability statement, page by page", { label: "Case study", href: "https://www.finbar.studio/case-studies/packer-associates" }),
  bleed("joe-devine/hero.webp", "Joe Devine. Single covers, art direction and photography"),

  { kind: "end" },
];

export const PORTFOLIO: Slide[] = mediaDeep(RAW);
