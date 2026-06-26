import LogoMark from "../LogoMark";

/** Tall footer: a four-column info grid over a full-bleed wordmark sweep. */
export default function SiteFooter() {
  return (
    <footer className="arl-foot">
      <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      <div className="arl-foot-grid">
        <div>
          <p className="arl-foot-label">Studio</p>
          <p className="arl-foot-val">
            A Rolley &amp; Sons<br />
            Fourth-generation builders<br />
            Sunshine Coast, QLD
          </p>
        </div>
        <div>
          <p className="arl-foot-label">Visit</p>
          <p className="arl-foot-val">
            37 Ascot Way<br />
            Little Mountain QLD 4551<br />
            By appointment
          </p>
        </div>
        <div>
          <p className="arl-foot-label">Contact</p>
          <p className="arl-foot-val">
            <a href="tel:+61754996811">07 5499 6811</a><br />
            <a href="/a-rolley/site#contact">Start a project</a>
          </p>
        </div>
        <div>
          <p className="arl-foot-label">Follow</p>
          <p className="arl-foot-val">
            <a href="https://www.instagram.com/arolleyandsons/" target="_blank" rel="noopener noreferrer">Instagram</a><br />
            <a href="https://www.facebook.com/ARolleynSons/" target="_blank" rel="noopener noreferrer">Facebook</a>
          </p>
        </div>
      </div>

      <div className="arl-mark" aria-hidden="true">
        <LogoMark className="w-full h-auto" />
      </div>

      <div className="arl-foot-base">
        <span>QBCC 1098669 · Master Builders Queensland</span>
        <span>Concept site by finbar✶studio</span>
      </div>
    </footer>
  );
}
