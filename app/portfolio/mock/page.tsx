import { notFound } from "next/navigation";
import { media } from "@/lib/media";
import "../portfolio.css";
import "./mock.css";

/**
 * A layout test, on the dev server only: the Lows van at three landscape
 * shapes (2:1, 4:3, 16:9), each shown full bleed and at two margins, so
 * Finbar can pick the shape and margin to make his portfolio images to.
 * The van's own backdrop is extended with a flat fill to reach each shape.
 * Not part of the portfolio; delete once the standard is chosen.
 */
const VAN = media("/media/images/portfolio/lows/van.webp");
const SHAPES = [
  { name: "2:1", r: 2 },
  { name: "4:3", r: 4 / 3 },
  { name: "16:9", r: 16 / 9 },
];
const FITS = [
  { name: "Full bleed", cls: "is-bleed" },
  { name: "Small margin", cls: "is-m1" },
  { name: "Large margin", cls: "is-m2" },
];

export default function PortfolioMock() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="pf">
      {SHAPES.flatMap((shape) =>
        FITS.map((fit) => (
          <section key={shape.name + fit.name} className={`pf-slide pfm ${fit.cls}`} style={{ "--r": shape.r } as React.CSSProperties}>
            <div className="pfm-box">
              <div className="pfm-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={VAN} alt="" />
              </div>
            </div>
            <p className="pfm-tag pf-mono">
              {shape.name} · {fit.name}
            </p>
          </section>
        )),
      )}
    </main>
  );
}
