"use client";

import Link from "next/link";
import { useState } from "react";
import { ago, gbp, groupByZone } from "@/lib/dad-shop/format";
import { BASE_PATH, LIST_PATH, type BasketView } from "@/lib/dad-shop/types";
import { api, ApiError } from "./api";
import { ProductImage, StoreChip } from "./ui";

type Phase = "idle" | "working" | "error";

type Votes = Record<string, 1 | -1>;

const SLOT_TITLE: Record<string, string> = {
  dinner: "Dinners",
  breakfast: "Breakfasts",
  lunch: "Lunches",
  veg: "Fruit and veg",
  staples: "Staples",
};
const SLOT_ORDER = ["dinner", "breakfast", "lunch", "veg", "staples"];

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
  const [votes, setVotes] = useState<Votes>(initial?.votes ?? {});
  // Answers given since this basket was made: they only take effect when he regenerates.
  const [changed, setChanged] = useState(0);
  const [voteError, setVoteError] = useState("");

  async function vote(productId: string, next: 1 | -1) {
    const before = votes[productId];
    // Tapping the answer he already gave takes it back.
    const target = before === next ? null : next;
    setVoteError("");
    setVotes((v) => {
      const copy = { ...v };
      if (target === null) delete copy[productId];
      else copy[productId] = target;
      return copy;
    });
    setChanged((n) => n + 1);
    try {
      await api("/basket/vote", { method: "POST", body: { productId, vote: target } });
    } catch {
      setVotes((v) => {
        const copy = { ...v };
        if (before === undefined) delete copy[productId];
        else copy[productId] = before;
        return copy;
      });
      setVoteError("Couldn't save that answer. Try again.");
    }
  }

  async function make() {
    setPhase("working");
    setMessage("");
    setUsed(null);
    try {
      const res = await api<{ basket: BasketView }>("/basket", { method: "POST", timeoutMs: 45_000 });
      setBasket(res.basket);
      setVotes(res.basket.votes ?? {});
      setChanged(0);
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
  const bySlot = items.some((i) => i.slot);
  const groups: { key: string; title: string; items: typeof items }[] = bySlot
    ? [...SLOT_ORDER, "other"]
        .map((slot) => ({
          key: slot,
          title: SLOT_TITLE[slot] ?? "Something else",
          items: items.filter((i) => (slot === "other" ? !i.slot || !SLOT_ORDER.includes(i.slot) : i.slot === slot)),
        }))
        .filter((g) => g.items.length > 0)
    : groupByZone(items).map((g) => ({ key: g.zone, title: g.zone, items: g.items }));
  const yes = Object.values(votes).filter((v) => v === 1).length;
  const no = Object.values(votes).filter((v) => v === -1).length;
  const meals = (basket?.meals ?? []).filter((m) => m.slot !== "staples");

  return (
    <div className="ds-page">
      <header className="ds-head">
        <h1 className="ds-h1">This week</h1>
      </header>

      <p>
        A week of food that fits your budget and your rules: low saturated fat, no seed oils, high protein, few ingredients. Say yes to what you want,
        no to what you don&apos;t, then tap Regenerate.
      </p>

      <button type="button" className="ds-btn ds-btn--primary ds-btn--wide ds-btn--big" onClick={make} disabled={phase === "working"}>
        {phase === "working" ? "Working it out…" : basket && basket.items.length > 0 ? "Regenerate basket" : "Make this week's basket"}
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
            {meals.length > 0 && (
              <ul className="ds-meals" aria-label="What the week covers">
                {meals.map((m) => (
                  <li key={m.slot} className={m.have >= m.need ? "is-ok" : "is-short"}>
                    <b>
                      {Math.min(m.have, m.need)}/{m.need}
                    </b>{" "}
                    {m.label.toLowerCase()}
                  </li>
                ))}
              </ul>
            )}
            <p className="ds-muted">
              {basket.fromHistory ? "This is an older basket, made " : "Made "}
              {ago(basket.createdAt, now)}.
            </p>
          </section>

          {(basket.taught.length > 0 || changed > 0 || yes + no > 0) && (
            <div className="ds-banner ds-banner--learn" role="status">
              {changed > 0 && (
                <p>
                  <strong>
                    {yes + no} {yes + no === 1 ? "answer" : "answers"} saved.
                  </strong>{" "}
                  Tap Regenerate basket to use {yes + no === 1 ? "it" : "them"}: yes items stay, no items go, the rest is filled again.
                </p>
              )}
              {basket.taught.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          )}
          {voteError && <p className="ds-banner ds-banner--amber">{voteError}</p>}

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
                    <Link className="ds-link" href={LIST_PATH}>
                      Go to my list
                    </Link>
                  </>
                )}
              </p>
            </div>
          )}

          {groups.map((g) => (
            <section key={g.key} className="ds-group" aria-label={g.title}>
              <h2 className="ds-h2">{g.title}</h2>
              <ul className="ds-cards">
                {g.items.map((i) => {
                  const v = votes[i.productId];
                  return (
                    <li key={i.productId} className={`ds-card ds-card--basket${v === -1 ? " is-no" : v === 1 ? " is-yes" : ""}`}>
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
                      {i.store && (i.store.status === "no" || i.store.stock === "out") && (
                        <div className="ds-basket-store">
                          <StoreChip status={i.store.status} reason={i.store.reason} stock={i.store.stock} stockAt={i.store.stockAt} id={`ds-bs-${i.productId}`} />
                        </div>
                      )}
                      <div className="ds-vote" role="group" aria-label={`Do you want ${i.name}?`}>
                        <button type="button" className="ds-vote-btn ds-vote-btn--yes" aria-pressed={v === 1} onClick={() => vote(i.productId, 1)}>
                          <span aria-hidden="true">{v === 1 ? "✓ " : ""}</span>Yes
                        </button>
                        <button type="button" className="ds-vote-btn ds-vote-btn--no" aria-pressed={v === -1} onClick={() => vote(i.productId, -1)}>
                          <span aria-hidden="true">{v === -1 ? "✕ " : ""}</span>No
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
