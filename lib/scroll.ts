/**
 * Shared smooth-scroll helpers for the home page logo + "Home" nav item.
 *
 * "Top project" = the Selected Work section (id="top-work") — clicking the logo
 * or Home takes you up to the work, NOT all the way back to the intro screen.
 */

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function scrollToTopProject() {
  const target = document.getElementById("top-work");
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
