/**
 * Braeden homepage — STORY (cohesive card system). A sticky "Since 1996" heading
 * + the referral pull-line, a short paragraph, and a hairline milestone ledger.
 */

import { CardSection, Ledger, Row } from "./Card";

export default function Story() {
  return (
    <CardSection
      eyebrow="Our story"
      title="Since 1996"
      intro="One of the most decorated custom-home records on the Sunshine Coast."
      headExtra={
        <a href="/braeden/site/about" className="redlink" style={{ marginTop: "2em", display: "inline-flex" }}>
          About Mick <span className="ar" aria-hidden>→</span>
        </a>
      }
    >
      <p className="ff-mont" style={{ fontWeight: 700, fontSize: "clamp(22px,2.5vw,40px)", lineHeight: 1.18, letterSpacing: "-0.01em", color: "var(--ink)", maxWidth: "20ch", margin: "0 0 0.7em" }}>
        More than 35 years building on the Sunshine Coast, and most of our work still comes by referral.
      </p>
      <p className="ff-quick" style={{ fontSize: "clamp(15px,1.1vw,18px)", lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: "54ch", margin: "0 0 2.2em" }}>
        Mick Devlin started Braeden in 1996 and moved to Noosa in 2001. On every build you deal directly with Mick, start to finish.
      </p>
      <Ledger>
        <Row k="1996">Founded by Mick Devlin</Row>
        <Row k="2001">Moved to Noosa with Sally and family</Row>
        <Row k="2010">First Sunshine Coast builder to win National House of the Year</Row>
        <Row k="Today">Still mostly word of mouth, you deal direct with Mick</Row>
      </Ledger>
    </CardSection>
  );
}
