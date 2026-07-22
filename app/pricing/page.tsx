import type { Metadata } from "next";
import BrandWordmark from "@/components/BrandWordmark";
import PrintButton from "./PrintButton";
import "./pricing.css";

/**
 * /pricing — a private rates deck for studio partners and serious enquiries.
 *
 * Deliberately UNLISTED: noindex/nofollow, not in the sitemap (it's a manual
 * list), and nothing on the site links here — it travels by URL only. Reads as
 * a deck on screen (one slide per section) and prints clean to PDF via the
 * print styles (one slide per page); the button just calls window.print().
 *
 * Numbers are Finbar's to tune — this is the first pass, flagged as such in
 * the footer note.
 */

export const metadata: Metadata = {
  title: { absolute: "Pricing | Finbar Studio" },
  description: "Rates and packages. Private deck for partners.",
  robots: { index: false, follow: false },
};

/* ── Deck data (edit freely — all numbers are the first pass) ─────────────── */

const PARTNER_ROWS = [
  { name: "Dev only: your design, my build", detail: "Figma in, custom-coded site out. Hand-built front end, CMS wired in, launch handled.", price: "$700/day" },
  { name: "Design + build overflow", detail: "Whole projects under your banner when the studio is at capacity.", price: "$750/day" },
  { name: "Project rate", detail: "Prefer fixed? Any package below at partner rate.", price: "15% off listed" },
  { name: "Ongoing overflow", detail: "A retained block of days each month, first call on my calendar.", price: "from $2,600/mo" },
];

const SITE_TIERS = [
  {
    name: "Landing page",
    price: "from $2,000",
    blurb: "One page that does one job properly.",
    points: ["Custom-coded, no templates", "Designed around your brand", "Motion and micro-interaction", "SEO and analytics basics", "Live in about two weeks"],
  },
  {
    name: "Brochure site",
    price: "$4,000 to $7,000",
    blurb: "The full front door: up to six pages.",
    points: ["Everything in Landing", "A CMS you edit yourself", "Contact and enquiry flows", "Structured data and OG cards", "Full handover and walkthrough"],
    lead: true,
  },
  {
    name: "Custom build",
    price: "$7,500 to $15,000",
    blurb: "Bespoke design system, built to behave exactly as drawn.",
    points: ["Everything in Brochure", "Custom animation throughout", "Integrations and custom tools", "AI-search-ready front end", "Performance budgets, hit"],
  },
  {
    name: "Brand + site",
    price: "from $10,000",
    blurb: "Identity and website as one piece of work.",
    points: ["Logo and full identity", "Guidelines the site actually uses", "Everything in Custom build", "Collateral to launch with", "One voice, sketch to code"],
  },
];

const EXTRAS = [
  { name: "Instant estimate calculator", note: "Turns visitors into named leads while you sleep.", price: "$1,500 to $3,000" },
  { name: "Live social or content feeds", note: "Instagram, reviews or news pulled in live.", price: "from $800" },
  { name: "Blog or journal CMS", note: "Write from your phone, published on your domain.", price: "from $900" },
  { name: "Copywriting pass", note: "Every page read, tightened and humanised.", price: "from $650" },
  { name: "Booking and payments", note: "Cal, Stripe or similar, wired in properly.", price: "from $900" },
];

const BRAND_ROWS = [
  { name: "Logo + core identity", detail: "Mark, type, colour, the essentials done properly.", price: "$2,500 to $4,500" },
  { name: "Full identity + guidelines", detail: "The complete system with a guide your whole team can use.", price: "$5,000 to $8,500" },
  { name: "Editorial, print and motion", detail: "Booklets, reports, campaigns, social. Scoped per job.", price: "$700/day" },
];

const CARE_ROWS = [
  { name: "Hosting", detail: "Fast, secure, one less login to chase.", price: "$40/mo" },
  { name: "Hosting + care", detail: "Updates, security, small changes handled within a couple of days.", price: "$95/mo" },
  { name: "Growth partner", detail: "Care plus a day of design or dev time every month.", price: "$390/mo" },
];

