/**
 * Braeden homepage — AWARDS (the reference section, now in the shared card).
 * A sticky "Awards" heading + a hairline ledger of the real decorations, with
 * Space Mono year/count keys and a membership note.
 */

import { CardSection, Ledger, Row } from "./Card";

export default function Awards() {
  return (
    <CardSection
      eyebrow="Recognition"
      title="Awards"
      intro="A decorated record on the Sunshine Coast."
      headExtra={<p className="bnote">MBA Member #19831 · QBCC #1017247</p>}
    >
      <Ledger>
        <Row k="2025" sub="Riverside · Noosaville">Best Individual Home ($5m to $10m)</Row>
        <Row k="2025" sub="Riverside · Noosaville">Best Residential Kitchen</Row>
        <Row k="2010">National Residential Master Builder of the Year</Row>
        <Row k="2010">National House of the Year</Row>
        <Row k="×3">House of the Year · Sunshine Coast</Row>
        <Row k="×2">House of the Year · Queensland</Row>
        <Row k="MBA QLD" sub="Modern Thai House · Noosa Heads">House of the Year</Row>
      </Ledger>
    </CardSection>
  );
}
