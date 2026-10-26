"use client";

import Link from "next/link";
import { useState } from "react";
import QuickRate from "./QuickRate";
import {
  dealPhrase,
  endsLabel,
  gbp,
  groupPromo,
  packLabel,
  pctOff,
  processing,
  satTone,
  shortName,
  shownPromos,
  unitPriceLabel,
  valueWhy,
} from "@/lib/dad-shop/format";
import { offerLabel, priceView, tidyMoney, type GroupInfo } from "@/lib/dad-shop/pricing";
import { BASE_PATH, type DealLink, type ListItem, type ProductCard } from "@/lib/dad-shop/types";
import type { ListStore } from "./listStore";
import { GroupTag, PriceBlock, ProductImage, ScoreChip, SeedOilTag, StarsDisplay } from "./ui";

interface Props {
  p: ProductCard;
  now: Date;
  store: ListStore;
  /** What is on the list now, by product id. */
  mine: Map<string, ListItem>;
  /** The lettered offer group this product is in on the list, if any. */
  group?: Pick<GroupInfo, "letter" | "colour" | "label" | "uid" | "kind"> | null;
  /** "✦ why" line on For you shelves. */
  why?: string;
  /** "#1 all round" inside a deal. */
  rank?: string;
  /** A clearly better product from the same deal, with a Swap button. */
  swap?: ProductCard | null;
  /** The meal deal this card is being shown in, so the list can price the bundle. */
  deal?: DealLink | null;
  /** Shelf cards have a fixed width. */
  shelf?: boolean;
  /** On a meal deal's own page the "part of a meal deal" link would point at itself. */
  inMealPage?: boolean;
}

/** Only the deal this card is shown in is known here; the server fills in the rest on the next read of the list. */
function dealsFor(deal: DealLink | null | undefined): DealLink[] {
  return deal ? [deal] : [];
}

