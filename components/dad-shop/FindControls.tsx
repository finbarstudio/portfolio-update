"use client";

import { useRef, useState } from "react";
import { SORTS, SORT_INFO, type FindFilters, type Sort } from "@/lib/dad-shop/types";
import Popover from "./Popover";
import { Caret } from "./ui";

/** Sort: a popover of choices, each with a one-line reason under its name. */
export function SortButton({ value, onChange }: { value: Sort; onChange: (next: Sort) => void }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const items: { key: Sort; label: string; sub: string }[] = SORTS.map((s) => ({ key: s, label: SORT_INFO[s].label, sub: SORT_INFO[s].sub }));
  const current = items.find((i) => i.key === value) ?? items[0];

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) anchor.current?.focus();
  }

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className={`ds-pbtn${open ? " is-open" : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="ds-sort-pop"
        onClick={() => setOpen(!open)}
      >
        <span className="ds-pbtn-k">Sort</span>
        <b>{current.label}</b>
        <Caret />
      </button>
      <Popover open={open} anchor={anchor} onClose={close} width={340} id="ds-sort-pop" label="Sort by" role="menu" autoFocus='[aria-checked="true"]'>
        <div className="ds-menu">
          {items.map((i) => (
            <button
              key={i.key}
              type="button"
              role="menuitemradio"
              aria-checked={i.key === value}
              className="ds-menu-row"
              onClick={() => {
                onChange(i.key);
                close(true);
              }}
              onKeyDown={(e) => {
                if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                e.preventDefault();
                const rows = [...e.currentTarget.parentElement!.querySelectorAll<HTMLButtonElement>("button")];
                const at = rows.indexOf(e.currentTarget);
                rows[(at + (e.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length].focus();
              }}
            >
              <b>{i.label}</b>
              <small>{i.sub}</small>
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

export type ToggleKey = "good" | "frozen" | "rated" | "onList" | "fewIngredients" | "noSeedOil" | "hideSat" | "hideOwn" | "hideSingle" | "tasteDiff" | "onOffer";

const ONLY: { key: ToggleKey; label: string; hint?: string }[] = [
  { key: "onOffer", label: "Only on offer", hint: "A price cut or a multi-buy" },
  { key: "good", label: "Good deals", hint: "25% off or more, and good value" },
  { key: "frozen", label: "Frozen" },
  { key: "rated", label: "Rated by me" },
  { key: "onList", label: "On my list" },
  { key: "fewIngredients", label: "5 ingredients or fewer" },
  { key: "tasteDiff", label: "Taste the Difference", hint: "Sainsbury's premium own range" },
  { key: "noSeedOil", label: "No seed oils", hint: "Hides anything with seed oils, or no ingredients listed yet" },
];
const HIDE: { key: ToggleKey; label: string; hint?: string }[] = [
  { key: "hideSat", label: "Hide high sat fat" },
  { key: "hideOwn", label: "Hide Sainsbury's own brand" },
  { key: "hideSingle", label: "Hide single-ingredient foods", hint: "Hides anything that is just one ingredient: plain meat, fish, eggs, fruit, veg, rice, tofu…" },
];

export function countFilters(f: FindFilters): number {
  return [...ONLY, ...HIDE].filter((t) => f[t.key]).length;
}

/** Filters: iOS-style switches under "Only show" and "Hide", a count badge, and Reset. */
export function FiltersButton({
  filters,
  ignored,
  onToggle,
  onReset,
}: {
  filters: FindFilters;
  /** Offers, Multi-buys and Meal deals never hide anything. */
  ignored: boolean;
  onToggle: (key: ToggleKey) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const n = ignored ? 0 : countFilters(filters);

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) anchor.current?.focus();
  }

  const row = (t: { key: ToggleKey; label: string; hint?: string }) => (
    <button
      key={t.key}
      type="button"
      className="ds-frow"
      aria-pressed={filters[t.key]}
      aria-disabled={ignored}
      onClick={() => {
        if (!ignored) onToggle(t.key);
      }}
    >
      <span>
        {t.label}
        {t.hint && <small>{t.hint}</small>}
      </span>
      <span className="ds-switch" aria-hidden="true" />
    </button>
  );

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className={`ds-pbtn${open ? " is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ds-filt-pop"
        onClick={() => setOpen(!open)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <b>Filters</b>
        {n > 0 && (
          <span className="ds-badge" aria-label={`${n} on`}>
            {n}
          </span>
        )}
        <Caret />
      </button>
      <Popover open={open} anchor={anchor} onClose={close} width={340} id="ds-filt-pop" label="Filters" autoFocus=".ds-frow">
        <div className="ds-fpanel">
          {ignored && (
            <p className="ds-fnote">Here everything shows. Filters don&apos;t hide anything in Offers, Multi-buys and Meal deals: only the sort changes.</p>
          )}
          <p className="ds-fh">Only show</p>
          {ONLY.map(row)}
          <p className="ds-fh">Hide</p>
          {HIDE.map(row)}
          <div className="ds-ffoot">
            <button type="button" className="ds-linkbtn" onClick={onReset}>
              Reset to default
            </button>
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--small" onClick={() => close(true)}>
              Done
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
}
