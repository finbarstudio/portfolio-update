"use client";

import { useSyncExternalStore } from "react";
import { LAYOUT_KEY, parseLayout, type SimilarLayout } from "@/lib/dad-shop/similar";

const EVENT = "dadshop:similar-layout";

/** What was picked on this visit, for browsers where storage is switched off. */
let picked: SimilarLayout | null = null;

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function read(): SimilarLayout {
  if (picked) return picked;
  try {
    return parseLayout(window.localStorage.getItem(LAYOUT_KEY));
  } catch {
    return "cards";
  }
}

function write(next: SimilarLayout): void {
  picked = next;
  try {
    window.localStorage.setItem(LAYOUT_KEY, next);
  } catch {
    // Private window or storage off: the switch still works until he leaves.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Cards or Compare, remembered on this phone. Cards on the server and until the browser has been asked. */
export function useSimilarLayout(): [SimilarLayout, (next: SimilarLayout) => void] {
  const layout = useSyncExternalStore(subscribe, read, () => "cards" as const);
  return [layout, write];
}
