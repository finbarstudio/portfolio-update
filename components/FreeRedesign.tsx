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
import { trackMeta } from "@/lib/meta";
import BrandWordmark from "./BrandWordmark";
import BrandMark from "./BrandMark";
import Loader from "./Loader";
import PreviewCycle from "./PreviewCycle";

const CalEmbed = dynamic(() => import("./CalEmbed"), { ssr: false, loading: () => null });

const CAL_NS = "book-call"; // must match CalEmbed's namespace for the event hook

const STEPS = [
  { n: "01", text: "A 15-minute call about your business. Not a sales call, just a chat about what you do." },
  { n: "02", text: "Within a week, I redesign your homepage as a real, coded concept. Free. No strings, no catch." },
  { n: "03", text: "It's yours to keep. Want it live? I'll put it up for you.\n\nI'm genuinely happy to build the free page and walk away, that's the whole offer. If you ever want the full site it's a separate paid job, but there is zero pressure to go there." },
];

// Each proof card hover-cycles through the site's section shots (same as the
// studio home site list), so hovering scrolls through the build, not one still.
const PROOF = [
  { images: ["/images/web/lows-1.webp", "/images/web/lows-2.webp", "/images/web/lows-3.webp", "/images/web/lows-4.webp"], alt: "Lows Design and Build website", caption: "Lows Design + Build, family builders in London", href: "/case-studies/lows-design-build" },
  { images: ["/images/web/plated-1.webp", "/images/web/plated-2.webp", "/images/web/plated-3.webp", "/images/web/plated-4.webp"], alt: "Plated with Issy website", caption: "Plated with Issy, a candlelit supper club", href: "/case-studies/plated-with-issy" },
  { images: ["/images/web/kinaya-1.webp", "/images/web/kinaya-2.webp", "/images/web/kinaya-3.webp", "/images/web/kinaya-4.webp"], alt: "KinAya website", caption: "KinAya, Adelaide-based NDIS support specialists", href: "/case-studies/kinaya" },
  { images: ["/images/web/lola-1.webp", "/images/web/lola-2.webp", "/images/web/lola-3.webp"], alt: "Lola Audio website", caption: "Lola Audio, a portfolio you can mix", href: "/case-studies/lola-audio" },
];

