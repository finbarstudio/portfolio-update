"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import CardWhy, { type WhyKind } from "./CardWhy";
import QuickRate from "./QuickRate";
import { gbp, satTone, shortName } from "@/lib/dad-shop/format";
import { priceView, tidyMoney, type GroupInfo } from "@/lib/dad-shop/pricing";
import { offerPill } from "@/lib/dad-shop/similar";
import { BASE_PATH, type DealLink, type ListItem, type ProductCard } from "@/lib/dad-shop/types";
import type { ListStore } from "./listStore";
import { GroupTag, ProductImage, StoreChip } from "./ui";

interface Props {
  p: ProductCard;
  now: Date;
  store: ListStore;
  /** What is on the list now, by product id. */
  mine: Map<string, ListItem>;
  /** The lettered offer group this product is in on the list, if any. */
  group?: Pick<GroupInfo, "letter" | "colour" | "label" | "uid" | "kind"> | null;
  /** Why it is on a For you shelf. One short muted line, and in the breakdown. */
  why?: string;
  /** "#3 best overall" on the picture. */
  rank?: string;
  /** A clearly better product from the same deal, with a Swap button. */
  swap?: ProductCard | null;
  /** The meal deal this card is being shown in, so the list can price the bundle. */
  deal?: DealLink | null;
  /** On a meal deal's own page the "meal deal" pill would point at itself. */
  inMealPage?: boolean;
  /** The product whose page this is, pinned first among its similar products. */
  isMe?: boolean;
}

/** Only the deal this card is shown in is known here; the server fills in the rest on the next read of the list. */
function dealsFor(deal: DealLink | null | undefined): DealLink[] {
  return deal ? [deal] : [];
}

const band = (n: number | null): string => (n == null ? "n" : n >= 7 ? "g" : n >= 5 ? "a" : "r");

/**
 * THE product card, the same everywhere (Find, Multi-buys, For you, deal pages,
 * similar products). Slim: picture, two-line name, one price row, one offer
 * pill, three key facts, Fit and Value badges (tap one for the working), and a
 * bottom row of stars and Add. Built to work at about 170px wide on a phone.
 */
