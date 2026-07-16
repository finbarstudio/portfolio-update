import Loader from "@/components/Loader";

/**
 * Instant loading UI for /work. The App Router shows this the moment the tab is
 * tapped, while the work page's server component streams in — so a click lands
 * on something immediately instead of the old dead pause on the previous page.
 *
 * Every cell is an IN-FLOW box with a real height that holds a <Loader/> (the
 * skeleton fill + the brand pulse). The earlier version made each skeleton a
 * bare `.skeleton` element — which is `position: absolute`, so the cells
 * collapsed to zero height, the whole page stood ~72px tall, and the footer got
 * drawn near the top with a slab of colour above it. Real heights here keep the
 * layout the same shape as the streamed page, so there's no flash and no shift.
 *
 * A cell needs position: relative because <Loader/>'s skeleton fills it via
 * absolute inset:0.
 */
function Cell({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ borderRadius: 14, ...style }}>
      <Loader />
    </div>
  );
}

export default function WorkLoading() {
  return (
    <div aria-busy="true" aria-label="Loading work">
      {/* Header — kicker, title, intro line */}
      <header className="px-5 md:px-10 pt-8 md:pt-12 pb-10 md:pb-14">
        <div className="skel-line" style={{ width: 220, height: 12, marginBottom: 20 }} />
        <div className="skel-line" style={{ width: "min(420px, 70%)", height: 48, borderRadius: 8 }} />
        <div className="skel-line" style={{ width: "min(640px, 90%)", height: 40, marginTop: 24, borderRadius: 6 }} />
      </header>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 px-5 md:px-10 pt-1.5 md:pt-2 mb-12 md:mb-14">
        {[64, 96, 110, 78, 92, 100].map((w, i) => (
          <div key={i} className="skel-line" style={{ width: w, height: 28, borderRadius: 999 }} />
        ))}
      </div>

      {/* Grid — mirrors the real one: a full-width featured card (75vh), then the
          rest as a 2-col grid of 60vh cards, so no reflow when the page arrives. */}
      <div className="px-5 md:px-10" style={{ paddingBottom: "var(--space-section)" }}>
        <Cell className="mb-16 md:mb-20" style={{ height: "75vh" }} />
        <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <Cell key={i} className="col-span-12 sm:col-span-6" style={{ height: "60vh" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