// Order tuned for balanced wrap, not narrative: greedy flex-wrap + the one long
// "Integrations…" pill (it sits solo on its own line, reading intentional) left
// short pills orphaned. This sequence packs 2-3 per line with no lone short pill
// at every desktop/tablet width, and closes on "Live in about two weeks".
const INCLUDES = [
  "Full handover",
  "Optimised for AI search",
  "Integrations like booking and custom calculators",
  "Mobile optimised",
  "Custom animation",
  "SEO",
  "A CMS you edit yourself",
  "Coded, not templated",
  "Hosting handled",
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
  const [showStickyBook, setShowStickyBook] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLElement>(null);

  // A standard event on the landing view itself, so the dataset sees a real
  // conversion-funnel event from every ad click (not just PageView) — this is
  // what completes Meta's "set up events" step. Schedule (below) is the hard
  // conversion once someone books; ViewContent is the top of the funnel.
  useEffect(() => { trackMeta("ViewContent"); }, []);

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

  // Mobile only: the book CTA rides the bottom of the viewport so it's always a
  // tap away. It comes up JUST BEFORE the case studies reach the fold, stays up
  // through the rest of the page, and steps aside once the calendar itself is on
  // screen so it never covers the booker.
  useEffect(() => {
    const proof = proofRef.current;
    const book = bookRef.current;
    if (!proof || !book) return;
    let reached = false;      // reached the case-studies region
    let bookVisible = false;  // the calendar is on screen
    const apply = () => setShowStickyBook(reached && !bookVisible);
    // The 140px bottom margin fires the observer while the case studies are
    // still just below the fold — "just before" they appear. Once they've
    // scrolled up and out the top we keep it up; only scrolling back above them
    // (proof still below the fold) puts it away again.
    const proofIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) reached = true;
        else if (e.boundingClientRect.top > 0) reached = false;
        apply();
      },
      { rootMargin: "0px 0px 140px 0px" }
    );
    const bookIO = new IntersectionObserver(
      ([e]) => { bookVisible = e.isIntersecting; apply(); },
      { threshold: 0 }
    );
    proofIO.observe(proof);
    bookIO.observe(book);
    return () => { proofIO.disconnect(); bookIO.disconnect(); };
  }, []);

  // The Meta-pixel cookie notice is also pinned to the bottom. While the sticky
  // CTA is up, lift the notice above it so the two never overlap (mobile only —
  // the CSS rule is scoped to this class and the phone breakpoint).
  useEffect(() => {
    document.body.classList.toggle("fr-sticky-on", showStickyBook);
    return () => document.body.classList.remove("fr-sticky-on");
  }, [showStickyBook]);

  // The conversion signal: Cal's embed emits bookingSuccessful in the browser
  // when a booking completes inside the inline embed. Once per session
  // (sessionStorage guard against re-renders and double events). trackMeta
  // sends it via BOTH the browser pixel and the /api/meta server relay with a
  // shared event_id — the conversion survives ad blockers and in-app WebViews.
  useEffect(() => {
    if (!calInView) return;
    (async () => {
      const api = await getCalApi({ namespace: CAL_NS });
      api("on", {
        action: "bookingSuccessful",
        callback: (e) => {
          if (sessionStorage.getItem("fr-scheduled")) return;
          sessionStorage.setItem("fr-scheduled", "1");
          // Cal's event detail carries the booking; the shape shifts between
          // embed versions, so probe the known paths defensively. Email/phone
          // (when found) lift the Meta match quality a long way — they're
          // SHA-256 hashed inside trackMeta before anything leaves the page.
          const d = (e as { detail?: { data?: Record<string, unknown> } })?.detail?.data ?? {};
          const dig = (obj: unknown, path: string[]): unknown =>
            path.reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
          const email = [
            dig(d, ["booking", "attendees", "0", "email"]),
            dig(d, ["attendees", "0", "email"]),
            dig(d, ["booking", "responses", "email", "value"]),
            dig(d, ["responses", "email", "value"]),
            dig(d, ["email"]),
          ].find((v) => typeof v === "string" && v.includes("@")) as string | undefined;
          const phone = [
            dig(d, ["booking", "responses", "phone", "value"]),
            dig(d, ["responses", "phone", "value"]),
            dig(d, ["booking", "attendees", "0", "phoneNumber"]),
          ].find((v) => typeof v === "string" && v.length > 5) as string | undefined;
          trackMeta("Schedule", { email, phone });
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

        {/* Mobile: from here the book CTA rides the bottom of the screen,
            stepping aside once the calendar is reached. Hidden on desktop —
            desktop keeps the hero CTA. */}
        <div
          className={`fr-book-sticky ${showStickyBook ? "is-visible" : ""}`}
          aria-hidden={!showStickyBook}
        >
          <a
            href="#book"
            className="sticker-pill book-call-pill fr-sticky-cta"
            tabIndex={showStickyBook ? 0 : -1}
          >
            Book a 15-min chat
          </a>
        </div>

        {/* ── Proof ────────────────────────────────────────────── */}
        <section className="fr-section" aria-label="Recent builds" ref={proofRef}>
          <p className="mono-label text-ink-soft fr-kicker">Shipped this year</p>
          <div className="fr-proof">
            {PROOF.map((p) => (
              <figure key={p.href} className="fr-proof-item">
                {/* Hover cycles through the site's section shots (PreviewCycle,
                    the studio home treatment). Rests on the first shot. */}
                <div className="fr-proof-frame">
                  <PreviewCycle images={p.images} alt={p.alt} />
                </div>
                <figcaption>{p.caption}</figcaption>
                {/* New tab: the landing page (and its booking calendar) stays open. */}
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="sticker-pill fr-proof-cta">Case study</a>
              </figure>
            ))}
          </div>
        </section>

        {/* ── What a full build includes ───────────────────────── */}
        {/* Honest pricing shape: the one-page redesign is free, hosting
            included. The full site is where it becomes paid work. */}
        <section className="fr-section" aria-label="What a full build includes">
          <p className="mono-label text-ink-soft fr-kicker">Want the full site? That&rsquo;s a paid build, and it includes</p>
          <ul className="fr-includes">
            {INCLUDES.map((item) => (
              <li key={item} className="fr-include">{item}</li>
            ))}
          </ul>
          <p className="fr-note">
            And if one page is all you need, the redesigned homepage stays
            free, hosting included. The paid conversation only starts when you
            want the full site.
          </p>
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
