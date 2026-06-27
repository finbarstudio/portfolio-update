import LogoMark from "../LogoMark";
import MaskReveal from "../MaskReveal";

/** Tall footer: a four-column info row over a full-bleed BRAEDEN wordmark sweep
 *  (Lindon-style). The columns clip-rise in a stagger, then the giant wordmark
 *  wipes up into view as it enters. */
const COLS: { label: string; rows: React.ReactNode[] }[] = [
  {
    label: "Studio",
    rows: [<>Braeden Constructions</>, <>Custom home builders</>, <>Sunshine Coast, est. 1996</>],
  },
  {
    label: "Visit",
    rows: [<>Hoy Rd, Lake McDonald</>, <>Noosa Hinterland, QLD</>, <>By appointment</>],
  },
  {
    label: "Contact",
    rows: [
      <a key="t" href="tel:+61418505117">0418 505 117</a>,
      <>Deal direct with Mick</>,
    ],
  },
  {
    label: "Follow",
    rows: [
      <a key="f" href="https://www.facebook.com/braedenconstructions/" target="_blank" rel="noopener noreferrer">Facebook</a>,
      <>MBA Member #19831</>,
    ],
  },
];

export default function Footer() {
  return (
    <footer className="brd-foot">
      <MaskReveal direction="left" duration={1.1} className="brd-foot-rule">
        <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      </MaskReveal>

      <div className="brd-foot-grid">
        {COLS.map((c, i) => (
          <MaskReveal key={c.label} direction="up" delay={i * 0.08} duration={1}>
            <div>
              <p className="brd-foot-label">{c.label}</p>
              <p className="brd-foot-val">
                {c.rows.map((r, j) => (
                  <span key={j}>
                    {r}
                    {j < c.rows.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            </div>
          </MaskReveal>
        ))}
      </div>

      <MaskReveal direction="up" duration={1.6} start="top 92%" className="brd-mark">
        <LogoMark className="w-full h-auto" />
      </MaskReveal>

      <div className="brd-foot-base">
        <span>QBCC 1017247 · Master Builders Queensland</span>
        <span>Concept site by finbar✶studio</span>
      </div>
    </footer>
  );
}
