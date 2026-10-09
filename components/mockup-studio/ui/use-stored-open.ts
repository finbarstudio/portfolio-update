import { useEffect, useState } from "react";

const PREFIX = "mockup-studio:open:";

/**
 * Whether a folding part of the panels is open, remembered between visits
 * under `key`. Starts from `fallback` so the first paint matches the server,
 * then takes the stored choice once the browser can be asked.
 */
export function useStoredOpen(
  key: string,
  fallback: boolean,
): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(fallback);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFIX + key);
      if (stored !== null) setOpen(stored === "1");
    } catch {
      // Storage blocked: the fallback stands.
    }
  }, [key]);

  function set(next: boolean) {
    setOpen(next);
    try {
      localStorage.setItem(PREFIX + key, next ? "1" : "0");
    } catch {
      // Storage blocked: the choice still lasts until the page closes.
    }
  }

  return [open, set];
}
