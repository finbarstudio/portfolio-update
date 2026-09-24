/**
 * /portfolio — every page of the scrolling PDF portfolio, in order.
 *
 * Page kinds (drawn by app/portfolio/page.tsx):
 *   title    chapter opener: name, discipline, year
 *   text     the project paragraph + team / year
 *   quote    a verbatim client line (shorten with … only, never reword)
 *   media    one to four images or clips in a row
 *   logo     a mark centred on a ground
 *
 * THE MEDIA RULE FOR THIS PAGE: inset, never full bleed, never cropped. Every
 * image and clip is framed at its true proportions (m() pulls them from
 * content/portfolio-dims.json; after adding media run
 * `node scripts/portfolio-dims.mjs`). Rows are sized so the whole row fits.
 *
 * Facts come from Job:CV/London 2026/FINBAR-CONTEXT.md. Media paths resolve
 * through mediaDeep (Cloudflare R2 in production). Copy: no em dashes,
 * humanizer pass, nothing that is not true.
 */
import { mediaDeep } from "@/lib/media";
import DIMS from "./portfolio-dims.json";

export type Media = { src: string; w: number; h: number; video?: boolean; frame?: boolean; alt?: string };
export type Meta = { label: string; value: string; href?: string };
export type Slide =
  | { kind: "cover" }
  | { kind: "cv" }
  | { kind: "title"; id: string; name: string; category: string; year: string }
  | { kind: "text"; name: string; category: string; body: string; meta: Meta[] }
  | { kind: "quote"; name: string; quote: string; by: string }
  | { kind: "media"; items: Media[]; caption?: string }
  | { kind: "logo"; src: string; alt?: string; bg?: string; size?: string; dark?: boolean }
  | { kind: "section"; title: string; subtitle: string; year: string }
  | { kind: "end" };

export const UPDATED = { long: "September 2026", short: "24.09.2026" };

