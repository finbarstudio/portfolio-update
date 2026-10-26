"use client";

import { useState } from "react";
import type { GroupInfo } from "@/lib/dad-shop/pricing";
import type { ListItem, Shelf } from "@/lib/dad-shop/types";
import type { ListStore } from "./listStore";
import ProductTile from "./ProductTile";

interface Props {
  shelves: Shelf[];
  now: Date;
  store: ListStore;
  mine: Map<string, ListItem>;
  groupOf: Map<string, GroupInfo>;
}

/** How many cards a shelf shows before "Show all": a 2×2 grid on a phone. */
const FIRST = 4;

/** For you: each shelf is a 2×2 grid of cards that expands. Nothing scrolls sideways. */
export default function Shelves({ shelves, now, store, mine, groupOf }: Props) {
  return (
    <div className="ds-shelves">
      {shelves.map((s) => (
        <ShelfGrid key={s.key} shelf={s} now={now} store={store} mine={mine} groupOf={groupOf} />
      ))}
    </div>
  );
}

function ShelfGrid({ shelf, now, store, mine, groupOf }: Omit<Props, "shelves"> & { shelf: Shelf }) {
  const [open, setOpen] = useState(false);
  const shown = open ? shelf.items : shelf.items.slice(0, FIRST);
  const extra = shelf.items.length - FIRST;

  return (
    <section className="ds-shelf" aria-label={shelf.title}>
      <div className="ds-shelf-head">
        <div>
          <h2 className="ds-h2 ds-shelf-title">{shelf.title}</h2>
          <p className="ds-muted ds-shelf-sub">
            {shelf.sub} · {shelf.items.length}
          </p>
        </div>
      </div>
      <ul className="ds-shelf-row">
        {shown.map((p) => (
          <ProductTile key={p.id} p={p} now={now} store={store} mine={mine} group={groupOf.get(p.id) ?? null} why={p.why} shelf />
        ))}
      </ul>
      {extra > 0 && (
        <button type="button" className="ds-btn ds-shelf-more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? "Show fewer" : `Show all ${shelf.items.length}`}
        </button>
      )}
    </section>
  );
}
