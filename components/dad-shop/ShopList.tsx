"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { gbp, groupByZone } from "@/lib/dad-shop/format";
import { priceView, type GroupInfo } from "@/lib/dad-shop/pricing";
import { BASE_PATH, type ListItem, type Settings } from "@/lib/dad-shop/types";
import AddItem from "./AddItem";
import { type ListStore, type SaveStatus } from "./listStore";
import { Caret, GroupTag, groupStyle, SeedOilTag } from "./ui";
import { useShopList, type ShopListState } from "./useShopList";

interface Props {
  initial: ListItem[];
  /** The server could not read the list: fall back to what this phone saved. */
  loadFailed: boolean;
  settings: Settings;
  nowIso: string;
}

const STATUS_TEXT: Record<SaveStatus, string> = {
  saved: "Saved",
  saving: "Saving…",
  offline: "Offline. Your changes are kept and will save when you're back.",
};

// ── Which offer boxes are folded shut: remembered on this phone ─────────────

const COLLAPSE_KEY = "ds-collapsed-groups";
const collapseListeners = new Set<() => void>();
let collapseCache: string | null = null;

function readCollapsed(): string {
  if (collapseCache !== null) return collapseCache;
  try {
    collapseCache = localStorage.getItem(COLLAPSE_KEY) ?? "[]";
  } catch {
    collapseCache = "[]";
  }
  return collapseCache;
}

function writeCollapsed(uids: string[]): void {
  collapseCache = JSON.stringify(uids);
  try {
    localStorage.setItem(COLLAPSE_KEY, collapseCache);
  } catch {
    // private mode: it stays folded for this visit only
  }
  for (const l of collapseListeners) l();
}

function subscribeCollapsed(listener: () => void): () => void {
  collapseListeners.add(listener);
  return () => {
    collapseListeners.delete(listener);
  };
}

function useCollapsed(): { has: (uid: string) => boolean; set: (uid: string, folded: boolean) => void } {
  const raw = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => "[]");
  let list: string[] = [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === "string");
  } catch {
    list = [];
  }
  return {
    has: (uid) => list.includes(uid),
    set: (uid, folded) => {
      const without = list.filter((x) => x !== uid);
      writeCollapsed(folded ? [...without, uid] : without);
    },
  };
}

// ── The list ────────────────────────────────────────────────────────────────

