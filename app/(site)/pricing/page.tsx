import type { Metadata } from "next";
import InfoTip from "./InfoTip";
import Tiers, { type Tier } from "./Tiers";
import "./pricing.css";

/**
 * /pricing — the rates page. Open to anyone with the link: no password.
 *
 * Inside the (site) group: full site chrome. The floating pill reads "Start a
 * project" on this page only (BookCall's pathname override) so there's no
 * duplicate CTA here. Still unlisted: noindex, not in the sitemap, linked from
 * nowhere. It travels in emails.
 *
 * ONE PAGE, MANY LINKS. /pricing?landing-page (or ?small-site, ?custom-site)
 * marks that package as the suggestion for whoever was sent the link; see
 * Tiers.tsx. The prices are the same for everyone.
 *
 * GUIDE PRICES. Finbar's rule: every figure here is a guide to the product and
 * the scope it expects. Projects never fit the list, so scope and price flex
 * and the page always says: talk first, then a fixed quote. Every ⓘ says so.
 * FORMAT: never a range. Always the word from and the lowest figure,
 * e.g. "from £750".
 *
 * All prices are GBP and say nothing about VAT, on purpose. Build prices do
 * not include hosting. Every price that can vary carries a little ⓘ explaining
 * what moves it.
 */

export const metadata: Metadata = {
  title: "Pricing",
  description: "Fixed prices for custom-coded websites, hosting and ongoing help.",
  robots: { index: false, follow: false },
};

/* ── Data (edit freely) ───────────────────────────────────────────────────── */

const SITE_TIERS: Tier[] = [
  {
    id: "landing-page",
    name: "Landing page",
    price: "£1,750",
    blurb: "One page that does one job properly.",
    info: "A guide price. It assumes a hero, five sections and a footer, but no project fits a list exactly, so the scope can flex and the price moves with it. Talk to me first and I will give you a fixed figure.",
    points: [
      "A hero, five sections and a footer",
      "Contact buttons in the nav",
      "Custom-coded, no templates",
      "Live in about two weeks",
    ],
    examples: [
      { label: "Lola Audio", href: "/case-studies/lola-audio" },
      { label: "Plated with Issy", href: "/case-studies/plated-with-issy" },
    ],
  },
  {
    id: "small-site",
    name: "Small site",
    price: "£3,500",
    blurb: "Three pages. Usually home, about and contact.",
    info: "A guide price for three pages. Yours might need two, or four with a gallery, so treat it as the starting point for a conversation. The fixed figure comes after we have talked.",
    points: [
      "A tighter home page, with the detail a click deeper",
      "A contact form if you want one",
      "Custom-coded, no templates",
      "Live in about four weeks",
    ],
  },
  {
    id: "custom-site",
    name: "Custom site",
    price: "from £4,000",
    blurb: "A CMS, project or blog posts, anything more involved.",
    info: "A guide to where this size of job starts. A site like Lows, with a CMS and custom project pages, sits near the starting figure. Big catalogues and custom tools, like Rennen Plus, sit higher. Every one is scoped with you, then quoted fixed.",
    points: [
      "A CMS you edit yourself, built on Sanity",
      "Project, portfolio or blog posts",
      "Custom tools and integrations",
      "Quoted fixed before we start",
    ],
    examples: [
      { label: "Lows Design + Build", href: "/case-studies/lows-design-build" },
      { label: "Rennen Plus", href: "/case-studies/rennen-plus" },
    ],
  },
];

/** On every build, whatever the size. */
const INCLUDED = [
  "Custom animation and scroll-driven interaction, designed for your site",
  "A first SEO fix, plus a plain guide to setting up Google Search Console and your Google Business Profile",
  "The custom code is yours outright",
  "A fixed quote once the scope is agreed, before anything starts",
];

const EXTRAS = [
  { name: "Extra section", price: "£200", info: "A guide for one more designed section on any page. A simple one costs less, a heavily animated one more." },
  { name: "Extra page", price: "about £1,000", info: "A guide. It depends how much of the page is new design and how much reuses what is already built, so ask." },
  { name: "Custom-coded components and tools", price: "from £350", info: "A guide to where these start. Estimate calculators, quote builders, configurators, anything interactive your business needs. Each one is scoped with you first." },
  { name: "Live social or content feeds", price: "from £200", info: "A guide. It depends on the platform and how the feed is designed into the page." },
  { name: "Copywriting pass", price: "from £150", info: "A guide, priced by page count. Send me what you have and I will tell you what it needs." },
  { name: "Booking and payments", price: "from £200", info: "A guide. It depends on the provider and whether payments are taken on the site." },
  { name: "Custom email + signatures", price: "from £75", info: "A guide for mailboxes on your own domain, set up properly, plus a designed email signature. Bigger teams cost a little more." },
];

