import Reveal from "@/components/toombul/Reveal";

export default function Statement() {
  return (
    <section className="tc-statement" id="story">
      <div className="tc-wrap">
        <Reveal>
          <p className="tc-statement-big">
            We have been playing cricket <em>longer than Australia has been a country.</em>
          </p>
        </Reveal>
        <Reveal delay={120}>
          <p className="tc-statement-sub">
            Club records date to 1882, nineteen years before Federation. Three of our own toured
            England with Bradman&rsquo;s Invincibles. Eleven have worn the baggy green. And every
            season at Oxenham Park, Nundah, the next chapter gets written.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
