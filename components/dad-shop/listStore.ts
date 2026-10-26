import type { DealLink, ListItem, ProductCard } from "@/lib/dad-shop/types";
import { api, ApiError } from "./api";

/**
 * The shopping list's brain, for a phone with patchy signal.
 *
 * - Every change shows at once (optimistic) and is queued.
 * - The queue and the list are mirrored into localStorage, so a closed tab or a
 *   dead signal loses nothing; the queue resumes next time the list opens.
 * - Changes are sent one at a time, in order. A network failure retries with a
 *   growing pause (and straight away when the phone says it is back online).
 *   A refusal (bad request) drops that one change and re-reads the server's list.
 * - Only when the queue is empty does the server's list replace the screen's, so
 *   a slow reply can never undo something he has just tapped.
 *
 * Framework-free: React reads it through useSyncExternalStore.
 */

export type SaveStatus = "saved" | "saving" | "offline";

export interface ListSnapshot {
  items: ListItem[];
  status: SaveStatus;
  /** Changes not yet saved. */
  pending: number;
}

type Op =
  | { type: "add"; item: ListItem }
  | { type: "tick"; id: number; ticked: boolean }
  | { type: "qty"; id: number; qty: number }
  | { type: "remove"; id: number }
  | { type: "clear" }
  | { type: "finish" };

type AddableProduct = Pick<
  ProductCard,
  "id" | "name" | "brand" | "imageUrl" | "zone" | "price" | "nectarPrice" | "promos" | "seedOil"
> &
  Partial<Pick<ProductCard, "wasPrice" | "offerPrice" | "value" | "protein" | "packGrams">> & { deals?: DealLink[] };

const KEY = "ds-list-v1";
const RETRY_MS = [2000, 4000, 8000, 15_000, 30_000];
const REFRESH_AFTER_MS = 30_000;

function sameRow(a: ListItem, b: ListItem): boolean {
  if (a.productId !== null || b.productId !== null) return a.productId === b.productId;
  return a.name.toLowerCase() === b.name.toLowerCase();
}

/** The screen's version of a change, applied straight away. */
function applyOp(items: ListItem[], op: Op): ListItem[] {
  switch (op.type) {
    case "add":
      // Matches the server: adding what is already on the list changes nothing.
      return items.some((i) => !i.ticked && sameRow(i, op.item)) ? items : [...items, op.item];
    case "tick":
      return items.map((i) => (i.id === op.id ? { ...i, ticked: op.ticked } : i));
    case "qty":
      return items.map((i) => (i.id === op.id ? { ...i, qty: op.qty } : i));
    case "remove":
      return items.filter((i) => i.id !== op.id);
    case "clear":
    case "finish":
      return items.filter((i) => !i.ticked);
  }
}

function bodyFor(op: Op): unknown {
  switch (op.type) {
    case "add":
      return op.item.productId !== null
        ? { action: "add", productId: op.item.productId, qty: op.item.qty }
        : { action: "add", label: op.item.name, qty: op.item.qty };
    case "tick":
      return { action: "tick", id: op.id, ticked: op.ticked };
    case "qty":
      return { action: "qty", id: op.id, qty: op.qty };
    case "remove":
      return { action: "remove", id: op.id };
    case "clear":
      return { action: "clear_ticked" };
    case "finish":
      return { action: "finish" };
  }
}

function fixOp(op: Op): Op {
  return op.type === "add" ? { ...op, item: fixItem(op.item) } : op;
}

function refersTo(op: Op, id: number): boolean {
  return op.type === "tick" || op.type === "qty" || op.type === "remove" ? op.id === id : false;
}

function retarget(op: Op, from: number, to: number): Op {
  if (!refersTo(op, from)) return op;
  return { ...(op as Extract<Op, { id: number }>), id: to };
}

/** Rows cached by an older version of the page lack the newer fields. */
function fixItem(i: ListItem): ListItem {
  return {
    ...i,
    wasPrice: i.wasPrice ?? null,
    offerPrice: i.offerPrice ?? null,
    packProtein: i.packProtein ?? null,
    value: i.value ?? null,
    deals: i.deals ?? [],
    promos: Array.isArray(i.promos) ? i.promos : [],
  };
}

type Mode = "off" | "keeper" | "full";

export class ListStore {
  private snap: ListSnapshot;
  private readonly initial: ListSnapshot;
  private queue: Op[] = [];
  private listeners = new Set<() => void>();
  private running = false;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private failures = 0;
  private nextTemp = -1;
  private lastRefresh = 0;
  private needsRefresh = false;
  private stopped = false;

