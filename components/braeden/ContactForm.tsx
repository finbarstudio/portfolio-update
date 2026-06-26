"use client";

import { useState } from "react";

/**
 * Enquiry form for the demo. No backend wired (concept build) — on submit it
 * validates natively and shows a thank-you state client-side. Underlined fields
 * in the brand palette; terracotta focus accent; AA-legible labels.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="display" style={{ fontSize: "var(--step-h3)", maxWidth: "20ch" }}>
        Thank you. We will be in touch shortly.
      </div>
    );
  }

  const field = "w-full bg-transparent border-b py-3 text-[15px] outline-none transition-colors";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid grid-cols-1 sm:grid-cols-2"
      style={{ gap: "clamp(18px,2vw,28px)" }}
    >
      <label className="block sm:col-span-1">
        <span className="eyebrow block" style={{ marginBottom: 8 }}>Name</span>
        <input name="name" required autoComplete="name" className={`brd-input ${field}`} />
      </label>
      <label className="block sm:col-span-1">
        <span className="eyebrow block" style={{ marginBottom: 8 }}>Email</span>
        <input name="email" type="email" required autoComplete="email" className={`brd-input ${field}`} />
      </label>
      <label className="block sm:col-span-1">
        <span className="eyebrow block" style={{ marginBottom: 8 }}>Phone</span>
        <input name="phone" type="tel" autoComplete="tel" className={`brd-input ${field}`} />
      </label>
      <label className="block sm:col-span-1">
        <span className="eyebrow block" style={{ marginBottom: 8 }}>Suburb / Site</span>
        <input name="suburb" className={`brd-input ${field}`} />
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow block" style={{ marginBottom: 8 }}>Tell us about your project</span>
        <textarea name="message" rows={3} className={`brd-input ${field} resize-none`} />
      </label>
      <div className="sm:col-span-2" style={{ marginTop: "clamp(8px,1vw,16px)" }}>
        <button type="submit" className="brd-btn" data-cursor="Send">
          Start the conversation
          <span aria-hidden style={{ marginLeft: "0.7em" }}>&rarr;</span>
        </button>
      </div>
    </form>
  );
}
