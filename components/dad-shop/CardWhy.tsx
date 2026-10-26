import { fitBlend, healthBreakdown, overallSum, valueBreakdown } from "@/lib/dad-shop/breakdown";
import { overallWeightsLine } from "@/lib/dad-shop/overall";
import type { ProductCard } from "@/lib/dad-shop/types";

export type WhyKind = "fit" | "value";

const tone = (score: number | null): string => (score == null ? "n" : score >= 7 ? "g" : score >= 5 ? "a" : "r");
const num = (n: number): string => String(Math.round(n * 10) / 10);

/**
 * The hidden working behind Fit or Value, shown inside the card when its badge
 * is tapped: every part with its score, weight and points, then the caps, then
 * the "Best overall" sum for this very product. Real numbers from the same
 * rules the pipeline and the sort use (lib/dad-shop/breakdown.ts).
 */
export default function CardWhy({ p, kind, id, rank, why }: { p: ProductCard; kind: WhyKind; id: string; rank?: string; why?: string }) {
  const sum = overallSum(p);
  return (
    <div className="ds-why" id={id} role="region" aria-label={kind === "fit" ? "How Fit is worked out" : "How Value is worked out"}>
      {why && (
        <p className="ds-why-top">
          <b>Why it&apos;s here:</b> {why}
        </p>
      )}
      {kind === "fit" ? <FitWhy p={p} /> : <ValueWhy p={p} />}
      <p className="ds-why-all">
        <b>
          Best overall {num(sum.total)}
          {rank ? ` · ${rank.replace(" best overall", "")}` : ""}
        </b>
        <span>{sum.text}</span>
        <span className="ds-muted">{overallWeightsLine()}</span>
      </p>
    </div>
  );
}

function FitWhy({ p }: { p: ProductCard }) {
  const h = healthBreakdown(p);
  return (
    <>
      <h3 className="ds-why-h">{p.fit != null ? `Why Fit ${Math.round(p.fit)}?` : "Why no Fit?"}</h3>
      {h.mode === "none" ? (
        <p className="ds-why-line">Nothing to judge it from yet: the ingredients and nutrition have not been read.</p>
      ) : (
        <ul className="ds-why-rows">
          {h.parts.map((part) => (
            <li key={part.key}>
              <span className="ds-why-row">
                <b className={`ds-why-s ds-why-s--${tone(part.score)}`}>
                  {part.label} {part.score != null ? `${num(part.score)}/10` : "?"}
                </b>
                <span className="ds-muted">
                  × {Math.round(part.weight * 100)}%{part.points != null ? ` = ${num(part.points)}` : ""}
                </span>
              </span>
              <small>{part.detail}</small>
            </li>
          ))}
        </ul>
      )}
      {h.raw != null && (
        <p className="ds-why-line">
          <b>Health {h.raw !== h.final && h.final != null ? `${num(h.raw)} → ${num(h.final)}` : num(h.raw)}</b>
          {h.caps.map((c) => (
            <span key={c} className="ds-why-cap">
              {c}
            </span>
          ))}
        </p>
      )}
      {h.reasons.length > 0 && <p className="ds-why-line ds-muted">{h.reasons.join(" · ")}</p>}
      <p className="ds-why-line">{fitBlend(p)}</p>
      {p.reviewAvg != null && p.reviewCount != null && p.reviewCount > 0 && (
        <p className="ds-why-line ds-muted">
          Shoppers give it {p.reviewAvg.toFixed(1)} out of 5 ({p.reviewCount}).
        </p>
      )}
      {h.notes.map((n) => (
        <p key={n} className="ds-why-line ds-why-note">
          {n}
        </p>
      ))}
    </>
  );
}

function ValueWhy({ p }: { p: ProductCard }) {
  const v = valueBreakdown(p);
  return (
    <>
      <h3 className="ds-why-h">{p.value != null ? `Why Value ${p.value}?` : "Why no Value?"}</h3>
      {v.note ? (
        <p className="ds-why-line">{v.note}</p>
      ) : (
        <ul className="ds-why-rows">
          {v.parts.map((part) => (
            <li key={part.key}>
              <span className="ds-why-row">
                <b className={`ds-why-s ds-why-s--${tone(part.score)}`}>
                  {part.label} {part.score != null ? `${num(part.score)}/10` : "?"}
                </b>
                <span className="ds-muted">
                  × {Math.round(part.weight * 100)}%{part.points != null ? ` = ${num(part.points)}` : ""}
                </span>
              </span>
              <small>{part.detail}</small>
            </li>
          ))}
        </ul>
      )}
      <p className="ds-why-line ds-muted">Value is how much good food you get for your money, not just the size of the discount. The price you pay already counts Nectar.</p>
    </>
  );
}
