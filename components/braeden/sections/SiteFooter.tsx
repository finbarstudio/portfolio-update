import LogoMark from "../LogoMark";
import MaskReveal from "../MaskReveal";

/** Tall footer: a four-column info grid over a full-bleed wordmark sweep.
 *  Premium scroll-triggered motion: the columns clip-rise in a stagger, then the
 *  giant wordmark wipes up into view as it enters. */
const COLS = [
  {
    label: "Studio",
    rows: [<>A Rolley &amp; Sons</>, <>Fourth-generation builders</>, <>Sunshine Coast, QLD</>],
  },
  {
    label: "Visit",
    rows: [<>37 Ascot Way</>, <>Little Mountain QLD 4551</>, <>By appointment</>],
  },
  {
    label: "Contact",
    rows: [
      <a key="t" href="tel:+61754996811">07 5499 6811</a>,
      <a key="s" href="/braeden/site#contact">Start a project</a>,
    ],
  },
  {
    label: "Follow",
    rows: [
      <a key="i" href="https://www.instagram.com/braedenandsons/" target="_blank" rel="noopener noreferrer">Instagram</a>,
      <a key="f" href="https://www.facebook.com/BraedennSons/" target="_blank" rel="noopener noreferrer">Facebook</a>,
    ],
  },
];

export default function SiteFooter() {
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
        <span>QBCC 1098669 · Master Builders Queensland</span>
        <span>Concept site by finbar✶studio</span>
      </div>
    </footer>
  );
}
