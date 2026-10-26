"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fitScore, nutritionRows } from "@/lib/dad-shop/fit";
import {
  ago,
  daysOld,
  dealPhrase,
  endsLabel,
  gbp,
  groupPromo,
  ingredientSegments,
  packLabel,
  processing,
  unitPriceLabel,
  valueWhy,
} from "@/lib/dad-shop/format";
import { priceView } from "@/lib/dad-shop/pricing";
import { BASE_PATH, type ListItem, type ProductCard, type ProductDetail } from "@/lib/dad-shop/types";
import { api } from "./api";
import ProductTile from "./ProductTile";
import { FitBadge, PriceBlock, ProductImage, ScoreChip, StarsInput } from "./ui";
import { useShopList } from "./useShopList";

type Phase = "idle" | "saving" | "saved" | "error";

interface Props {
  product: ProductDetail;
  similar: { items: ProductCard[]; total: number };
  list: ListItem[];
  nowIso: string;
}

export default function ProductSheet({ product, similar, list, nowIso }: Props) {
  const router = useRouter();
  const now = new Date(nowIso);
  const { store, mine } = useShopList(list, now);
  const [stars, setStars] = useState<number | null>(product.stars);
  const [rating, setRating] = useState<Phase>("idle");
  const [notHere, setNotHere] = useState(product.notAtStore);
  const [notHerePhase, setNotHerePhase] = useState<Phase>("idle");

  const fit = fitScore(product.health, stars);
  const pv = priceView(product, now);
  const multi = groupPromo(product, now);
  const mealPromo = product.promos.find((x) => x.kind === "mealdeal");
  const ends = endsLabel(product.promos, now);
  const proc = processing(product);
  const why = valueWhy(product);
  const row = mine.get(product.id);
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
          <PriceBlock view={pv} big />
          {packLabel(product.packGrams, product.unitMeasure) ? <span className="ds-muted"> {packLabel(product.packGrams, product.unitMeasure)}</span> : null}
          {unit ? <span className="ds-muted"> · {unit}</span> : null}
        </p>
        <p className="ds-sheet-scores">
          <ScoreChip label="Fit" score={fit} />
          <ScoreChip label="Value" score={product.value} />
          {ends && <span className="ds-chipx">{ends}</span>}
          {proc && <span className={`ds-chipx ds-chipx--${proc.tone}`}>{proc.label}</span>}
        </p>
        {multi && (
          <p>
            <Link className="ds-offer ds-offer--big ds-offer--link" href={`${BASE_PATH}/offer/${encodeURIComponent(multi.uid)}`}>
              {dealPhrase(multi)} ›
            </Link>
          </p>
        )}
        {mealPromo && (
          <p>
            <Link className="ds-offer ds-offer--big ds-offer--link" href={`${BASE_PATH}/meal/${encodeURIComponent(mealPromo.uid)}`}>
              Part of a meal deal ›
            </Link>
          </p>
        )}
        {why && (
          <p className="ds-muted">
            <b>Why Value {product.value}?</b> {why}
          </p>
        )}
        {product.paidBefore && (
          <p className="ds-paid">
            Ordered before · you paid {gbp(product.paidBefore.each)}
            {product.paidBefore.offer ? ` (${product.paidBefore.offer})` : ""}, now {gbp(pv.nowPence / 100)}
          </p>
        )}
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
        {row ? (
          <div className="ds-step ds-step--wide" role="group" aria-label={`How many ${product.name}`}>
            <button type="button" className="ds-step-btn" aria-label={row.qty > 1 ? "One fewer" : "Take it off your list"} onClick={() => (row.qty > 1 ? store.setQty(row.id, row.qty - 1) : store.remove(row.id))}>
              <span aria-hidden="true">−</span>
            </button>
            <span className="ds-step-qty" aria-live="polite">
              {row.qty} on your list ✓
            </span>
            <button type="button" className="ds-step-btn" aria-label="One more" onClick={() => store.setQty(row.id, row.qty + 1)}>
              <span aria-hidden="true">+</span>
            </button>
          </div>
        ) : (
          <button type="button" className="ds-btn ds-btn--primary ds-btn--wide" onClick={() => store.add(product)}>
            + Add to list
          </button>
        )}
        {row && (
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

      {similar.items.length > 0 && (
        <section className="ds-block" aria-label="Similar products">
          <h2 className="ds-h2">Similar products</h2>
          <p className="ds-muted">
            Showing {similar.items.length} of {similar.total} {product.category ? `in ${product.category.toLowerCase()}` : "like this"}.
          </p>
          <ul className="ds-cards ds-cards--grid">
            {similar.items.map((p) => (
              <ProductTile key={p.id} p={p} now={now} store={store} mine={mine} />
            ))}
          </ul>
          {similar.total > similar.items.length && product.zone && product.department && (
            <Link
              className="ds-link"
              href={`${BASE_PATH}/find?noSeedOil=0&hideSat=0&zone=${encodeURIComponent(product.zone)}&dept=${encodeURIComponent(product.department)}${product.category ? `&cat=${encodeURIComponent(product.category)}` : ""}`}
            >
              See all {similar.total + 1} in Find
            </Link>
          )}
        </section>
      )}

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
