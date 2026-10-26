"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { BASE_PATH, type FindFilters, type ProductCard, type Sort } from "@/lib/dad-shop/types";
import ProductTile from "./ProductTile";

interface Props {
  filters: FindFilters;
  zones: string[];
  items: ProductCard[];
  hasMore: boolean;
  nowIso: string;
}

type ChipKey = "noSeedOil" | "highProtein" | "lowSat" | "fewIngredients" | "onOffer";

const CHIPS: { key: ChipKey; label: string }[] = [
  { key: "noSeedOil", label: "No seed oils" },
  { key: "highProtein", label: "High protein" },
  { key: "lowSat", label: "Low sat fat" },
  { key: "fewIngredients", label: "Few ingredients" },
  { key: "onOffer", label: "On offer" },
];

const SORT_LABELS: Record<Sort, string> = {
  best: "Best for you",
  protein: "Protein per £",
  price: "Price",
};

/** The URL is the state: back from a product lands on the same search. */
function queryFor(f: FindFilters): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  p.set("noSeedOil", f.noSeedOil ? "1" : "0");
  if (f.highProtein) p.set("highProtein", "1");
  if (f.lowSat) p.set("lowSat", "1");
  if (f.fewIngredients) p.set("fewIngredients", "1");
  if (f.onOffer) p.set("onOffer", "1");
  if (f.zone) p.set("zone", f.zone);
  if (f.sort !== "best") p.set("sort", f.sort);
  if (f.page > 0) p.set("page", String(f.page));
  return p.toString();
}

export default function FindView({ filters, zones, items, hasMore, nowIso }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(filters.q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = new Date(nowIso);

  function go(next: Partial<FindFilters>) {
    const f: FindFilters = { ...filters, q: text.trim(), page: 0, ...next };
    startTransition(() => {
      router.replace(`${BASE_PATH}/find?${queryFor(f)}`, { scroll: false });
    });
  }

  function toggle(key: ChipKey) {
    const next: Partial<FindFilters> = {};
    next[key] = !filters[key];
    go(next);
  }

  function onType(value: string) {
    setText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const f: FindFilters = { ...filters, q: value.trim(), page: 0 };
      startTransition(() => {
        router.replace(`${BASE_PATH}/find?${queryFor(f)}`, { scroll: false });
      });
    }, 350);
  }

  const anyFilter = filters.q || filters.zone || filters.highProtein || filters.lowSat || filters.fewIngredients || filters.onOffer;

  return (
    <div className="ds-page">
      <header className="ds-head">
        <h1 className="ds-h1">Find</h1>
      </header>

      <form
        role="search"
        className="ds-search"
        onSubmit={(e) => {
          e.preventDefault();
          if (timer.current) clearTimeout(timer.current);
          go({});
        }}
      >
        <label className="ds-label" htmlFor="ds-find-q">
          Search products
        </label>
        <input
          id="ds-find-q"
          className="ds-input"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          maxLength={120}
          placeholder="Try chicken, eggs, yoghurt"
          value={text}
          onChange={(e) => onType(e.target.value)}
        />
      </form>

      <div className="ds-chips" role="group" aria-label="Only show">
        {CHIPS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={`ds-chip${filters[c.key] ? " is-on" : ""}`}
            aria-pressed={filters[c.key]}
            onClick={() => toggle(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="ds-selects">
        <div>
          <label className="ds-label" htmlFor="ds-find-zone">
            Section
          </label>
          <select id="ds-find-zone" className="ds-select" value={filters.zone} onChange={(e) => go({ zone: e.target.value })}>
            <option value="">All sections</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="ds-label" htmlFor="ds-find-sort">
            Sort by
          </label>
          <select id="ds-find-sort" className="ds-select" value={filters.sort} onChange={(e) => go({ sort: e.target.value as Sort })}>
            {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={pending ? "ds-results is-pending" : "ds-results"} aria-busy={pending}>
        {items.length === 0 ? (
          <div className="ds-empty">
            <p className="ds-empty-title">Nothing found.</p>
            {filters.noSeedOil ? (
              <>
                <p>&ldquo;No seed oils&rdquo; is switched on, so products with seed oils, or with no ingredients listed yet, are hidden.</p>
                <button type="button" className="ds-btn ds-btn--primary" onClick={() => go({ noSeedOil: false })}>
                  Show them too
                </button>
              </>
            ) : anyFilter ? (
              <p>Try taking a filter off, or searching for something else.</p>
            ) : (
              <p>There are no products loaded yet.</p>
            )}
          </div>
        ) : (
          <>
            <ul className="ds-cards">
              {items.map((p) => (
                <ProductTile key={p.id} p={p} now={now} />
              ))}
            </ul>
            {hasMore && (
              <button type="button" className="ds-btn ds-btn--ghost ds-btn--wide" onClick={() => go({ page: filters.page + 1 })}>
                Show more
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