/** One product: picture with overlays, price, a few chips, details behind a button, and the add control. */
export default function ProductTile({ p, now, store, mine, group, why, rank, swap, deal, shelf = false, inMealPage = false }: Props) {
  const [open, setOpen] = useState(false);
  const row = mine.get(p.id);
  const pv = priceView(p, now);
  const offers = shownPromos(p.promos, now);
  const multi = groupPromo(p, now);
  const mealPromo = p.promos.find((x) => x.kind === "mealdeal");
  const off = pctOff(p);
  const hasOffer = pv.cut || offers.length > 0 || multi !== null;
  const pack = packLabel(p.packGrams, p.unitMeasure);
  const ends = endsLabel(p.promos, now);
  const proc = processing(p);
  const sat = satTone(p.sat);
  const unit = unitPriceLabel(p.unitPrice, p.unitMeasure);
  const why2 = valueWhy(p);
  const nowEach = pv.nowPence / 100;
  const paid = p.paidBefore;
  // Bought in a multi-buy that is still running: the single price is not the thing to compare.
  const sameDeal = paid != null && paid.offer != null && multi != null && tidyMoney(offerLabel(multi)) === paid.offer;
  const paidMove = paid && !sameDeal ? Math.round((nowEach - paid.each) * 100) : 0;
  const offerHref = multi ? `${BASE_PATH}/offer/${encodeURIComponent(multi.uid)}` : null;
  const storage = p.storage === "frozen" ? "Frozen" : p.storage === "chilled" ? "Fridge" : null;

  return (
    <li className={`ds-pcard${p.notAtStore ? " is-muted" : ""}${shelf ? " ds-pcard--shelf" : ""}${row ? " is-added" : ""}`}>
      <Link href={`${BASE_PATH}/p/${encodeURIComponent(p.id)}`} className="ds-pcard-imgwrap" aria-label={`${p.name}: open`}>
        <ProductImage src={p.imageUrl} className="ds-img--card" />
        <span className="ds-ov ds-ov--tl" aria-hidden="false">
          {rank != null && <span className="ds-score ds-score--rank">{rank}</span>}
          <ScoreChip label="Fit" score={p.fit} />
          <ScoreChip label="Value" score={p.value} />
        </span>
        <span className="ds-ov ds-ov--bl">
          {hasOffer && <span className="ds-ovchip ds-ovchip--offer">Offer</span>}
          {off != null && <span className="ds-ovchip ds-ovchip--off">−{off}%</span>}
          {pack && <span className="ds-ovchip">{pack}</span>}
          {p.isNew && <span className="ds-ovchip ds-ovchip--new">New</span>}
        </span>
      </Link>

      <div className="ds-pcard-body">
        <Link href={`${BASE_PATH}/p/${encodeURIComponent(p.id)}`} className="ds-pcard-name" title={p.name}>
          {shortName(p.name)}
        </Link>

        <div className="ds-pcard-price">
          <PriceBlock view={pv} />
          {unit && <span className="ds-muted ds-pcard-unit">{unit}</span>}
        </div>
        {multi && offerHref && (
          <Link href={offerHref} className="ds-eachin">
            {dealPhrase(multi)} <span aria-hidden="true">›</span>
          </Link>
        )}
        {mealPromo && !inMealPage && (
          <Link href={`${BASE_PATH}/meal/${encodeURIComponent(mealPromo.uid)}`} className="ds-eachin">
            Part of a meal deal <span aria-hidden="true">›</span>
          </Link>
        )}
        {p.per100Protein != null && <p className="ds-cmp">{gbp(p.per100Protein)} per 100g protein</p>}

        <div className="ds-pcard-chips">
          {group && <GroupTag group={group} label={group.kind === "mealdeal" ? group.label : tidyMoney(group.label)} />}
          {ends && <span className="ds-chipx">{ends}</span>}
          {proc && <span className={`ds-chipx ds-chipx--${proc.tone}`}>{proc.label}</span>}
          {p.seedOil === "none" ? <span className="ds-chipx ds-chipx--g">No seed oils</span> : <SeedOilTag seedOil={p.seedOil} />}
          {sat && p.sat != null && <span className={`ds-chipx ds-chipx--${sat}`}>Sat fat {+p.sat.toFixed(1)}g</span>}
          {storage && <span className="ds-chipx">{storage}</span>}
          {paid && (
            <span className={`ds-chipx ${paidMove < 0 ? "ds-chipx--g" : paidMove > 0 ? "ds-chipx--r" : ""}`}>
              {sameDeal ? `Ordered before · same deal as then, ${gbp(paid.each)} each` : `Ordered before · paid ${gbp(paid.each)}, now ${gbp(nowEach)}`}
            </span>
          )}
          {p.notAtStore && <span className="ds-chipx ds-chipx--grey">Not at my store</span>}
        </div>

        {why && <p className="ds-why">✦ {why}</p>}

        {swap && row && (
          <p className="ds-swap">
            <span>
              ↺ Better: <b>{shortName(swap.name)}</b> {Math.round(swap.fit ?? 0)} vs {Math.round(p.fit ?? 0)}
            </span>
            <button
              type="button"
              className="ds-swap-btn"
              onClick={() => {
                store.add({ ...swap, deals: dealsFor(deal) }, row.qty);
                store.remove(row.id);
              }}
            >
              Swap
            </button>
          </p>
        )}

        <details className="ds-more" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
          <summary>{open ? "Hide details" : "Details"}</summary>
          <dl className="ds-facts">
            {p.protein != null && (
              <div>
                <dt>Protein</dt>
                <dd>{+p.protein.toFixed(1)}g in every 100g</dd>
              </div>
            )}
            {p.sat != null && (
              <div>
                <dt>Sat fat</dt>
                <dd>{+p.sat.toFixed(1)}g in every 100g</dd>
              </div>
            )}
            {p.ingredientCount != null && (
              <div>
                <dt>Ingredients</dt>
                <dd>{p.ingredientCount === 1 ? "Only 1" : p.ingredientCount}</dd>
              </div>
            )}
            {p.stars !== null && (
              <div>
                <dt>You rated it</dt>
                <dd>
                  <StarsDisplay stars={p.stars} />
                </dd>
              </div>
            )}
            {p.reviewAvg != null && p.reviewCount != null && p.reviewCount > 0 && (
              <div>
                <dt>Shoppers</dt>
                <dd>
                  {p.reviewAvg.toFixed(1)} out of 5 from {p.reviewCount}
                </dd>
              </div>
            )}
          </dl>
          {why2 && (
            <p className="ds-valuewhy">
              <b>Why Value {p.value}?</b> {why2}
            </p>
          )}
        </details>

        <QuickRate productId={p.id} name={p.name} stars={p.stars} />

        <div className="ds-pcard-foot">
          {row ? (
            <div className="ds-step" role="group" aria-label={`How many ${p.name}`}>
              {row.qty > 1 ? (
                <button type="button" className="ds-step-btn" aria-label={`One fewer ${p.name}`} onClick={() => store.setQty(row.id, row.qty - 1)}>
                  <span aria-hidden="true">−</span>
                </button>
              ) : (
                <button type="button" className="ds-step-btn ds-step-btn--bin" aria-label={`Take ${p.name} off your list`} onClick={() => store.remove(row.id)}>
                  <span aria-hidden="true">−</span>
                </button>
              )}
              <span className="ds-step-qty" aria-live="polite">
                {row.qty} on list
              </span>
              <button type="button" className="ds-step-btn" aria-label={`One more ${p.name}`} onClick={() => store.setQty(row.id, row.qty + 1)}>
                <span aria-hidden="true">+</span>
              </button>
            </div>
          ) : (
            <button type="button" className="ds-btn ds-btn--primary ds-pcard-add" aria-label={`Add ${p.name} to your list`} onClick={() => store.add({ ...p, deals: dealsFor(deal) })}>
              + Add to list
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
