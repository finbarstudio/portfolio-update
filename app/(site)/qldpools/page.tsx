import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import ContactCta from "@/components/ContactCta";

// Private pitch page for QLD Pool Installs. Reachable by URL only, kept out of
// the index, the sitemap and the public nav — something Finbar sends after a
// phone call, not something people find. Same editorial shape as the old
// Lindon pitch. Kept deliberately short: the detail happens on the phone.
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

// Live report links — each one runs the test fresh when opened, so there's
// nothing cherry-picked about the numbers on this page.
const REPORTS = {
  pagespeed: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fqldpoolinstalls.com.au%2F",
  observatory: "https://developer.mozilla.org/en-US/observatory/analyze?host=qldpoolinstalls.com.au",
  headers: "https://securityheaders.com/?q=qldpoolinstalls.com.au&followRedirects=on",
};

const STATS = [
  {
    value: "50/100",
    label: "Google performance score",
    note: "Google's own speed test, run on a phone. Anything under 90 is costing you visitors and ad money.",
    href: REPORTS.pagespeed,
    linkLabel: "Run the test yourself",
  },
  {
    value: "10.5s",
    label: "Until the page shows",
    note: "The main content takes ten and a half seconds to appear on a phone. Google's target is 2.5. Most people are gone well before then.",
    href: REPORTS.pagespeed,
    linkLabel: "See it in the report",
  },
  {
    value: "C",
    label: "Security grade",
    note: "Mozilla's security scan gives the site 50 out of 100. Not a crisis, but not what you want under a business taking enquiries.",
    href: REPORTS.observatory,
    linkLabel: "Run the scan yourself",
  },
];

