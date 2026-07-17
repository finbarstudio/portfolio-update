"use client";

/**
 * FreeRedesign — the /free-redesign ad landing page (Meta campaign).
 *
 * Conversion architecture, per the campaign brief: ONE action. The inline
 * Cal.com booking is the only CTA; no nav, no phone, no socials, no note form
 * (it's desktop-only and traffic here is ~95% mobile). The single escape hatch
 * is a plain mailto in the footer.
 *
 * The booking embed is TRUE INLINE on every width — unlike /contact, which
 * links out to Cal's hosted page on phones. Here the page scrolls normally, so
 * Cal's own mobile column layout works inside the iframe, the visitor never
 * leaves the page, and the bookingSuccessful browser event can fire — which is
 * what the Meta Schedule conversion (and therefore ad optimisation) hangs off.
 * The embed loads on approach (IntersectionObserver), so it never drags the
 * hero's LCP.
 *
 * Testimonial slots: quotes are still being collected. Empty slots hide
 * gracefully — the section only renders entries with text, and disappears
 * entirely if none have landed.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { getCalApi } from "@calcom/embed-react";
import BrandWordmark from "./BrandWordmark";
import BrandMark from "./BrandMark";
import Loader from "./Loader";

const CalEmbed = dynamic(() => import("./CalEmbed"), { ssr: false, loading: () => null });

const CAL_NS = "book-call"; // must match CalEmbed's namespace for the event hook

const STEPS = [
  { n: "01", text: "A 15-minute call about your business." },
  { n: "02", text: "Your homepage redesigned as a real concept, within a week." },
  { n: "03", text: "Love it? The full site gets built, live in about two weeks. Don’t? Keep the concept, no hard feelings." },
];

const PROOF = [
  { src: "/images/web/lows-1.webp", alt: "Lows Design and Build homepage", caption: "Lows Design + Build, family builders in London", href: "/case-studies/lows-design-build" },
  { src: "/images/web/plated-1.webp", alt: "Plated with Issy homepage", caption: "Plated with Issy, a candlelit supper club", href: "/case-studies/plated-with-issy" },
  { src: "/images/web/kinaya-1.webp", alt: "KinAya homepage", caption: "KinAya, wellness brand and store", href: "/case-studies/kinaya" },
  { src: "/images/web/lola-1.webp", alt: "Lola Audio homepage", caption: "Lola Audio, a portfolio you can mix", href: "/case-studies/lola-audio" },
];

const INCLUDES = [
  "Coded, not templated",
  "Custom animation",
  "A CMS you edit yourself",
  "Integrations like booking and custom calculators",
  "Full handover",
  "Live in about two weeks",
];

// One quote per proof site, verbatim from the case studies (content/projects.ts)
// — shortened only with ellipses, never reworded. Empty entries never render.
const TESTIMONIALS: { quote: string; author: string }[] = [
  {
    quote:
      "It has been nothing but a pleasure working with Finbar on our new website. He has completely transformed our online presence and taken it to the next level.",
    author: "Samuel Low, Lows Design + Build",
  },
  {
    quote:
      "Finbar just got it, honestly. I'd send him a voice note about something I wanted changed and it would be live by the evening. He kept me in the loop the whole way through without ever drowning me in tech talk, and the site went from an idea to launched faster than I thought was possible. It feels completely like me.",
    author: "Issy Park, Plated with Issy",
  },
  {
    quote:
      "Finbar was great to work with from start to finish. He took the time to understand what KinAya needed, communicated clearly throughout, and delivered something that felt cohesive. The branding and website genuinely felt like one vision. … Highly recommend.",
    author: "Aryan Sareen, KinAya",
  },
  {
    quote:
      "Finbar is reliable, fast and really easy to work with. He was able to translate the brief of a sound-based website into something aesthetically beautiful and totally original. I'm so impressed and would genuinely recommend him to anyone.",
    author: "Lola Stoodley, Lola Audio",
  },
];

export default function FreeRedesign() {
  const [calInView, setCalInView] = useState(false);
  const [calReady, setCalReady] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  // Load the embed on approach, not on page load — hero LCP stays clean.
  // Belt and braces for the conversion point: if the observer never fires
  // (throttled tabs, odd in-app WebViews), a 5s idle fallback mounts it anyway
  // — by then the hero has long since painted.
  useEffect(() => {
    const el = bookRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCalInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(el);
    const fallback = setTimeout(() => { setCalInView(true); io.disconnect(); }, 5000);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);

  // The conversion signal: Cal's embed emits bookingSuccessful in the browser
  // when a booking completes inside the inline embed. Once per session
  // (sessionStorage guard against re-renders and double events).
  useEffect(() => {
    if (!calInView) return;
    (async () => {
      const api = await getCalApi({ namespace: CAL_NS });
      api("on", {
        action: "bookingSuccessful",
        callback: () => {
          if (sessionStorage.getItem("fr-scheduled")) return;
          sessionStorage.setItem("fr-scheduled", "1");
          window.fbq?.("track", "Schedule");
        },
      });
    })();
  }, [calInView]);

  const liveTestimonials = TESTIMONIALS.filter((t) => t.quote.trim().length > 0);

  return (
    <div className="fr">
      {/* Header: logo only — paid traffic gets no exit doors. */}
      <header className="fr-head">
        <a href="/" aria-label="finbarstudio, home" className="fr-logo">
          <BrandWordmark />
        </a>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="fr-hero" aria-label="A free homepage redesign">
          {/* The signature motion element: the mark, pulsing — the same
              animation the whole site breathes with. */}
          <span className="mark-pulse fr-hero-mark" aria-hidden="true">
            <BrandMark />
          </span>
          <h1 className="home-display fr-hero-title">
            A free redesign of your homepage. Seriously.
          </h1>
          <p className="fr-lede">
            You&rsquo;ve seen the before-and-after. Yours is next: no cost, no
            pitch, no obligation.
          </p>
          <a href="#book" className="sticker-pill book-call-pill fr-cta">
            Book a 15-min chat
          </a>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section className="fr-section" aria-label="How it works">
          <p className="mono-label text-ink-soft fr-kicker">How it works</p>
          <ol className="fr-steps">
            {STEPS.map((s) => (
              <li key={s.n} className="fr-step">
                <span className="mono-label fr-step-n">{s.n}</span>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Proof ────────────────────────────────────────────── */}
        <section className="fr-section" aria-label="Recent builds">
          <p className="mono-label text-ink-soft fr-kicker">Shipped this year</p>
          <div className="fr-proof">
            {PROOF.map((p) => (
              <figure key={p.src} className="fr-proof-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
                <figcaption>{p.caption}</figcaption>
                {/* New tab: the landing page (and its booking calendar) stays open. */}
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="sticker-pill fr-proof-cta">Case study</a>
              </figure>
            ))}
          </div>
        </section>

        {/* ── What a full build includes ───────────────────────── */}
        <section className="fr-section" aria-label="What a full build includes">
          <p className="mono-label text-ink-soft fr-kicker">If you go ahead, the full build includes</p>
          <ul className="fr-includes">
            {INCLUDES.map((item) => (
              <li key={item} className="fr-include">{item}</li>
            ))}
          </ul>
        </section>

        {/* ── Testimonials (slots hide gracefully while quotes land) ── */}
        {liveTestimonials.length > 0 && (
          <section className="fr-section" aria-label="What clients say">
            <p className="mono-label text-ink-soft fr-kicker">From clients</p>
            <div className="fr-quotes">
              {liveTestimonials.map((t) => (
                <figure key={t.author} className="quote-box fr-quote">
                  <span aria-hidden="true" className="quote-box-mark">&ldquo;</span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption className="mono-label text-ink-soft">— {t.author}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ── The conversion point ─────────────────────────────── */}
        <section id="book" className="fr-section fr-book" aria-label="Book a call" ref={bookRef}>
          <p className="mono-label text-ink-soft fr-kicker">Book your 15-min chat</p>
          <div className="fr-cal">
            {calInView && !calReady && <Loader />}
            {calInView && <CalEmbed onReady={() => setCalReady(true)} />}
          </div>
        </section>
      </main>

      {/* Footer: the wordmark, the single quiet escape hatch, the ©. */}
      <footer className="fr-foot">
        <a href="/" aria-label="finbarstudio, home" className="fr-foot-logo">
          <BrandWordmark />
        </a>
        <a href="mailto:finbar@finbar.studio" className="fr-foot-mail">
          finbar@finbar.studio
        </a>
        <span className="mono-label text-ink-soft">© {new Date().getFullYear()} FINBARSTUDIO</span>
      </footer>
    </div>
  );
}
