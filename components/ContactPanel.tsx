"use client";

/**
 * ContactPanel — THE contact popup, opened by anything that dispatches
 * "contact:open" (the nav's Contact pill, ContactCta, the Get-in-touch pin).
 * One fullscreen sheet over a subtle blur of the page, frameless: the trace
 * draws the frame, the fill blooms centre-out, then the details mask-reveal
 * with a short stagger. Just the direct details and the socials (ContactDirect);
 * the form and the Cal booker came out on 16 Sep 2026 when the site turned
 * into a portfolio.
 */

import { useEffect, useRef, useState } from "react";
import ContactDirect from "./ContactDirect";

export default function ContactPanel() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("contact:open", onOpen as EventListener);
    return () => window.removeEventListener("contact:open", onOpen as EventListener);
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
      <div className="contact-sheet" role="dialog" aria-modal="true" aria-label="Get in touch">
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
          <p className="contact-lede contact-reveal rv-1">Email is quickest. I read everything.</p>
          <div className="contact-direct contact-reveal rv-2">
            <ContactDirect tabbable={open} />
          </div>
        </div>
      </div>
    </div>
  );
}
