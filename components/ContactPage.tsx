"use client";

/**
 * ContactPage — /contact as a standing surface: one deep-pink viewport, no
 * scroll, opened by its own preloader (the brand pulse on the maroon), then
 * the same content the contact popup shows — title, direct links, note form,
 * Cal booker — revealing in the same order. Chrome is the nav and a © line
 * only; no footer, no Book-a-call pin (this page IS the booking surface).
 *
 * Shares its building blocks with ContactPanel (ContactDirect and the
 * contact-* classes), so page and popup can't
 * drift apart.
 */

import { useEffect, useState } from "react";
import TopNav from "./TopNav";
import BrandLoader from "./ui/loader";
import ContactDirect from "./ContactDirect";
import BrandWordmark from "./BrandWordmark";


export default function ContactPage() {
  const [ready, setReady] = useState(false);

  // The preloader: the pulse holds the maroon for one beat (and for the fonts,
  // so the reveal never flashes fallback type), then hands over to the content.
  useEffect(() => {
    let cancelled = false;
    const minBeat = new Promise((r) => setTimeout(r, 1100));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([minBeat, fonts]).then(() => { if (!cancelled) setReady(true); });
    // Failsafe: never strand the page behind the preloader.
    const failsafe = setTimeout(() => { if (!cancelled) setReady(true); }, 4000);
    return () => { cancelled = true; clearTimeout(failsafe); };
  }, []);

  // Same breakpoint the popup uses: only genuinely narrow screens link out to
  // Cal's own page; from ~1024px up the 920px booker embeds fine.

  return (
    <div className={`contact-skin ${ready ? "is-ready" : ""}`}>
      <TopNav />
      {/* The nav logo, static — this page has no HomeIntro to hand over from. */}
      <a href="/" className="nav-logo" aria-label="finbarstudio, home">
        <BrandWordmark />
      </a>

      <main className="contact-page-main" id="main-content">
        <div className="contact-rail">
          <h1 className="contact-title contact-reveal rv-0">Hiring or have a project?</h1>
          <p className="contact-lede contact-reveal rv-1">Email is quickest. I read everything.</p>
          <div className="contact-direct contact-reveal rv-2">
            <ContactDirect />
          </div>
        </div>
      </main>

      {/* The one sticky bottom element this page keeps: the © line. */}
      <span className="contact-page-cr mono-label" aria-hidden="true">
        © {new Date().getFullYear()} FINBARSTUDIO
      </span>

      {/* Preloader: the brand pulse on the same maroon, fading out once ready. */}
      <div className={`contact-preloader ${ready ? "is-done" : ""}`} aria-hidden={ready}>
        <span className="contact-preloader-mark">
          <BrandLoader size={72} />
        </span>
      </div>
    </div>
  );
}
