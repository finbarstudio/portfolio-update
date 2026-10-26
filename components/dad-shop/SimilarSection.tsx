"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { gbp, shortName } from "@/lib/dad-shop/format";
import { queryFor } from "@/lib/dad-shop/find";
import { priceView } from "@/lib/dad-shop/pricing";
import { bestInColumns, compareValues, offerPill, type CompareColumn, type CompareValues } from "@/lib/dad-shop/similar";
import { BASE_PATH, SORT_INFO, type FindFilters, type ListItem, type ProductCard, type SimilarSection as Section, type Sort } from "@/lib/dad-shop/types";
import type { ListStore } from "./listStore";
import { FiltersButton, SortButton, type ToggleKey } from "./FindControls";
import ProductTile from "./ProductTile";
import { ProductImage } from "./ui";
import { useSimilarLayout } from "./useSimilarLayout";

interface Props {
  productId: string;
  section: Section;
  filters: FindFilters;
  now: Date;
  store: ListStore;
  mine: Map<string, ListItem>;
}

/** Cards show a dozen at a time; Compare shows the lot, it is one thin line each. */
const STEP = 12;

/** Every switch off, for "Show all". */
const ALL_OFF: Partial<FindFilters> = {
  noSeedOil: false,
  hideSat: false,
  good: false,
  frozen: false,
  rated: false,
  onList: false,
  fewIngredients: false,
  hideOwn: false,
  hideSingle: false,
  tasteDiff: false,
  onOffer: false,
  atStore: false,
  atStoreSure: false,
};

/**
 * "Similar products": everything of the same type as this product, to compare
 * price and nutrition. The Find filters and sort apply (best overall to start),
 * this product stays pinned first, and what the filters hide is counted. Cards
 * or Compare (a dense aligned list), remembered on this phone.
 */
export default function SimilarSection({ productId, section, filters, now, store, mine }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [layout, setLayout] = useSimilarLayout();
  const [shown, setShown] = useState(STEP);

  function go(next: Partial<FindFilters>) {
    const f: FindFilters = { ...filters, page: 0, ...next };
    startTransition(() => {
      router.replace(`${BASE_PATH}/p/${encodeURIComponent(productId)}?${queryFor(f)}`, { scroll: false });
    });
  }

  function reset() {
    go({ noSeedOil: false, hideSat: false, good: false, frozen: false, rated: false, onList: false, fewIngredients: false, hideOwn: false, hideSingle: false, tasteDiff: false, onOffer: false, atStore: false, atStoreSure: false, sort: "best" });
  }

  const { items, total, hidden, capped, rank, ranks } = section;
  const others = items.length - 1;
  const rows = items.map((p) => compareValues(p, now));
  const best = bestInColumns(rows);
  const cards = items.slice(0, shown);

  return (
    <section className="ds-simsec" aria-label="Similar products">
      <h2 className="ds-h2 ds-sim-h">
        {section.group ? `Similar: ${section.group}` : "Similar products"} <span className="ds-muted">· {total}</span>
      </h2>
      <p className="ds-muted ds-sim-scope">
        {total <= 1
          ? "Nothing else like this one."
          : section.group
            ? "Everything you could buy instead, to compare price and nutrition."
            : `Everything in ${section.scopeLabel}, to compare price and nutrition.`}
      </p>

      {total > 1 && (
        <>
          <div className="ds-sim-tools">
            <div className="ds-seg ds-seg--sim" role="group" aria-label="How to show them">
              <button type="button" aria-pressed={layout === "cards"} onClick={() => setLayout("cards")}>
                Cards
              </button>
              <button type="button" aria-pressed={layout === "compare"} onClick={() => setLayout("compare")}>
                Compare
              </button>
            </div>
            <div className="ds-ctl ds-ctl--sim">
              <FiltersButton filters={filters} ignored={false} onToggle={(k: ToggleKey) => go({ [k]: !filters[k] } as Partial<FindFilters>)} onReset={reset} />
              <SortButton value={filters.sort} onChange={(s: Sort) => go({ sort: s })} />
            </div>
          </div>
          {section.proteins.length > 1 && (
            <div className="ds-pills ds-pills--sim" role="group" aria-label="Main protein">
              <button type="button" aria-pressed={section.protein === null} onClick={() => go({ protein: "any" })}>
                Any <span className="ds-tabs2-n">{section.proteins.reduce((n, p) => n + p.n, 0)}</span>
              </button>
              {section.proteins.map((p) => (
                <button key={p.protein} type="button" aria-pressed={section.protein === p.protein} onClick={() => go({ protein: p.protein })}>
                  {p.protein.charAt(0).toUpperCase() + p.protein.slice(1)} <span className="ds-tabs2-n">{p.n}</span>
                </button>
              ))}
            </div>
          )}
          <p className="ds-sortline" aria-live="polite">
            <b>{SORT_INFO[filters.sort].label}</b>: {SORT_INFO[filters.sort].sub}
          </p>

          <p className="ds-sim-count" role="status">
            {rank != null && (
              <span className="ds-sim-rank">
                This one is <b>#{rank}</b> of {total} on best overall
              </span>
            )}
            <span>
              Showing {items.length} of {total}
              {hidden > 0 && (
                <>
                  {" "}
                  · {hidden} hidden by filters ·{" "}
                  <button type="button" className="ds-linkbtn ds-linkbtn--inline" onClick={() => go(ALL_OFF)}>
                    Show all
                  </button>
                </>
              )}
              {capped > 0 && ` · the best ${items.length} only`}
            </span>
          </p>

          <div className={pending ? "ds-results is-pending" : "ds-results"} aria-busy={pending}>
            {layout === "cards" ? (
              <>
                <ul className="ds-cards ds-cards--grid">
                  {cards.map((p) => (
                    <ProductTile key={p.id} p={p} now={now} store={store} mine={mine} isMe={p.id === productId} rank={ranks[p.id] ? `#${ranks[p.id]} best overall` : undefined} />
                  ))}
                </ul>
                {items.length > shown && (
                  <button type="button" className="ds-btn ds-btn--ghost ds-btn--wide" onClick={() => setShown(shown + STEP)}>
                    Show {Math.min(STEP, items.length - shown)} more
                  </button>
                )}
              </>
            ) : (
              <CompareList items={items} rows={rows} best={best} meId={productId} now={now} />
            )}
            {others === 0 && hidden > 0 && <p className="ds-muted ds-note-small">Every other product is hidden by the filters.</p>}
          </div>
        </>
      )}
    </section>
  );
}