export const CV = {
  email: "finbar@finbar.studio",
  bio: [
    "I’m Finbar, a London-born graphic and digital designer. I studied at Brighton, started in-house at Share to Buy, then spent two years in Brisbane as the only designer at a consulting firm, designing brands, publications and a lot of sales playbooks.",
    "Since 2025 most of my work has been brands and websites for small businesses, taking them from the first sketch of a mark to a live site the client runs themselves. The sites are coded with Claude Code under my direction. I moved back to London in September 2026 and I’m looking for my next studio or in-house team.",
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
function m(path: string, o: Partial<Media> = {}): Media {
  const [w, h] = D[path] ?? [16, 9];
  return { src: `/media/images/${path}`, w, h, video: /\.(mp4|webm)$/.test(path), frame: true, ...o };
}
const one = (path: string, caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: [m(path, o)], caption });
const row = (paths: string[], caption?: string, o: Partial<Media> = {}): Slide => ({ kind: "media", items: paths.map((p) => m(p, o)), caption });

const ME = { label: "Team members", value: "Finbar Skitini" };

const RAW: Slide[] = [
  { kind: "cover" },
  { kind: "cv" },

  /* ── Rennen Plus ───────────────────────────────────────────── */
  { kind: "title", id: "rennen-plus", name: "Rennen Plus", category: "Website", year: "2026" },
  {
    kind: "text",
    name: "Rennen Plus",
    category: "Website",
    body:
      "Rennen Plus sells performance parts from five brands, and its range was spread across supplier sites, an old Shopify store and a quoting spreadsheet. I designed one catalogue where the car comes first: pick your car, see only the parts that fit it, and get a landed Australian price that changes as you choose options. 228 cars and about 2,500 parts, live in five and a half weeks for the Porsche Club of Queensland Concours.",
    meta: [ME, { label: "Year", value: "2026" }, { label: "Live", value: "rennenplus.com.au", href: "https://rennenplus.com.au" }],
  },
  one("rennen-plus/demos/landing.mp4"),
  one("rennen-plus/demos/grid.mp4", "Every car on one baseline, each thumbnail cut out and faced the same way"),
  row(["rennen-plus/demos/phone-1.webp", "rennen-plus/demos/phone-2.webp", "rennen-plus/demos/phone-3.webp"], "The finder, a car page and its package on a phone"),
  one("rennen-plus/demos/material.mp4", "Trim and finish change the price live; the finish renders as a 3D material"),
  one("rennen-plus/demos/dealers.mp4", "Forty-five dealers and installers, searchable by postcode"),

  /* ── Lows Design and Build ─────────────────────────────────── */
  { kind: "title", id: "lows", name: "Lows Design + Build", category: "Brand and Website", year: "2026" },
  {
    kind: "text",
    name: "Lows Design + Build",
    category: "Brand and Website",
    body:
      "Lows is a family-run building company in South London. I refined their mark from the client’s own sketches, then designed a website led by the work: big photography, project pages, an estimate tool that turns a visitor into a named lead, and a CMS the team updates themselves. The launch came with a pack of posts for Instagram, LinkedIn and X.",
    meta: [ME, { label: "Year", value: "2023–2026" }, { label: "Live", value: "lowsdesignandbuild.com", href: "https://lowsdesignandbuild.com" }],
  },
  { kind: "logo", src: `/media/images/lows-design-build/logo.svg`, alt: "Lows Design + Build logo", bg: "#f3efe6", size: "44cqw" },
  one("lows-design-build/site-scroll-3d.mp4"),
  one("lows-design-build/project-page.mp4"),
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
    meta: [ME, { label: "Year", value: "2026" }],
  },
  { kind: "logo", src: `/media/images/plated-with-issy/wordmark.svg`, alt: "Plated with Issy wordmark", bg: "#3D3E2A", size: "54cqw", dark: true },
  one("plated-with-issy/site-scroll-3d.mp4"),
  row(["plated-with-issy/supper-issy.webp", "plated-with-issy/supper-table.webp", "plated-with-issy/supper-course.webp"], "Photography from the supper club, used across the site"),

  /* ── Lola Audio ────────────────────────────────────────────── */
  { kind: "title", id: "lola", name: "Lola Audio", category: "Website", year: "2026" },
  {
    kind: "text",
    name: "Lola Audio",
    category: "Website",
    body:
      "Lola Stoodley is a composer and sound designer, so her site plays like her work. Faders mix the music as you move them, scrolling back rewinds the track, and her name draws itself in pen. Each showreel opens in a full-screen player you can scrub frame by frame.",
    meta: [ME, { label: "Year", value: "2026" }, { label: "Live", value: "lola-audio.com", href: "https://www.lola-audio.com" }],
  },
  one("lola-audio/site-scroll-3d.mp4"),
  one("lola-audio/watch.mp4"),

  /* ── Salesmasters ──────────────────────────────────────────── */
  { kind: "title", id: "salesmasters", name: "Salesmasters", category: "Editorial", year: "2024–2025" },
  {
    kind: "text",
    name: "Salesmasters",
    category: "Editorial",
    body:
      "Salesmasters writes sales playbooks for businesses in healthcare, manufacturing, technology and storage. Over twelve months I researched, wrote and designed more than fifteen of them, each 30 to 50 pages, with the diagrams drawn for each client. Every book ran on the same InDesign system and took about seventy hours, and every client came back for the next one.",
    meta: [ME, { label: "Studio", value: "Packer and Associates" }, { label: "Year", value: "2024–2025" }],
  },
  row(["salesmasters/covers/alpha.webp", "salesmasters/covers/bus4x4.webp", "salesmasters/covers/playbook.webp", "salesmasters/covers/siteware.webp"], "Four of the fifteen covers"),
  row(["salesmasters/graphics/active-medical/wheel.webp", "salesmasters/graphics/bus4x4/wheel.webp", "salesmasters/graphics/cutek/wheel.webp", "salesmasters/graphics/site-ware-direct/wheel.webp"], "The Sales Wheel, drawn fresh for each client", { frame: false }),
  row(["salesmasters/playbook/page-1.webp", "salesmasters/playbook/page-8.webp", "salesmasters/playbook/page-14.webp", "salesmasters/playbook/page-17.webp"], "Pages from one edition"),

  /* ── KinAya ────────────────────────────────────────────────── */
  { kind: "title", id: "kinaya", name: "KinAya", category: "Brand and Website", year: "2024" },
  {
    kind: "text",
    name: "KinAya",
    category: "Brand and Website",
    body:
      "KinAya supports people with disabilities in Adelaide. I took the client’s sketch through to a finished mark, built a colour system with a full tint range and a guidelines document, then designed a six-page site with a text resizer for carers and people with low vision.",
    meta: [ME, { label: "Year", value: "2024" }, { label: "Live", value: "kinaya.com.au", href: "https://kinaya.com.au" }],
  },
  { kind: "logo", src: `/media/images/kinaya/final-logos/logo-pink.svg`, alt: "KinAya logo", bg: "#fff", size: "40cqw" },
  row(["kinaya/logo-development/asset-30.webp", "kinaya/logo-development/asset-32.webp", "kinaya/logo-development/asset-35.webp", "kinaya/logo-development/asset-38.webp"], "From the client’s sketch to the final mark", { frame: false }),
  row(["web/kinaya-3.webp", "web/kinaya-4.webp"], "The values and team pages"),
  one("kinaya/accessibility.webm", "The text resizer, for carers and people with low vision"),

  /* ── Palms Motel ───────────────────────────────────────────── */
  { kind: "title", id: "palms", name: "Palms Motel", category: "Art Direction", year: "2024" },
  {
    kind: "text",
    name: "Palms Motel",
    category: "Art Direction",
    body:
      "Palms Motel is a personal project: a 1970s Palm Springs motel that never existed, told through AI imagery on TikTok. I built one Midjourney prompt system from reference photography so every image holds the same light and the same world. 48 posts, 109k likes, and one post seen 770k times.",
    meta: [ME, { label: "Year", value: "2024" }],
  },
  one("palmsmotel/scene-1.webp"),
  row(["palmsmotel/poster-2.webp", "palmsmotel/poster-1.webp", "palmsmotel/poster-3.webp", "palmsmotel/poster-4.webp"]),
  one("palmsmotel/scene-3.webp"),

  /* ── Share to Buy ──────────────────────────────────────────── */
  { kind: "title", id: "share-to-buy", name: "Share to Buy", category: "Social Campaign", year: "2022–2023" },
  {
    kind: "text",
    name: "Share to Buy",
    category: "Social Campaign",
    body:
      "The Moment You Realise was a campaign for Share to Buy, the UK’s largest affordable homeownership platform. I made more than thirty motion and still assets in two styles and cut every one for feed, Stories, Reels and LinkedIn. New registrants were up 19.7 percent on the year before.",
    meta: [{ label: "Team members", value: "Share to Buy marketing team" }, { label: "Year", value: "2022–2023" }],
  },
  row(["tmyr/1080x1920-ig-reels/freya.webm", "tmyr/1080x1920-ig-reels/kiran.webm", "tmyr/1080x1920-ig-reels/lauren.webm", "tmyr/1080x1920-ig-reels/olu.webm"], "Reels"),
  row(["tmyr/1080x1080-ig-posts/kiran.webm", "tmyr/1080x1080-ig-posts/anthony.webm", "tmyr/1080x1080-ig-posts/molly.webm"], "Feed posts"),

  /* ── The London Home Show ──────────────────────────────────── */
  { kind: "title", id: "london-home-show", name: "The London Home Show", category: "Event", year: "2023" },
  {
    kind: "text",
    name: "The London Home Show",
    category: "Event",
    body:
      "The London Home Show is the UK’s first affordable homes exhibition, with more than 4,000 visitors. I designed the show’s print and digital: flags and wayfinding, stage graphics, brochures, booklets and tickets, Metro newspaper ads, and the email campaign that drove record ticket sales.",
    meta: [{ label: "Team members", value: "Share to Buy marketing team" }, { label: "Year", value: "2023" }],
  },
  one("london-home-show/hero.webp"),
  row(["london-home-show/flags.webp", "london-home-show/booklets.webp"]),
  one("london-home-show/stage.webp"),

  /* ── TasWater ──────────────────────────────────────────────── */
  { kind: "title", id: "taswater", name: "TasWater", category: "Information Design", year: "2024" },
  {
    kind: "text",
    name: "TasWater",
    category: "Information Design",
    body:
      "TasWater runs water and sewerage for the whole of Tasmania. I designed two large infographics for them in a month, turning a statewide network into something a customer can read at a glance, strictly on brand and signed off by their leadership.",
    meta: [ME, { label: "Studio", value: "Packer and Associates" }, { label: "Year", value: "2024" }],
  },
  one("taswater/map.webp"),
  one("taswater/hero.webp"),

  /* ── Other ─────────────────────────────────────────────────── */
  { kind: "section", title: "Other", subtitle: "Covers and side projects", year: "2022–2026" },
  one("joe-devine/hero.webp", "Single covers for Joe Devine"),
  row(["joe-devine/albums/giant-leap-md.webp", "joe-devine/albums/baby-steps-md.webp", "joe-devine/albums/one-foot-forward-md.webp", "joe-devine/albums/too-far-gone-md.webp"], "Art direction and photography, one colour per single"),

  { kind: "end" },
];

export const PORTFOLIO: Slide[] = mediaDeep(RAW);
