/**
 * Braeden homepage — the ONE shared section shell.
 *
 * Everything is based on the Awards section: an off-white card panel at ~100vh,
 * a sticky heading block (eyebrow + Montserrat-800 caps title + a short red
 * rule), and a content column. Every homepage section uses this so the page
 * reads as one cohesive piece (consistent tokens, type, padding, the ledger
 * motif). The footer keeps its own panel.
 */

import React from "react";

export function CardSection({
  id, eyebrow, title, intro, headExtra, children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  headExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="bsec">
      <div className="bcard">
        <div className="bcard-grid">
          <div className="bhead">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="bhead-title">{title}</h2>
            {intro && <p className="bhead-intro">{intro}</p>}
            <span className="brule" aria-hidden />
            {headExtra}
          </div>
          <div>{children}</div>
        </div>
      </div>
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