export default function ProductTile({ p, now, store, mine, group, why, rank, swap, deal, inMealPage = false, isMe = false }: Props) {
  const [open, setOpen] = useState<WhyKind | null>(null);
  const panelId = useId();
  const card = useRef<HTMLLIElement>(null);

  // On a phone the open card takes the whole row; keep it in view when it does.
  useEffect(() => {
    if (!open) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.current?.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }, [open]);
  const row = mine.get(p.id);
  const pv = priceView(p, now);
  const sat = satTone(p.sat);
  const paid = p.paidBefore;
  const nowEach = pv.nowPence / 100;
  const paidMove = paid ? Math.round((nowEach - paid.each) * 100) : 0;
  const href = `${BASE_PATH}/p/${encodeURIComponent(p.id)}`;
  const fit = p.fit != null ? Math.round(p.fit) : null;
  const val = p.value != null ? Math.round(p.value) : null;

  // The one pill: a multi-buy, else a meal deal, else the size of the cut.
  const pill = offerPill(p, now, inMealPage);

  // The key facts, each coloured, most important first: how plain it is (ingredients, ultra-processing
  // markers), seed oils, then protein. Saturated fat only shows when it is not low; the breakdown has the rest.
  const facts: { key: string; tone: string; text: string; label: string; why?: boolean }[] = [];
  const markers = p.upfMarkers;
  if (p.upfCount == null && p.ingredientCount == null && !p.isBasic) {
    facts.push({ key: "ingr", tone: "n", text: "Ingredients ?", label: "Ingredients not read yet", why: true });
  } else {
    if (p.isBasic || p.ingredientCount === 1) facts.push({ key: "ingr", tone: "g", text: "1 ingr", label: "Single-ingredient food", why: true });
    else if (p.ingredientCount != null) {
      facts.push({
        key: "ingr",
        tone: p.ingredientCount <= 5 ? "g" : p.ingredientCount <= 10 ? "a" : "r",
        text: `${p.ingredientCount} ingr`,
        label: `${p.ingredientCount} ingredients`,
        why: true,
      });
    }
    if (p.upfCount != null) {
      facts.push(
        p.upfCount === 0
          ? { key: "upf", tone: "g", text: "No UPF", label: "No ultra-processing markers", why: true }
          : {
              key: "upf",
              tone: p.upfCount >= 3 ? "r" : "a",
              text: `${p.upfCount} UPF`,
              label: `${p.upfCount} ultra-processing ${p.upfCount === 1 ? "marker" : "markers"}${markers.length > 0 ? `: ${markers.join(", ")}` : ""}`,
              why: true,
            },
      );
    }
  }
  if (p.seedOil === "none") facts.push({ key: "oil", tone: "g", text: "No seed oil", label: "No seed oils" });
  else if (p.seedOil === "yes") facts.push({ key: "oil", tone: "r", text: "Seed oil", label: "Contains seed oils" });
  else if (p.seedOil === "likely") facts.push({ key: "oil", tone: "a", text: "Maybe seed oil", label: "May contain a seed oil" });
  if (p.protein != null) {
    const g = p.protein >= 10 ? Math.round(p.protein) : +p.protein.toFixed(1);
    facts.push({ key: "protein", tone: p.protein >= 15 ? "g" : p.protein >= 6 ? "a" : "n", text: `${g}g protein`, label: `${g} grams of protein in every 100 grams` });
  }
  if (p.sat != null && sat && sat !== "g") {
    facts.push({ key: "sat", tone: sat, text: `Sat ${+p.sat.toFixed(1)}g`, label: `${+p.sat.toFixed(1)} grams of saturated fat in every 100 grams` });
  }

  // One short muted line, most important first.
  let note: { text: string; tone: string } | null = null;
  if (why) note = { text: `✦ ${why}`, tone: "why" };
  else if (paid) {
    note = {
      text: `Paid ${gbp(paid.each)} before${paidMove < 0 ? ", now cheaper" : paidMove > 0 ? ", now dearer" : ""}`,
      tone: paidMove < 0 ? "g" : paidMove > 0 ? "r" : "n",
    };
  } else if (p.valueBasis === "protein" && p.per100Protein != null) note = { text: `${gbp(p.per100Protein)} per 100g protein`, tone: "n" };

  function toggle(kind: WhyKind) {
    setOpen((cur) => (cur === kind ? null : kind));
  }

  return (
    <li ref={card} className={`ds-pcard${p.notAtStore || p.storeStatus === "no" ? " is-muted" : ""}${row ? " is-added" : ""}${open ? " is-open" : ""}${isMe ? " is-me" : ""}`}>
      <div className="ds-pcard-imgwrap">
        <Link href={href} className="ds-pcard-imglink" aria-label={`${p.name}: open`}>
          <ProductImage src={p.imageUrl} className="ds-img--card" />
        </Link>
        {(rank || isMe) && <span className={`ds-rank${isMe ? " ds-rank--me" : ""}`}>{isMe ? `This one${rank ? ` · ${rank.replace(" best overall", "")}` : ""}` : rank}</span>}
        {p.isNew && <span className="ds-newtag">New</span>}
        {pill &&
          (pill.href ? (
            <Link href={pill.href} className={`ds-pill ds-pill--${pill.tone}`}>
              {pill.text} <span aria-hidden="true">›</span>
            </Link>
          ) : (
            <span className={`ds-pill ds-pill--${pill.tone}`}>{pill.text}</span>
          ))}
      </div>

      <div className="ds-pcard-body">
        <Link href={href} className="ds-pcard-name" title={p.name}>
          {shortName(p.name)}
        </Link>

        <div className="ds-pcard-price">
          <strong className="ds-pcard-now">{gbp(nowEach)}</strong>
          {pv.cut && (
            <s className="ds-pcard-was">
              <span className="ds-sr">Usually </span>
              {gbp(pv.fullPence / 100)}
            </s>
          )}
          {pv.nectar && <span className="ds-pcard-nectar">Nectar</span>}
        </div>

        <StoreChip status={p.storeStatus} reason={p.storeReason} id={`${panelId}-store`} />

        {group && <GroupTag group={group} label={group.kind === "mealdeal" ? group.label : tidyMoney(group.label)} />}

        {facts.length > 0 && (
          <ul className="ds-facts3" aria-label="Key facts">
            {facts.map((f) => (
              <li key={f.key}>
                {f.why ? (
                  <button type="button" className={`ds-fact ds-fact--${f.tone}`} aria-label={`${f.label}. Tap to see how Fit is worked out.`} onClick={() => setOpen("fit")}>
                    {f.text}
                  </button>
                ) : (
                  <span className={`ds-fact ds-fact--${f.tone}`} aria-label={f.label}>
                    {f.text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {note && <p className={`ds-pcard-note ds-pcard-note--${note.tone}`}>{note.text}</p>}

        <div className="ds-scores" role="group" aria-label="Scores. Tap one to see how it is worked out.">
          <button
            type="button"
            className={`ds-sbtn ds-sbtn--${band(fit)}`}
            aria-expanded={open === "fit"}
            aria-controls={panelId}
            onClick={() => toggle("fit")}
          >
            <span>Fit {fit ?? "?"}</span>
            {p.stars != null ? <i aria-label="from your rating">✓</i> : p.learned ? <i aria-label="estimated from your taste">≈</i> : null}
            <Caret open={open === "fit"} />
          </button>
          <button
            type="button"
            className={`ds-sbtn ds-sbtn--${band(val)}`}
            aria-expanded={open === "value"}
            aria-controls={panelId}
            onClick={() => toggle("value")}
          >
            <span>Value {val ?? "?"}</span>
            <Caret open={open === "value"} />
          </button>
        </div>

        {open && <CardWhy p={p} kind={open} id={panelId} rank={rank} why={why} />}

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

        <div className="ds-pcard-foot">
          <QuickRate productId={p.id} name={p.name} stars={p.stars} />
          {row ? (
            <div className="ds-step ds-step--card" role="group" aria-label={`How many ${p.name}`}>
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
                {row.qty}
                <span className="ds-sr"> on list</span>
              </span>
              <button type="button" className="ds-step-btn" aria-label={`One more ${p.name}`} onClick={() => store.setQty(row.id, row.qty + 1)}>
                <span aria-hidden="true">+</span>
              </button>
            </div>
          ) : (
            <button type="button" className="ds-btn ds-btn--primary ds-pcard-add" aria-label={`Add ${p.name} to your list`} onClick={() => store.add({ ...p, deals: dealsFor(deal) })}>
              + Add
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg className={`ds-sbtn-caret${open ? " is-open" : ""}`} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
