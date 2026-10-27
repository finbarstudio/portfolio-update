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

export type ToggleKey =
  | "good"
  | "frozen"
  | "rated"
  | "onList"
  | "fewIngredients"
  | "noSeedOil"
  | "hideSat"
  | "hideOwn"
  | "hideSingle"
  | "tasteDiff"
  | "onOffer"
  | "highProtein"
  | "hideFolic"
  | "hideAvoided"
  | "atStore"
  | "atStoreSure";

interface Toggle {
  key: ToggleKey;
  /** On the chip. */
  label: string;
  /** In the Filters button's list of what is on. */
  name: string;
  hint?: string;
}

const ONLY: Toggle[] = [
  { key: "onOffer", label: "On offer", name: "Only on offer", hint: "A price cut or a multi-buy" },
  { key: "highProtein", label: "High protein", name: "High protein", hint: "15g or more protein in 100g, or 8g or more for every 100 calories" },
  { key: "atStore", label: "At Chislehurst", name: "Only at Chislehurst", hint: "Hides what isn't stocked there. Anything we can't tell stays." },
  { key: "atStoreSure", label: "Confirmed at Chislehurst", name: "Only confirmed at Chislehurst", hint: "Just what the store's list shows, or you found" },
  { key: "good", label: "Good deals", name: "Good deals", hint: "25% off or more, and good value" },
  { key: "frozen", label: "Frozen", name: "Frozen" },
  { key: "tasteDiff", label: "Taste the Difference", name: "Taste the Difference", hint: "Sainsbury's premium own range" },
  { key: "rated", label: "Rated by me", name: "Rated by me" },
  { key: "onList", label: "On my list", name: "On my list" },
  { key: "fewIngredients", label: "≤5 ingredients", name: "5 ingredients or fewer", hint: "Products whose ingredients aren't read yet are left out" },
  { key: "noSeedOil", label: "No seed oils", name: "No seed oils", hint: "Hides anything with seed oils, or no ingredients listed yet" },
];
const HIDE: Toggle[] = [
  { key: "hideSat", label: "High sat fat", name: "Hide high sat fat", hint: "Whole foods such as steak and full-fat Greek yoghurt stay" },
  { key: "hideFolic", label: "Folic acid", name: "Hide folic acid", hint: "Hides anything with folic acid in the ingredients, such as most bread" },
  { key: "hideAvoided", label: "Foods I don't eat", name: "Hide foods I don't eat", hint: "The foods you picked in Settings, such as pork" },
  { key: "hideSingle", label: "Single-ingredient foods", name: "Hide single-ingredient foods", hint: "Plain meat, fish, eggs, fruit, veg, rice, tofu…" },
  { key: "hideOwn", label: "Sainsbury's own brand", name: "Hide Sainsbury's own brand" },
];

/** On by default. A typed search ignores them, so a brand he likes is always found. */
const DEFAULT_ON: readonly ToggleKey[] = ["noSeedOil", "hideSat", "hideAvoided"];

export const UPF_CHOICES: { value: FindFilters["maxUpf"]; label: string; name: string; hint: string }[] = [
  { value: null, label: "Any", name: "", hint: "Any amount of processing" },
  { value: 0, label: "None", name: "no ultra-processing markers", hint: "No ultra-processing markers in the ingredients. Products whose ingredients aren't read yet are left out." },
  { value: 1, label: "≤ 1", name: "at most 1 ultra-processing marker", hint: "At most one marker, such as a flavouring. Products whose ingredients aren't read yet are left out." },
  { value: 2, label: "≤ 2", name: "at most 2 ultra-processing markers", hint: "At most two markers. Products whose ingredients aren't read yet are left out." },
];

/** What is switched on and counts: while searching, the three default filters are paused. */
function activeFilters(f: FindFilters, searching: boolean): string[] {
  const on = [...ONLY, ...HIDE].filter((t) => f[t.key] && !(searching && DEFAULT_ON.includes(t.key))).map((t) => t.name);
  const upf = UPF_CHOICES.find((u) => u.value === f.maxUpf && u.value !== null);
  return upf ? [...on, `Ultra-processing: ${upf.name}`] : on;
}

export function countFilters(f: FindFilters, searching = false): number {
  return activeFilters(f, searching).length;
}

/** Filters: wrapping pill toggles under "Only show" and "Hide", a segmented control for ultra-processing markers, a count badge, and Reset. */
export function FiltersButton({
  filters,
  ignored,
  searching = false,
  onToggle,
  onUpf,
  onReset,
}: {
  filters: FindFilters;
  /** Offers, Multi-buys and Meal deals never hide anything. */
  ignored: boolean;
  /** A search is typed: the default filters are paused. */
  searching?: boolean;
  onToggle: (key: ToggleKey) => void;
  onUpf: (max: FindFilters["maxUpf"]) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const active = ignored ? [] : activeFilters(filters, searching);
  const n = active.length;
  const paused = searching && !ignored && DEFAULT_ON.some((k) => filters[k]);

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) anchor.current?.focus();
  }

  const chip = (t: Toggle) => (
    <button
      key={t.key}
      type="button"
      className={`ds-fchip${searching && DEFAULT_ON.includes(t.key) ? " is-paused" : ""}`}
      aria-pressed={filters[t.key]}
      aria-disabled={ignored}
      title={t.hint}
      onClick={() => {
        if (!ignored) onToggle(t.key);
      }}
    >
      {t.label}
    </button>
  );

  const summary = n > 0 ? `${n} on: ${active.join(", ")}` : "none on";

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className={`ds-pbtn${open ? " is-open" : ""}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="ds-filt-pop"
        aria-label={`Filters, ${summary}`}
        title={n > 0 ? `On: ${active.join(", ")}` : "No filters on"}
        onClick={() => setOpen(!open)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M2 4h12M4.5 8h7M7 12h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <b>Filters</b>
        {n > 0 && (
          <span className="ds-badge" aria-hidden="true">
            {n}
          </span>
        )}
        <Caret />
      </button>
      <Popover open={open} anchor={anchor} onClose={close} width={380} id="ds-filt-pop" label="Filters" autoFocus=".ds-fchip">
        <div className="ds-fpanel">
          {ignored && (
            <p className="ds-fnote">Here everything shows. Filters don&apos;t hide anything in Offers, Multi-buys and Meal deals: only the sort changes.</p>
          )}
          {paused && <p className="ds-fnote">Search shows everything the default filters hide. They apply again when you clear the search.</p>}
          <p className="ds-fh">Only show</p>
          <div className="ds-fchips">{ONLY.map(chip)}</div>
          <p className="ds-fh">Ultra-processing</p>
          <div className="ds-fseg" role="group" aria-label="Ultra-processing markers" aria-disabled={ignored}>
            {UPF_CHOICES.map((u) => (
              <button
                key={String(u.value)}
                type="button"
                className="ds-fsegb"
                aria-pressed={filters.maxUpf === u.value}
                title={u.hint}
                onClick={() => {
                  if (!ignored) onUpf(u.value);
                }}
              >
                {u.label}
              </button>
            ))}
          </div>
          <p className="ds-fh">Hide</p>
          <div className="ds-fchips">{HIDE.map(chip)}</div>
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
