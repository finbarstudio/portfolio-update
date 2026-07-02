import Reveal from "@/components/toombul/Reveal";
import { merchItems } from "@/content/toombul";

export default function MerchTeaser() {
  return (
    <section className="tc-section tc-section--panel" id="merch">
      <div className="tc-wrap">
        <Reveal>
          <span className="tc-eyebrow">Club Merchandise</span>
          <h2 className="tc-section-title" style={{ marginTop: 10 }}>
            Kit up in club colours
          </h2>
          <p className="tc-section-lead">
            The new EV2 range for Toombul players and members. The full online shop is still being
            built here, but you can get a look at the range now.
          </p>
        </Reveal>

        <Reveal delay={80}>
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

        <Reveal delay={120}>
          <div className="tc-merch-note">
            <span className="tc-badge-soon">Shop opening soon</span>
            <span>The full Toombul store is coming to this site. Get in touch with the club for current stock.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
