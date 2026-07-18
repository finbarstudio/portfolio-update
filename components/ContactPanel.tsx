"use client";

/**
 * ContactPanel — THE contact popup, opened by anything that dispatches
 * "contact:open" (the nav's Contact pill, ContactCta, the Book-a-call pin).
 * One fullscreen sheet over a subtle blur of the page, frameless: the left
 * rail holds the title, direct links, socials and the "Say hi" form; the
 * right column is the Cal.com booker. Each item mask-reveals with a stagger.
 *
 * The booker is dynamically imported and only mounted once the popup first
 * opens, then kept mounted so reopening is instant.
 *
 * Form delivery: set NEXT_PUBLIC_WEB3FORMS_KEY to a Web3Forms access key (free —
 * it emails you each submission). Without it the form opens a pre-filled email.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ContactDirect from "./ContactDirect";
import ContactNoteForm from "./ContactNoteForm";
import Loader from "./Loader";
import { trackMeta } from "@/lib/meta";
import { MdOpenInNew } from "@/components/MaterialIcon";

// The Cal.com iframe embed. The native @calcom/atoms BookerEmbed was tried and
// proven credential-less, but its 2.11.0 build infinite-loops setState on
// mount under React 19 ("Maximum update depth exceeded") — retry atoms once
// they ship React 19 support.
const CalEmbed = dynamic(() => import("./CalEmbed"), { ssr: false, loading: () => null });




export default function ContactPanel() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [calReady, setCalReady] = useState(false);
  // Stacked layouts (phone/tablet) don't embed the booker at all — Cal's tall
  // mobile column inside the fixed sheet made nested scrolling fight itself
  // and run off screen. They get a link to Cal's own page instead, which
  // handles small screens properly. Matches the CSS stack breakpoint.
  const [stacked, setStacked] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setEverOpened(true); trackMeta("Contact"); };
    window.addEventListener("contact:open", onOpen as EventListener);
    return () => window.removeEventListener("contact:open", onOpen as EventListener);
  }, []);

  useEffect(() => {
    // Embed only where Cal's compact 2-col month actually fits: the booker
    // column needs ~950px, which the sheet only gives it at ~1440px+ viewport.
    // Below that Cal collapses to a tall 1-col list and the nested scroll fights
    // the fixed sheet on touch (the tablet bug) — so tablets and smaller laptops
    // get the "Pick a time" link instead.
    const mq = window.matchMedia("(max-width: 1439px)");
    const update = () => setStacked(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className={`contact-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="contact-backdrop" aria-label="Close contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      {/* The 1px line that traces the sheet's frame ahead of the colour fill
          (see .contact-trace). pathLength=1 lets the dash animate 1 -> 0
          regardless of the frame's real perimeter. */}
      <svg className="contact-trace" aria-hidden="true">
        <rect className="contact-trace-rect" pathLength={1} />
      </svg>
      {/* div, not aside: role="dialog" + aria-modal aren't valid on <aside>. */}
      <div className="contact-sheet" role="dialog" aria-modal="true" aria-label="Get in touch or book a call">
        {/* The colour, arriving as concentric frames centre-out after the
            trace — the icon's bloom, in blinds (see .contact-fill). */}
        <div className="contact-fill" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="contact-fill-ring" style={{ "--ring": i } as React.CSSProperties} />
          ))}
        </div>
        <button ref={closeRef} className="contact-close contact-reveal rv-close" aria-label="Close" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>

        <div className="contact-rail">
        <h2 className="contact-title contact-reveal rv-0">Hiring or have a project?</h2>
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
          <ContactDirect tabbable={open} />
        </div>

        <div className="contact-bottom contact-reveal rv-3">
          <p className="contact-col-label">Send a note</p>
          <ContactNoteForm tabbable={open} />
        </div>
        </div>

        {/* The booker. Mounted on first open, kept mounted after, so a second
            open lands on an already-loaded calendar. Until Cal reports ready
            it's OUR loading pulse on the card, not Cal's default spinner. */}
        <div className="contact-cal-col contact-reveal rv-4">
          <p className="contact-col-label">Book a call</p>
          {stacked ? (
            /* Small screens: straight to Cal's own booking page — their
               mobile layout, not our iframe wrestling it. */
            <a
              href="https://cal.com/finbar.studio/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-pill book-call-pill contact-cal-link"
              tabIndex={open ? 0 : -1}
            >
              Pick a time <MdOpenInNew size={13} />
            </a>
          ) : (
            <div className="contact-cal">
              {everOpened && !calReady && <Loader />}
              {everOpened && <CalEmbed onReady={() => setCalReady(true)} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
