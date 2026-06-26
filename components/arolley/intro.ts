// Coordinates page-entry reveals with the preloader. The preloader sets a
// per-session flag and dispatches "arl:intro" when it lifts. Reveal components
// call playOnIntro(fn): if the preloader already ran this session (or won't run,
// e.g. a client-side navigation), fn fires next frame; otherwise it waits for the
// lift, with a fallback timeout so content never gets stuck hidden.
export const INTRO_EVENT = "arl:intro";
export const PRELOAD_KEY = "arl:preloaded";

export function alreadyPreloaded(): boolean {
  try {
    return !!sessionStorage.getItem(PRELOAD_KEY);
  } catch {
    return false;
  }
}

export function playOnIntro(fn: () => void): () => void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  if (alreadyPreloaded()) {
    const r = requestAnimationFrame(() => requestAnimationFrame(run));
    return () => cancelAnimationFrame(r);
  }
  window.addEventListener(INTRO_EVENT, run, { once: true });
  const t = window.setTimeout(run, 3200);
  return () => {
    window.removeEventListener(INTRO_EVENT, run);
    clearTimeout(t);
  };
}
