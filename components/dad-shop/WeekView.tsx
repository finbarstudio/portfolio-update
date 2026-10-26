"use client";

import Link from "next/link";
import { useState } from "react";
import { ago, gbp, groupByZone } from "@/lib/dad-shop/format";
import { BASE_PATH, type BasketView } from "@/lib/dad-shop/types";
import { api, ApiError } from "./api";
import { ProductImage } from "./ui";

type Phase = "idle" | "working" | "error";

interface Used {
  added: number;
  skipped: number;
}

export default function WeekView({ initial, nowIso }: { initial: BasketView | null; nowIso: string }) {
  const now = new Date(nowIso);
  const [basket, setBasket] = useState<BasketView | null>(initial);
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");
  const [usePhase, setUsePhase] = useState<Phase>("idle");
  const [used, setUsed] = useState<Used | null>(null);

  async function make() {
    setPhase("working");
    setMessage("");
    setUsed(null);
    try {
      const res = await api<{ basket: BasketView }>("/basket", { method: "POST", timeoutMs: 45_000 });
      setBasket(res.basket);
      setPhase("idle");
    } catch (err) {
      setPhase("error");
      setMessage(
        err instanceof ApiError && err.status === 0
          ? "No signal, or it took too long. Your last basket is still below. Try again in a moment."
          : "Couldn't make a basket just now. Your last one is still below.",
      );
    }
  }

  async function addAll() {
    if (!basket || basket.id === null) return;
    setUsePhase("working");
    try {
      const res = await api<Used>("/basket/use", { method: "POST", body: { basketId: basket.id } });
      setUsed({ added: res.added, skipped: res.skipped });
      setUsePhase("idle");
    } catch {
      setUsePhase("error");
    }
  }

  const items = basket?.items ?? [];
  const budget = basket?.settings.budget_gbp ?? 0;
  const people = basket?.settings.people ?? 1;
  const perDay = basket ? Math.round(basket.proteinG / 7 / people) : 0;
  const target = basket?.settings.protein_g_per_day ?? 0;
  const used100 = budget > 0 && basket ? Math.min(100, Math.round((basket.total / budget) * 100)) : 0;
  const groups = groupByZone(items);

  return (
    <div className="ds-page">
      <header className="ds-head">
        <h1 className="ds-h1">This week</h1>
      </header>

      <p>Pick a basket that fits your budget and your rules: low saturated fat, no seed oils, high protein, few ingredients.</p>

      <button type="button" className="ds-btn ds-btn--primary ds-btn--wide ds-btn--big" onClick={make} disabled={phase === "working"}>
        {phase === "working" ? "Working it out…" : basket && basket.items.length > 0 ? "Make a new basket" : "Make this week's basket"}
      </button>
      <p className="ds-sr" role="status" aria-live="polite">
        {phase === "working" ? "Working out your basket" : ""}
      </p>
      {message && <p className="ds-banner ds-banner--amber">{message}</p>}

      {!basket || items.length === 0 ? (
        <div className="ds-empty">
          <p className="ds-empty-title">No basket yet.</p>
          <p>Tap the button and I&apos;ll choose things that fit, with a reason for each.</p>
          {basket && basket.warnings.length > 0 && (
            <ul className="ds-warnings">
              {basket.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
          <section className="ds-summary" aria-label="Basket summary">
            <p className="ds-summary-big">
              <strong>{gbp(basket.total)}</strong> <span className="ds-muted">of {gbp(budget)}</span>
            </p>
            <div className="ds-meter" role="img" aria-label={`${used100} percent of the budget used`}>
              <span style={{ width: `${used100}%` }} />
            </div>
            <p>
              About <strong>{perDay}g</strong> protein a day{people > 1 ? " each" : ""}
              <span className="ds-muted"> (you aim for {target}g)</span>
            </p>
            <p className="ds-muted">
              {basket.fromHistory ? "This is an older basket, made " : "Made "}
              {ago(basket.createdAt, now)}.
            </p>
          </section>

          {basket.warnings.length > 0 && (
            <div className="ds-banner ds-banner--amber" role="note">
              <strong>Worth knowing</strong>
              <ul className="ds-warnings">
                {basket.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {basket.id !== null && (
            <div className="ds-actions">
              <button type="button" className="ds-btn ds-btn--primary ds-btn--wide" onClick={addAll} disabled={usePhase === "working"}>
                {usePhase === "working" ? "Adding…" : "Add all to my list"}
              </button>
              <p className="ds-muted ds-hint" role="status">
                {usePhase === "error" && "Couldn't add them just now. Try again."}
                {used && (
                  <>
                    Added {used.added} {used.added === 1 ? "item" : "items"}.
                    {used.skipped > 0 && ` ${used.skipped} ${used.skipped === 1 ? "was" : "were"} already on your list. `}
                    <Link className="ds-link" href={BASE_PATH}>
                      Go to my list
                    </Link>
                  </>
                )}
              </p>
            </div>
          )}

          {groups.map((g) => (
            <section key={g.zone} className="ds-group" aria-label={g.zone}>
              <h2 className="ds-h2">{g.zone}</h2>
              <ul className="ds-cards">
                {g.items.map((i) => (
                  <li key={i.productId} className="ds-card ds-card--basket">
                    <Link href={`${BASE_PATH}/p/${encodeURIComponent(i.productId)}`} className="ds-card-main">
                      <ProductImage src={i.imageUrl} />
                      <span className="ds-card-text">
                        <span className="ds-card-name">
                          {i.qty > 1 ? `${i.qty} × ` : ""}
                          {i.name}
                        </span>
                        <span className="ds-reason">{i.reason}</span>
                        <span className="ds-card-price">
                          <strong>{gbp(i.lineTotal)}</strong>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
