"use client";

import { useRef, useState, type ReactNode } from "react";
import { COLLECTIONS, ZONE_ORDER, type Facets } from "@/lib/dad-shop/types";
import Popover from "./Popover";
import { Caret } from "./ui";

export interface CatSel {
  coll: string;
  zone: string;
  dept: string;
  cat: string;
}

export const NO_CAT: CatSel = { coll: "", zone: "", dept: "", cat: "" };

interface Props {
  facets: Facets;
  sel: CatSel;
  onPick: (next: CatSel) => void;
}

type Shown = { kind: "coll"; key: string } | { kind: "zone"; zone: string } | null;

interface Opt {
  id: string;
  label: ReactNode;
  text: string;
  n: number;
  selected: boolean;
  pick: CatSel;
  /** Left column rows that open a right column. */
  show?: Shown;
}

const collLabel = (key: string): string => COLLECTIONS.find((c) => c.key === key)?.label ?? key;
const collDesc = (key: string): string => COLLECTIONS.find((c) => c.key === key)?.desc ?? "";

const zoneRank = (z: string): number => {
  const at = (ZONE_ORDER as readonly string[]).indexOf(z);
  return at === -1 ? 500 : at;
};

/** "Meat & fish › Beef › Mince": where he is, as one line. */
export function crumbs(sel: CatSel): string[] {
  const out: string[] = [];
  if (sel.coll) out.push(collLabel(sel.coll));
  else if (sel.zone) out.push(sel.zone);
  if (sel.dept) out.push(sel.dept);
  if (sel.cat && sel.cat !== sel.dept) out.push(sel.cat);
  return out;
}

/** Ids can't hold spaces or ampersands (aria-activedescendant reads them as a list). */
const slug = (s: string): string => s.replace(/[^a-z0-9]+/gi, "_");

const isSel = (a: CatSel, b: CatSel): boolean => a.coll === b.coll && a.zone === b.zone && a.dept === b.dept && a.cat === b.cat;

