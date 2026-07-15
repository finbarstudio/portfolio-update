import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for QLD Pool Installs. Reachable by URL only, kept out of
// the index, the sitemap and the public nav. Deliberately SHORT — four scannable
// blocks (hook, the AI-site analysis, the demo + Lows proof, the offer) for a
// reader who won't sit through paragraphs. Detail happens on the phone.
export const metadata: Metadata = {
  title: { absolute: "For QLD Pool Installs · Finbar Studio" },
  description:
    "A note and a working demo for QLD Pool Installs, from Brisbane web developer Finbar Skitini.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

const DEMO_HREF = "/qldpools/site";
const LOWS_LIVE = "https://www.lowsdesignandbuild.com";
const LOWS_CASE = "/case-studies/lows-design-build";

// Live report links — each runs the test fresh on their site when opened.
const REPORTS = {
  pagespeed: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fqldpoolinstalls.com.au%2F",
  observatory: "https://developer.mozilla.org/en-US/observatory/analyze?host=qldpoolinstalls.com.au",
};

const STATS = [
  {
    value: "50/100",
    label: "Google speed score",
    note: "On a phone. Under 90 costs you visitors.",
    href: REPORTS.pagespeed,
    linkLabel: "Run it yourself",
  },
  {
    value: "10.5s",
    label: "Until the page shows",
    note: "Google's target is 2.5 seconds.",
    href: REPORTS.pagespeed,
    linkLabel: "See the report",
  },
  {
    value: "C",
    label: "Security grade",
    note: "Mozilla scores it 50 out of 100.",
    href: REPORTS.observatory,
    linkLabel: "Run the scan",
  },
];

export default function QldPoolsPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── 1 · Hook ──────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-14 md:pb-20" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For QLD Pool Installs
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          I saw your ad on the back of a bus. Then I saw your website.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-8 max-w-[58ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a Brisbane web developer. Short version below, and I&rsquo;m happy to
            talk it through on the phone.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-pink">
              See the demo &rarr;
            </Link>
            <ContactCta className="pitch-cta pitch-cta-ghost">Talk to me</ContactCta>
          </div>
        </Reveal>
      </section>

      {/* ── 2 · The analysis ──────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-16 md:py-24" aria-label="The analysis">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">Your site was built by AI.</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.55 }}>
              I analysed it. It was made with Lovable, an AI website generator. The tells:
              Lovable&rsquo;s own tracking scripts are still in the code, the page arrives empty and
              builds itself afterwards, and the headlines flash Times New Roman while the real font
              loads. The numbers back it up, and every link below runs the test live on your site.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p className="text-pink leading-none" style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)" }}>
                {s.value}
              </p>
              <p className="mono-label text-ink mt-3 mb-1.5">{s.label}</p>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{s.note}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label text-pink inline-block mt-2.5 underline underline-offset-4"
              >
                {s.linkLabel} ↗
              </a>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── 3 · The demo + proof ──────────────────────────────── */}
      <Reveal as="section" section className="home-section py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">So I built you one.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.55 }}>
            A proper home page in custom code, designed around your pools. And here&rsquo;s a
            finished site I did for Lows, a construction company in London, so you can see the
            standard.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-pink">
              View your demo &rarr;
            </Link>
            <a href={LOWS_LIVE} target="_blank" rel="noopener noreferrer" className="pitch-cta pitch-cta-ghost">
              lowsdesignandbuild.com ↗
            </a>
            <Link href={LOWS_CASE} className="pitch-cta pitch-cta-ghost">
              Lows case study
            </Link>
          </div>
          {/* Canonical .quote-box token (globals.css) */}
          <figure className="m-0 mt-10 max-w-[56ch]">
            <div className="quote-box">
              <span aria-hidden="true" className="quote-box-mark">&ldquo;</span>
              <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)" }}>
                &hellip;it has changed the kind of enquiries coming in. We are quoting bigger
                projects because the site holds up next to firms twice our size.
              </blockquote>
            </div>
            <figcaption className="mono-label text-ink-soft mt-3 text-center">&mdash; The Lows family, Lows Design + Build</figcaption>
          </figure>
        </div>
      </Reveal>

      {/* ── 4 · The offer ─────────────────────────────────────── */}
      <Reveal as="section" section className="home-section no-rule py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8" aria-label="The offer">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">$600, then $20 a month. Cancel anytime.</h2>
        </div>
        <div className="md:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">Custom code</h3>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                Designed and written from scratch. Fast on a phone.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">A CMS you run</h3>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                Swap photos and words yourself, no developer.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">Your photos, done right</h3>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
                Pools sell on pictures. Yours get treated properly.
              </p>
            </div>
          </div>
          <p className="text-ink mt-8" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
            The price is low because I&rsquo;m growing my web work, not because the work is cheap.
            You deal with me directly.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ContactCta className="pitch-cta pitch-cta-pink">Talk to me</ContactCta>
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-ghost">
              See the demo &rarr;
            </Link>
          </div>
          <p className="mono-label text-ink-soft mt-8">Finbar Skitini · finbar.studio</p>
        </div>
      </Reveal>
    </div>
  );
}
