import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for QLD Pool Installs. Reachable by URL only, kept out of
// the index, the sitemap and the public nav. Deliberately SHORT and scannable —
// hook, the AI-site analysis (tells as a list, numbers as tiles), the Lows
// proof, their demo, the offer. Layout varies per block on purpose so it never
// reads as heading-left/paragraph-right five times. Detail happens on the phone.
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

const TELLS = [
  "Lovable's own tracking scripts are still in the code.",
  "The page arrives empty and builds itself afterwards.",
  "Headlines flash Times New Roman while the real font loads.",
];

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
              See your demo &rarr;
            </Link>
            <ContactCta className="pitch-cta pitch-cta-ghost">Talk to me</ContactCta>
          </div>
        </Reveal>
      </section>

      {/* ── 2 · The analysis — lead left, tells as a numbered list right,
             numbers as tiles across the full width below ────────── */}
      <Reveal as="section" section className="home-section py-16 md:py-24" aria-label="The analysis">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8 mb-14">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">Your site was built by AI.</h2>
            <p className="text-ink-soft mt-5 max-w-[38ch]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
              I analysed it. It was made with Lovable, an AI website generator.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h3 className="mono-heading text-pink mb-2">The tells</h3>
            <ol className="m-0 p-0 list-none">
              {TELLS.map((t, i) => (
                <li key={t} className="flex items-baseline gap-4 border-t border-line py-3.5">
                  <span className="mono-label text-ink-soft shrink-0">0{i + 1}</span>
                  <span className="text-ink" style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)", lineHeight: 1.45 }}>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <h3 className="mono-heading text-pink mb-3">
          Seen on your site <span className="text-ink-soft normal-case">· headlines captured while the fonts load</span>
        </h3>
        <p className="text-ink mb-7 max-w-[62ch]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
          Clients can tell. Times New Roman is the browser&rsquo;s fallback font, it shows whenever
          something in the back end breaks or lags, and it makes your work look cheap. That&rsquo;s a
          disservice to it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-16">
          {[
            { src: "/qldpools/tnr-range.webp", w: 1200, h: 264, cap: "/pool-range" },
            { src: "/qldpools/tnr-concrete.webp", w: 1200, h: 296, cap: "/concrete-pools" },
            { src: "/qldpools/tnr-brisbane.webp", w: 1200, h: 283, cap: "/service-areas/brisbane" },
          ].map((s) => (
            <figure key={s.src} className="m-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                width={s.w}
                height={s.h}
                loading="lazy"
                alt={`A headline on qldpoolinstalls.com.au${s.cap} rendering in the fallback serif`}
                className="w-full h-auto border border-line"
                style={{ borderRadius: "4px" }}
              />
              <figcaption className="mono-label text-ink-soft mt-2">qldpoolinstalls.com.au{s.cap}</figcaption>
            </figure>
          ))}
        </div>

        <h3 className="mono-heading text-pink mb-6">
          The numbers <span className="text-ink-soft normal-case">· every link runs the test live on your site</span>
        </h3>
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

      {/* ── 3 · The Lows proof — heading across the top, copy + buttons
             left, the quote box sitting beside them ─────────────── */}
      <Reveal as="section" section className="home-section py-16 md:py-24" aria-label="Recent work">
        <h2 className="home-display-sm mb-8 md:mb-10">Here&rsquo;s one I finished.</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8">
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.55 }}>
              Lows, a family design and build firm in London. Same job as yours: turn lookers into
              enquiries. I also coded them a custom estimate tool, so visitors price up their own
              job and land in the inbox as a lead. You could have the pool version.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={LOWS_LIVE} target="_blank" rel="noopener noreferrer" className="pitch-cta pitch-cta-pink">
                lowsdesignandbuild.com ↗
              </a>
              <Link href={LOWS_CASE} className="pitch-cta pitch-cta-ghost">
                Case study
              </Link>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {/* Canonical .quote-box token (globals.css) */}
            <figure className="m-0">
              <div className="quote-box">
                <span aria-hidden="true" className="quote-box-mark">&ldquo;</span>
                <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)" }}>
                  We’re genuinely delighted with the end result and wouldn’t hesitate to
                  recommend Finbar to anyone looking for a professional, high-quality website.
                </blockquote>
              </div>
              <figcaption className="mono-label text-ink-soft mt-3 text-center">&mdash; The Lows family, Lows Design + Build</figcaption>
            </figure>
          </div>
        </div>
      </Reveal>

      {/* ── 3b · Their demo — a short centred interlude for readers who
             won't click away to Lows ────────────────────────────── */}
      <Reveal as="section" section className="home-section py-16 md:py-24" aria-label="Your demo">
        <div className="text-center flex flex-col items-center">
          <h2 className="home-display-sm">And I started yours.</h2>
          <p className="text-ink mt-5 max-w-[48ch]" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
            Rather stay put? I already rebuilt your home page as a demo, custom code, designed
            around your pools. It&rsquo;s a quick proof of concept, not the finished standard. Lows
            shows how far the real thing goes.
          </p>
          <Link href={DEMO_HREF} className="pitch-cta pitch-cta-pink mt-7">
            View your demo &rarr;
          </Link>
        </div>
      </Reveal>

      {/* ── 4 · The offer — price as the heading, one-line tiles ── */}
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
              See your demo &rarr;
            </Link>
          </div>
          <p className="mono-label text-ink-soft mt-8">Finbar Skitini · finbar.studio</p>
        </div>
      </Reveal>
    </div>
  );
}
