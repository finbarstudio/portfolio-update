"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
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
} from "@/lib/dad-shop/format";
import { priceView } from "@/lib/dad-shop/pricing";
import { BASE_PATH, LIST_PATH, type FindFilters, type ListItem, type ProductDetail, type SimilarSection as Similar, type StoreStatus } from "@/lib/dad-shop/types";
import { api } from "./api";
import CardWhy, { type WhyKind } from "./CardWhy";
import SimilarSection from "./SimilarSection";
import { FitBadge, PriceBlock, ProductImage, StarsInput, StoreChip } from "./ui";
import { useShopList } from "./useShopList";

type Phase = "idle" | "saving" | "saved" | "error";

interface Props {
  product: ProductDetail;
  similar: Similar | null;
  filters: FindFilters;
  list: ListItem[];
  nowIso: string;
}

export default function ProductSheet({ product, similar, filters, list, nowIso }: Props) {
  const router = useRouter();
  const now = new Date(nowIso);
  const { store, mine } = useShopList(list, now);
  const [stars, setStars] = useState<number | null>(product.stars);
  const [rating, setRating] = useState<Phase>("idle");
  // His own answer on the buttons below; until he gives one, what the card already knew.
  const [report, setReport] = useState<"found" | "missing" | null>(product.notAtStore ? "missing" : null);
  const [reportPhase, setReportPhase] = useState<Phase>("idle");
  const [open, setOpen] = useState<WhyKind | null>(null);
  const panelId = useId();

  // His own answer beats what the store feed says.
  const status: StoreStatus = report === "found" ? "yes" : report === "missing" ? "no" : product.storeStatus;
  const reason = report === "found" ? "You found it here" : report === "missing" ? "You said it isn't on the shelf here" : product.storeReason;
  const fit = fitScore(product.health, stars);
  const pv = priceView(product, now);
  const multi = groupPromo(product, now);
  const mealPromo = product.promos.find((x) => x.kind === "mealdeal");
  const ends = endsLabel(product.promos, now);
  const proc = processing(product);
  const row = mine.get(product.id);
  const unit = unitPriceLabel(product.unitPrice, product.unitMeasure);
  const age = daysOld(product.listedAt, now);
  const rows = product.nutrition ? nutritionRows(product.nutrition) : [];
  const band = (n: number | null): string => (n == null ? "n" : n >= 7 ? "g" : n >= 5 ? "a" : "r");
  const fitN = fit != null ? Math.round(fit) : null;
  const valN = product.value != null ? Math.round(product.value) : null;

  function back() {
    if (window.history.length > 1) router.back();
    else router.push(BASE_PATH);
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

  async function sendReport(next: "found" | "missing") {
    const before = report;
    setReport(next);
    setReportPhase("saving");
    try {
      await api("/store-report", { method: "POST", body: { productId: product.id, status: next } });
      setReportPhase("saved");
    } catch {
      setReport(before);
      setReportPhase("error");
    }
  }

  return (
    <article className="ds-page ds-page--wide ds-sheet">
      <div className="ds-sheet-main">
        <button type="button" className="ds-back" onClick={back}>
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="ds-sum">
          <ProductImage src={product.imageUrl} alt={product.name} className="ds-img--sum" />
          <header className="ds-sum-main">
            {product.brand && <p className="ds-muted ds-sum-brand">{product.brand}</p>}
            <h1 className="ds-h1 ds-h1--product">{product.name}</h1>
            <p className="ds-price">
              <PriceBlock view={pv} big />
              {packLabel(product.packGrams, product.unitMeasure) ? <span className="ds-muted"> {packLabel(product.packGrams, product.unitMeasure)}</span> : null}
              {unit ? <span className="ds-muted"> · {unit}</span> : null}
            </p>
          </header>
        </div>

        <div className="ds-scores ds-scores--sum" role="group" aria-label="Scores. Tap one to see how it is worked out.">
          <button type="button" className={`ds-sbtn ds-sbtn--${band(fitN)}`} aria-expanded={open === "fit"} aria-controls={panelId} onClick={() => setOpen(open === "fit" ? null : "fit")}>
            <span>Fit {fitN ?? "?"}</span>
            {stars != null ? <i aria-label="from your rating">✓</i> : null}
          </button>
          <button type="button" className={`ds-sbtn ds-sbtn--${band(valN)}`} aria-expanded={open === "value"} aria-controls={panelId} onClick={() => setOpen(open === "value" ? null : "value")}>
            <span>Value {valN ?? "?"}</span>
          </button>
        </div>
        {open && <CardWhy p={{ ...product, stars, fit }} kind={open} id={panelId} />}

        <p className="ds-sheet-scores">
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
            <Link className="ds-link" href={LIST_PATH}>
              Go to my list
            </Link>
          )}
        </section>

        <section className="ds-block ds-storebox" aria-label="Is it at Chislehurst?">
          <p className="ds-store-line">
            <StoreChip status={status} reason={reason} id="ds-sheet-store" />
            <span className="ds-muted">Been to the shelf? Tell me.</span>
          </p>
          <div className="ds-found" role="group" aria-label="Is it on the shelf here?">
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--found" aria-pressed={report === "found"} disabled={reportPhase === "saving"} onClick={() => sendReport("found")}>
              Found it here
            </button>
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--missing" aria-pressed={report === "missing"} disabled={reportPhase === "saving"} onClick={() => sendReport("missing")}>
              Not here
            </button>
          </div>
          <p className="ds-muted ds-hint" role="status">
            {reportPhase === "error"
              ? "Couldn't save that. Try again."
              : report === "missing"
                ? "Marked. It won't go in your weekly baskets."
                : report === "found"
                  ? "Thanks. I'll count it as stocked."
                  : "Ticking it off your list counts as found."}
          </p>
        </section>
      </div>

      {similar && <SimilarSection productId={product.id} section={similar} filters={filters} now={now} store={store} mine={mine} />}

      <div className="ds-sheet-main">
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
      </div>
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
