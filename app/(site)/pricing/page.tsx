import type { Metadata } from "next";
import ContactCta from "@/components/ContactCta";
import PrintButton from "./PrintButton";
import "./pricing.css";

/**
 * /pricing — a private rates page for studio partners and serious enquiries.
 *
 * Lives INSIDE the (site) group on purpose: full site chrome (nav, footer, the
 * floating Get-a-quote pill). Still unlisted — noindex, not in the sitemap
 * (manual list), linked from nowhere. Travels by URL only.
 *
 * Layout matches the main pages: px-5 md:px-10 width, H1 in ink at
 * --text-display, H2s in .display-brand, mono labels, sticker-pill CTA.
 * Products lead; the studio day rates follow. Prints clean to PDF (site
 * chrome hidden via the print styles; the button calls window.print()).
 *
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
    points: ["Custom-coded, no templates", "Motion and micro-interaction", "SEO and analytics basics", "Live in about two weeks"],
  },
  {
    name: "Brochure site",
    price: "$2,500 to $4,500",
    blurb: "The full front door, up to six pages.",
    points: ["A CMS you edit yourself", "Contact and enquiry flows", "Structured data and OG cards", "Full handover and walkthrough"],
    lead: true,
  },
  {
    name: "Custom build",
    price: "$5,000 to $9,000",
    blurb: "Bespoke design system, built as drawn.",
    points: ["Custom animation throughout", "Integrations and custom tools", "AI-search-ready front end", "Fast, and it stays fast"],
  },
  {
    name: "Brand + site",
    price: "from $6,500",
    blurb: "Identity and website as one piece.",
    points: ["Logo and full identity", "Guidelines the site actually uses", "Everything in Custom build", "One voice, sketch to code"],
  },
];

const EXTRAS = [
  { name: "Instant estimate calculator", price: "$800 to $1,500" },
  { name: "Live social or content feeds", price: "from $500" },
  { name: "Blog or journal CMS", price: "from $600" },
  { name: "Copywriting pass", price: "from $400" },
  { name: "Booking and payments", price: "from $500" },
];

const BRAND_ROWS = [
  { name: "Logo + core identity", price: "$1,500 to $2,500" },
  { name: "Full identity + guidelines", price: "$3,000 to $5,500" },
  { name: "Editorial, print and motion", price: "$550/day" },
];

const CARE_ROWS = [
  { name: "Hosting", price: "$35/mo" },
  { name: "Hosting + care", price: "$75/mo" },
  { name: "Care + a design day monthly", price: "$250/mo" },
];

const PARTNER_ROWS = [
  { name: "Day rate, design or dev", detail: "Your designs built as drawn, or overflow taken on under your banner. White-label or credited.", price: "$550/day" },
  { name: "Fixed projects", detail: "Any package on this page at partner rate.", price: "10% off listed" },
  { name: "Retained days", detail: "A block of days each month, first call on my calendar.", price: "from $1,800/mo" },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div className="pr px-5 md:px-10 pb-24 md:pb-28">
      <PrintButton />

      {/* ── Title ── */}
      <section className="pt-10 md:pt-16 pb-10 md:pb-12">
        <h1 className="font-bold text-ink leading-[1.02]" style={{ fontSize: "var(--text-display)", letterSpacing: "-0.01em" }}>
          Pricing
        </h1>
        <p className="text-ink-soft mt-5 max-w-2xl" style={{ fontSize: "var(--text-body)" }}>
          Custom-coded websites and brand design, quoted fixed before anything
          starts. AUD, ex GST. Private, shared by link only.
        </p>
      </section>

      {/* ── Websites: the products lead ── */}
      <section className="pb-14 md:pb-20" aria-label="Website packages">
        <div className="pr-tiers">
          {SITE_TIERS.map((t) => (
            <article key={t.name} className={`pr-tier ${t.lead ? "is-lead" : ""}`}>
              <h2 className="mono-heading text-ink-soft">{t.name}</h2>
              <p className="pr-tier-price">{t.price}</p>
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
                <li key={r.name}><span>{r.name}</span><span className="pr-price">{r.price}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="pr-h2 font-bold display-brand">Brand and design</h2>
            <ul className="pr-list">
              {BRAND_ROWS.map((r) => (
                <li key={r.name}><span>{r.name}</span><span className="pr-price">{r.price}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="pr-h2 font-bold display-brand">Hosting and care</h2>
            <ul className="pr-list">
              {CARE_ROWS.map((r) => (
                <li key={r.name}><span>{r.name}</span><span className="pr-price">{r.price}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Studios: day rates after the products ── */}
      <section className="pb-14 md:pb-20" aria-label="Working with studios">
        <div className="pr-partner">
          <div>
            <h2 className="pr-h2 font-bold display-brand">Working with studios</h2>
            <p className="text-ink-soft mt-3 leading-relaxed max-w-[36ch]" style={{ fontSize: "var(--text-small)" }}>
              White-label or credited, whichever suits. I plug into your Slack
              or thread, deadlines are sacred, and your client stays your client.
            </p>
          </div>
          <ul className="pr-rows">
            {PARTNER_ROWS.map((r) => (
              <li key={r.name} className="pr-row">
                <div>
                  <p className="pr-row-name">{r.name}</p>
                  <p className="pr-row-detail">{r.detail}</p>
                </div>
                <p className="pr-price">{r.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Terms + CTA ── */}
      <section aria-label="Terms and contact">
        <div className="pr-foot">
          <p className="pr-terms">
            Half to begin, half at launch. Most sites are live in two to six
            weeks. These numbers are a guide and every job is quoted properly,
            so the number you sign is the number you pay.
          </p>
          <div className="no-print">
            <ContactCta className="sticker-pill book-call-pill">Start a project</ContactCta>
          </div>
        </div>
      </section>
    </div>
  );
}
