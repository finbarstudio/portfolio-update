"use client";

/**
 * ContactPanel — a right-side drawer opened by the nav's email/phone buttons
 * (they dispatch a "contact:open" event). Holds the "hiring or project" line,
 * email + phone, the socials, and a "Chat with me" bubble that launches the live
 * chat (Tawk.to) if configured, falling back to email otherwise.
 *
 * Live chat: set NEXT_PUBLIC_TAWK_SRC to your Tawk.to embed URL
 * (https://embed.tawk.to/<propertyId>/<widgetId>). The Tawk app on your phone
 * then pushes a notification, and Tawk emails you on a new conversation. The
 * default Tawk launcher is hidden — this bubble opens the chat instead.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const EMAIL = "finbar@finbar.studio";
const PHONE = "+61412796630";
const PHONE_DISPLAY = "+61 412 796 630";
const TAWK_SRC = process.env.NEXT_PUBLIC_TAWK_SRC;

const SOCIALS = [
  { label: "Instagram", handle: "@finbar.studio", href: "https://instagram.com/finbar.studio" },
  { label: "X", handle: "@finbarstudio", href: "https://x.com/finbarstudio" },
  { label: "LinkedIn", handle: "finbarskitini", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Are.na", handle: "finbar-studio", href: "https://are.na/finbar-studio" },
];

type TawkApi = { maximize?: () => void; hideWidget?: () => void; onLoad?: () => void };
declare global {
  interface Window { Tawk_API?: TawkApi; Tawk_LoadStart?: Date; }
}

let tawkLoading = false;
function ensureTawk(): boolean {
  if (!TAWK_SRC) return false;
  if (tawkLoading || document.getElementById("tawk-embed")) return true;
  tawkLoading = true;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_API.onLoad = () => { window.Tawk_API?.hideWidget?.(); };
  const s = document.createElement("script");
  s.id = "tawk-embed";
  s.async = true;
  s.src = TAWK_SRC;
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  document.head.appendChild(s);
  return true;
}

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
    closeRef.current?.focus();
    return () => { window.removeEventListener("keydown", onKey); window.__lenis?.start(); };
  }, [open]);

  const openChat = useCallback(() => {
    if (ensureTawk()) {
      // Tawk may still be loading; retry maximize briefly.
      let n = 0;
      const tick = () => {
        if (window.Tawk_API?.maximize) { window.Tawk_API.maximize(); }
        else if (n++ < 20) setTimeout(tick, 150);
      };
      tick();
    } else {
      window.location.href = `mailto:${EMAIL}?subject=Hello%20Finbar`;
    }
  }, []);

  return (
    <div className={`contact-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="contact-backdrop" aria-label="Close contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <aside className="contact-drawer" role="dialog" aria-modal="true" aria-label="Get in touch">
        <button ref={closeRef} className="contact-close" aria-label="Close" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>

        <p className="mono-label text-ink-soft contact-eyebrow">Hiring or have a project?</p>

        <div className="contact-primary">
          <a href={`mailto:${EMAIL}`} className="contact-email">{EMAIL}</a>
          <a href={`tel:${PHONE}`} className="contact-phone tabular-nums">{PHONE_DISPLAY}</a>
        </div>

        <p className="mono-label text-ink-soft contact-section">Elsewhere</p>
        <ul className="contact-socials">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                <span className="contact-social-label">{s.label}</span>
                <span className="contact-social-handle text-ink-soft">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>

        <button className="contact-chat" tabIndex={open ? 0 : -1} onClick={openChat}>
          <span className="contact-chat-dot" aria-hidden="true" />
          Chat with me
        </button>
      </aside>
    </div>
  );
}
