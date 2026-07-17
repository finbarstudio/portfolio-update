import { club, contact } from "@/content/toombul";

export default function Footer() {
  return (
    <footer className="tc-footer" id="contact">
      <div className="tc-wrap">
        <div className="tc-footer-top">
          <div>
            <div className="tc-footer-crest">
              <img src="/toombul/logo.svg" alt="" />
              <div>
                <div className="tc-footer-crest-word">{club.name}</div>
                <div className="tc-footer-crest-sub">Est. {club.founded} · {club.competition}</div>
              </div>
            </div>
          </div>

          <div className="tc-footer-col">
            <div className="tc-footer-col-title">Main Ground</div>
            <p>{contact.ground}</p>
            <p>{contact.address}</p>
            <p>{contact.postal}</p>
          </div>

          <div className="tc-footer-col">
            <div className="tc-footer-col-title">Club</div>
            {contact.roles.map((r) => (
              <p key={r.role}>
                {r.role}: {r.name}
              </p>
            ))}
          </div>
        </div>

        <div className="tc-footer-word" aria-hidden="true">
          Toombul
        </div>

        <div className="tc-footer-bottom">
          <span>&copy; {club.founded}–2026 Toombul District Cricket Club</span>
          <span>A demo redesign by Finbar Studio</span>
        </div>
      </div>

      <a href="/" className="tc-back-pill" aria-label="Back to finbar.studio">
        <span aria-hidden="true">&larr;</span>
        <span className="tc-back-pill-text">back to finbar.studio</span>
      </a>
    </footer>
  );
}
