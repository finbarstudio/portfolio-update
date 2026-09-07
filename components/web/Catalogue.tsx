import { WEB_SITES, PER_PAGE } from "@/content/web-sites";

/**
 * The catalogue grid, shared by the page-1 route and the /page/[n] routes.
 * Newest first (sorted by id, descending), paginated PER_PAGE at a time.
 */
export default function Catalogue({ page }: { page: number }) {
  const sorted = [...WEB_SITES].sort((a, b) => b.id - a.id);
  const total = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const items = sorted.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="wf-void" />

      <div className="wf-grid wf-row">
        <span>
          {sorted.length} {sorted.length === 1 ? "website" : "websites"}
        </span>
        <span />
        <span className="wf-right">{total > 1 ? `Page ${page} of ${total}` : ""}</span>
      </div>

      <div className="wf-grid">
        {items.map((site, i) => (
          <article key={site.id} className="wf-cell">
            <a className="wf-tile" href={site.url} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.image}
                alt={`${site.name} website`}
                width={1440}
                height={810}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
              />
            </a>
            <div className="wf-label">
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                {site.name}
              </a>
              <span className="wf-num">{String(site.id).padStart(4, "0")}</span>
            </div>
          </article>
        ))}
      </div>

      <nav className="wf-grid wf-row" aria-label="Pages">
        <span>
          {page > 1 && <a href={page - 1 === 1 ? "/" : `/page/${page - 1}`}>← Newer</a>}
        </span>
        <span />
        <span className="wf-right">{page < total && <a href={`/page/${page + 1}`}>Older →</a>}</span>
      </nav>
    </>
  );
}
