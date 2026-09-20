/**
 * Is this a phone-sized screen? The same breakpoint the stylesheet uses to swap
 * the desktop page for the plain mobile one (MobileHome.tsx).
 *
 * Hiding the desktop sections with CSS does not stop their scripts: a hidden
 * component still mounts, and would still start WebGL, smooth scrolling and
 * per-frame scroll work for something nobody can see. Every desktop-only effect
 * asks this first and does nothing on a phone. That, more than any styling, is
 * what makes the phone page light.
 *
 * Read once, at mount. Nobody resizes a phone across 760px.
 */
export const PHONE = "(max-width: 760px)";
export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE).matches;
