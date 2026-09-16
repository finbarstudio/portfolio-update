"use client";

/**
 * ContactDirect — the whole contact surface now: the email set large as the
 * one thing to click, the phone under it, the socials as a row of pills.
 * Shared by the contact popup (ContactPanel) and the /contact page so the
 * two can never drift. No form, no booker: a portfolio's contact is a
 * person's details.
 */

const EMAIL = "finbar@finbar.studio";
const PHONE = "+447876492551";
const PHONE_DISPLAY = "+44 7876 492551";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "X", href: "https://x.com/finbarstudio" },
  { label: "Are.na", href: "https://are.na/finbar-studio" },
];

export default function ContactDirect({ tabbable = true }: { tabbable?: boolean }) {
  const tab = tabbable ? 0 : -1;
  return (
    <div className="contact-details">
      <div className="contact-primary">
        <a href={`mailto:${EMAIL}`} className="contact-email" tabIndex={tab}>{EMAIL}</a>
        <a href={`tel:${PHONE}`} className="contact-link u-underline tabular-nums" tabIndex={tab}>{PHONE_DISPLAY}</a>
        <span className="contact-where">London, and around</span>
      </div>
      <div className="contact-socials">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={tab} className="tag tag-default">
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}
