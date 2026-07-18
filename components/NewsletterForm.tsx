"use client";

/**
 * NewsletterForm — the footer "join my mailing list" field. Compact: one email
 * input + arrow submit. Delivery mirrors ContactNoteForm — NEXT_PUBLIC_WEB3FORMS_KEY
 * posts to Web3Forms (emails each signup to Finbar); without the key it falls
 * back to a pre-filled mailto so it never dead-ends.
 */

import { useCallback, useState } from "react";
import { MdArrowForward } from "./MaterialIcon";

const EMAIL = "finbar@finbar.studio";
const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!email) return;

    if (W3F_KEY) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: W3F_KEY,
            subject: "Mailing list signup",
            from_name: "finbar.studio mailing list",
            email,
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
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Mailing list signup")}&body=${encodeURIComponent(`Please add me to the mailing list: ${email}`)}`;
    }
  }, []);

  if (status === "sent") {
    return <p className="sf-nl-done" role="status">You&rsquo;re on the list.</p>;
  }

  return (
    <div className="sf-nl-wrap">
      <form className="sf-nl-form" onSubmit={onSubmit} noValidate>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          aria-label="Email address for the mailing list"
          className="sf-nl-input"
        />
        <button type="submit" className="sf-nl-btn" aria-label="Join the mailing list" disabled={status === "sending"}>
          <MdArrowForward size={18} />
        </button>
      </form>
      {status === "error" && <span className="sf-nl-err" role="alert">Try again?</span>}
    </div>
  );
}
