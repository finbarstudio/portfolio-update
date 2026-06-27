// Coordinates page-entry reveals with the preloader. The preloader calls
// fireIntro() when it lifts (and a safety timer guarantees that even if its
// animation stalls). Reveal components call playOnIntro(fn): it runs fn once the
// intro has happened — immediately if it already has (this session / flagged),
// on the event otherwise, and on a hard fallback so text can NEVER stay hidden.
export const INTRO_EVENT = "brd:intro";
export const PRELOAD_KEY = "brd:preloaded";

let introFired = false;
if (typeof window !== "undefined") {
  window.addEventListener(INTRO_EVENT, () => {
    introFired = true;
  });
}

export function alreadyPreloaded(): boolean {
  try {
    return !!sessionStorage.getItem(PRELOAD_KEY);
  } catch {
    return false;
  }
}

/** Clear the gate so the preloader plays again on the next demo load — used when
 *  entering the demo from the marketing/pitch page, so Finbar gets the branded
 *  intro every time he demos it (internal navigation + refresh stay gated). */
export function resetIntro(): void {
  introFired = false;
  try {
    sessionStorage.removeItem(PRELOAD_KEY);
  } catch {}
}

/** Mark the intro done + tell every waiting reveal to play. Idempotent. */
export function fireIntro(): void {
  introFired = true;
  try {
    sessionStorage.setItem(PRELOAD_KEY, "1");
  } catch {}
  if (typeof window !== "undefined") window.dispatchEvent(new Event(INTRO_EVENT));
}

export function playOnIntro(fn: () => void): () => void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    fn();
  };
  // Intro already happened (flagged this render, or preloader seen this session).
  if (introFired || alreadyPreloaded()) {
    const r = requestAnimationFrame(() => requestAnimationFrame(run));
    const t = window.setTimeout(run, 300); // safety if rAF is throttled
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }
  // Wait for the intro, with a hard fallback so the text reveals no matter what.
  window.addEventListener(INTRO_EVENT, run, { once: true });
  const t = window.setTimeout(run, 3600);
  return () => {
    window.removeEventListener(INTRO_EVENT, run);
    clearTimeout(t);
  };
}
