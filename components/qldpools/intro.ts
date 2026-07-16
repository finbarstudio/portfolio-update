/**
 * The demo's intro handshake.
 *
 * Two things this has to survive, both learned the hard way:
 *
 * 1. A bare `qpi:intro-done` window event is a ONE-SHOT. If a component was
 *    between mounts when it fired (StrictMode's double-invoke, a Fast Refresh
 *    remount), its listener missed it for good and the hero sat empty until a
 *    fail-open timeout rescued it.
 * 2. Module-scoped state is NOT reliably shared. The bundler can hand two
 *    client boundaries their own instance of this module, so a promise
 *    resolved from the Preloader's copy never resolved for the Hero's copy.
 *
 * So the state lives on `window` — one instance, guaranteed — and callers get
 * a promise, which cannot be missed after the fact.
 */

type IntroState = { done: boolean; waiters: Array<() => void> };

function state(): IntroState {
  const w = window as unknown as { __qpiIntro?: IntroState };
  if (!w.__qpiIntro) w.__qpiIntro = { done: false, waiters: [] };
  return w.__qpiIntro;
}

/** Called once by the Preloader when the curtain has lifted. */
export function markIntroDone() {
  if (typeof window === "undefined") return;
  const s = state();
  if (s.done) return;
  s.done = true;
  (window as unknown as { __qpiPreloaderLifted?: boolean }).__qpiPreloaderLifted = true;
  s.waiters.splice(0).forEach((f) => f());
  // Kept for the components still listening for the event.
  window.dispatchEvent(new Event("qpi:intro-done"));
}

/** Resolves when the intro is done — immediately if it already happened. */
export function whenIntroDone(): Promise<void> {
  if (typeof window === "undefined") return new Promise<void>(() => {});
  const s = state();
  if (s.done) return Promise.resolve();
  return new Promise<void>((res) => s.waiters.push(res));
}

export function isIntroDone() {
  return typeof window !== "undefined" && state().done;
}
