/**
 * WhatWasDelivered — flat list of deliverables, rendered as a tidy multi-column
 * bulleted grid with a small editorial header. Generic; used by any case study
 * that supplies `project.delivered`.
 */
export default function WhatWasDelivered({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="delivered" aria-label="What was delivered">
      <header className="delivered-header">
        <span className="delivered-meta">
          DELIVERABLES &nbsp;/&nbsp; {String(items.length).padStart(2, "0")}
        </span>
        <h2 className="delivered-title">What was delivered</h2>
      </header>
      <ul className="delivered-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
