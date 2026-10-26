"use client";

import { useState } from "react";
import type { GroupInfo } from "@/lib/dad-shop/pricing";
import type { ListItem, Shelf } from "@/lib/dad-shop/types";
import type { ListStore } from "./listStore";
import MealDealCard from "./MealDealCard";
import ProductTile from "./ProductTile";

interface Props {
  shelves: Shelf[];
  now: Date;
  store: ListStore;
  mine: Map<string, ListItem>;
  groupOf: Map<string, GroupInfo>;
  /** How many of a meal deal's products are on his list. */
  dealOnList: (dealId: string) => number;
}

/**
 * For you: each shelf is the same 3-across (2 on a phone) grid as everywhere
 * else, showing ONE row (3 cards, or 2 on a phone) until "Show all". A page of several shelves stays short.
 * Nothing scrolls sideways. The rows are cut with CSS so no script has to know the screen width.
 */
export default function Shelves({ shelves, now, store, mine, groupOf, dealOnList }: Props) {
  return (
    <div className="ds-shelves">
      {shelves.map((s) => (
        <ShelfGrid key={s.key} shelf={s} now={now} store={store} mine={mine} groupOf={groupOf} dealOnList={dealOnList} />
      ))}
    </div>
  );
}

/** One row before "Show all": 3 cards on a desktop, 2 on a phone (the CSS cuts it, so it can never leave half a row). */
const ROW_WIDE = 3;
const ROW_PHONE = 2;

function ShelfGrid({ shelf, now, store, mine, groupOf, dealOnList }: Omit<Props, "shelves"> & { shelf: Shelf }) {
  const [open, setOpen] = useState(false);
  const n = shelf.deals ? shelf.deals.length : shelf.items.length;
  const more = n > ROW_PHONE;
  // With 3 cards the desktop row already shows them all, so the button is a phone-only thing.
  const phoneOnly = n <= ROW_WIDE;

  return (
    <section className="ds-shelf" aria-label={shelf.title}>
      <div className="ds-shelf-head">
        <div>
          <h2 className="ds-h2 ds-shelf-title">{shelf.title}</h2>
          <p className="ds-muted ds-shelf-sub">
            {shelf.sub} · {n}
          </p>
        </div>
      </div>
      {shelf.deals ? (
        <ul className="ds-dealstrip">
          {shelf.deals.map((d) => (
            <MealDealCard key={d.id} deal={d} onList={dealOnList(d.id)} />
          ))}
        </ul>
      ) : (
        <ul className={`ds-cards ds-cards--grid ds-shelf-row${open ? " is-open" : ""}`}>
          {shelf.items.map((p) => (
            <ProductTile key={p.id} p={p} now={now} store={store} mine={mine} group={groupOf.get(p.id) ?? null} why={p.why} />
          ))}
        </ul>
      )}
      {more && !shelf.deals && (
        <button type="button" className={`ds-btn ds-shelf-more${phoneOnly ? " ds-shelf-more--phone" : ""}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Show fewer" : `Show all ${n}`}
        </button>
      )}
    </section>
  );
}