export default function ShopList({ initial, loadFailed, settings, nowIso }: Props) {
  const now = new Date(nowIso);
  const state = useShopList(initial, now, loadFailed);
  const { store, snap, pricing } = state;
  const [confirmFinish, setConfirmFinish] = useState(false);
  const collapsed = useCollapsed();

  const todo = snap.items.filter((i) => !i.ticked);
  const done = snap.items.filter((i) => i.ticked);
  const byId = new Map(snap.items.map((i) => [i.id, i]));

  // Offer groups with something still to buy; singles go under the shop's own sections.
  const boxes = pricing.groups
    .map((g) => ({ g, rows: g.rowIds.map((id) => byId.get(id)).filter((i): i is ListItem => i !== undefined && !i.ticked) }))
    .filter((b) => b.rows.length > 0);
  const singles = todo.filter((i) => !pricing.groupOfRow.has(i.id));
  const zones = groupByZone(singles);

  const total = pricing.total / 100;
  const saving = Math.max(0, pricing.full - pricing.total) / 100;
  const budget = settings.budget_gbp;
  const left = budget - total;
  const protein = snap.items.reduce((n, i) => n + (i.packProtein ?? 0) * i.qty, 0);
  const target = settings.protein_g_per_day * settings.people;
  const days = target > 0 ? protein / target : 0;
  let toPay = 0;
  let unpriced = 0;
  for (const i of todo) {
    const line = pricing.lines.get(i.id);
    if (line) toPay += line.cost;
    else unpriced += 1;
  }
  const toBuy = todo.reduce((n, i) => n + i.qty, 0);
  const groupByRow = (id: number): GroupInfo | undefined => pricing.groups.find((g) => g.uid === pricing.groupOfRow.get(id));

  return (
    <div className="ds-page">
      <header className="ds-head">
        <h1 className="ds-h1">My list</h1>
        <p className={`ds-status ds-status--${snap.status}`} role="status">
          {STATUS_TEXT[snap.status]}
        </p>
      </header>

      {loadFailed && snap.status === "offline" && (
        <p className="ds-banner ds-banner--amber">Couldn&apos;t load your list just now. Showing what this phone saved last.</p>
      )}

      {snap.items.some((i) => i.price != null) && (
        <section className="ds-stats" aria-label="Your list in numbers">
          <div className="ds-stats-top">
            <div>
              <span className="ds-stats-k">Total</span>
              <strong className="ds-stats-big">{gbp(total)}</strong>
            </div>
            <div className="ds-stats-r">
              <span className={left < 0 ? "ds-stats-over" : "ds-muted"}>
                {left < 0 ? `${gbp(-left)} over` : `${gbp(left)} left`} of your {gbp(budget)}
              </span>
            </div>
          </div>
          <div className="ds-meter" role="img" aria-label={`${Math.round(Math.min(100, (total / Math.max(1, budget)) * 100))} percent of the budget`}>
            <span className={left < 0 ? "is-over" : undefined} style={{ width: `${Math.min(100, (total / Math.max(1, budget)) * 100)}%` }} />
          </div>
          <dl className="ds-stats-rows">
            <div>
              <dt>You save</dt>
              <dd className={saving > 0 ? "ds-green" : undefined}>{gbp(saving)} vs full price</dd>
            </div>
            <div>
              <dt>Protein</dt>
              <dd>
                {protein > 0 ? `${Math.round(protein)}g · ${days.toFixed(1)} days at your target` : "Not known for these yet"}
              </dd>
            </div>
          </dl>
        </section>
      )}

      <AddItem store={store} />

      {snap.items.length === 0 && (
        <div className="ds-empty">
          <p className="ds-empty-title">Your list is empty.</p>
          <p>Add something above, or let the shop pick for you.</p>
          <Link className="ds-btn ds-btn--primary" href={`${BASE_PATH}/week`}>
            Make this week&apos;s basket
          </Link>
        </div>
      )}

      {boxes.map(({ g, rows }) => (
        <GroupBox key={g.uid} group={g} rows={rows} state={state} folded={collapsed.has(g.uid)} onFold={(f) => collapsed.set(g.uid, f)} now={now} />
      ))}

      {zones.map((z) => (
        <section key={z.zone} className="ds-group" aria-label={z.zone}>
          <h2 className="ds-h2">{boxes.length > 0 && z.zone === "Other" ? "Single items" : z.zone}</h2>
          <ul className="ds-rows">
            {z.items.map((i) => (
              <Row key={i.id} item={i} store={store} state={state} now={now} />
            ))}
          </ul>
        </section>
      ))}

      {done.length > 0 && (
        <>
          <details className="ds-trolley">
            <summary className="ds-trolley-sum">In the trolley ({done.length})</summary>
            <ul className="ds-rows">
              {done.map((i) => (
                <Row key={i.id} item={i} store={store} state={state} now={now} tag={groupByRow(i.id)} />
              ))}
            </ul>
          </details>

          <section className="ds-finish" aria-label="Finished shopping">
            {confirmFinish ? (
              <div className="ds-confirm" role="alertdialog" aria-label="Finished shopping">
                <p>
                  Save this shop and clear {done.length === 1 ? "the ticked item" : `all ${done.length} ticked items`} from your list? You can still see what you paid on the next visit.
                </p>
                <div className="ds-confirm-row">
                  <button
                    type="button"
                    className="ds-btn ds-btn--primary"
                    onClick={() => {
                      store.finishShopping();
                      setConfirmFinish(false);
                    }}
                  >
                    Yes, I&apos;m finished
                  </button>
                  <button type="button" className="ds-btn ds-btn--ghost" onClick={() => setConfirmFinish(false)}>
                    Keep them
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className="ds-btn ds-btn--primary ds-btn--big ds-btn--wide" onClick={() => setConfirmFinish(true)}>
                Finished shopping
              </button>
            )}
          </section>
        </>
      )}

      {todo.length > 0 && (
        <div className="ds-total" aria-live="polite">
          <span>
            {toBuy} to buy
            {unpriced > 0 && <span className="ds-total-note"> ({unpriced} with no price)</span>}
          </span>
          <strong>{toPay > 0 ? `About ${gbp(toPay / 100)}` : "No prices yet"}</strong>
        </div>
      )}
    </div>
  );
}

