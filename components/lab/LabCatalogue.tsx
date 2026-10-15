import { LAB_ITEMS } from "@/content/lab-items";
import LabHeader from "@/components/lab/LabHeader";
import DinoBadge from "@/components/moto-technique/DinoBadge";
import { heroMark } from "@/content/moto-technique";

/**
 * The lab grid: the same shape as web.finbar's catalogue (empty void, then a
 * strict 3-column grid of 3:4 tiles), on black. Plain: each tile carries only
 * its number. Newest first. Loose tiles sit in the TOP row, so every row
 * below it is full (the same rule as web.finbar): the row breaks after the
 * loose ones, by data-r3 / data-r2 on the grid (see lab.css).
 * No pagination and no submit form yet. Each tile is one word, a wordmark
 * still, greyscale until hovered (touch screens get colour). The Dino tile is
 * the one live one: the demo's metal badge itself, tilting to the pointer.
 */
export default function LabCatalogue() {
  const items = LAB_ITEMS; // shown in the order set in content/lab-items.ts

  return (
    <>
      <LabHeader />

      <div className="lb-void" />

      <div className="lb-grid" data-r3={items.length % 3} data-r2={items.length % 2}>
        {items.map((item, i) => (
          <article
            key={item.id}
            className="lb-cell lb-fade"
            style={{ "--i": 2 + i } as React.CSSProperties}
          >
            <a className="lb-tile" href={item.href} aria-label={item.name}>
              {item.live === "dino" && heroMark ? (
                <span className="lb-media lb-live">
                  <DinoBadge title={heroMark} active lab />
                </span>
              ) : item.video ? (
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
