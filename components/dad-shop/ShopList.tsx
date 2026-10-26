"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { gbp, groupByZone } from "@/lib/dad-shop/format";
import { linePrice, type Line } from "@/lib/dad-shop/pricing";
import { BASE_PATH, type ListItem } from "@/lib/dad-shop/types";
import AddItem from "./AddItem";
import { ListStore, type SaveStatus } from "./listStore";
import { SeedOilTag } from "./ui";

interface Props {
  initial: ListItem[];
  /** The server could not read the list: fall back to what this phone saved. */
  loadFailed: boolean;
  nowIso: string;
}

/** What a row costs, or null for a free-text row with no price. */
function rowLine(item: ListItem, now: Date): Line | null {
  if (item.price == null) return null;
  return linePrice({ price: item.price, nectarPrice: item.nectarPrice, promos: item.promos }, item.qty, now);
}

const STATUS_TEXT: Record<SaveStatus, string> = {
  saved: "Saved",
  saving: "Saving…",
  offline: "Offline. Your changes are kept and will save when you're back.",
};

export default function ShopList({ initial, loadFailed, nowIso }: Props) {
  const [store] = useState(() => new ListStore(initial));
  const snap = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => store.start(loadFailed), [store, loadFailed]);

  const now = new Date(nowIso);
  const todo = snap.items.filter((i) => !i.ticked);
  const done = snap.items.filter((i) => i.ticked);
  const groups = groupByZone(todo);

  let totalPence = 0;
  let unpriced = 0;
  for (const i of todo) {
    const line = rowLine(i, now);
    if (line) totalPence += line.pence;
    else unpriced += 1;
  }
  const toBuy = todo.reduce((n, i) => n + i.qty, 0);

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

      {groups.map((g) => (
        <section key={g.zone} className="ds-group" aria-label={g.zone}>
          <h2 className="ds-h2">{g.zone}</h2>
          <ul className="ds-rows">
            {g.items.map((i) => (
              <Row key={i.id} item={i} store={store} now={now} />
            ))}
          </ul>
        </section>
      ))}

      {done.length > 0 && (
        <details className="ds-trolley">
          <summary className="ds-trolley-sum">
            In the trolley ({done.length})
          </summary>
          <ul className="ds-rows">
            {done.map((i) => (
              <Row key={i.id} item={i} store={store} now={now} />
            ))}
          </ul>
          {confirmClear ? (
            <div className="ds-confirm" role="alertdialog" aria-label="Clear ticked items">
              <p>Clear {done.length === 1 ? "the ticked item" : `all ${done.length} ticked items`} from your list?</p>
              <div className="ds-confirm-row">
                <button
                  type="button"
                  className="ds-btn ds-btn--danger"
                  onClick={() => {
                    store.clearTicked();
                    setConfirmClear(false);
                  }}
                >
                  Yes, clear them
                </button>
                <button type="button" className="ds-btn ds-btn--ghost" onClick={() => setConfirmClear(false)}>
                  Keep them
                </button>
              </div>
            </div>
          ) : (
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--wide" onClick={() => setConfirmClear(true)}>
              Clear ticked
            </button>
          )}
        </details>
      )}

      {todo.length > 0 && (
        <div className="ds-total" aria-live="polite">
          <span>
            {toBuy} to buy
            {unpriced > 0 && <span className="ds-total-note"> ({unpriced} with no price)</span>}
          </span>
          <strong>{totalPence > 0 ? `About ${gbp(totalPence / 100)}` : "No prices yet"}</strong>
        </div>
      )}
    </div>
  );
}

function Row({ item, store, now }: { item: ListItem; store: ListStore; now: Date }) {
  const line = rowLine(item, now);
  const href = item.productId ? `${BASE_PATH}/p/${encodeURIComponent(item.productId)}` : null;
  const sub = line ? `${gbp(line.pence / 100)}${line.dealGroup ? " with the offer" : ""}` : "";

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
          {sub}
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
