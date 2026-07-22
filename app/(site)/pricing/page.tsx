import type { Metadata } from "next";
import PricingGate from "./PricingGate";
import InfoTip from "./InfoTip";
import "./pricing.css";

/**
 * /pricing — a private rates page for studio partners and serious enquiries.
 *
 * Inside the (site) group: full site chrome. The floating pill reads "Start a
 * project" on this page only (BookCall's pathname override) so there's no
 * duplicate CTA here. Unlisted (noindex, not in the sitemap, linked from
 * nowhere) AND soft-locked behind a password (PricingGate, "workwithme").
 *
 * Every price that can vary carries a little ⓘ explaining what moves it.
 * Numbers are the working draft — tune freely.
 */

export const metadata: Metadata = {
  title: "Pricing",
  description: "Rates and packages. Private page for partners.",
  robots: { index: false, follow: false },
};

/* ── Data (edit freely) ───────────────────────────────────────────────────── */

const SITE_TIERS = [
  {
    name: "Landing page",
    price: "from $1,200",
    blurb: "One page that does one job properly.",
    info: "The from price is a single tight page. More sections, custom illustration or heavier animation move it up.",
    points: ["Custom-coded, no templates", "Motion and micro-interaction", "SEO and analytics basics", "Live in about two weeks"],
  },
  {
    name: "Brochure site",
    price: "$2,500 to $4,500",
    blurb: "The full front door, up to six pages.",
    info: "Where it lands depends on page count, how much the CMS needs to manage, and how custom the design goes.",
    points: ["A CMS you edit yourself", "Contact and enquiry flows", "Structured data and OG cards", "Full handover and walkthrough"],
    lead: true,
  },
  {
    name: "Custom build",
    price: "$5,000 to $9,000",
    blurb: "Fully custom design, built exactly as drawn.",
    info: "Driven by the size of the design system, the animation and any integrations or custom tools.",
    points: ["Custom animation throughout", "Integrations and custom tools", "AI-search-ready front end", "Fast, and it stays fast"],
  },
  {
    name: "Brand + site",
    price: "from $6,500",
    blurb: "Identity and website as one piece.",
    info: "Depends how much identity work already exists and the size of the site it feeds into.",
    points: ["Logo and full identity", "Guidelines the site actually uses", "Everything in Custom build", "One person, sketch to code"],
  },
];

const EXTRAS = [
  { name: "Instant estimate calculator", price: "$680 to $1,275", info: "Follows the logic inside it: a few inputs sits low, multi-step with an email handoff sits high." },
  { name: "Live social or content feeds", price: "from $425", info: "Depends on the platform and how the feed is designed into the page." },
  { name: "Blog or journal CMS", price: "from $510", info: "Covers the CMS set-up, templates and feeds. More post types cost more." },
  { name: "Copywriting pass", price: "from $340", info: "Priced by page count." },
  { name: "Booking and payments", price: "from $425", info: "Depends on the provider and whether payments are taken on-site." },
];

const BRAND_ROWS = [
  { name: "Logo + core identity", price: "$1,500 to $2,500", info: "Rounds of exploration and the size of the deliverables list." },
  { name: "Full identity + guidelines", price: "$3,000 to $5,500", info: "Scope of the guidelines and how much collateral launches with it." },
  { name: "Editorial, print and motion", price: "$550/day", info: "Booked by the day, scoped up front so you know the days before we start." },
];

const CARE_ROWS = [
  {
    name: "Hosting",
    price: "$35/mo",
    detail: "Fast, secure hosting with SSL and backups. The domain pointed and looked after, one less login to chase.",
  },
  {
    name: "Hosting + care",
    price: "$75/mo",
    detail: "Everything in Hosting, plus updates, security patches and small content changes handled within a couple of days.",
  },
  {
    name: "Care + a design day monthly",
    price: "$250/mo",
    detail: "Everything in Care, plus a full design or dev day every month for whatever is next on the list.",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div className="pr px-5 md:px-10 pb-24 md:pb-28">
      <PricingGate>

      {/* ── Title: central, caps ── */}
      <section className="pt-10 md:pt-16 pb-10 md:pb-12 text-center">
        <h1 className="font-bold text-ink leading-[1.02] uppercase" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
          Pricing
        </h1>
        <p className="pr-sub">
          Custom-coded websites and brand design, quoted fixed before anything starts. AUD, ex GST.
        </p>
      </section>

      {/* ── Websites: the products lead ── */}
      <section className="pb-14 md:pb-20" aria-label="Website packages">
        <div className="pr-tiers">
          {SITE_TIERS.map((t) => (
            <article key={t.name} className={`pr-tier ${t.lead ? "is-lead" : ""}`}>
              <h2 className="pr-tier-name">{t.name}</h2>
              <p className="pr-tier-price">{t.price} <InfoTip text={t.info} /></p>
              <p className="pr-tier-blurb">{t.blurb}</p>
              <ul className="pr-tier-points">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── Extras / brand / care: one wide three-column band ── */}
      <section className="pb-14 md:pb-20" aria-label="Extras, brand and care">
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
          <div>
            <h2 className="pr-h2 font-bold display-brand">Hosting and care</h2>
            <ul className="pr-list">
              {CARE_ROWS.map((r) => (
                <li key={r.name} className="pr-list-tall">
                  <span className="pr-list-name">
                    {r.name}
                    <span className="pr-list-detail">{r.detail}</span>
                  </span>
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
            Half to begin, half at launch, and most sites are live in two to six
            weeks. Where a range is shown, the final number comes down to scope:
            page count, custom features and how far the animation goes. Every job
            is quoted fixed before we start, so the number you sign is the number
            you pay.
          </p>
        </div>
      </section>
      </PricingGate>
    </div>
  );
}
