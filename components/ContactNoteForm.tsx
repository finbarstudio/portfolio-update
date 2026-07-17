"use client";

/**
 * ContactNoteForm — the "send a note" form, shared by the contact popup
 * (ContactPanel) and the /contact page so the two can never drift.
 *
 * Delivery: NEXT_PUBLIC_WEB3FORMS_KEY posts to Web3Forms (it emails each
 * submission); without it the form opens a pre-filled email instead.
 */

import { useCallback, useState } from "react";

const EMAIL = "finbar@finbar.studio";
const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactNoteForm({ tabbable = true }: { tabbable?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const tab = tabbable ? 0 : -1;

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

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      {status === "sent" ? (
        <p className="contact-sent">Thanks, I’ll be in touch.</p>
      ) : (
        <>
          <input className="contact-input" name="name" type="text" placeholder="Name" autoComplete="name" tabIndex={tab} required />
          <input className="contact-input" name="email" type="email" placeholder="Email" autoComplete="email" tabIndex={tab} required />
          <textarea className="contact-input contact-textarea" name="message" placeholder="Say hi…" rows={3} tabIndex={tab} required />
          {status === "error" && <p className="contact-err">Something went wrong. Try email instead.</p>}
          <button type="submit" className="tag tag-pink contact-chat" tabIndex={tab} disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </>
      )}
    </form>
  );
}
