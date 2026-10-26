"use client";

import { useRef, useState } from "react";
import { gbp } from "@/lib/dad-shop/format";
import { singlePence } from "@/lib/dad-shop/pricing";
import type { ProductCard } from "@/lib/dad-shop/types";
import { api } from "./api";
import type { ListStore } from "./listStore";
import { ProductImage } from "./ui";

/**
 * "Add something": type to search products, tap one to add it, or add what he
 * typed as plain text ("milk"). Searches as he types, after a short pause.
 */
export default function AddItem({ store }: { store: ListStore }) {
  const [text, setText] = useState("");
  const [results, setResults] = useState<ProductCard[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [note, setNote] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(0);

  function onChange(value: string) {
    setText(value);
    setNote("");
    if (timer.current) clearTimeout(timer.current);
    latest.current += 1;
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearching(false);
      setSearchFailed(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(() => void search(trimmed), 250);
  }

  async function search(query: string) {
    const mine = ++latest.current;
    try {
      const res = await api<{ items: ProductCard[] }>(`/products?q=${encodeURIComponent(query)}&limit=6`);
      if (mine !== latest.current) return;
      setResults(res.items);
      setSearchFailed(false);
    } catch {
      if (mine !== latest.current) return;
      setResults([]);
      setSearchFailed(true);
    } finally {
      if (mine === latest.current) setSearching(false);
    }
  }

  function reset(message: string) {
    if (timer.current) clearTimeout(timer.current);
    latest.current += 1;
    setText("");
    setResults([]);
    setSearching(false);
    setSearchFailed(false);
    setNote(message);
  }

  function addProduct(p: ProductCard) {
    store.add(p);
    reset(`Added ${p.name}.`);
  }

  function addText() {
    const label = text.replace(/\s+/g, " ").trim();
    if (!label) return;
    store.addText(label.slice(0, 120));
    reset(`Added ${label.slice(0, 120)}.`);
  }

  const trimmed = text.trim();

  return (
    <form
      className="ds-add"
      onSubmit={(e) => {
        e.preventDefault();
        addText();
      }}
    >
      <label className="ds-label" htmlFor="ds-add-input">
        Add to your list
      </label>
      <div className="ds-add-row">
        <input
          id="ds-add-input"
          className="ds-input"
          type="search"
          inputMode="search"
          enterKeyHint="done"
          autoComplete="off"
          autoCapitalize="none"
          maxLength={120}
          placeholder="Type a product, like chicken"
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit" className="ds-btn ds-btn--primary" disabled={trimmed.length === 0}>
          Add
        </button>
      </div>

      {trimmed.length >= 2 && (
        <div className="ds-suggest">
          {searching && results.length === 0 && <p className="ds-muted">Looking…</p>}
          {searchFailed && <p className="ds-muted">Couldn&apos;t search just now. You can still add it as written.</p>}
          {!searching && !searchFailed && results.length === 0 && (
            <p className="ds-muted">Nothing found for that. You can add it as written.</p>
          )}
          {results.length > 0 && (
            <ul className="ds-suggest-list">
              {results.map((p) => (
                <li key={p.id}>
                  <button type="button" className="ds-suggest-item" onClick={() => addProduct(p)}>
                    <ProductImage src={p.imageUrl} className="ds-img--sm" />
                    <span className="ds-suggest-name">{p.name}</span>
                    <span className="ds-suggest-price">{gbp(singlePence(p) / 100)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="ds-btn ds-btn--ghost ds-btn--wide" onClick={addText}>
            Add &ldquo;{trimmed}&rdquo; as written
          </button>
        </div>
      )}

      <p className="ds-sr" role="status" aria-live="polite">
        {note}
      </p>
      {note && <p className="ds-muted ds-note">{note}</p>}
    </form>
  );
}