// ── Compare ─────────────────────────────────────────────────────────────────

const COLS = [
  { key: "price", long: "Price", short: "Price" },
  { key: "perkg", long: "Per kg", short: "Per kg" },
  { key: "protein", long: "Protein", short: "Prot" },
  { key: "sat", long: "Sat fat", short: "Sat" },
  { key: "ingr", long: "Ingr.", short: "Ingr" },
  { key: "upf", long: "UPF", short: "UPF" },
  { key: "oil", long: "Oil", short: "Oil" },
] as const;

function CompareList({
  items,
  rows,
  best,
  meId,
  now,
}: {
  items: ProductCard[];
  rows: CompareValues[];
  best: Record<CompareColumn, Set<string>>;
  meId: string;
  now: Date;
}) {
  return (
    <div className="ds-cmp" role="table" aria-label="Similar products side by side">
      <div className="ds-cmp-head" role="row">
        <span className="ds-cmp-h ds-cmp-h--name" role="columnheader">
          Product
        </span>
        {COLS.map((c) => (
          <span key={c.key} className={`ds-cmp-h ds-cmp-h--${c.key}`} role="columnheader">
            <span className="ds-cmp-long">{c.long}</span>
            <span className="ds-cmp-short">{c.short}</span>
          </span>
        ))}
        <span className="ds-cmp-h ds-cmp-h--offer" role="columnheader">
          Offer
        </span>
      </div>
      {items.map((p, i) => (
        <CompareRow key={p.id} p={p} v={rows[i]} best={best} isMe={p.id === meId} now={now} />
      ))}
      <p className="ds-cmp-key">
        <span className="ds-cmp-best">Green</span> is the best in its column. Per kg is what you pay after offers. Protein and sat fat are per 100g.
      </p>
    </div>
  );
}

