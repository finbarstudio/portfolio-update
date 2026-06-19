/**
 * Shared smooth-scroll helper for the home page logo.
 *
 * Target = the disciplines hero (id="hero", the big "Brand ⦿ Digital…" text),
 * which sits just below the intro screen and above the projects — so clicking
 * the logo lifts you to the start of the hero, not all the way to the intro.
 */

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function scrollToHero() {
  const target = document.getElementById("hero");
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--menubar-h")) || 56;
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;

  if (target && lenis) {
    // Slow, eased Lenis scroll; offset clears the fixed nav.
    lenis.scrollTo(target, { offset: -navH - 8, duration: 1.7, easing: easeInOutCubic });
    return;
  }
  if (target) {
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top: y, behavior: "smooth" });
    return;
  }
  // Fallback: top of the page.
  if (lenis) lenis.scrollTo(0, { duration: 1.7, easing: easeInOutCubic });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
