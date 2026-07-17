"use client";

/**
 * ContactDirect — the "Direct" block: email + phone stacked, the social pills
 * in a row beneath. Shared by the contact popup (ContactPanel) and the
 * /contact page so the two can never drift.
 */

const EMAIL = "finbar@finbar.studio";
const PHONE = "+61412796630";
const PHONE_DISPLAY = "+61 412 796 630";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/finbar.studio" },
  { label: "X", href: "https://x.com/finbarstudio" },
  { label: "LinkedIn", href: "https://linkedin.com/in/finbarskitini" },
  { label: "Are.na", href: "https://are.na/finbar-studio" },
];

export default function ContactDirect({ tabbable = true }: { tabbable?: boolean }) {
  const tab = tabbable ? 0 : -1;
  return (
    <>
      <p className="contact-col-label">Direct</p>
      <div className="contact-details">
        <div className="contact-primary">
          <a href={`mailto:${EMAIL}`} className="contact-link u-underline" tabIndex={tab}>{EMAIL}</a>
          <a href={`tel:${PHONE}`} className="contact-link u-underline tabular-nums" tabIndex={tab}>{PHONE_DISPLAY}</a>
        </div>
        <div className="contact-socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={tab} className="tag tag-default">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
