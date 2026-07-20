"use client";

/**
 * FaqAccordion — the service-landing FAQ as an interactive accordion. Each
 * question toggles independently; a "+" rotates to a "-". The open height is
 * measured from the answer's scrollHeight and applied as max-height, so the
 * collapse animates smoothly and reliably in every engine (the pure-CSS
 * grid-rows trick doesn't resolve everywhere). Styling: globals.css (.faq-*).
 *
 * Accessible: a real <button> per row with aria-expanded + aria-controls; the
 * answers stay in the DOM (collapsed) for crawlers and the FAQPage schema.
 */

import { useRef, useState } from "react";

export default function FaqAccordion({ faqs, idBase = "faq" }: { faqs: { q: string; a: string }[]; idBase?: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const bodyRefs = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <ul className="faq-acc">
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        const aId = `${idBase}-a-${i}`;
        return (
          <li key={f.q} className="faq-item" data-open={isOpen}>
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={aId}
              onClick={() => toggle(i)}
            >
              <span>{f.q}</span>
              <span className="faq-icon" aria-hidden="true" />
            </button>
            <div
              id={aId}
              role="region"
              className="faq-a-wrap"
              style={{ maxHeight: isOpen ? `${bodyRefs.current[i]?.scrollHeight ?? 0}px` : "0px" }}
            >
              <div className="faq-a" ref={(el) => { bodyRefs.current[i] = el; }}>
                <p>{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
