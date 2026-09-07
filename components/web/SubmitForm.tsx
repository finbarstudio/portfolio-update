"use client";

/**
 * SubmitForm — web.finbar's site-submission form. Delivery mirrors
 * ContactNoteForm exactly: NEXT_PUBLIC_WEB3FORMS_KEY posts to Web3Forms;
 * without it, falls back to a pre-filled mailto.
 */

import { useCallback, useState } from "react";

const EMAIL = "finbar@finbar.studio";
const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export default function SubmitForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const title = String(data.get("title") || "");
    const url = String(data.get("url") || "");
    const country = String(data.get("country") || "");
    const design = String(data.get("design") || "");
    const development = String(data.get("development") || "");
    const note = String(data.get("note") || "");
    const botcheck = data.get("botcheck") === "on";

    if (W3F_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: W3F_KEY,
            subject: `web.finbar submission: ${title}`,
            from_name: "web.finbar",
            name,
            email,
            title,
            url,
            country,
            design,
            development,
            note,
            botcheck,
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
      } catch (err) {
        console.error("Web3Forms fetch error:", err);
        setStatus("error");
      }
    } else {
      const body = `Website: ${url}%0D%0ACountry: ${encodeURIComponent(country)}%0D%0ADesign credits: ${encodeURIComponent(design)}%0D%0ADevelopment credits: ${encodeURIComponent(development)}%0D%0A%0D%0A${encodeURIComponent(note)}%0D%0A%0D%0A${encodeURIComponent(name)}%0D%0A${encodeURIComponent(email)}`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`web.finbar submission: ${title}`)}&body=${body}`;
    }
  }, []);

  if (status === "sent") {
    return (
      <div className="wf-form">
        <p className="wf-msg">
          Thanks. If it is a fit it will go up on the catalogue and Instagram, and you will get an
          email when it does.
        </p>
      </div>
    );
  }

  return (
    <form className="wf-form" onSubmit={onSubmit}>
      <input className="wf-input" name="name" type="text" placeholder="Full name" autoComplete="name" required />
      <input className="wf-input" name="email" type="email" placeholder="Email" required />
      <input className="wf-input" name="title" type="text" placeholder="Website name" required />
      <input className="wf-input" name="url" type="url" placeholder="Website URL" required />
      <input className="wf-input" name="country" type="text" placeholder="Country" />
      <input className="wf-input" name="design" type="text" placeholder="+  Design credits" />
      <input className="wf-input" name="development" type="text" placeholder="+  Development credits" />
      <textarea className="wf-input" name="note" placeholder="Optional note" rows={2} />
      <input type="checkbox" name="botcheck" className="wf-hp" tabIndex={-1} autoComplete="off" />
      <button type="submit" className="wf-submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit →"}
      </button>
      {status === "error" && (
        <p className="wf-msg">Something went wrong. Email finbar@finbar.studio instead.</p>
      )}
    </form>
  );
}
