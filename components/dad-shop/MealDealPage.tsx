"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { gbp, shortDate } from "@/lib/dad-shop/format";
import { sortCards, betterSwap, type SortKey } from "@/lib/dad-shop/sorts";
import { BASE_PATH, type DealLink, type DealPage, type ListItem, type ProductCard } from "@/lib/dad-shop/types";
import { SortButton } from "./FindControls";
import ProductTile from "./ProductTile";
import { groupStyle } from "./ui";
import { useShopList } from "./useShopList";

type Item = ProductCard & { listId: number };

/**
 * A dinner meal deal laid out to build: one section per part ("Main: 1 of 1
 * picked"), a bar of part chips that jump to each section, and + adds to the
 * list. Nothing is hidden here; only the sort changes.
 */
export default function MealDealPage({ page, list, nowIso }: { page: DealPage; list: ListItem[]; nowIso: string }) {
  const router = useRouter();
  const now = new Date(nowIso);
  const { deal, items } = page;
  const { store, snap, pricing, mine } = useShopList(list, now);
  const [sort, setSort] = useState<SortKey>("best");

  const partOf = new Map<string, number>();
  for (const i of items) if (!partOf.has(i.id)) partOf.set(i.id, i.listId);

  // How many he has picked for each part: from the list, using the part the server knew about, else the first part the product is in.
  const picked = new Map<number, number>();
  for (const row of snap.items) {
    if (row.ticked || !row.productId) continue;
    const listId = row.deals?.find((d) => d.id === deal.id)?.listId ?? partOf.get(row.productId);
    if (listId != null) picked.set(listId, (picked.get(listId) ?? 0) + row.qty);
  }
  const wanted = deal.parts.reduce((n, p) => n + p.qty, 0);
  const have = deal.parts.reduce((n, p) => n + Math.min(picked.get(p.listId) ?? 0, p.qty), 0);
  const group = pricing.groups.find((g) => g.uid === deal.id) ?? null;
  const complete = group ? group.unlocked : false;
  const ends = shortDate(deal.endsOn);

  const linkFor = (listId: number): DealLink => ({ id: deal.id, title: deal.title, price: deal.price, listId, parts: deal.parts });
  const sections = deal.parts.map((part) => ({ part, items: sortCards(items.filter((i) => i.listId === part.listId), sort) }));
  const known = new Set(deal.parts.map((p) => p.listId));
  const other = sortCards(items.filter((i) => !known.has(i.listId)), sort);
  const onListIds = new Set(mine.keys());

  function back() {
    if (window.history.length > 1) router.back();
    else router.push(`${BASE_PATH}/find?view=deals`);
  }

  function jump(listId: number) {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(`part-${listId}`)?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  }

  const card = (p: Item, listId: number) => {
    const pool = items.filter((a) => a.listId === listId);
    const swap = mine.has(p.id) ? betterSwap(p, pool, onListIds) : null;
    return (
      <ProductTile
        key={`${listId}-${p.id}`}
        p={p}
        now={now}
        store={store}
        mine={mine}
        group={mine.has(p.id) ? group : null}
        deal={linkFor(listId)}
        inMealPage
        swap={swap}
      />
    );
  };

  return (
    <div className="ds-page ds-page--wide ds-dealpage">
      <div className="ds-dealbar-wrap">
        <div className="ds-dealbar" style={group ? groupStyle(group.colour) : undefined}>
          {group ? <span className="ds-gtag-l ds-dealbar-l">{group.letter}</span> : <span aria-hidden="true" />}
          <div className="ds-dealbar-main">
            <strong className="ds-dealbar-name">{deal.title}</strong>
            <span className="ds-muted">
              <b>{gbp(deal.price)}</b> for {deal.parts.map((p) => `${p.qty} ${p.label}`).join(" + ")}
              {deal.typical != null && (
                <>
                  {" "}
                  <s>≈{gbp(deal.typical)}</s>
                </>
              )}
              {ends ? ` · ends ${ends}` : ""}
            </span>
            <span className={`ds-dealbar-status${complete ? " is-ok" : ""}`}>
              {complete
                ? `✓ Complete: ${gbp((group?.total ?? 0) / 100)} for the lot${group && group.saving > 0 ? `, you save ${gbp(group.saving / 100)}` : ""}`
                : `${have} of ${wanted} picked`}
            </span>
          </div>
          <button type="button" className="ds-btn ds-btn--ghost ds-dealbar-back" onClick={back}>
            ✕ Back
          </button>
        </div>
        <div className="ds-pchips" role="group" aria-label="Jump to a part of the deal">
          {deal.parts.map((p) => {
            const n = Math.min(picked.get(p.listId) ?? 0, p.qty);
            const done = n >= p.qty;
            return (
              <button key={p.listId} type="button" className={`ds-pchip${done ? " is-ok" : n > 0 ? " is-part" : ""}`} onClick={() => jump(p.listId)}>
                {done ? "✓ " : ""}
                {p.label} <b>{n}/{p.qty}</b>
              </button>
            );
          })}
          <SortButton value={sort} onChange={(s) => setSort(s)} />
        </div>
      </div>

      <p className="ds-muted ds-note-small">Nothing is hidden here; only the sort changes. Tap + to put one on your list.</p>

      {sections.map(({ part, items: list2 }) => {
        const n = picked.get(part.listId) ?? 0;
        const done = n >= part.qty;
        return (
          <section key={part.listId} aria-labelledby={`part-${part.listId}`} className="ds-part">
            <h2 id={`part-${part.listId}`} className="ds-h2 ds-part-h">
              {part.label}{" "}
              <span className={done ? "ds-part-s is-ok" : "ds-part-s"}>
                {done ? "✓ " : ""}
                {Math.min(n, part.qty)} of {part.qty} picked
              </span>
            </h2>
            {list2.length === 0 ? (
              <p className="ds-muted ds-part-none">None in stock online right now.</p>
            ) : (
              <ul className="ds-cards ds-cards--grid">{list2.map((p) => card(p, part.listId))}</ul>
            )}
          </section>
        );
      })}

      {other.length > 0 && (
        <section aria-label="Also in this deal" className="ds-part">
          <h2 className="ds-h2 ds-part-h">
            Also in this deal <span className="ds-part-s">part not known</span>
          </h2>
          <ul className="ds-cards ds-cards--grid">{other.map((p) => card(p, p.listId))}</ul>
        </section>
      )}
    </div>
  );
}