const BRAND_ROWS = [
  { name: "Logo + core identity", price: "from £750", info: "A guide to where this starts. It goes up with the rounds of exploration and the length of the list of deliverables." },
  { name: "Full identity + guidelines", price: "from £2,000", info: "A guide to where this starts. It goes up with the scope of the guidelines and how much collateral launches with them." },
  { name: "Editorial, print and motion", price: "£400/day", info: "Booked by the day. I scope the job with you first, so you know how many days before we start." },
];

const CARE_ROWS = [
  {
    name: "Hosting",
    price: "£20/mo, or £200 a year",
    detail: "Charged at what it costs me, with no markup. It covers hosting the code, storing the images and the CMS. Changes to the site are not part of it.",
  },
  {
    name: "Monthly retainer",
    price: "£300/mo",
    detail: "One page redesigned every month, usually a new hero for a promotion or an event. A direct line to me, and basic content changes across the site live within 48 hours. A CMS lets you do much of this yourself.",
  },
  {
    name: "Always yours",
    price: "included",
    detail: "The code is yours. Stop paying for hosting whenever you like and I will help you set up your own, then move everything across, free.",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div className="pr px-5 md:px-10 pb-24 md:pb-28">
      {/* ── Title: central, caps ── */}
      <section className="pt-10 md:pt-16 pb-10 md:pb-12 text-center">
        <h1 className="font-bold text-ink leading-[1.02] uppercase" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
          Pricing
        </h1>
        <p className="pr-sub">
          Custom-coded websites and brand design. These are guide prices in GBP: they show what each product is and the scope it expects. Your job gets its own fixed quote once we have talked it through.
        </p>
        <p className="pr-sub" style={{ marginTop: "10px" }}>
          I can develop, or design and develop. Come with Figma files, an existing
          website, an existing brand, or just the concept of one.
        </p>
      </section>

      {/* ── Websites: the products lead ── */}
      <section className="pb-10 md:pb-12" aria-label="Website packages">
        <Tiers tiers={SITE_TIERS} />
      </section>

      {/* ── On every build ── */}
      <section className="pb-14 md:pb-20" aria-label="Included with every build">
        <div className="pr-included">
          <h2 className="pr-included-title">Every build includes</h2>
          <ul>
            {INCLUDED.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Hosting and help: its own full-width row, three across ── */}
      <section className="pb-14 md:pb-20" aria-label="Hosting and help">
        <div className="pr-care">
          <h2 className="pr-h2 font-bold display-brand">Hosting and help</h2>
          <ul className="pr-care-list">
            {CARE_ROWS.map((r) => (
              <li key={r.name}>
                <span className="pr-care-head">
                  <span className="pr-list-name">{r.name}</span>
                  <span className="pr-price">{r.price}</span>
                </span>
                <span className="pr-list-detail">{r.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Extras and brand: two columns below ── */}
      <section className="pb-14 md:pb-20" aria-label="Extras and brand">
        <div className="pr-band">
          <div>
            <h2 className="pr-h2 font-bold display-brand">The extras</h2>
            <ul className="pr-list">
              {EXTRAS.map((r) => (
                <li key={r.name}>
                  <span className="pr-list-name">{r.name} <InfoTip text={r.info} /></span>
                  <span className="pr-price">{r.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="pr-h2 font-bold display-brand">Brand and design</h2>
            <ul className="pr-list">
              {BRAND_ROWS.map((r) => (
                <li key={r.name}>
                  <span className="pr-list-name">{r.name} <InfoTip text={r.info} /></span>
                  <span className="pr-price">{r.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Terms ── */}
      <section aria-label="Terms">
        <div className="pr-foot">
          <p className="pr-terms">
            Every price here is a guide. No project fits a list exactly, so
            the scope bends to suit yours and the price moves with it: page
            count, custom features and how far the animation goes. Talk to me
            first. Once we agree the scope I quote it fixed, so the number you
            sign is the number you pay. Half to begin, half at launch. Build
            prices do not include hosting, which is separate and optional. Custom emails, signatures and
            any other design or graphic work are covered too, just ask.
          </p>
        </div>
      </section>
    </div>
  );
}
