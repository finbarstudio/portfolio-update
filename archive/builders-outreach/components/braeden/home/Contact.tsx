/**
 * Braeden homepage — CONTACT (cohesive card system). The heading block carries
 * the invitation + a hairline detail ledger; the content column is a short form.
 */

import { CardSection } from "./Card";

const DETAILS: [string, string][] = [
  ["Call", "0418 505 117"],
  ["Facebook", "/braedenconstructions"],
  ["Visit", "Lake McDonald, Noosa Hinterland"],
];

export default function Contact() {
  return (
    <CardSection
      id="contact"
      card
      eyebrow="Enquire"
      title="Start a conversation"
      intro="Tell us about your block. You'll deal directly with Mick."
      headExtra={
        <div style={{ borderTop: "1px solid var(--line)", marginTop: "1.9em" }}>
          {DETAILS.map(([k, v]) => (
            <div key={k} style={{ borderBottom: "1px solid var(--line)", padding: "0.95em 0" }}>
              <span className="ff-mono" style={{ display: "block", marginBottom: "0.35em", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{k}</span>
              <span className="ff-quick" style={{ fontSize: 15.5, color: "var(--ink)" }}>{v}</span>
            </div>
          ))}
        </div>
      }
    >
      <form style={{ display: "grid", gap: "clamp(20px,2.4vw,30px)" }}>
        {[
          { label: "Name", ph: "Your name" },
          { label: "Email", ph: "you@email.com" },
        ].map((f) => (
          <label key={f.label} style={{ display: "block" }}>
            <span className="ff-mono" style={{ display: "block", marginBottom: "0.7em", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{f.label}</span>
            <input className="brd-input" type="text" placeholder={f.ph} />
          </label>
        ))}
        <label style={{ display: "block" }}>
          <span className="ff-mono" style={{ display: "block", marginBottom: "0.7em", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>A few words about your project</span>
          <textarea className="brd-input" rows={4} placeholder="Where is the block, and what are you hoping to build?" style={{ resize: "vertical" }} />
        </label>
        <div>
          <button type="button" className="brd-btn">Send enquiry</button>
        </div>
      </form>
    </CardSection>
  );
}
