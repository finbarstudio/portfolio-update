import type { Metadata } from "next";
import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Reveal from "@/components/toombul/Reveal";
import { merchItems } from "@/content/toombul";

export const metadata: Metadata = {
  title: "Merch | Toombul District Cricket Club",
  robots: { index: false, follow: false },
};

export default function ToombulMerchPage() {
  return (
    <>
      <Nav forceSolid />
      <main>
        <section className="tc-section" style={{ paddingTop: "clamp(120px, 20vh, 180px)", textAlign: "center" }}>
          <div className="tc-wrap" style={{ maxWidth: 760, margin: "0 auto" }}>
            <Reveal>
              <span className="tc-eyebrow">Club Merchandise</span>
              <h1 className="tc-section-title" style={{ marginTop: 10 }}>
                The Toombul shop
              </h1>
              <p className="tc-section-lead" style={{ margin: "18px auto 0" }}>
                A dedicated online store is being built for this site. In the meantime, here is the
                current EV2 club range, available through the club's existing store.
              </p>
              <div className="tc-merch-note" style={{ justifyContent: "center", marginTop: 22 }}>
                <span className="tc-badge-soon">Shop opening soon on this site</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="tc-section tc-section--panel" style={{ paddingTop: 0 }}>
          <div className="tc-wrap">
            <Reveal>
              <div className="tc-merch-grid">
                {merchItems.map((item) => (
                  <div className="tc-merch-card" key={item.name}>
                    <div className="tc-merch-thumb">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="tc-merch-name">{item.name}</div>
                    <div className="tc-merch-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
