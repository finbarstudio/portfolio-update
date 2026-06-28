import MaskReveal from "@/components/bppd/MaskReveal";

// Verbatim service groupings from bppd.com.au, lightly tightened.
const SERVICES = [
  {
    t: "Strategic Acquisition & Development",
    b: "Targeting low-volatility, high-return investments, we oversee developments from inception to completion with in-depth risk and capital analysis.",
  },
  {
    t: "Boutique Project Marketing",
    b: "Market analytics that maximise share and absorption, with our team working alongside architects and designers from the pre-development phase.",
  },
  {
    t: "Design & Construction Solutions",
    b: "Pre-construction planning, titles, budgets, scheduling, contract procurement and site sign-off, the full path through to delivery.",
  },
  {
    t: "Regulatory Resolution",
    b: "Specialists in complex, regulatory-heavy projects, from development application reversals to the Planning and Environment Court, backed by a deep professional network.",
  },
];

export default function Story() {
  return (
    <>
      {/* ── Philosophy ──────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-28 md:py-40 flex flex-col items-center text-center">
        <MaskReveal
          as="p"
          className="violet text-[var(--accent)] text-[11px] tracking-[0.34em] uppercase mb-8"
        >
          Unity is Strength
        </MaskReveal>
        <MaskReveal
          as="h2"
          className="violet text-[var(--ink)] max-w-[18ch] leading-tight"
          start="top 82%"
        >
          <span style={{ fontSize: "clamp(1.7rem, 4.2vw, 3.4rem)", letterSpacing: "0.04em", fontWeight: 600 }}>
            When there is teamwork and collaboration, dynamic things happen.
          </span>
        </MaskReveal>
        <MaskReveal
          as="p"
          start="top 82%"
          delay={0.25}
          className="text-[var(--ink-soft)] font-light mt-9 max-w-[58ch]"
        >
          <span style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", lineHeight: 1.6 }}>
            For over fifteen years we have specialised in complex projects involving
            extensive entitlements, structured joint ventures and sustainable
            visions for development. You can be assured of our authenticity, and our
            values of hard work, honesty, fairness and transparency.
          </span>
        </MaskReveal>
      </section>

      {/* ── What we do ──────────────────────────────────────── */}
      <section className="bg-[var(--grey-light)] px-6 md:px-16 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 mb-14">
          <h2
            className="violet md:col-span-4 text-[var(--ink)] text-2xl md:text-4xl leading-tight"
            style={{ letterSpacing: "0.06em" }}
          >
            WHAT WE DO
          </h2>
          <p className="md:col-span-7 md:col-start-6 self-end text-[var(--ink-soft)] font-light" style={{ fontSize: "clamp(1rem, 1.5vw, 1.25rem)", lineHeight: 1.55 }}>
            We engage as developer, strategic advisor, project manager, joint-venture
            partner or full-service deliverer, whatever a project needs to succeed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {SERVICES.map((s, i) => (
            <MaskReveal key={s.t} as="div" start="top 88%" delay={(i % 2) * 0.12} className="border-t border-[var(--line)] pt-5">
              <h3 className="violet text-[var(--ink)] text-base mb-3" style={{ letterSpacing: "0.08em" }}>
                {s.t.toUpperCase()}
              </h3>
              <p className="text-[var(--ink-soft)] font-light" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", lineHeight: 1.6 }}>
                {s.b}
              </p>
            </MaskReveal>
          ))}
        </div>
      </section>
    </>
  );
}
