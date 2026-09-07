import WebWordmark from "@/components/web/WebWordmark";

/**
 * web.finbar header on the section's 3-column grid: the WEBFINBAR lockup,
 * a one-line tagline, then the two links set to the right edge. Links are
 * plain clean paths (`/`, `/submit`) because proxy.ts rewrites them on the
 * subdomain; a `/web/...` prefix here would leak into the URL.
 */
export default function WebHeader() {
  return (
    <header className="wf-grid wf-header">
      <a href="/" className="wf-logo" aria-label="web.finbar home">
        <WebWordmark />
      </a>
      <span className="wf-tagline">Good websites, one at a time.</span>
      <nav className="wf-nav" aria-label="web.finbar">
        <a href="/submit">Submit a site</a>
        <a href="https://instagram.com/web.finbar" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </nav>
    </header>
  );
}
