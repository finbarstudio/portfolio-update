import { WEB_SITES, PER_PAGE, type Credit } from "@/content/web-sites";
import SiteThumbVideo from "@/components/home/SiteThumbVideo";

/**
 * The catalogue grid, shared by the page-1 route and the /page/[n] routes.
 * Newest first (sorted by id, descending), paginated PER_PAGE at a time.
 * Each tile is the site's 3:4 Instagram frame (still or looping clip), shown
 * greyscale until hovered.
 */
function Names({ list }: { list: Credit[] }) {
  return (
    <dd>
      {list.map((c, i) => (
        <span key={c.name}>
          {i > 0 && ", "}
          {c.url ? (
            <a href={c.url} target="_blank" rel="noopener noreferrer">
              {c.name}
            </a>
          ) : (
            c.name
          )}
        </span>
      ))}
    </dd>
  );
}

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
        {items.map((site, i) => {
          const alt = `${site.name} website`;
          return (
            <article key={site.id} className="wf-cell">
              <a className="wf-tile" href={site.url} target="_blank" rel="noopener noreferrer">
                {site.video ? (
                  <SiteThumbVideo
                    src={site.video.webm}
                    mp4={site.video.mp4}
                    poster={site.image}
                    alt={alt}
                    className="wf-media"
                    width={1080}
                    height={1440}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="wf-media"
                    src={site.image}
                    alt={alt}
                    width={1080}
                    height={1440}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                )}
              </a>
              <div className="wf-label">
                <a href={site.url} target="_blank" rel="noopener noreferrer">
                  {site.name}
                </a>
                <span className="wf-num">{String(site.id).padStart(4, "0")}</span>
              </div>
              {site.credits && (
                <dl className="wf-credits">
                  {site.credits.design && (
                    <div><dt>Design</dt><Names list={site.credits.design} /></div>
                  )}
                  {site.credits.development && (
                    <div><dt>Development</dt><Names list={site.credits.development} /></div>
                  )}
                  {site.credits.built && (
                    <div><dt>Built with</dt><Names list={site.credits.built} /></div>
                  )}
                </dl>
              )}
            </article>
          );
        })}
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