export default function QldPoolsPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="pt-[5svh] md:pt-[7svh] pb-16 md:pb-24" aria-label="Introduction">
        <Reveal as="p" immediate className="mono-label text-pink mb-6">
          For QLD Pool Installs
        </Reveal>
        <MaskReveal as="h1" className="home-display">
          I saw your ad on the back of a bus. Then I saw your website.
        </MaskReveal>
        <Reveal as="div" immediate delay={0.5} className="mt-10 max-w-[62ch]">
          <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)", lineHeight: 1.5 }}>
            I&rsquo;m Finbar, a web developer here in Brisbane. Your bus ad in Acacia Ridge did its
            job, I looked you up. But the site people land on isn&rsquo;t worth what you&rsquo;re
            paying to send them there, so I built you a demo of what it could be instead.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-pink">
              See the demo &rarr;
            </Link>
            <ContactCta className="pitch-cta pitch-cta-ghost">Talk to me</ContactCta>
          </div>
        </Reveal>
      </section>

      {/* ── 01 · The straight read on the current site ────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The current site">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">Whatever you paid for, you got an AI template.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            I build sites for a living, so the tells jump out at me. Your current site has the
            fingerprints of an AI site generator all through it: the generic layout, the filler
            copy, headlines that flash up in Times New Roman while the real font loads. My guess
            is someone sold it to you as a bespoke build. It wasn&rsquo;t one, and it shows in the
            numbers below.
          </p>
        </div>
      </Reveal>

      {/* ── 02 · The numbers, with live report links ──────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="The numbers">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-4 mb-12">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">Don&rsquo;t take my word for it.</h2>
          </div>
          <div className="md:col-span-7 flex md:items-end">
            <p className="text-ink-soft" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)", lineHeight: 1.5 }}>
              These are Google&rsquo;s and Mozilla&rsquo;s public tests, not mine. Every link runs
              the test live on your site, so you can check the numbers yourself.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-line pt-5">
              <p className="text-pink leading-none" style={{ fontSize: "clamp(2.6rem, 5vw, 4rem)" }}>
                {s.value}
              </p>
              <p className="mono-label text-ink mt-3 mb-2">{s.label}</p>
              <p className="text-ink-soft" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{s.note}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-label text-pink inline-block mt-3 underline underline-offset-4"
              >
                {s.linkLabel} &nearr;
              </a>
            </div>
          ))}
        </div>
        <p className="text-ink-soft mt-10" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
          There&rsquo;s also a{" "}
          <a href={REPORTS.headers} target="_blank" rel="noopener noreferrer" className="text-pink underline underline-offset-4">
            security headers report
          </a>{" "}
          if you want the detail. The short version: you&rsquo;re paying for bus ads and Google
          ads, and a slow site quietly wastes a slice of every dollar.
        </p>
      </Reveal>

      {/* ── 03 · The demo ─────────────────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5" aria-label="The demo">
        <div className="md:col-span-5">
          <h2 className="home-display-sm">So I rebuilt your home page.</h2>
        </div>
        <div className="md:col-span-7">
          <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
            One page, written from scratch in custom code, designed around your pools and the
            areas you serve. It&rsquo;s a direction, not the finished thing, but it should make
            the difference obvious inside ten seconds.
          </p>
          <div className="pitch-demo-card mt-8">
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-pink">
              View the live demo &rarr;
            </Link>
            <p className="text-ink-soft mt-5" style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>
              It works on a phone, but it&rsquo;s at its best on a bigger screen if you have one
              handy.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── 04 · Proof: the Lows build ────────────────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36" aria-label="Recent work">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-5">
          <div className="md:col-span-5">
            <h2 className="home-display-sm">I just did this for a construction company.</h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-ink" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)", lineHeight: 1.55 }}>
              Lows Design + Build, a family-run design and build firm in London. Same world as
              yours: real jobs, real photos, and a site that has to turn lookers into enquiries.
              Here&rsquo;s what they said after launch.
            </p>
            {/* Canonical .quote-box token (globals.css): outlined box, serif
                mark breaking the top border, name outside. */}
            <figure className="m-0 mt-9 max-w-[58ch]">
              <div className="quote-box">
                <span aria-hidden="true" className="quote-box-mark">&ldquo;</span>
                <blockquote className="text-ink leading-relaxed" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
                  &hellip;it has changed the kind of enquiries coming in. We are quoting bigger
                  projects because the site holds up next to firms twice our size&hellip; The
                  estimate tool has been the surprise: people price up their own job and land in
                  our inbox as a lead before we have spoken a word.
                </blockquote>
              </div>
              <figcaption className="mono-label text-ink-soft mt-3 text-center">&mdash; The Lows family, Lows Design + Build</figcaption>
            </figure>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={LOWS_LIVE} target="_blank" rel="noopener noreferrer" className="pitch-cta pitch-cta-ghost">
                lowsdesignandbuild.com &nearr;
              </a>
              <Link href={LOWS_CASE} className="pitch-cta pitch-cta-ghost">
                Read the case study &rarr;
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── 05 · What you get, and what it costs ──────────────── */}
      <Reveal as="section" section className="home-section py-24 md:py-36 grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-8" aria-label="The offer">
        <div className="md:col-span-4">
          <h2 className="home-display-sm">What you get, and what it costs.</h2>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">A custom-coded site</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", lineHeight: 1.5 }}>
                Designed and written from scratch, fast on a phone, built around your pools and
                your service areas rather than a template&rsquo;s idea of them.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">A CMS you run</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", lineHeight: 1.5 }}>
                Swap photos, update words, add finished pools yourself. No developer, no waiting on
                anyone.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">Your photos, done right</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", lineHeight: 1.5 }}>
                Pool builds sell on pictures. Yours get sized, compressed and presented properly so
                the gallery is fast and actually gets looked at.
              </p>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="mono-heading text-ink mb-2">Transparent pricing</h3>
              <p className="text-ink-soft" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)", lineHeight: 1.5 }}>
                $600 AUD for the build, $20 AUD a month for hosting, cancel anytime. No lock-in, no
                surprise invoices.
              </p>
            </div>
          </div>
          <p className="text-ink mt-9" style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.45rem)", lineHeight: 1.45 }}>
            That price is honest, not a catch. I&rsquo;m growing the web side of my studio, and the
            number reflects that, not the effort. You get the same care as everything else on this
            site, and you deal with me directly the whole way.
          </p>
        </div>
      </Reveal>

      {/* ── Let's talk ────────────────────────────────────────── */}
      <Reveal as="section" section className="home-section no-rule py-24 md:py-36" aria-label="Let's talk">
        <div className="text-center flex flex-col items-center">
          <MaskReveal as="h2" className="home-display max-w-[16ch]">
            Let&rsquo;s have a chat.
          </MaskReveal>
          <p className="text-ink-soft mt-8 max-w-[48ch]" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", lineHeight: 1.5 }}>
            Look at the demo, poke at the reports, and if it makes sense we&rsquo;ll talk. No hard
            sell either way.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ContactCta className="pitch-cta pitch-cta-pink">Talk to me</ContactCta>
            <Link href={DEMO_HREF} className="pitch-cta pitch-cta-ghost">
              See the demo &rarr;
            </Link>
          </div>
          <p className="mono-label text-ink-soft mt-10">Finbar Skitini · finbar.studio</p>
        </div>
      </Reveal>
    </div>
  );
}
