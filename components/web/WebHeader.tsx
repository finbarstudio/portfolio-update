import BrandWordmark from "@/components/BrandWordmark";

/**
 * web.finbar header: Menu-style nav / logo / year, laid out on the same
 * 3-column .wf-grid as everything else in the section. Links are plain clean
 * paths (`/`, `/submit`) — proxy.ts rewrites them on the subdomain, so a
 * `/web/...` prefix here would leak into the URL.
 */
export default function WebHeader() {
  return (
    <header className="wf-grid wf-header">
      <nav className="wf-nav" aria-label="web.finbar">
        <a href="/">Catalogue</a>
        <a href="/submit">Submit</a>
        <a href="https://instagram.com/web.finbar" target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </nav>
      <a href="/" className="wf-logo" aria-label="web.finbar home">
        <BrandWordmark />
      </a>
      <span>{new Date().getFullYear()}</span>
    </header>
  );
}
