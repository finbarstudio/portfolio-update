/**
 * Braeden homepage — the ONE shared section frame.
 *
 * Cohesion comes from a consistent HEADER (eyebrow + Montserrat-800 caps title +
 * short red rule), consistent tokens/spacing, and a consistent scroll reveal,
 * NOT from wrapping every section in a card. `card` opts a section into the
 * off-white panel (reserved for contact + footer); everything else is a plain
 * white section with the same header + grid. The ledger motif is shared too.
 */

import React from "react";
import BReveal from "./BReveal";

export function CardSection({
  id, card = false, eyebrow, title, intro, headExtra, children,
}: {
  id?: string;
  card?: boolean;
  eyebrow?: string;
  title: string;
  intro?: string;
  headExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  const inner = (
    <div className="bcard-grid">
      <div className="bhead">
        <BReveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="bhead-title">{title}</h2>
          {intro && <p className="bhead-intro">{intro}</p>}
          <span className="brule" aria-hidden />
          {headExtra}
        </BReveal>
      </div>
      <BReveal delay={0.08}>{children}</BReveal>
    </div>
  );

  if (card) {
    return (
      <section id={id} className="bsec">
        <div className="bcard">{inner}</div>
      </section>
    );
  }
  return (
    <section id={id} className="bsec-plain">
      <div className="frame wrap pad-y">{inner}</div>
    </section>
  );
}

/** A hairline ledger (top + per-row bottom borders), lifted from Awards. */
export function Ledger({ children }: { children: React.ReactNode }) {
  return <div className="bledger">{children}</div>;
}

/** One ledger row: a Space Mono key + a value, optional Space Mono sub-line. */
export function Row({ k, sub, children }: { k: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bledger-row">
      <span className="bledger-key">{k}</span>
      <span className="bledger-val">
        {children}
        {sub && <span className="bledger-sub">{sub}</span>}
      </span>
    </div>
  );
}
