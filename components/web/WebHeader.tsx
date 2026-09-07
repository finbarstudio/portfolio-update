import WebWordmark from "@/components/web/WebWordmark";
import BrandWordmark from "@/components/BrandWordmark";

/**
 * web.finbar header on the section's 3-column grid: the WEBFINBAR lockup
 * with the studio wordmark beside it (linking home to finbar.studio), an
 * empty middle column, then the two links set to the right edge. Links are
 * plain clean paths (`/`, `/submit`) because proxy.ts rewrites them on the
 * subdomain; a `/web/...` prefix here would leak into the URL.
 */
export default function WebHeader() {
  return (
    <header className="wf-grid wf-header">
      <div className="wf-logos">
        <a href="/" className="wf-logo" aria-label="web.finbar home">
          <WebWordmark />
        </a>
        <a
          href="https://www.finbar.studio"
          className="wf-logo wf-logo-studio"
          aria-label="finbar.studio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandWordmark />
        </a>
      </div>
      <span />
      <nav className="wf-nav" aria-label="web.finbar">
        <a href="/submit">Submit a site</a>
        <a href="https://instagram.com/web.finbar" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </nav>
    </header>
  );
}
