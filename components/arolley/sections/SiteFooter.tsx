import LogoMark from "../LogoMark";
import MaskReveal from "../MaskReveal";
import BrandWordmark from "@/components/BrandWordmark";

/** Tall footer: a four-column info grid over a full-bleed wordmark sweep, with
 *  the Master Builders QLD membership badge in the base row. Premium
 *  scroll-triggered motion: the columns clip-rise in a stagger, then the giant
 *  wordmark wipes up as it enters. `base` keeps internal links on the right
 *  version (signature vs editorial). */
export default function SiteFooter({ base = "/a-rolley/site", tone }: { base?: string; tone?: "dark" }) {
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
        <a key="s" href={`${base}#contact`}>Start a project</a>,
      ],
    },
    {
      label: "Follow",
      rows: [
        <a key="i" href="https://www.instagram.com/arolleyandsons/" target="_blank" rel="noopener noreferrer">Instagram</a>,
        <a key="f" href="https://www.facebook.com/ARolleynSons/" target="_blank" rel="noopener noreferrer">Facebook</a>,
      ],
    },
  ];

  return (
    <footer className="arl-foot" data-tone={tone === "dark" ? "dark" : undefined}>
      <MaskReveal direction="left" duration={1.1} className="arl-foot-rule">
        <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      </MaskReveal>

      <div className="arl-foot-grid">
        {COLS.map((c, i) => (
          <MaskReveal key={c.label} direction="up" delay={i * 0.08} duration={1}>
            <div>
              <p className="arl-foot-label">{c.label}</p>
              <p className="arl-foot-val">
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

      <MaskReveal direction="up" duration={1.6} start="top 92%" className="arl-mark">
        <LogoMark className="w-full h-auto" />
      </MaskReveal>

      <div className="arl-foot-base">
        <span className="arl-mbq" role="img" aria-label="Proud Member of Master Builders Queensland" />
        <span className="inline-flex items-center" style={{ gap: "0.5em", flexWrap: "wrap" }}>
          QBCC 1098669 &middot; Concept site by <BrandWordmark className="arl-foot-mark" />
        </span>
      </div>
    </footer>
  );
}
