"use client";

/**
 * ContactPanel — right-side drawer opened by the nav's 🫂 button (it dispatches a
 * "contact:open" event). The whole thing reveals as one sweep from the right: the
 * cream drawer first, then the darker overlay across the rest of the page (a
 * single clip-path wipe). Inside, each item mask-reveals with a stagger. Titles
 * use the home hero's big display type. Basic "Say hi" form at the foot.
 *
 * Form delivery: set NEXT_PUBLIC_WEB3FORMS_KEY to a Web3Forms access key (free —
 * it emails you each submission). Without it the form opens a pre-filled email.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const EMAIL = "finbar@finbar.studio";
const PHONE = "+61412796630";
const PHONE_DISPLAY = "+61 412 796 630";
const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
  { label: "X", href: "https://x.com/finbarstudio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Are.na", href: "https://are.na/finbar-studio" },
];

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactPanel() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
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

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");

    if (W3F_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: W3F_KEY,
            subject: `Say hi from ${name || "the site"}`,
            from_name: name || "finbar.studio",
            name, email, message,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success !== false) {
          setStatus("sent");
          form.reset();
        } else {
          console.error("Web3Forms error:", json);
          setStatus("error");
        }
      } catch (err) { console.error("Web3Forms fetch error:", err); setStatus("error"); }
    } else {
      const body = `Hi Finbar,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0A${encodeURIComponent(name)}%0D%0A${encodeURIComponent(email)}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Say hi from ${name || "the site"}`)}&body=${body}`;
    }
  }, []);

  const rv = (i: number) => ({ "--i": i } as React.CSSProperties);

  return (
    <div className={`contact-panel ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button className="contact-backdrop" aria-label="Close contact" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <aside className="contact-drawer" role="dialog" aria-modal="true" aria-label="Get in touch">
        <button ref={closeRef} className="contact-close" aria-label="Close" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>

        <h2 className="contact-title contact-reveal" style={rv(0)}>Hiring or have a project?</h2>

        <div className="contact-details contact-reveal" style={rv(1)}>
          <div className="contact-primary">
            <a href={`mailto:${EMAIL}`} className="contact-link u-underline">{EMAIL}</a>
            <a href={`tel:${PHONE}`} className="contact-link u-underline tabular-nums">{PHONE_DISPLAY}</a>
          </div>
          <div className="contact-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="tag tag-default">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="contact-bottom contact-reveal" style={rv(3)}>
          <p className="contact-title">Say hi</p>
          <form className="contact-form" onSubmit={onSubmit}>
          {status === "sent" ? (
            <p className="contact-sent">Thanks — I’ll be in touch.</p>
          ) : (
            <>
              <input className="contact-input" name="name" type="text" placeholder="Name" autoComplete="name" tabIndex={open ? 0 : -1} required />
              <input className="contact-input" name="email" type="email" placeholder="Email" autoComplete="email" tabIndex={open ? 0 : -1} required />
              <textarea className="contact-input contact-textarea" name="message" placeholder="Say hi…" rows={3} tabIndex={open ? 0 : -1} required />
              {status === "error" && <p className="contact-err">Something went wrong. Try email instead.</p>}
              <button type="submit" className="tag tag-pink contact-chat" tabIndex={open ? 0 : -1} disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send"}
              </button>
            </>
          )}
        </form>
        </div>
      </aside>
    </div>
  );
}
