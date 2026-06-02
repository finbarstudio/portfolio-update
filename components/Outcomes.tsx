/**
 * Outcomes — measurable results / metrics. Same place in the bottom info block
 * as WhatWasDelivered, but with big highlighted numbers, delta and label.
 */
type Stat = { value: string; delta?: string; label: string };

export default function Outcomes({
  intro,
  subtitle,
  stats,
  source,
}: {
  intro?: string;
  subtitle?: string;
  stats: Stat[];
  source?: string;
}) {
  if (!stats?.length) return null;
  return (
    <section className="outcomes" aria-label="Outcomes">
      <header className="outcomes-header">
        <h2 className="outcomes-title">Outcomes</h2>
      </header>

      {intro && <p className="outcomes-intro">{intro}</p>}
      {subtitle && <p className="outcomes-subtitle">{subtitle}</p>}

      <div className="outcomes-grid">
        {stats.map((s) => (
          <div key={s.label} className="outcomes-stat">
            <div className="outcomes-value">{s.value}</div>
            {s.delta && <div className="outcomes-delta">{s.delta}</div>}
            <div className="outcomes-label">{s.label}</div>
          </div>
        ))}
      </div>

      {source && <p className="outcomes-source">Source: {source}</p>}
    </section>
  );
}
