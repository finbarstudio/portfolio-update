"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { priceList, type ListPricing, type PricedRow } from "@/lib/dad-shop/pricing";
import type { ListItem } from "@/lib/dad-shop/types";
import { getListStore, type ListSnapshot, type ListStore } from "./listStore";

export function pricedRows(items: ListItem[]): PricedRow[] {
  return items
    .filter((i) => i.price != null && i.qty > 0)
    .map((i) => ({
      id: i.id,
      qty: i.qty,
      item: {
        price: i.price ?? 0,
        wasPrice: i.wasPrice ?? null,
        offerPrice: i.offerPrice ?? null,
        nectarPrice: i.nectarPrice,
        promos: i.promos,
        deals: i.deals,
      },
    }));
}

export interface ShopListState {
  store: ListStore;
  snap: ListSnapshot;
  /** The whole list priced as the shelf would charge it (ticked items included). */
  pricing: ListPricing;
  /** Products on the list that are not ticked yet, by product id. */
  mine: Map<string, ListItem>;
}

/**
 * The shared shopping list, on any page. Every page that shows an add button or
 * a count reads the same store, so the list never disagrees with itself.
 */
export function useShopList(initial: ListItem[], now: Date, loadFailed = false): ShopListState {
  const [store] = useState(() => getListStore(initial));
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  useEffect(() => store.acquire(loadFailed), [store, loadFailed]);
  // If the server could not read the list, what this phone saved stays on screen.
  useEffect(() => {
    if (!loadFailed) store.hydrate(initial);
  }, [store, initial, loadFailed]);

  const pricing = priceList(pricedRows(snap.items), now);
  const mine = new Map<string, ListItem>();
  for (const i of snap.items) if (i.productId && !i.ticked) mine.set(i.productId, i);
  return { store, snap, pricing, mine };
}
