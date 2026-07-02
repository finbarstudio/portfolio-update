import Reveal from "@/components/toombul/Reveal";

// The lineage — real club history as a bare ledger. Years in Barlow red,
// facts in Inter. No cards, no icons, just the record.
const MOMENTS = [
  {
    year: "1882",
    fact: "Records begin at the Toombul District Cricket Club, one of the oldest sporting clubs in Australia.",
  },
  {
    year: "1946",
    fact: "Bill Brown captains Australia, still the only Queensland-born player ever to do it.",
  },
  {
    year: "1948",
    fact: "Don Tallon, Bill Brown and Colin McCool tour England undefeated with Bradman's Invincibles.",
  },
  {
    year: "1970s",
    fact: "Jeff Thomson, the fastest bowler the game has seen, tears in off the long run for Toombul.",
  },
  {
    year: "2016",
    fact: "Toombul junior Matthew Renshaw walks out at Adelaide Oval to debut for Australia.",
  },
  {
    year: "Today",
    fact: "11 Test players, 4 one-day internationals, 3 T20 internationals and 61 Sheffield Shield players, so far.",
  },
];

export default function Lineage() {
  return (
    <section className="tc-lineage">
      <div className="tc-wrap">
        <Reveal>
          <span className="tc-eyebrow">The lineage</span>
        </Reveal>
        <div className="tc-lineage-rows">
          {MOMENTS.map((m, i) => (
            <Reveal key={m.year} delay={i * 60}>
              <div className="tc-lineage-row">
                <span className="tc-lineage-year">{m.year}</span>
                <span className="tc-lineage-fact">{m.fact}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