/** A lettered, coloured box for one offer: its name opens the deal, and it folds shut. */
function GroupBox({
  group,
  rows,
  state,
  folded,
  onFold,
  now,
}: {
  group: GroupInfo;
  rows: ListItem[];
  state: ShopListState;
  folded: boolean;
  onFold: (folded: boolean) => void;
  now: Date;
}) {
  const { store, pricing } = state;
  const href = group.kind === "mealdeal" ? `${BASE_PATH}/meal/${encodeURIComponent(group.uid)}` : `${BASE_PATH}/offer/${encodeURIComponent(group.uid)}`;

  // The deal's Value: each item's Value weighted by what he pays for it here.
  let paid = 0;
  let weighted = 0;
  for (const i of rows) {
    const cost = pricing.lines.get(i.id)?.cost ?? 0;
    if (i.value != null) {
      paid += cost;
      weighted += cost * i.value;
    }
  }
  const value = paid > 0 ? Math.round(weighted / paid) : null;
  const struck = group.full > group.total;

  return (
    <details
      className={`ds-gbox${group.unlocked ? " is-unlocked" : ""}`}
      style={groupStyle(group.colour)}
      open={!folded}
      onToggle={(e) => {
        const isOpen = e.currentTarget.open;
        if (isOpen === folded) onFold(!isOpen);
      }}
    >
      <summary className="ds-gbox-sum">
        <span className="ds-gtag-l ds-gbox-letter">{group.letter}</span>
        <span className="ds-gbox-mid">
          <Link href={href} className="ds-gbox-name" onClick={(e) => e.stopPropagation()}>
            {group.label} <span aria-hidden="true">›</span>
          </Link>
          <span className="ds-gbox-sub">
            {group.have} {group.have === 1 ? "item" : "items"} ·{" "}
            {group.need > 0 ? <span className="ds-need">Add {group.need} more to unlock</span> : <span className="ds-okk">✓ unlocked</span>}
          </span>
          {group.partsText ? <span className="ds-gbox-sub ds-muted">{group.partsText}</span> : null}
        </span>
        <span className="ds-gbox-cost">
          {value != null && <span className={`ds-score ds-score--${value >= 7 ? "g" : value >= 5 ? "a" : "r"}`}>Value {value}</span>}
          <span className="ds-gbox-price">
            {struck && <s>{gbp(group.full / 100)}</s>}
            <strong>{gbp(group.total / 100)}</strong>
          </span>
        </span>
        <span className="ds-gbox-chev" aria-hidden="true">
          <Caret />
        </span>
      </summary>
      <ul className="ds-rows ds-rows--inner">
        {rows.map((i) => (
          <Row key={i.id} item={i} store={store} state={state} now={now} />
        ))}
      </ul>
    </details>
  );
}

function Row({ item, store, state, now, tag }: { item: ListItem; store: ListStore; state: ShopListState; now: Date; tag?: GroupInfo }) {
  const line = state.pricing.lines.get(item.id);
  const href = item.productId ? `${BASE_PATH}/p/${encodeURIComponent(item.productId)}` : null;
  const view =
    item.price != null
      ? priceView(
          { price: item.price, nectarPrice: item.nectarPrice, wasPrice: item.wasPrice, offerPrice: item.offerPrice, promos: item.promos },
          now,
        )
      : null;
  const struck = line != null && line.full > line.cost;
  const nectar = line != null && struck && (view?.nectar ?? false);

  return (
    <li className={`ds-row${item.ticked ? " is-done" : ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={item.ticked}
        aria-label={`${item.name}${item.qty > 1 ? `, ${item.qty}` : ""}`}
        className="ds-check"
        onClick={() => store.setTicked(item.id, !item.ticked)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </button>

      <div className="ds-row-body">
        {href ? (
          <Link href={href} className="ds-row-name">
            {item.name}
          </Link>
        ) : (
          <span className="ds-row-name">{item.name}</span>
        )}
        <span className="ds-row-sub">
          {item.ticked && item.qty > 1 ? `${item.qty} × ` : ""}
          {line && (
            <span className="ds-row-price">
              {struck && <s>{gbp(line.full / 100)}</s>}
              <b>{gbp(line.cost / 100)}</b>
              {nectar && <span className="ds-pb-note">with Nectar</span>}
            </span>
          )}
          {tag && <GroupTag group={tag} label={tag.letter} />}
          <SeedOilTag seedOil={item.seedOil} />
        </span>
      </div>

      {!item.ticked && (
        <div className="ds-step" role="group" aria-label={`How many ${item.name}`}>
          {item.qty > 1 ? (
            <button type="button" className="ds-step-btn" aria-label={`One fewer ${item.name}`} onClick={() => store.setQty(item.id, item.qty - 1)}>
              <span aria-hidden="true">−</span>
            </button>
          ) : (
            <button type="button" className="ds-step-btn ds-step-btn--bin" aria-label={`Remove ${item.name} from your list`} onClick={() => store.remove(item.id)}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
              </svg>
            </button>
          )}
          <span className="ds-step-qty" aria-live="polite">
            {item.qty}
          </span>
          <button type="button" className="ds-step-btn" aria-label={`One more ${item.name}`} onClick={() => store.setQty(item.id, item.qty + 1)}>
            <span aria-hidden="true">+</span>
          </button>
        </div>
      )}
    </li>
  );
}
