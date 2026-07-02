import Reveal from "@/components/toombul/Reveal";

export default function FutureBand() {
  return (
    <section className="tc-future">
      <img
        src="/toombul/blasters.webp"
        alt="A young Toombul Blasters player bowling under lights"
        className="tc-future-img"
        loading="lazy"
      />
      <div className="tc-future-scrim" aria-hidden="true" />
      <Reveal className="tc-future-body">
        <h2 className="tc-future-title">
          The next century
          <br />
          starts at five years old.
        </h2>
        <p className="tc-future-sub">
          Blasters, juniors, seniors. Men and women, boys and girls, at every level of the game.
        </p>
        <a href="/toombul/club" className="tc-btn tc-btn--red">
          Get Involved
        </a>
      </Reveal>
    </section>
  );
}
