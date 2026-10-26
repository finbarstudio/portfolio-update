"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { type GroupInfo } from "@/lib/dad-shop/pricing";
import {
  ANIMALS,
  BASE_PATH,
  FILTER_DEFAULTS,
  VIEWS,
  VIEW_LABEL,
  VIEW_SHORT,
  type Deal,
  type Facets,
  SORT_INFO,
  type FindFilters,
  type ListItem,
  type ForYou,
  type ProductCard,
  type Sort,
  type View,
} from "@/lib/dad-shop/types";
import { defaultSort, queryFor } from "@/lib/dad-shop/find";
import CategoryMenu, { NO_CAT, type CatSel } from "./CategoryMenu";
import { FiltersButton, SortButton, type ToggleKey } from "./FindControls";
import MealDealCard from "./MealDealCard";
import ProductTile from "./ProductTile";
import Shelves from "./Shelves";
import { useShopList } from "./useShopList";

interface Props {
  filters: FindFilters;
  facets: Facets;
  items: ProductCard[];
  hasMore: boolean;
  forYou: ForYou | null;
  deals: Deal[] | null;
  list: ListItem[];
  nowIso: string;
}

const cap = (t: string): string => t.charAt(0).toUpperCase() + t.slice(1);

export default function FindView({ filters, facets, items, hasMore, forYou, deals, list, nowIso }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [text, setText] = useState(filters.q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = new Date(nowIso);
  const { store, pricing, mine, snap } = useShopList(list, now);

  const groupOf = new Map<string, GroupInfo>();
  for (const i of snap.items) {
    const g = i.productId && !i.ticked ? pricing.groups.find((x) => x.uid === pricing.groupOfRow.get(i.id)) : undefined;
    if (g && i.productId) groupOf.set(i.productId, g);
  }

  const dealish = filters.view === "offers" || filters.view === "multibuys" || filters.view === "deals";
  const sel: CatSel = { coll: filters.coll, zone: filters.zone, dept: filters.dept, cat: filters.cat };
  const picked = sel.coll || sel.zone || sel.dept || sel.cat;

  function go(next: Partial<FindFilters>) {
    const f: FindFilters = { ...filters, q: text.trim(), page: 0, ...next };
    startTransition(() => {
      router.replace(`${BASE_PATH}/find?${queryFor(f)}`, { scroll: false });
    });
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

  function pickCat(c: CatSel) {
    go({ ...c, animal: "" });
  }

  function setView(view: View) {
    go({ view, sort: defaultSort(view), page: 0 });
  }

  function toggle(key: ToggleKey) {
    go({ [key]: !filters[key] } as Partial<FindFilters>);
  }

  function reset() {
    go({
      noSeedOil: FILTER_DEFAULTS.noSeedOil,
      hideSat: FILTER_DEFAULTS.hideSat,
      good: false,
      frozen: false,
      rated: false,
      onList: false,
      fewIngredients: false,
      hideOwn: false,
      hideSingle: false,
      tasteDiff: false,
      onOffer: false,
    });
  }

  // ── Type tabs and animal pills: they narrow what the category menu picked ──
  interface Tab {
    key: string;
    label: string;
    n: number;
    on: boolean;
    pick: CatSel;
  }
  const tabs: Tab[] = [];
  if (filters.coll && !filters.dept) {
    for (const d of (facets.collDepts[filters.coll] ?? []).slice().sort((a, b) => b.n - a.n)) {
      tabs.push({ key: `${d.zone}|${d.dept}`, label: d.dept, n: d.n, on: false, pick: { coll: filters.coll, zone: d.zone, dept: d.dept, cat: "" } });
    }
  } else if (filters.dept) {
    for (const c of facets.cats.filter((x) => x.zone === filters.zone && x.dept === filters.dept && x.cat !== x.dept).sort((a, b) => b.n - a.n)) {
      tabs.push({ key: c.cat, label: cap(c.cat), n: c.n, on: filters.cat === c.cat, pick: { ...sel, cat: c.cat } });
    }
  } else if (filters.zone) {
    for (const d of facets.depts.filter((x) => x.zone === filters.zone).sort((a, b) => b.n - a.n)) {
      tabs.push({ key: d.dept, label: d.dept, n: d.n, on: false, pick: { ...sel, dept: d.dept } });
    }
  }
  const tabAllLabel = filters.dept ? `All ${filters.dept.toLowerCase()}` : filters.coll ? "All" : `All ${filters.zone.toLowerCase()}`;
  const tabAllN = filters.dept
    ? (facets.depts.find((d) => d.zone === filters.zone && d.dept === filters.dept)?.n ?? 0)
    : filters.coll
      ? (facets.colls[filters.coll] ?? 0)
      : (facets.zones.find((z) => z.zone === filters.zone)?.n ?? 0);
  const animals = facets.animals.filter((a) => (ANIMALS as readonly string[]).includes(a.animal));

  const shelves = forYou?.shelves ?? null;
  const empty = items.length === 0 && (!shelves || shelves.length === 0) && (!deals || deals.length === 0);
  const ranked = filters.sort === "best";

  return (
    <div className="ds-page ds-page--wide ds-find">
      <div className="ds-find-head">
        <div className="ds-find-top">
          <h1 className="ds-h1">Find</h1>
          <form
            role="search"
            className="ds-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (timer.current) clearTimeout(timer.current);
              go({});
            }}
          >
            <label className="ds-sr" htmlFor="ds-find-q">
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
          <FiltersButton filters={filters} ignored={dealish} onToggle={toggle} onReset={reset} />
        </div>

        <div className="ds-seg" role="group" aria-label="View">
          {VIEWS.map((v) => (
            <button key={v} type="button" aria-pressed={filters.view === v} onClick={() => setView(v)}>
              <span className="ds-lab-long">{VIEW_LABEL[v]}</span>
              <span className="ds-lab-short" aria-hidden="true">
                {VIEW_SHORT[v]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="ds-find-tools">
        <div className="ds-ctl">
          {filters.view !== "deals" && <CategoryMenu facets={facets} sel={sel} onPick={pickCat} />}
          {filters.view !== "foryou" && <SortButton value={filters.sort} onChange={(s) => go({ sort: s as Sort })} />}
        </div>
        {filters.view !== "foryou" && (
          <p className="ds-sortline" aria-live="polite">
            <b>{SORT_INFO[filters.sort].label}</b>: {SORT_INFO[filters.sort].sub}
          </p>
        )}

        {filters.view !== "deals" && tabs.length > 1 && (
          <div className="ds-tabs2" role="group" aria-label="Type">
            <button type="button" aria-pressed={filters.dept ? !filters.cat : true} onClick={() => pickCat(filters.dept ? { ...sel, cat: "" } : filters.coll ? { ...NO_CAT, coll: filters.coll } : { ...NO_CAT, zone: filters.zone })}>
              {tabAllLabel} <span className="ds-tabs2-n">{tabAllN}</span>
            </button>
            {tabs.map((t) => (
              <button key={t.key} type="button" aria-pressed={t.on} onClick={() => pickCat(t.pick)}>
                {t.label} <span className="ds-tabs2-n">{t.n}</span>
              </button>
            ))}
          </div>
        )}

        {filters.view !== "deals" && picked && animals.length > 1 && (
          <div className="ds-pills" role="group" aria-label="Main meat or fish">
            <button type="button" aria-pressed={!filters.animal} onClick={() => go({ animal: "" })}>
              Any
            </button>
            {animals.map((a) => (
              <button key={a.animal} type="button" aria-pressed={filters.animal === a.animal} onClick={() => go({ animal: a.animal })}>
                {cap(a.animal)} <span className="ds-tabs2-n">{a.n}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={pending ? "ds-results is-pending" : "ds-results"} aria-busy={pending}>
        {filters.view === "deals" && deals && deals.length > 0 && (
          <section aria-label="Meal deals on now" className="ds-dealstrip-wrap">
            <h2 className="ds-h2">{deals.length === 1 ? "1 meal deal on now" : `${deals.length} meal deals on now`}</h2>
            <ul className="ds-dealstrip">
              {deals.map((d) => (
                <MealDealCard key={d.id} deal={d} onList={snap.items.filter((i) => !i.ticked && i.deals?.some((x) => x.id === d.id)).length} />
              ))}
            </ul>
            <p className="ds-muted ds-note-small">
              Every product below is in one of these deals. Open a deal to build it. Nothing is hidden here: only the sort changes.
            </p>
          </section>
        )}

        {filters.view === "multibuys" && items.length > 0 && (
          <p className="ds-muted ds-note-small">
            Every product here has a multi-buy offer. Nothing is hidden: only the sort changes. Tap an offer on a card to see everything that shares it.
          </p>
        )}

        {filters.view === "foryou" && forYou && forYou.rated === 0 && shelves && shelves.length > 0 && (
          <p className="ds-note-small ds-learn">
            Rate a few products with the stars and this page learns what you like. Until then it goes by your rules: healthy, no seed oils, good value.
          </p>
        )}
        {filters.view === "foryou" && shelves && shelves.length > 0 && (
          <Shelves shelves={shelves} now={now} store={store} mine={mine} groupOf={groupOf} dealOnList={(id) => snap.items.filter((i) => !i.ticked && i.deals?.some((x) => x.id === id)).length} />
        )}

        {items.length > 0 && (
          <>
            <ul className="ds-cards ds-cards--grid">
              {items.map((p, i) => (
                <ProductTile key={p.id} p={p} now={now} store={store} mine={mine} group={groupOf.get(p.id) ?? null} rank={ranked ? `#${i + 1} best overall` : undefined} />
              ))}
            </ul>
            {hasMore && (
              <button type="button" className="ds-btn ds-btn--ghost ds-btn--wide" onClick={() => go({ page: filters.page + 1 })}>
                Show more
              </button>
            )}
          </>
        )}

        {empty && (
          <div className="ds-empty">
            <p className="ds-empty-title">{filters.view === "foryou" ? "Nothing picked for you with these choices." : "Nothing found."}</p>
            {filters.view === "foryou" ? (
              <p>Rate a few products and this page learns what you like. You can also loosen the filters.</p>
            ) : dealish ? (
              <p>Try another category, or search for something else.</p>
            ) : filters.noSeedOil ? (
              <p>&ldquo;No seed oils&rdquo; is switched on, so products with seed oils, or with no ingredients listed yet, are hidden.</p>
            ) : (
              <p>Try taking a filter off, or searching for something else.</p>
            )}
            <div className="ds-empty-actions">
              {picked ? (
                <button type="button" className="ds-btn ds-btn--ghost" onClick={() => pickCat(NO_CAT)}>
                  Show all categories
                </button>
              ) : null}
              {!dealish && filters.noSeedOil && (
                <button type="button" className="ds-btn ds-btn--primary" onClick={() => go({ noSeedOil: false })}>
                  Show them too
                </button>
              )}
              {!dealish && (filters.good || filters.frozen || filters.rated || filters.onList || filters.fewIngredients || filters.hideOwn || filters.hideSingle || filters.tasteDiff || filters.onOffer) && (
                <button type="button" className="ds-btn ds-btn--ghost" onClick={reset}>
                  Reset filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

