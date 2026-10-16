/**
 * /portfolio — every page of the scrolling PDF portfolio, in order.
 *
 * Page kinds (drawn by app/portfolio/page.tsx):
 *   title    chapter opener: name, discipline, year
 *   text     the project paragraph + its links (live site, case study)
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
import PHONE from "./portfolio-phone.json";

export type Media = { src: string; w: number; h: number; video?: boolean; frame?: boolean; alt?: string; /** the file to show instead when the page is in its light theme */ light?: string; /** the Rennen Plus car grid: this page is drawn live by PfCars, and the file is only its measurements */ cars?: boolean; /** The Moment You Realise phones: this page is the live 3D iPhone carousel from the case study (PhoneCarousel), and the file is its poster and measurements */ phones?: boolean; /** Plated with Issy: this page is the live 3D globe of polaroids (PfGlobe), and the file is only a stand-in for its measurements */ globe?: boolean; /** a clip with a soundtrack: muted until the reader turns it on */ sound?: boolean; /** shown this much bigger than the standard inset, e.g. 1.1 */ scale?: number; /** a separate file for phones (760px and under), with its own shape: the page swaps to it and takes its proportions */ mobile?: { src: string; w: number; h: number; /** the phone file for the light theme */ light?: string }; /** an image laid over the piece, placed in the FILE's own frame (percent of its width and height, centre point), so it stays put however the page crops the file */ overlay?: { src: string; x: number; y: number; w: number; alt?: string }; /** on a phone only: the piece sits whole inside a box of this shape, on this colour (its own background colour, so the box reads as one picture) */ phoneBox?: { w: number; h: number; fill: string }; };
/** One tile of a grid page: where it sits on the unit grid and how many units it spans. */
export type Cell = Media & { c: number; r: number; cs: number; rs: number };
export type Meta = { label: string; value: string; href?: string };
export type Stat = { value: string; label: string };
/** The skill tags on each project's opening page: a short list, in the words job ads use, so an employer scanning the deck can match it to their brief. Keep it short; add a tag here before using it. */
export const TAGS = ["Brand Identity", "Web Design", "UX/UI", "Art Direction", "Motion Design", "Social Media", "Print", "Editorial", "Infographics", "Wayfinding", "Email", "Generative AI", "3D", "Photography"] as const;
export type Tag = (typeof TAGS)[number];
export type Slide =
  | { kind: "cover" }
  | { kind: "cv" }
  | { kind: "index" }
  | { kind: "grid"; cols: number; rows: number; cells: Cell[]; caption?: string }
  | { kind: "title"; id: string; name: string; category: string; year: string; /** skills an employer would look for, as tags on the opening page (from the short list in TAGS) */ tags?: Tag[] }
  | { kind: "text"; name: string; category: string; body: string; meta: Meta[]; /** the project's key numbers, along the foot of the page (kept out of the body copy) */ stats?: Stat[] }
  | { kind: "quote"; name: string; quote: string; by: string }
  | { kind: "media"; items: Media[]; caption?: string; /** a link shown after the caption */ link?: { label: string; href: string }; /** fill the whole page, edge to edge (crops to 16:9); "desktop": only on a desktop (and in the PDF), a phone keeps the usual stacked page */ bleed?: boolean | "desktop"; /** the colour of the running line and caption (on a full-bleed page they sit over the picture) */ ink?: string; /** on a phone only: the piece fills the page edge to edge, top to bottom, with the running line over it (no page colour shows round it) */ phoneBleed?: boolean; /** the page's own ground colour, to match a piece's background so it sits on the page with no edge */ ground?: string; /** stack the items in rows of this many, each at its true proportions */ per?: number; /** skill tags, for the one-page projects in Other */ tags?: Tag[]; /** keep the caption on a phone (phones drop captions otherwise) */ phoneCaption?: boolean }
  | { kind: "covers"; /** A4 covers, shown small in rows */ items: Media[]; caption?: string }
  | { kind: "deck"; /** a landscape document to page through: every page in order, and the same pages small */ name: string; pages: string[]; thumbs: string[]; caption?: string }
  | { kind: "logo"; src: string; alt?: string; bg?: string; size?: string; dark?: boolean }
  | { kind: "section"; title: string; subtitle: string; year: string }
  | { kind: "end" };

export const UPDATED = { long: "October 2026", short: "05.10.2026" };

