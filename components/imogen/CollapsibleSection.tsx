"use client";

import { useState, type ReactNode } from "react";

/**
 * A whole content section (Apps, Things I learnt, A heads-up, …) collapsed to a
 * tappable header so the page stays scannable. Matches the stop-card +/− affordance.
 */
export default function CollapsibleSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`im-coll ${open ? "is-open" : ""}`}>
      <button className="im-coll-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="im-section-label">{label}</span>
        <span className="im-coll-chev" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="im-coll-body">{children}</div>}
    </div>
  );
}
