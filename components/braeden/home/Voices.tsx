/**
 * Braeden homepage — a single client voice, set as a quiet type-led band (no
 * grid). Word of mouth is the whole business, so one real quote carries it.
 */

export default function Voices() {
  return (
    <section className="brd-band" style={{ background: "var(--paper-2)" }}>
      <p className="eyebrow">In their words</p>
      <blockquote className="brd-band-quote" style={{ textTransform: "none", fontWeight: 400, fontFamily: "var(--font-quick)", letterSpacing: 0, maxWidth: "24ch" }}>
        “Mick and his team are more than tradesmen, they are craftsmen whose attitude and application
        to their work produces outstanding results.”
      </blockquote>
      <p className="brd-band-cite">Brian &amp; Dotty Knott <b>·</b> Noosa Heads</p>
    </section>
  );
}