/** The portfolio PDF link on the About page (the same flag is in TopNav). The PDF is made by scripts/portfolio-pdf.mjs. */
export const PORTFOLIO_PDF = true;

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
        { title: "Finbar Studio", lines: ["Designer", "2025–now"] },
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
  return forPhones({ src: `/media/images/${path}`, w, h, video: /\.(mp4|webm)$/.test(path), frame: true, ...o });
}

/**
 * Phones on mobile data get lighter copies (scripts/portfolio-phone.mjs makes
 * them as <name>.sm.<ext> and lists them in content/portfolio-phone.json). A
 * piece with its own phone file uses that file's copy; any other piece uses its
 * own copy at the same shape. Pages drawn live (cars, phones, globe) are left alone.
 */
const SM = new Set(PHONE as string[]);
const PRE = "/media/images/";
const lighter = (src: string) => {
  const rel = src.startsWith(PRE) ? src.slice(PRE.length) : src;
  return SM.has(rel) ? PRE + rel.replace(/\.(\w+)$/, ".sm.$1") : undefined;
};
function forPhones(item: Media): Media {
  if (item.cars || item.phones || item.globe) return item;
  const light = item.light ? lighter(item.light) : undefined;
  if (item.mobile) {
    const src = lighter(item.mobile.src);
    return src ? { ...item, mobile: { ...item.mobile, src } } : item;
  }
  const src = lighter(item.src);
  return src ? { ...item, mobile: { src, w: item.w, h: item.h, ...(light ? { light } : null) } } : item;
}
const one = (path: string, caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, o)], caption });
/** One image filling the whole page, edge to edge (cropped to 16:9). */
const bleed = (path: string, caption?: string, o: Partial<Media> = {}, ink?: string): Slide => ({ kind: "media", items: [m(path, o)], bleed: true, caption, ink });
/** A device video on its own page: a 2:1 file on black, filling the page top to bottom (only black is lost at the sides), the running line over it. */
const device = (path: string, caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, { frame: false, ...o })], caption, bleed: "desktop" });
/** The same with a link out after the caption: only in Other, where a page stands in for a whole project (each project's own links are on its opening page). */
const linked = (path: string, caption: string, link: { label: string; href: string }, tags?: Tag[], o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, { frame: false, ...o })], caption, link, bleed: "desktop", tags });
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

/** The small link on a project's intro card to its full case study on the studio site. */
const study = (slug: string): Meta => ({ label: "Case study", value: "Read it", href: `https://www.finbar.studio/case-studies/${slug}` });

