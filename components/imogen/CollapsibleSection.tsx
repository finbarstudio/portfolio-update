"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * A whole content section (Apps, Things I learnt, A heads-up, …) collapsed to a
 * tappable header so the page stays scannable. Matches the stop-card +/− affordance.
 * If `id` is set, the section opens when something links to `#id` (e.g. a tip
 * reference elsewhere on the page).
 */
export default function CollapsibleSection({
  id,
  label,
  children,
  defaultOpen = false,
}: {
  id?: string;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (!id) return;
    const check = () => {
      if (window.location.hash === `#${id}`) setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [id]);

  return (
    <div id={id} className={`im-coll ${open ? "is-open" : ""}`}>
      <button className="im-coll-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="im-section-label">{label}</span>
        <span className="im-coll-chev" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="im-coll-body">{children}</div>}
    </div>
  );
}
