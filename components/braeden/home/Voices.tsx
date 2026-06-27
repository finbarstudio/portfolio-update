/**
 * Braeden homepage — WORD OF MOUTH (cohesive card system). A sticky heading + a
 * hairline-divided stack of real client quotes, each with a Space Mono credit.
 */

import { CardSection } from "./Card";

const QUOTES = [
  { q: "Mick and his team are more than tradesmen, they are craftsmen whose attitude and application to their work produces outstanding results.", a: "Brian & Dotty Knott · Noosa Heads" },
  { q: "The craftsmanship exhibited in so many areas of the house is testament to the skill of the people Mick chooses to work with.", a: "Mike & Sim Burgess · Noosa Heads" },
  { q: "Your service after handover has been, without question, of the highest order.", a: "Greg & Cheryl O'Neill · Doonan" },
  { q: "We rate our experience of building with Braeden the smoothest and most enjoyable project to date.", a: "Daylight Studios · Coolum" },
];

export default function Voices() {
  return (
    <CardSection
      eyebrow="In their words"
      title="Word of mouth"
      intro="Most of our work comes by referral and repeat clients."
    >
      <div style={{ borderTop: "1px solid var(--line)" }}>
        {QUOTES.map((t, i) => (
          <figure key={i} style={{ borderBottom: "1px solid var(--line)", padding: "clamp(20px,2.4vw,34px) 0", margin: 0 }}>
            <blockquote className="ff-quick" style={{ fontSize: "clamp(16px,1.4vw,23px)", lineHeight: 1.45, color: "var(--ink)", margin: 0 }}>{t.q}</blockquote>
            <figcaption className="ff-mono" style={{ marginTop: "0.9em", fontSize: "clamp(9px,0.72vw,10.5px)", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)" }}>{t.a}</figcaption>
          </figure>
        ))}
      </div>
    </CardSection>
  );
}
