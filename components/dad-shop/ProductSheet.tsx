"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fitScore, nutritionRows } from "@/lib/dad-shop/fit";
import { ago, daysOld, gbp, ingredientSegments, offerText, unitPriceLabel } from "@/lib/dad-shop/format";
import { BASE_PATH, type ProductDetail } from "@/lib/dad-shop/types";
import { api } from "./api";
import { FitBadge, ProductImage, StarsInput } from "./ui";

type Phase = "idle" | "saving" | "saved" | "error";

export default function ProductSheet({ product, nowIso }: { product: ProductDetail; nowIso: string }) {
  const router = useRouter();
  const now = new Date(nowIso);
  const [stars, setStars] = useState<number | null>(product.stars);
  const [rating, setRating] = useState<Phase>("idle");
  const [notHere, setNotHere] = useState(product.notAtStore);
  const [notHerePhase, setNotHerePhase] = useState<Phase>("idle");
  const [onList, setOnList] = useState(product.onList);
  const [listPhase, setListPhase] = useState<Phase>("idle");

  const fit = fitScore(product.health, stars);
  const offer = offerText(product, now);
  const unit = unitPriceLabel(product.unitPrice, product.unitMeasure);
  const age = daysOld(product.listedAt, now);
  const rows = product.nutrition ? nutritionRows(product.nutrition) : [];

  function back() {
    if (window.history.length > 1) router.back();
    else router.push(`${BASE_PATH}/find`);
  }

  async function rate(next: number | null) {
    const before = stars;
    setStars(next);
    setRating("saving");
    try {
      await api("/rating", { method: "POST", body: { productId: product.id, stars: next } });
      setRating("saved");
    } catch {
      setStars(before);
      setRating("error");
    }
  }

  async function toggleNotHere() {
    const next = !notHere;
    setNotHere(next);
    setNotHerePhase("saving");
    try {
      await api("/not-at-store", { method: "POST", body: { productId: product.id, value: next } });
      setNotHerePhase("saved");
    } catch {
      setNotHere(!next);
      setNotHerePhase("error");
    }
  }

  async function addToList() {
    setListPhase("saving");
    try {
      await api("/list", { method: "POST", body: { action: "add", productId: product.id, qty: 1 } });
      setOnList(true);
      setListPhase("saved");
    } catch {
      setListPhase("error");
    }
  }

  return (
    <article className="ds-page ds-sheet">
      <button type="button" className="ds-back" onClick={back}>
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="ds-hero">
        <ProductImage src={product.imageUrl} alt={product.name} className="ds-img--hero" />
      </div>

      <header>
        {product.brand && <p className="ds-muted">{product.brand}</p>}
        <h1 className="ds-h1 ds-h1--product">{product.name}</h1>
        <p className="ds-price">
          <strong>{gbp(product.price)}</strong>
          {product.packGrams ? <span className="ds-muted"> {Math.round(product.packGrams)}g</span> : null}
          {unit ? <span className="ds-muted"> · {unit}</span> : null}
        </p>
        {offer && <p className="ds-offer ds-offer--big">{offer}</p>}
        {!product.isAvailable && <p className="ds-banner ds-banner--amber">Sainsbury&apos;s isn&apos;t selling this at the moment.</p>}
        {age !== null && age > 14 && (
          <p className="ds-banner ds-banner--amber">This price is {ago(product.listedAt, now)} and may have changed.</p>
        )}
      </header>

      <section className="ds-block" aria-label="How well it suits you">
        <div className="ds-fit-row">
          <FitBadge fit={fit} />
          <span className="ds-muted">
            {stars === null ? "Based on your rules. Rate it to teach me your taste." : `Mixes your rules with your ${stars} star${stars === 1 ? "" : "s"}.`}
          </span>
        </div>
        {product.reasons.length > 0 && (
          <ul className="ds-reasons">
            {product.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </section>

      <SeedOilBanner product={product} />

      <section className="ds-block" aria-label="Your rating">
        <h2 className="ds-h2">Your rating</h2>
        <StarsInput value={stars} onChange={rate} disabled={rating === "saving"} />
        <p className="ds-muted ds-hint" role="status">
          {rating === "saving" && "Saving…"}
          {rating === "saved" && (stars === null ? "Rating cleared." : "Saved.")}
          {rating === "error" && "Couldn't save that. Try again."}
          {rating === "idle" && (stars === null ? "Tap a star. Tap it again to clear." : "Tap the same star again to clear.")}
        </p>
      </section>

      <section className="ds-actions" aria-label="Actions">
        <button
          type="button"
          className={`ds-btn ${onList ? "ds-btn--done" : "ds-btn--primary"} ds-btn--wide`}
          onClick={addToList}
          disabled={onList || listPhase === "saving"}
        >
          {onList ? "On your list ✓" : listPhase === "saving" ? "Adding…" : listPhase === "error" ? "Try adding again" : "+ Add to list"}
        </button>
        {onList && (
          <Link className="ds-link" href={BASE_PATH}>
            Go to my list
          </Link>
        )}
        <button
          type="button"
          className={`ds-btn ds-btn--ghost ds-btn--wide${notHere ? " is-on" : ""}`}
          aria-pressed={notHere}
          onClick={toggleNotHere}
          disabled={notHerePhase === "saving"}
        >
          {notHere ? "Not at my store ✓" : "Not at my store"}
        </button>
        <p className="ds-muted ds-hint" role="status">
          {notHerePhase === "error"
            ? "Couldn't save that. Try again."
            : notHere
              ? "Marked. It won't go in your weekly baskets."
              : "Tap if you looked and the shelf was empty."}
        </p>
      </section>

      <section className="ds-block" aria-label="Nutrition">
        <h2 className="ds-h2">
          Nutrition <span className="ds-muted">per 100{product.nutrition?.basis === "100ml" ? "ml" : "g"}{product.nutrition?.cooked ? ", cooked" : ""}</span>
        </h2>
        {rows.length === 0 ? (
          <p className="ds-muted">No nutrition listed for this one yet.</p>
        ) : (
          <table className="ds-nutri">
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className={r.indent ? "is-sub" : undefined}>
                  <th scope="row">{r.label}</th>
                  <td>{r.value}</td>
                  <td>
                    {r.light !== "none" && (
                      <span className={`ds-light ds-light--${r.light}`}>
                        <span className="ds-light-dot" aria-hidden="true" />
                        {r.word}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="ds-block" aria-label="Ingredients">
        <h2 className="ds-h2">
          Ingredients
          {product.ingredientCount !== null && (
            <span className="ds-muted"> ({product.ingredientCount === 1 ? "only 1" : product.ingredientCount})</span>
          )}
        </h2>
        {product.ingredients ? (
          <p className="ds-ingredients">
            {ingredientSegments(product.ingredients).map((s, i) =>
              s.seedOil ? (
                <mark key={i} className="ds-seed">
                  {s.text}
                </mark>
              ) : (
                <span key={i}>{s.text}</span>
              ),
            )}
          </p>
        ) : (
          <p className="ds-muted">Ingredients aren&apos;t listed for this one yet.</p>
        )}
        {product.upfMarkers.length > 0 && (
          <p className="ds-muted">Processed extras: {product.upfMarkers.join(", ")}.</p>
        )}
      </section>

      <p className="ds-foot">
        <a href={`https://www.sainsburys.co.uk/gol-ui/product/${encodeURIComponent(product.slug)}`} target="_blank" rel="noopener noreferrer">
          View on Sainsbury&apos;s
        </a>
        <span className="ds-muted"> · price seen {ago(product.listedAt, now)}</span>
      </p>
    </article>
  );
}

function SeedOilBanner({ product }: { product: ProductDetail }) {
  switch (product.seedOil) {
    case "yes":
      return (
        <div className="ds-seedbox ds-seedbox--red" role="note">
          <strong>Contains seed oil</strong>
          <span>
            {product.seedOilsFound.length > 0 ? `It has ${product.seedOilsFound.join(", ")}.` : "It lists a seed oil in the ingredients."}
          </span>
        </div>
      );
    case "likely":
      return (
        <div className="ds-seedbox ds-seedbox--amber" role="note">
          <strong>May contain seed oil</strong>
          <span>It says &ldquo;vegetable oil&rdquo; or &ldquo;vegetable fat&rdquo; without saying which.</span>
        </div>
      );
    case "none":
      return (
        <div className="ds-seedbox ds-seedbox--green" role="note">
          <strong>No seed oils</strong>
          <span>None in the ingredients.</span>
        </div>
      );
    default:
      return (
        <div className="ds-seedbox ds-seedbox--grey" role="note">
          <strong>Not sure about seed oils</strong>
          <span>We don&apos;t have the ingredients for this one yet.</span>
        </div>
      );
  }
}