const PROCESS = [
  { n: "01", title: "A 15 minute call", body: "You tell me about the job, I tell you honestly what it needs. Fixed quote follows in writing." },
  { n: "02", title: "Design first", body: "The design is approved before a line of code is written, so you see exactly what you're getting." },
  { n: "03", title: "The build", body: "Hand-coded front end, CMS wired in, SEO and speed handled as part of the build, not bolted on." },
  { n: "04", title: "Handover", body: "The keys and a walkthrough. You edit day-to-day yourself, and I'm an email away." },
];

/* ── The deck ─────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <div className="pr">
      <PrintButton />

      {/* ── Cover ── */}
      <section className="pr-slide pr-cover">
        <span className="pr-cover-mark"><BrandWordmark /></span>
        <h1 className="pr-title">Pricing</h1>
        <p className="pr-cover-lede">
          Custom-coded websites and brand design from a boutique Brisbane studio.
          Rates for studio partners and direct projects.
        </p>
        <p className="pr-cover-meta">
          July 2026 · AUD, ex GST · Private, shared by link only
        </p>
      </section>

      {/* ── Working with studios ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">Working with studios</h2>
        <p className="pr-lede">
          White-label or credited, whichever suits. Your designs built the way they
          were drawn, or whole projects taken on quietly under your banner. I plug
          into your Slack or thread, deadlines are sacred, and your client stays
          your client.
        </p>
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
      </section>

      {/* ── Websites ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">Websites</h2>
        <p className="pr-lede">
          Every site is designed from the brand and coded by hand. No WordPress,
          no page builders, and you still edit everything yourself through a CMS.
        </p>
        <div className="pr-tiers">
          {SITE_TIERS.map((t) => (
            <article key={t.name} className={`pr-tier ${t.lead ? "is-lead" : ""}`}>
              <h3 className="pr-tier-name">{t.name}</h3>
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

      {/* ── Extras ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">The extras</h2>
        <p className="pr-lede">Built in where they earn their place, priced on top of any tier.</p>
        <ul className="pr-rows">
          {EXTRAS.map((r) => (
            <li key={r.name} className="pr-row">
              <div>
                <p className="pr-row-name">{r.name}</p>
                <p className="pr-row-detail">{r.note}</p>
              </div>
              <p className="pr-price">{r.price}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Brand & design ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">Brand and graphic design</h2>
        <p className="pr-lede">
          Years of identity, editorial and motion work sit behind every build,
          and they're available on their own too.
        </p>
        <ul className="pr-rows">
          {BRAND_ROWS.map((r) => (
            <li key={r.name} className="pr-row">
              <div>
                <p className="pr-row-name">{r.name}</p>
                <p className="pr-row-detail">{r.detail}</p>
              </div>
              <p className="pr-price">{r.price}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Care ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">Hosting and care</h2>
        <p className="pr-lede">Launch isn't goodbye. The site keeps working long after it goes live.</p>
        <ul className="pr-rows">
          {CARE_ROWS.map((r) => (
            <li key={r.name} className="pr-row">
              <div>
                <p className="pr-row-name">{r.name}</p>
                <p className="pr-row-detail">{r.detail}</p>
              </div>
              <p className="pr-price">{r.price}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Process + terms ── */}
      <section className="pr-slide">
        <h2 className="pr-h2">How a project runs</h2>
        <ol className="pr-steps">
          {PROCESS.map((s) => (
            <li key={s.n}>
              <p className="pr-step-n">{s.n}</p>
              <h3 className="pr-step-title">{s.title}</h3>
              <p className="pr-step-body">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="pr-terms">
          <p>Fixed quote before anything starts. Half to begin, half at launch. Most sites are live in two to six weeks. Prices are a guide and every job is quoted properly, so the number you sign is the number you pay.</p>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="pr-slide pr-end">
        <h2 className="pr-h2">Let's talk</h2>
        <p className="pr-lede">A 15 minute call is the fastest way to a real number.</p>
        <div className="pr-contact">
          <a href="mailto:finbar@finbar.studio">finbar@finbar.studio</a>
          <a href="tel:+61412796630">+61 412 796 630</a>
          <a href="https://www.finbar.studio" target="_blank" rel="noopener noreferrer">finbar.studio</a>
        </div>
        <span className="pr-end-mark"><BrandWordmark /></span>
      </section>
    </div>
  );
}
