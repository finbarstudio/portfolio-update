"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { shortDate } from "@/lib/dad-shop/format";
import { offerWords, tidyMoney } from "@/lib/dad-shop/pricing";
import { sortCards, betterSwap, type SortKey } from "@/lib/dad-shop/sorts";
import { BASE_PATH, type ListItem, type OfferPage } from "@/lib/dad-shop/types";
import { SortButton } from "./FindControls";
import ProductTile from "./ProductTile";
import { groupStyle } from "./ui";
import { useHideOnScroll } from "./useHideOnScroll";
import { useShopList } from "./useShopList";

/**
 * One offer and everything that shares it. His own picks sit first; the rest
 * are ranked all round, and + / − swaps them. Filters never hide anything
 * here, only the sort changes.
 */
export default function DealManager({ offer, list, nowIso }: { offer: OfferPage; list: ListItem[]; nowIso: string }) {
  const router = useRouter();
  const now = new Date(nowIso);
  const { store, snap, pricing, mine } = useShopList(list, now);
  const [sort, setSort] = useState<SortKey>("round");
  const bar = useRef<HTMLDivElement>(null);
  const hidden = useHideOnScroll(bar);

  const group = pricing.groups.find((g) => g.uid === offer.uid) ?? null;
  const have = snap.items.filter((i) => !i.ticked && i.promos.some((p) => p.uid === offer.uid)).reduce((n, i) => n + i.qty, 0);
  const size = group?.size ?? offer.qty ?? 1;
  const need = group ? group.need : size > 1 && have % size !== 0 ? size - (have % size) : 0;

  const sorted = sortCards(offer.items, sort);
  const rankOf = new Map(sorted.map((p, i) => [p.id, i + 1]));
  const picks = sorted.filter((p) => mine.has(p.id));
  const rest = sorted.filter((p) => !mine.has(p.id));
  const shown = [...picks, ...rest];
  const onListIds = new Set(mine.keys());
  const ends = shortDate(offer.endsOn);
  const title = tidyMoney(offerWords(offer.text));

  function back() {
    if (window.history.length > 1) router.back();
    else router.push(`${BASE_PATH}/find`);
  }

  return (
    <div className="ds-page ds-page--wide ds-dealpage">
      <div ref={bar} className={`ds-dealbar-wrap${hidden ? " is-hidden" : ""}`}>
        <div className="ds-dealbar" style={group ? groupStyle(group.colour) : undefined}>
          {group ? <span className="ds-gtag-l ds-dealbar-l">{group.letter}</span> : <span aria-hidden="true" />}
          <div className="ds-dealbar-main">
            <strong className="ds-dealbar-name">{title}</strong>
            <span className="ds-muted">
              {offer.items.length} products in this deal{ends ? ` · ends ${ends}` : ""}
            </span>
            <span className={`ds-dealbar-status${have > 0 && need === 0 && size > 1 ? " is-ok" : ""}`}>
              {have === 0
                ? "None on your list yet"
                : need > 0
                  ? `${have} on your list · add ${need} more to unlock`
                  : size > 1
                    ? `${have} on your list · ✓ unlocked`
                    : `${have} on your list`}
            </span>
          </div>
          <button type="button" className="ds-btn ds-btn--ghost ds-dealbar-back" onClick={back}>
            ✕ Back
          </button>
        </div>
        <div className="ds-ctl ds-ctl--deal">
          <SortButton value={sort} allRound onChange={(s) => setSort(s)} />
        </div>
      </div>

      <p className="ds-muted ds-note-small">
        Everything in this deal shows; filters don&apos;t apply here. {sort === "round" ? "Ranked best to worst all round (suits you, value, least processed)." : "Sorted your way."}
        {picks.length > 0 ? " Your picks are first." : ""}
      </p>

      <ul className="ds-cards ds-cards--grid">
        {shown.map((p) => {
          const swap = mine.has(p.id)
            ? betterSwap(
                p,
                offer.items.filter((a) => (a.category ?? a.department) === (p.category ?? p.department)),
                onListIds,
              )
            : null;
          const g = pricing.groups.find((x) => x.uid === offer.uid) ?? null;
          return (
            <ProductTile
              key={p.id}
              p={p}
              now={now}
              store={store}
              mine={mine}
              group={mine.has(p.id) ? g : null}
              rank={sort === "round" ? `#${rankOf.get(p.id)} all round` : `#${rankOf.get(p.id)}`}
              swap={swap}
            />
          );
        })}
      </ul>
    </div>
  );
}
