import BadgeLogo from "@/components/qldpools/BadgeLogo";
import BrandWordmarkText from "@/components/BrandWordmarkText";

const YEAR = 2026;

const MENU = [
  "Pool Range",
  "Concrete Pools",
  "Renovations",
  "Gallery",
  "Reviews",
  "Contact",
];

const AREAS = [
  "Brisbane",
  "Gold Coast",
  "Sunshine Coast",
  "Logan & Ipswich",
  "Northern NSW",
];

/**
 * Footer — ported from the Lows "Marquee Band" footer (finbarstudio/
 * lowsdesignbuild app/components/Footer.tsx), reskinned to QPI: badge lockup +
 * CTA in the lead row, three ruled columns (menu / where we work / contact),
 * legal bar. Self-contained CSS, scoped with the qft- prefix.
 */
export default function MarqueeFooter() {
  return (
    <footer className="qft" role="contentinfo">
      <style>{css}</style>

      <div className="qft__inner">
        <div className="qft__lead">
          <BadgeLogo className="qft__badge" />
          <a href="tel:+61423123248" className="qft__cta">
            Get a quote <span className="qft__cta-arrow" aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="qft__cols">
          <nav className="qft__col" aria-label="Sitemap">
            <h2 className="qft__ch">Menu</h2>
            <ul className="qft__list">
              {MENU.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="qft__col">
            <h2 className="qft__ch">Where we work</h2>
            <ul className="qft__list qft__list--plain">
              {AREAS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="qft__col qft__col--contact">
            <h2 className="qft__ch">Get in touch</h2>
            <address className="qft__addr">
              <a className="qft__contact" href="mailto:poolsqld@gmail.com">
                poolsqld@gmail.com
              </a>
              <a className="qft__contact tabular-nums" href="tel:+61423123248">
                0423 123 248
              </a>
              <span className="qft__place">Brisbane, QLD</span>
            </address>
            <ul className="qft__list qft__list--plain qft__licences">
              <li>QBCC Licence #15377435</li>
              <li>NSW Builders Licence #453 712C</li>
            </ul>
          </div>
        </div>

        <div className="qft__bar">
          <p className="qft__legal">© {YEAR} QLD Pool Installs. All rights reserved.</p>
          <span className="qft__legal qft__credit">
            Concept site by <BrandWordmarkText className="qft__credit-mark" />
          </span>
        </div>
      </div>
    </footer>
  );
}

const css = `
.qft{
  --qft-pad: 20px;
  display:block; width:100%;
  background:#ffffff; color:var(--qpi-ink);
  font-family:var(--font-qpi), system-ui, sans-serif;
  box-sizing:border-box;
}
.qft *{box-sizing:border-box;}

.qft__inner{
  width:100%; max-width:1900px; margin:0 auto;
  padding:clamp(44px,6vw,72px) var(--qft-pad) 16px;
}
@media (min-width:640px){
  .qft{ --qft-pad: 28px; }
}

.qft__lead{
  display:flex; flex-wrap:wrap; align-items:flex-end;
  justify-content:space-between; gap:28px 40px;
  padding-bottom:clamp(36px,5vw,52px);
  border-bottom:1px solid rgba(11,42,74,0.15);
}
.qft__badge{ width:clamp(150px,20vw,240px); height:auto; margin:0 0 4px; }

.qft__cta{
  display:inline-flex; align-items:baseline; gap:0.7em;
  text-decoration:none; color:var(--qpi-ink);
  font-size:15px; font-weight:600; letter-spacing:0.02em;
  padding:14px 26px 14px 24px;
  border:1px solid var(--qpi-ink); border-radius:2px;
  background:transparent;
  transition:background .35s cubic-bezier(.2,.7,.2,1),
             color .35s cubic-bezier(.2,.7,.2,1),
             border-color .35s cubic-bezier(.2,.7,.2,1);
  white-space:nowrap;
}
.qft__cta-arrow{transition:transform .4s cubic-bezier(.2,.7,.2,1); display:inline-block;}
.qft__cta:hover{background:var(--qpi-ink); color:#ffffff; border-color:var(--qpi-ink);}
.qft__cta:hover .qft__cta-arrow{transform:translateX(5px);}

.qft__cols{
  display:grid; gap:clamp(32px,4vw,48px);
  grid-template-columns:repeat(3, minmax(0,1fr));
  padding:clamp(40px,5vw,56px) 0 clamp(36px,4vw,48px);
}
.qft__col{min-width:0;}
.qft__ch{
  margin:0 0 20px; font-size:11px; font-weight:700;
  letter-spacing:0.22em; text-transform:uppercase;
  color:var(--qpi-blue);
}
.qft__list{ list-style:none; margin:0; padding:0; }
.qft__list li{margin:0 0 11px;}
.qft__list--plain li{ font-size:14px; line-height:1.4; color:var(--qpi-ink); }
.qft__list a,
.qft__contact{
  display:inline-block;
  text-decoration:none; color:var(--qpi-ink);
  font-size:14px; line-height:1.4; letter-spacing:0.01em;
  transition:color .3s ease;
}
.qft__list a:hover,
.qft__contact:hover{color:var(--qpi-blue);}

.qft__addr{font-style:normal; display:flex; flex-direction:column; align-items:flex-start; gap:11px; margin-bottom:22px;}
.qft__place{font-size:14px; color:rgba(11,42,74,0.55); letter-spacing:0.01em;}
.qft__licences li{ font-size:12px; color:rgba(11,42,74,0.55); }

.qft__bar{
  display:flex; flex-wrap:wrap; align-items:center;
  justify-content:space-between;
  gap:10px 28px; padding-top:14px;
  border-top:1px solid rgba(11,42,74,0.15);
}
.qft__legal{margin:0; font-size:12px; letter-spacing:0.01em; color:rgba(11,42,74,0.55);}
.qft__credit{ margin-left:auto; display:inline-flex; align-items:center; gap:0.4em; }
.qft__credit-mark{ font-size:11px; color:var(--qpi-ink); }

.qft a:focus-visible{ outline:2px solid var(--qpi-blue); outline-offset:4px; border-radius:1px; }

@media (max-width:860px){
  .qft__cols{grid-template-columns:repeat(2,minmax(0,1fr)); gap:36px 32px;}
  .qft__col--contact{grid-column:1 / -1;}
}
@media (max-width:560px){
  .qft__lead{align-items:flex-start;}
  .qft__cta{width:100%; justify-content:space-between;}
  .qft__cols{grid-template-columns:repeat(2,minmax(0,1fr)); gap:36px 20px;}
  .qft__col--contact{grid-column:1 / -1;}
  .qft__bar{gap:14px;}
}

@media (prefers-reduced-motion:reduce){
  .qft__cta,
  .qft__cta-arrow,
  .qft__list a,
  .qft__contact{transition:none;}
}
`;
