import { useSyncExternalStore } from "react";

const QUERY = "(min-width: 1000px)";

function subscribe(notify: () => void): () => void {
  const list = window.matchMedia(QUERY);
  list.addEventListener("change", notify);
  return () => list.removeEventListener("change", notify);
}

/** True when the window is wide enough for the editor layout. */
export function useDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    // The server cannot know; assume desktop and let the client correct it.
    () => true,
  );
}
