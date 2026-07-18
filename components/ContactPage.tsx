"use client";

/**
 * ContactPage — /contact as a standing surface: one deep-pink viewport, no
 * scroll, opened by its own preloader (the brand pulse on the maroon), then
 * the same content the contact popup shows — title, direct links, note form,
 * Cal booker — revealing in the same order. Chrome is the nav and a © line
 * only; no footer, no Book-a-call pin (this page IS the booking surface).
 *
 * Shares its building blocks with ContactPanel (ContactDirect,
 * ContactNoteForm, CalEmbed, the contact-* classes), so page and popup can't
 * drift apart.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TopNav from "./TopNav";
import BrandLoader from "./ui/loader";
import Loader from "./Loader";
import ContactDirect from "./ContactDirect";
import ContactNoteForm from "./ContactNoteForm";
import BrandWordmark from "./BrandWordmark";
import { MdOpenInNew } from "@/components/MaterialIcon";

const CalEmbed = dynamic(() => import("./CalEmbed"), { ssr: false, loading: () => null });

export default function ContactPage() {
  const [ready, setReady] = useState(false);
  const [calReady, setCalReady] = useState(false);
  const [stacked, setStacked] = useState(false);

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

  // Same breakpoint the popup uses: stacked layouts link out to Cal's own
  // mobile page instead of embedding.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1439px)");
    const update = () => setStacked(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
          <p className="contact-lede contact-reveal rv-1">
            <span className="contact-lede-desktop">
              Three ways in: reach me direct, send a note with the form, or book
              a call on the right.
            </span>
            <span className="contact-lede-mobile">
              Reach me direct, or book a call below.
            </span>
          </p>

          <div className="contact-direct contact-reveal rv-2">
            <ContactDirect />
          </div>

          <div className="contact-bottom contact-reveal rv-3">
            <p className="contact-col-label">Send a note</p>
            <ContactNoteForm />
          </div>
        </div>

        <div className="contact-cal-col contact-reveal rv-4">
          <p className="contact-col-label">Book a call</p>
          {stacked ? (
            <a
              href="https://cal.com/finbar.studio/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill book-call-pill contact-cal-link"
            >
              Pick a time <MdOpenInNew size={13} />
            </a>
          ) : (
            <div className="contact-cal">
              {ready && !calReady && <Loader />}
              {ready && <CalEmbed onReady={() => setCalReady(true)} />}
            </div>
          )}
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
