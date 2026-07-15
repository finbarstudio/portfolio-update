/**
 * SiteFooter — the about / projects pages share the homepage's footer verbatim,
 * so the whole demo closes the same way (real Braeden logo, dark ground). Single
 * source of truth lives in home/Footer; this re-export keeps existing imports
 * (and replaces the old stale-content copy that still read "A Rolley & Sons").
 */
export { default } from "../home/Footer";
