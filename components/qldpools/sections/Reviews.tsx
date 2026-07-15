/**
 * Reviews — their real Google reviews, set like an editorial spread: one big
 * pull-quote with lots of air, then a quiet three-up of shorter ones. All
 * quotes verbatim from the reviews on their own site (cuts marked with …).
 */

const LEAD = {
  text: "Most efficient builder we could have found… Excavator arrived on a Sunday. Pool delivered on Wednesday and crane on Friday to drop it in the hole… We were swimming in the pool before Xmas day.",
  name: "Andrew Booth",
};

const REVIEWS = [
  {
    text: "I couldn't have asked for better service. This was my first time having a pool installed and it was completely stress free.",
    name: "Sharmaine Garwood",
  },
  {
    text: "His pricing was a lot better than all the others I spoke to and he turned up exactly when he said he would… We are thrilled with the finish!",
    name: "Sean S",
  },
  {
    text: "100 percent satisfied. Completely professional. Great communication. Does what they say they will do and at the time scheduled.",
    name: "Dion Stubbs",
  },
];

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[var(--qpi-blue)] tracking-[0.22em] ${className}`} aria-label="Five stars">
      ★★★★★
    </span>
  );
}

export default function Reviews() {
  return (
    <section
      className="relative min-h-svh w-full bg-white flex flex-col justify-center px-6 md:px-14 py-24"
      aria-label="Reviews"
    >
      {/* Label row */}
      <div className="flex items-baseline justify-between border-b border-[var(--qpi-ink)]/15 pb-4 mb-16 md:mb-20">
        <h2 className="qpi-caps text-[var(--qpi-ink)] text-[11px] md:text-xs m-0">Google Reviews</h2>
        <p className="m-0 flex items-baseline gap-3">
          <Stars className="text-xs" />
          <span className="qpi-caps text-[var(--qpi-ink)]/60 text-[10px]">5.0 on Google</span>
        </p>
      </div>

      {/* The lead quote — big, light, plenty of air */}
      <blockquote className="m-0 max-w-[34ch]">
        <p
          className="m-0 text-[var(--qpi-ink)]"
          style={{ fontSize: "clamp(1.45rem, 2.7vw, 2.5rem)", lineHeight: 1.3, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          &ldquo;{LEAD.text}&rdquo;
        </p>
        <footer className="mt-6 flex items-baseline gap-4">
          <Stars className="text-[11px]" />
          <span className="qpi-caps text-[var(--qpi-ink)]/60 text-[10px]">{LEAD.name}</span>
        </footer>
      </blockquote>

      {/* Supporting three — quiet, ruled columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10 mt-16 md:mt-24">
        {REVIEWS.map((r) => (
          <blockquote key={r.name} className="m-0 border-t border-[var(--qpi-ink)]/15 pt-6">
            <p className="m-0 text-[var(--qpi-ink)]/85" style={{ fontSize: "0.98rem", lineHeight: 1.6 }}>
              &ldquo;{r.text}&rdquo;
            </p>
            <footer className="mt-4 flex items-baseline gap-3">
              <Stars className="text-[9px]" />
              <span className="qpi-caps text-[var(--qpi-ink)]/55 text-[9px]">{r.name}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