/** The name without its pack size, and without "Sainsbury's" (most of the shelf, so it only costs room). */
const rowName = (name: string): string => shortName(name).replace(/^sainsbury['’]s\s+/i, "");

/** A value we don't have: a muted dash, never a number or a guess. */
function Unknown() {
  return (
    <span className="ds-cmp-unk">
      <span aria-hidden="true">–</span>
      <span className="ds-sr">not known</span>
    </span>
  );
}

const dot = (tone: "g" | "a" | "r" | "n") => <i className={`ds-cdot ds-cdot--${tone}`} aria-hidden="true" />;

function CompareRow({ p, v, best, isMe, now }: { p: ProductCard; v: CompareValues; best: Record<CompareColumn, Set<string>>; isMe: boolean; now: Date }) {
  const pv = priceView(p, now);
  const pill = offerPill(p, now);
  const cls = (col: CompareColumn) => `ds-cmp-c${best[col].has(p.id) ? " is-best" : ""}`;
  const href = `${BASE_PATH}/p/${encodeURIComponent(p.id)}`;
  const upfTone = v.upf == null ? "n" : v.upf === 0 ? "g" : v.upf >= 3 ? "r" : "a";
  const ingrTone = v.ingredients == null ? "n" : v.ingredients <= 5 ? "g" : v.ingredients <= 10 ? "a" : "r";
  const oil = p.seedOil === "none" ? { tone: "g" as const, label: "No seed oil" } : p.seedOil === "yes" ? { tone: "r" as const, label: "Contains seed oil" } : p.seedOil === "likely" ? { tone: "a" as const, label: "May contain seed oil" } : { tone: "n" as const, label: "Seed oil not known" };

  return (
    <div className={`ds-cmp-row${isMe ? " is-me" : ""}${p.notAtStore ? " is-muted" : ""}`} role="row">
      <span className="ds-cmp-img" role="cell">
        <ProductImage src={p.imageUrl} className="ds-img--cmp" />
      </span>
      <span className="ds-cmp-name" role="cell">
        <Link href={href} className="ds-cmp-link" title={p.name}>
          {rowName(p.name)}
        </Link>
        {isMe && <b className="ds-cmp-me">This one</b>}
      </span>
      <span className="ds-cmp-c ds-cmp-price" role="cell">
        <strong>{gbp(pv.nowPence / 100)}</strong>
        {pv.cut && (
          <s>
            <span className="ds-sr">Usually </span>
            {gbp(pv.fullPence / 100)}
          </s>
        )}
      </span>
      <span className={`${cls("unit")} ds-cmp-unit`} role="cell">
        {v.unit != null ? `${gbp(v.unit)}${v.unitMeasure === "ltr" ? "/l" : ""}` : <Unknown />}
      </span>
      <span className={`${cls("protein")} ds-cmp-protein`} role="cell">
        {p.protein != null ? `${p.protein >= 10 ? Math.round(p.protein) : +p.protein.toFixed(1)}g` : <Unknown />}
      </span>
      <span className={`${cls("sat")} ds-cmp-sat`} role="cell">
        {v.sat != null ? (
          <>
            {dot(v.satTone ?? "n")}
            {+v.sat.toFixed(1)}
            <span className="ds-sr">g saturated fat</span>
          </>
        ) : (
          <Unknown />
        )}
      </span>
      <span className={`${cls("ingredients")} ds-cmp-ingr ds-tone--${ingrTone}`} role="cell">
        {v.ingredients != null ? <>{v.ingredients}</> : <Unknown />}
        <span className="ds-sr"> ingredients</span>
      </span>
      <span className={`${cls("upf")} ds-cmp-upf ds-tone--${upfTone}`} role="cell">
        {v.upf != null ? <>{v.upf}</> : <Unknown />}
        <span className="ds-sr"> ultra-processing markers</span>
      </span>
      <span className="ds-cmp-c ds-cmp-oil" role="cell" title={oil.label}>
        {dot(oil.tone)}
        <span className="ds-sr">{oil.label}</span>
      </span>
      <span className="ds-cmp-offer" role="cell">
        {pill &&
          (pill.href ? (
            <Link href={pill.href} className={`ds-cpill ds-cpill--${pill.tone}`}>
              {pill.text} <span aria-hidden="true">›</span>
            </Link>
          ) : (
            <span className={`ds-cpill ds-cpill--${pill.tone}`}>{pill.text}</span>
          ))}
      </span>
    </div>
  );
}
