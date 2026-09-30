import { LAB_ITEMS } from "@/content/lab-items";
import LabHeader from "@/components/lab/LabHeader";

/**
 * The lab grid: the same shape as web.finbar's catalogue (empty void, then a
 * strict 3-column grid of 3:4 tiles), on black. Plain: each tile carries only
 * its number. Newest first.
 * No pagination and no submit form yet. Each tile is a looping clip that
 * starts greyscale and goes colour on hover (touch screens get colour).
 */
export default function LabCatalogue() {
  const items = [...LAB_ITEMS].sort((a, b) => b.id - a.id);

  return (
    <>
      <LabHeader />

      <div className="lb-void" />

      <div className="lb-grid">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="lb-cell lb-fade"
            style={{ "--i": 2 + i } as React.CSSProperties}
          >
            <a className="lb-tile" href={item.href} aria-label={item.name}>
              {item.video ? (
                <video
                  className="lb-media"
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              ) : (
                <img className="lb-media" src={item.image} alt="" loading="lazy" decoding="async" />
              )}
            </a>
            <div className="lb-label">
              <span className="lb-num">{String(item.id).padStart(4, "0")}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