const RAW: Slide[] = [
  { kind: "cover" },
  { kind: "cv" },
  { kind: "index" },

  /* ── Lola Audio ─────────────────────────────────────────────── */
  { kind: "title", id: "lola", name: "Lola Audio", category: "Logo and Website", year: "2026", tags: ["Brand Identity", "Web Design", "UX/UI"] },
  {
    kind: "text",
    name: "Lola Audio",
    category: "Logo and Website",
    body:
      "Lola Stoodley is a composer and sound designer, so her site plays like her work. Faders mix the music as you move them, scrolling back rewinds the track, and her name draws itself in pen. Each showreel opens in a full-screen player you can scrub frame by frame.",
    meta: [{ label: "Live", value: "lola-audio.com", href: "https://www.lola-audio.com" }, study("lola-audio")],
  },
  device("portfolio/lola-audio/brand.webm"),
  // inset, not full bleed (his call)
  one("portfolio/lola-audio/pages.webm", undefined, { frame: false }),
  // phones get an H.264 and AAC copy: an iPhone will not reliably play the Opus sound in the WebM
  device("portfolio/lola-audio/website.webm", undefined, { sound: true, mobile: phone("portfolio/lola-audio/website-mobile.mp4") }),

  /* ── Rennen Plus ────────────────────────────────────────────── */
  { kind: "title", id: "rennen-plus", name: "Rennen Plus", category: "Website", year: "2026", tags: ["Web Design", "UX/UI"] },
  {
    kind: "text",
    name: "Rennen Plus",
    category: "Website",
    body:
      "Rennen Plus sells performance parts from five brands, and its range was spread across supplier sites, an old Shopify store and a quoting spreadsheet. I designed one catalogue where the car comes first: pick your car, see only the parts that fit it, and get a landed Australian price that changes as you choose options. It went live for the Porsche Club of Queensland Concours, and the customers who call now are noticeably better informed.",
    stats: [{ value: "228", label: "Cars" }, { value: "2,500", label: "Parts, priced live" }, { value: "5½ weeks", label: "Brief to live" }],
    meta: [{ label: "Live", value: "rennenplus.com.au", href: "https://rennenplus.com.au" }, study("rennen-plus")],
  },
  device("portfolio/rennen-plus/website.webm"),
  one("portfolio/rennen-plus/cars.webp", "228 cars, each cut out and set on one baseline", { frame: false, cars: true }),
  // 2:1 and inset, on the page's own black (the clip is on black)
  { ...one("portfolio/rennen-plus/materials.webm", "Pick an option on the site, like an exhaust tip finish, to preview it as an interactive 3D material", { frame: false, mobile: phone("portfolio/rennen-plus/materials-mobile.mp4") }), phoneCaption: true } as Slide,
  device("portfolio/rennen-plus/phones.webm", "Designed mobile first, as most visitors browse on a phone", { mobile: phone("portfolio/rennen-plus/phones-mobile.webp") }),

  /* ── Plated with Issy ──────────────────────────────────────── */
  { kind: "title", id: "plated", name: "Plated with Issy", category: "Brand and Website", year: "2026", tags: ["Brand Identity", "Art Direction", "Web Design"] },
  {
    kind: "text",
    name: "Plated with Issy",
    category: "Brand and Website",
    body:
      "Plated with Issy is a candlelit supper club run by Issy Park. The identity sets a flowing script against a sharp serif on deep olive, so it feels like the table itself. The site carries her photography, a polaroid gallery she orders herself and her Instagram, and it went live in under a week.",
    meta: [study("plated-with-issy")],
  },
  // cream type on the olive; the wordmark sits centred, about a third of the way up, just under the main photograph and catching its edge
  // on a phone these two are square like the globe after them, on their own background colours
  bleed("portfolio/plated-with-issy/filmstrip.webm", undefined, { overlay: { src: "/media/images/plated-with-issy/wordmark.svg", x: 50, y: 73, w: 20.9, alt: "Plated with Issy" }, phoneBox: { w: 1, h: 1, fill: "#3f3c2a" } }, "#FAE3B1"),
  bleed("portfolio/plated-with-issy/website-phone.webm", undefined, { phoneBox: { w: 1, h: 1, fill: "#f3e3b0" } }, "#3e3c2a"),
  // the globe of polaroids, live: 16:9 on a desktop, square on a phone
  bleed("portfolio/plated-with-issy/polaroids/the-venue.webp", undefined, { globe: true, w: 16, h: 9, mobile: { ...phone("portfolio/plated-with-issy/polaroids/the-venue.webp")!, w: 1, h: 1 } }, "#FAE3B1"),

  /* ── Lows Design and Build ──────────────────────────────────── */
  { kind: "title", id: "lows", name: "Lows Design + Build", category: "Brand and Website", year: "2026", tags: ["Brand Identity", "Web Design", "Social Media"] },
  {
    kind: "text",
    name: "Lows Design + Build",
    category: "Brand and Website",
    body:
      "Lows is a family-run building company in South London. I refined their mark from the client’s own sketches, then designed a website led by the work: big photography, project pages and a CMS the team updates themselves. Rather than buy in an extension cost estimator, I built theirs from scratch. It saved them money, they can configure it however they like, and it asks for an email before it gives an estimate, so every use is a lead. The launch came with a pack of posts for Instagram, LinkedIn and X.",
    meta: [{ label: "Live", value: "lowsdesignandbuild.com", href: "https://lowsdesignandbuild.com" }, { label: "Instagram", value: "@lowsdesignandbuild", href: "https://www.instagram.com/lowsdesignandbuild" }, study("lows-design-build")],
  },
  one("portfolio/lows/logo-zoom.mp4", undefined, { frame: false, light: `/media/images/${"portfolio/lows/logo-zoom-light.mp4"}` }),
  device("portfolio/lows/macbook.webm"),
  device("portfolio/lows/iphone-instagram.webm"),
  device("portfolio/lows/signage-wheel.webm"),
  {
    kind: "quote",
    name: "Lows Design + Build",
    quote: "He has completely transformed our online presence and taken it to the next level.",
    by: "Samuel Low",
  },

  /* ── The Moment You Realise (Share to Buy) ─────────────────── */
  { kind: "title", id: "share-to-buy", name: "The Moment You Realise", category: "Social Campaign for Share to Buy", year: "2022–2023", tags: ["Motion Design", "Social Media"] },
  {
    kind: "text",
    name: "The Moment You Realise",
    category: "Social Campaign for Share to Buy",
    body:
      "The Moment You Realise was a campaign for Share to Buy, the UK’s largest affordable homeownership platform. I made motion and still assets in two styles and cut every one for feed, Stories, Reels and LinkedIn.",
    stats: [{ value: "30+", label: "Motion and still assets" }, { value: "+19.7%", label: "New registrants, year on year" }, { value: "+3.4%", label: "Property enquiries" }],
    meta: [study("tmyr")],
  },
  { kind: "media", items: [m("tmyr/hero-poster.webp", { frame: false, phones: true, mobile: { ...phone("tmyr/hero-poster.webp")!, w: 9, h: 10 } })], ground: "#ae125f", ink: "#ffffff" },
  // These two clips carry their page colour in the file (padded to the page's shape with the clip's own
  // corner pixels), so the pink round them is the same video colour on every screen. Phones get square
  // versions; the ring's is H.264 at 30fps, as the VP9 one was too heavy for an iPhone to start.
  { kind: "media", items: [m("portfolio/tmyr/posts-ring-wide.webm", { frame: false, mobile: phone("portfolio/tmyr/posts-ring-mobile.mp4") })], bleed: true, ground: "#ae125f", ink: "#ffffff" },
  { kind: "media", items: [m("portfolio/tmyr/guy-wide.webm", { frame: false, mobile: phone("portfolio/tmyr/guy-mobile.mp4") })], bleed: true, ground: "#e71988", ink: "#ffffff" },

  /* ── TasWater ──────────────────────────────────────────────── */
  { kind: "title", id: "taswater", name: "TasWater", category: "Information Design", year: "2024", tags: ["Infographics"] },
  {
    kind: "text",
    name: "TasWater",
    category: "Information Design",
    body:
      "TasWater runs water and sewerage for the whole of Tasmania. I designed two large graphics for them in a month, made to sit inside their interactive eLearning software: one of the whole water network, one of a new starter’s first year. Both are strictly on brand and were signed off by their leadership.",
    meta: [{ label: "Studio", value: "Packer and Associates" }, study("taswater")],
  },
  bleed("portfolio/taswater/map-mockup.webp", undefined, { mobile: phone("portfolio/taswater/map-mockup-mobile.webp") }),
  bleed("portfolio/taswater/snake-mockup.webp", undefined, { mobile: phone("portfolio/taswater/snake-mockup-mobile.webp") }),

  /* ── The London Home Show ──────────────────────────────────── */
  { kind: "title", id: "london-home-show", name: "The London Home Show", category: "Event", year: "2023", tags: ["Print", "Wayfinding", "Email"] },
  {
    kind: "text",
    name: "The London Home Show",
    category: "Event",
    body:
      "The London Home Show is the UK’s first affordable homes exhibition. I designed the show’s print and digital: flags and wayfinding, stage graphics, brochures, booklets and tickets, Metro newspaper ads, and the email campaign that sold the tickets.",
    meta: [study("london-home-show")],
    stats: [{ value: "4,000+", label: "Visitors" }, { value: "Record", label: "Ticket sales" }],
  },
  // edge to edge on a phone too
  { kind: "media", items: [m("portfolio/london-home-show/event-deck.webm", { frame: false, mobile: phone("portfolio/london-home-show/event-deck-mobile.webm") })], bleed: true },

  /* ── Other ─────────────────────────────────────────────────── */
  /* One page each. The full story is on each case study. */
  { kind: "section", title: "Other", subtitle: "Playbooks, print and covers", year: "2022–2026" },
  linked("portfolio/salesmasters/covers-wheel.webm", "Salesmasters. Sales playbooks for nine clients", { label: "Case study", href: "https://www.finbar.studio/case-studies/salesmasters" }, ["Editorial", "Print", "Infographics", "Generative AI"]),
  linked("portfolio/packer/capability-statement.webm", "Packer and Associates. Capability statement", { label: "Case study", href: "https://www.finbar.studio/case-studies/packer-associates" }, ["Editorial", "Print", "3D"]),
  { kind: "media", items: [m("joe-devine/hero.webp")], bleed: true, caption: "Joe Devine. Single covers and art direction", link: { label: "Case study", href: "https://www.finbar.studio/case-studies/joe-devine" }, tags: ["Art Direction", "Photography"] },

  { kind: "end" },
];

export const PORTFOLIO: Slide[] = mediaDeep(RAW);
