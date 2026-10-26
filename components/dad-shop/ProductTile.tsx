"use client";

import Link from "next/link";
import { useState } from "react";
import { gbp, offerText, unitPriceLabel } from "@/lib/dad-shop/format";
import { BASE_PATH, type ProductCard } from "@/lib/dad-shop/types";
import { api } from "./api";
import { FitBadge, ProductImage, SeedOilTag, StarsDisplay } from "./ui";

type AddState = "idle" | "adding" | "added" | "error";

/** One product in Find: tap the card to open it, or "+ List" to add it. */
export default function ProductTile({ p, now }: { p: ProductCard; now: Date }) {
  const [state, setState] = useState<AddState>(p.onList ? "added" : "idle");
  const offer = offerText(p, now);
  const unit = unitPriceLabel(p.unitPrice, p.unitMeasure);

  async function add() {
    setState("adding");
    try {
      await api("/list", { method: "POST", body: { action: "add", productId: p.id, qty: 1 } });
      setState("added");
    } catch {
      setState("error");
    }
  }

  return (
    <li className={`ds-card${p.notAtStore ? " is-muted" : ""}`}>
      <Link href={`${BASE_PATH}/p/${encodeURIComponent(p.id)}`} className="ds-card-main">
        <ProductImage src={p.imageUrl} />
        <span className="ds-card-text">
          <span className="ds-card-name">{p.name}</span>
          <span className="ds-card-price">
            <strong>{gbp(p.price)}</strong>
            {unit && <span className="ds-muted"> {unit}</span>}
          </span>
          {offer && <span className="ds-offer">{offer}</span>}
          <span className="ds-card-meta">
            <FitBadge fit={p.fit} />
            {p.stars !== null && <StarsDisplay stars={p.stars} />}
            <SeedOilTag seedOil={p.seedOil} />
            {p.protein !== null && <span className="ds-muted">{Math.round(p.protein * 10) / 10}g protein / 100g</span>}
            {p.notAtStore && <span className="ds-tag ds-tag--grey">Not at my store</span>}
          </span>
        </span>
      </Link>
      <button
        type="button"
        className={`ds-btn ${state === "added" ? "ds-btn--done" : "ds-btn--primary"} ds-card-add`}
        disabled={state === "adding" || state === "added"}
        onClick={add}
        aria-label={
          state === "added" ? `${p.name} is on your list` : state === "error" ? `Try adding ${p.name} again` : `Add ${p.name} to your list`
        }
      >
        {state === "added" ? "On list ✓" : state === "adding" ? "Adding…" : state === "error" ? "Try again" : "+ List"}
      </button>
    </li>
  );
}