  constructor(initial: ListItem[]) {
    this.snap = { items: initial, status: "saved", pending: 0 };
    this.initial = this.snap;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ListSnapshot => this.snap;
  getServerSnapshot = (): ListSnapshot => this.initial;

  private commit(patch: Partial<ListSnapshot>): void {
    this.snap = { ...this.snap, ...patch, pending: this.queue.length };
    for (const l of this.listeners) l();
  }

  private persist(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify({ items: this.snap.items, queue: this.queue }));
    } catch {
      // private mode or full: the list still works, it just is not cached
    }
  }

  private holders = 0;
  private keepers = 0;
  private mode: Mode = "off";
  private teardown: (() => void) | null = null;
  private loadFailed = false;

  /**
   * A page holds the store while it is on screen. Pages hold it in full (reads
   * the phone's saved copy, refreshes, sends changes); the tab bar holds it as a
   * keeper everywhere else (only sends changes left over from earlier). The store
   * is shared, so the list is the same on every page and nothing is sent twice.
   * `loadFailed` means the server could not give this page the list.
   */
  acquire(loadFailed: boolean, keeper = false): () => void {
    if (keeper) this.keepers += 1;
    else this.holders += 1;
    if (loadFailed) this.loadFailed = true;
    this.sync();
    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (keeper) this.keepers -= 1;
      else this.holders -= 1;
      this.sync();
    };
  }

  private sync(): void {
    const want: Mode = this.holders > 0 ? "full" : this.keepers > 0 ? "keeper" : "off";
    if (want === this.mode) return;
    this.teardown?.();
    this.teardown = null;
    this.mode = want;
    if (want === "off") {
      this.stopped = true;
      return;
    }
    this.teardown = this.begin(this.loadFailed, want === "keeper");
  }

  /** Replaces the screen's list with the server's, unless changes are still waiting to be saved. */
  hydrate(items: ListItem[]): void {
    if (this.queue.length > 0 || this.running) return;
    this.commit({ items: items.map(fixItem), status: this.snap.status === "offline" ? "offline" : "saved" });
    this.persist();
  }

  private begin(loadFailed: boolean, keeper: boolean): () => void {
    this.stopped = false; // React dev mode runs effects twice: start, stop, start
    let cached: { items: ListItem[]; queue: Op[] } | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null && "items" in parsed && "queue" in parsed) {
          const { items, queue } = parsed as { items: unknown; queue: unknown };
          if (Array.isArray(items) && Array.isArray(queue)) {
            cached = { items: (items as ListItem[]).map(fixItem), queue: (queue as Op[]).map(fixOp) };
          }
        }
      }
    } catch {
      cached = null;
    }

    if (keeper && !(cached && cached.queue.length > 0)) return () => undefined;

    if (this.queue.length === 0 && cached && (cached.queue.length > 0 || loadFailed)) {
      // Unsaved changes (or no server list at all): the cached screen is the truth.
      this.queue = cached.queue;
      this.commit({ items: cached.items, status: cached.queue.length > 0 ? "saving" : "offline" });
    }
    this.nextTemp = Math.min(-1, this.nextTemp, ...this.snap.items.map((i) => i.id - 1), ...this.queue.map((o) => (o.type === "add" ? o.item.id - 1 : -1)));
    this.lastRefresh = Date.now();
    this.persist();

    const wake = (): void => {
      if (this.queue.length > 0) {
        void this.flush();
      } else if (Date.now() - this.lastRefresh > REFRESH_AFTER_MS) {
        void this.refresh();
      }
    };
    const onVisible = (): void => {
      if (document.visibilityState === "visible") wake();
    };
    window.addEventListener("online", wake);
    document.addEventListener("visibilitychange", onVisible);

    if (this.queue.length > 0) void this.flush();
    else if (loadFailed) void this.refresh();

    return () => {
      this.stopped = true;
      window.removeEventListener("online", wake);
      document.removeEventListener("visibilitychange", onVisible);
      if (this.retryTimer) clearTimeout(this.retryTimer);
      this.retryTimer = null;
    };
  }

  // ── Changes ──────────────────────────────────────────────────────────────

  add(product: AddableProduct, qty = 1): void {
    const packProtein =
      product.packGrams != null && product.protein != null ? Math.round(((product.packGrams * product.protein) / 100) * 10) / 10 : null;
    this.dispatch({
      type: "add",
      item: {
        id: this.nextTemp--,
        productId: product.id,
        name: product.name,
        brand: product.brand,
        imageUrl: product.imageUrl,
        zone: product.zone,
        qty,
        ticked: false,
        price: product.price,
        nectarPrice: product.nectarPrice,
        promos: product.promos,
        seedOil: product.seedOil,
        wasPrice: product.wasPrice ?? null,
        offerPrice: product.offerPrice ?? null,
        packProtein,
        value: product.value ?? null,
        deals: product.deals ?? [],
      },
    });
  }

  addText(label: string): void {
    this.dispatch({
      type: "add",
      item: {
        id: this.nextTemp--,
        productId: null,
        name: label,
        brand: null,
        imageUrl: null,
        zone: null,
        qty: 1,
        ticked: false,
        price: null,
        nectarPrice: null,
        promos: [],
        seedOil: null,
        wasPrice: null,
        offerPrice: null,
        packProtein: null,
        value: null,
        deals: [],
      },
    });
  }

  setTicked(id: number, ticked: boolean): void {
    this.dispatch({ type: "tick", id, ticked });
  }

  setQty(id: number, qty: number): void {
    this.dispatch({ type: "qty", id, qty: Math.min(50, Math.max(1, qty)) });
  }

  remove(id: number): void {
    this.dispatch({ type: "remove", id });
  }

  clearTicked(): void {
    this.dispatch({ type: "clear" });
  }

  /** "Finished shopping": the server saves the ticked items as a past shop and takes them off the list. */
  finishShopping(): void {
    this.dispatch({ type: "finish" });
  }

  private dispatch(op: Op): void {
    this.queue.push(op);
    this.commit({ items: applyOp(this.snap.items, op), status: "saving" });
    this.persist();
    void this.flush();
  }

  // ── Talking to the server ────────────────────────────────────────────────

  private async flush(): Promise<void> {
    if (this.running) return;
    this.running = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    try {
      while (this.queue.length > 0) {
        // The screen that owned this store has gone: leave the rest saved for the next one.
        if (this.stopped) return;
        const op = this.queue[0];
        this.commit({ status: "saving" });
        try {
          const res = await api<{ id: number | null; items: ListItem[] }>("/list", { method: "POST", body: bodyFor(op) });
          this.failures = 0;
          this.queue.shift();
          if (op.type === "add" && res.id !== null) this.rekey(op.item.id, res.id);
          if (this.queue.length === 0) {
            this.lastRefresh = Date.now();
            this.commit({ items: res.items });
          }
          this.persist();
        } catch (err) {
          if (err instanceof ApiError && !err.retryable) {
            // The server refused this one (bad data, product gone). Drop it and re-read.
            this.queue.shift();
            this.needsRefresh = true;
            this.commit({});
            this.persist();
          } else {
            this.failures += 1;
            this.commit({ status: "offline" });
            const wait = RETRY_MS[Math.min(this.failures - 1, RETRY_MS.length - 1)];
            this.retryTimer = setTimeout(() => void this.flush(), wait);
            return;
          }
        }
      }
      if (this.needsRefresh) {
        this.needsRefresh = false;
        await this.pull();
      }
      this.commit({ status: "saved" });
    } finally {
      this.running = false;
    }
  }

  /** The server gave a temporary row its real id: fix the screen and any queued changes. */
  private rekey(from: number, to: number): void {
    this.queue = this.queue.map((o) => retarget(o, from, to));
    this.commit({ items: this.snap.items.map((i) => (i.id === from ? { ...i, id: to } : i)) });
  }

  private async pull(): Promise<void> {
    try {
      const res = await api<{ items: ListItem[] }>("/list");
      this.lastRefresh = Date.now();
      if (this.queue.length === 0) {
        this.commit({ items: res.items, status: "saved" });
        this.persist();
      }
    } catch {
      this.commit({ status: this.queue.length > 0 ? "offline" : "saved" });
    }
  }

  /** Re-read the server's list (when idle). */
  async refresh(): Promise<void> {
    if (this.running || this.queue.length > 0) return;
    await this.pull();
  }
}

/**
 * One store per browser tab, shared by every page, so the list is always the
 * same. On the server each render gets its own, so nothing leaks between
 * visitors.
 */
const shared = globalThis as typeof globalThis & { __dsListStore?: ListStore };

export function getListStore(initial: ListItem[]): ListStore {
  if (typeof window === "undefined") return new ListStore(initial);
  shared.__dsListStore ??= new ListStore(initial.map(fixItem));
  return shared.__dsListStore;
}

/** True when this phone holds changes that were never sent (no signal when they were made). */
export function hasPendingChanges(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && "queue" in parsed && Array.isArray((parsed as { queue: unknown }).queue) && (parsed as { queue: unknown[] }).queue.length > 0;
  } catch {
    return false;
  }
}