/** Category: a button with a breadcrumb that opens a two-column menu, with type-to-find across every level. */
export default function CategoryMenu({ facets, sel, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const parts = crumbs(sel);

  function close(refocus: boolean) {
    setOpen(false);
    if (refocus) anchor.current?.focus();
  }

  return (
    <>
      <button
        ref={anchor}
        type="button"
        className={`ds-pbtn ds-pbtn--cat${parts.length > 0 ? " is-on" : ""}${open ? " is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="ds-cat-pop"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="ds-pbtn-k">Category</span>
        <b className="ds-crumbs">
          {parts.length === 0
            ? "All categories"
            : parts.map((c, i) => (
                <span key={`${c}-${i}`}>
                  {i > 0 && <span className="ds-crumb-sep"> › </span>}
                  {c}
                </span>
              ))}
        </b>
        <Caret />
      </button>
      <Popover open={open} anchor={anchor} onClose={close} width={640} id="ds-cat-pop" label="Choose a category" role="dialog" className="ds-catpop">
        <Panel
          facets={facets}
          sel={sel}
          onPick={(next) => {
            onPick(next);
            close(true);
          }}
        />
      </Popover>
    </>
  );
}

function Panel({ facets, sel, onPick }: Props) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<Shown>(
    sel.coll ? { kind: "coll", key: sel.coll } : sel.zone ? { kind: "zone", zone: sel.zone } : null,
  );
  const [drill, setDrill] = useState(false);
  const [col, setCol] = useState<"l" | "r">("l");
  const [activeId, setActiveId] = useState<string | null>(null);
  const word = q.trim().toLowerCase();

  // ── Left column: collections, then the shop's own sections ──
  const left: Opt[] = [{ id: "cm-l-all", label: "All categories", text: "all", n: facets.total, selected: isSel(sel, NO_CAT), pick: NO_CAT }];
  for (const c of COLLECTIONS) {
    const n = facets.colls[c.key] ?? 0;
    if (n === 0 && sel.coll !== c.key) continue;
    left.push({
      id: `cm-l-c-${c.key}`,
      label: c.label,
      text: c.label,
      n,
      selected: sel.coll === c.key && !sel.dept,
      pick: { ...NO_CAT, coll: c.key },
      show: { kind: "coll", key: c.key },
    });
  }
  const zones = [...facets.zones].sort((a, b) => zoneRank(a.zone) - zoneRank(b.zone) || a.zone.localeCompare(b.zone));
  for (const z of zones) {
    left.push({
      id: `cm-l-z-${slug(z.zone)}`,
      label: z.zone,
      text: z.zone,
      n: z.n,
      selected: !sel.coll && sel.zone === z.zone && !sel.dept,
      pick: { ...NO_CAT, zone: z.zone },
      show: { kind: "zone", zone: z.zone },
    });
  }

  // ── Right column: what is inside the one he is pointing at ──
  const right: Opt[] = [];
  let rightTitle = "";
  let rightDesc = "";
  if (shown?.kind === "zone") {
    rightTitle = shown.zone;
    const base: CatSel = { ...NO_CAT, zone: shown.zone };
    right.push({
      id: "cm-r-all",
      label: `All ${shown.zone}`,
      text: shown.zone,
      n: facets.zones.find((z) => z.zone === shown.zone)?.n ?? 0,
      selected: isSel(sel, base),
      pick: base,
    });
    for (const d of facets.depts.filter((x) => x.zone === shown.zone).sort((a, b) => b.n - a.n || a.dept.localeCompare(b.dept))) {
      const pick: CatSel = { ...base, dept: d.dept };
      right.push({ id: `cm-r-d-${slug(d.dept)}`, label: d.dept, text: d.dept, n: d.n, selected: isSel(sel, pick), pick });
    }
  } else if (shown?.kind === "coll") {
    rightTitle = collLabel(shown.key);
    rightDesc = collDesc(shown.key);
    const base: CatSel = { ...NO_CAT, coll: shown.key };
    right.push({
      id: "cm-r-all",
      label: `All ${collLabel(shown.key).toLowerCase()}`,
      text: collLabel(shown.key),
      n: facets.colls[shown.key] ?? 0,
      selected: isSel(sel, base),
      pick: base,
    });
    for (const d of (facets.collDepts[shown.key] ?? []).slice().sort((a, b) => b.n - a.n || a.dept.localeCompare(b.dept))) {
      const pick: CatSel = { ...base, zone: d.zone, dept: d.dept };
      right.push({
        id: `cm-r-d-${slug(d.zone)}-${slug(d.dept)}`,
        label: (
          <>
            {d.dept} <span className="ds-muted">· {d.zone}</span>
          </>
        ),
        text: d.dept,
        n: d.n,
        selected: isSel(sel, pick),
        pick,
      });
    }
  }

  // ── Type to find: collections, sections, departments and categories, all at once ──
  const hits: Opt[] = [];
  if (word) {
    const words = word.split(/\s+/);
    const match = (text: string): boolean => words.every((w) => text.toLowerCase().includes(w));
    for (const c of COLLECTIONS) {
      const n = facets.colls[c.key] ?? 0;
      if (n > 0 && match(`${c.label} ${c.desc}`)) {
        hits.push({
          id: `cm-s-c-${c.key}`,
          label: (
            <>
              {c.label} <span className="ds-muted">· collection</span>
            </>
          ),
          text: c.label,
          n,
          selected: sel.coll === c.key && !sel.dept,
          pick: { ...NO_CAT, coll: c.key },
        });
      }
    }
    for (const z of facets.zones) {
      if (match(z.zone)) {
        hits.push({
          id: `cm-s-z-${slug(z.zone)}`,
          label: (
            <>
              {z.zone} <span className="ds-muted">· all</span>
            </>
          ),
          text: z.zone,
          n: z.n,
          selected: !sel.coll && sel.zone === z.zone && !sel.dept,
          pick: { ...NO_CAT, zone: z.zone },
        });
      }
    }
    for (const d of facets.depts) {
      if (match(d.dept)) {
        const pick: CatSel = { ...NO_CAT, zone: d.zone, dept: d.dept };
        hits.push({
          id: `cm-s-d-${slug(d.zone)}-${slug(d.dept)}`,
          label: (
            <>
              {d.dept} <span className="ds-muted">· {d.zone}</span>
            </>
          ),
          text: d.dept,
          n: d.n,
          selected: isSel(sel, pick),
          pick,
        });
      }
    }
    for (const c of facets.cats) {
      if (c.cat !== c.dept && match(c.cat)) {
        const pick: CatSel = { ...NO_CAT, zone: c.zone, dept: c.dept, cat: c.cat };
        hits.push({
          id: `cm-s-t-${slug(c.zone)}-${slug(c.dept)}-${slug(c.cat)}`,
          label: (
            <>
              {c.cat} <span className="ds-muted">· {c.dept}</span>
            </>
          ),
          text: c.cat,
          n: c.n,
          selected: isSel(sel, pick),
          pick,
        });
      }
    }
    hits.sort((a, b) => Number(b.text.toLowerCase().startsWith(word)) - Number(a.text.toLowerCase().startsWith(word)));
    hits.splice(40);
  }

  const searching = word.length > 0;
  const list = searching ? hits : col === "l" ? left : right;
  const activeIndex = list.findIndex((o) => o.id === activeId);

  function activate(o: Opt | undefined, scroll = true) {
    if (!o) {
      setActiveId(null);
      return;
    }
    setActiveId(o.id);
    if (!searching && col === "l" && o.show !== undefined) setShown(o.show);
    else if (!searching && col === "l") setShown(null);
    if (scroll) queueMicrotask(() => document.getElementById(o.id)?.scrollIntoView({ block: "nearest" }));
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (list.length === 0) return;
      const at = activeIndex === -1 ? (e.key === "ArrowDown" ? 0 : list.length - 1) : Math.max(0, Math.min(list.length - 1, activeIndex + (e.key === "ArrowDown" ? 1 : -1)));
      activate(list[at]);
    } else if (e.key === "ArrowRight" && !searching && col === "l" && right.length > 0) {
      e.preventDefault();
      setCol("r");
      setDrill(true);
      setActiveId(right[0].id);
    } else if (e.key === "ArrowLeft" && !searching && col === "r") {
      e.preventDefault();
      setCol("l");
      const back = left.find((o) => o.show === shown || (o.show && shown && JSON.stringify(o.show) === JSON.stringify(shown)));
      setActiveId(back?.id ?? left[0].id);
      setDrill(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const o = list[activeIndex === -1 ? 0 : activeIndex];
      if (o) onPick(o.pick);
    }
  }

  const option = (o: Opt, arrow: boolean) => (
    <li
      key={o.id}
      id={o.id}
      role="option"
      aria-selected={o.selected}
      className={`ds-opt${o.id === activeId ? " is-active" : ""}${arrow && o.show && shown && JSON.stringify(o.show) === JSON.stringify(shown) ? " is-cur" : ""}`}
      onMouseMove={() => {
        if (o.id === activeId) return;
        setCol(arrow ? "l" : "r");
        setActiveId(o.id);
        if (arrow && o.show !== undefined) setShown(o.show);
      }}
      onClick={() => {
        // Phones have no hover: tapping a section opens what is inside it.
        if (arrow && o.show && window.matchMedia("(max-width: 700px)").matches) {
          setShown(o.show);
          setDrill(true);
          setCol("r");
          return;
        }
        onPick(o.pick);
      }}
    >
      <span className="ds-opt-l">{o.label}</span>
      <span className="ds-opt-n">{o.n}</span>
      <span className="ds-opt-a" aria-hidden="true">
        {arrow && o.show ? "›" : ""}
      </span>
    </li>
  );

  return (
    <div className="ds-cat">
      <div className="ds-cat-search">
        <label className="ds-sr" htmlFor="ds-cat-q">
          Find a category
        </label>
        <input
          id="ds-cat-q"
          className="ds-input ds-input--small"
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls={searching ? "ds-cat-res" : col === "l" ? "ds-cat-left" : "ds-cat-right"}
          aria-activedescendant={activeId ?? undefined}
          autoComplete="off"
          placeholder="Find a category (mince, bread, yoghurt)"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveId(null);
            setCol("l");
          }}
          onKeyDown={onKey}
          autoFocus={!window.matchMedia("(pointer: coarse)").matches}
        />
      </div>

      {searching ? (
        <ul role="listbox" id="ds-cat-res" aria-label="Matching categories" className="ds-cat-res">
          {hits.length === 0 ? <li className="ds-opt ds-opt--none">No category matches</li> : hits.map((o) => option(o, false))}
        </ul>
      ) : (
        <div className={`ds-cat-cols${drill ? " is-drill" : ""}`}>
          <ul role="listbox" id="ds-cat-left" aria-label="Collections and sections" className="ds-cat-left">
            {option(left[0], false)}
            <li className="ds-cat-h" role="presentation">
              Collections
            </li>
            {left.filter((o) => o.id.startsWith("cm-l-c-")).map((o) => option(o, true))}
            <li className="ds-cat-h" role="presentation">
              Sections
            </li>
            {left.filter((o) => o.id.startsWith("cm-l-z-")).map((o) => option(o, true))}
          </ul>
          <ul role="listbox" id="ds-cat-right" aria-label={rightTitle ? `Inside ${rightTitle}` : "Inside"} className="ds-cat-right">
            <li className="ds-cat-back" role="presentation">
              <button type="button" onClick={() => setDrill(false)}>
                ‹ All categories
              </button>
            </li>
            {shown ? (
              <>
                <li className="ds-cat-h" role="presentation">
                  {rightTitle}
                </li>
                {rightDesc && (
                  <li className="ds-cat-desc" role="presentation">
                    {rightDesc}
                  </li>
                )}
                {right.map((o) => option(o, false))}
                {right.length <= 1 && (
                  <li className="ds-opt ds-opt--none" role="presentation">
                    Nothing in here with your filters.
                  </li>
                )}
              </>
            ) : (
              <li className="ds-cat-desc" role="presentation">
                Pick a section or a collection on the left to see what is in it.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
