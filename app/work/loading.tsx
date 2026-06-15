/**
 * Route-level loading UI for /work. App Router renders this instantly on
 * navigation (e.g. from the home "What I do" cards) while the work page's RSC
 * payload streams in, so a tap always produces immediate visible feedback
 * instead of a dead pause.
 */
export default function WorkLoading() {
  return (
    <div aria-busy="true" aria-label="Loading work">
      {/* Header */}
      <header className="px-5 md:px-10 pt-8 md:pt-12 pb-10 md:pb-14">
        <div className="skeleton mb-5" style={{ width: 220, height: 12, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: "min(420px, 70%)", height: 48, borderRadius: 8 }} />
        <div className="skeleton mt-6" style={{ width: "min(640px, 90%)", height: 40, borderRadius: 6 }} />
      </header>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 px-5 md:px-10 mb-12 md:mb-14">
        {[64, 96, 110, 78, 92, 100].map((w, i) => (
          <div key={i} className="skeleton" style={{ width: w, height: 28, borderRadius: 999 }} />
        ))}
      </div>

      {/* Card grid */}
      <div className="px-5 md:px-10" style={{ paddingBottom: "var(--space-section)" }}>
        <div className="grid grid-cols-12 gap-x-8 gap-y-16 md:gap-y-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="col-span-12 md:col-span-6">
              <div className="skeleton" style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 12 }} />
              <div className="skeleton mt-4" style={{ width: "55%", height: 16, borderRadius: 4 }} />
              <div className="skeleton mt-2" style={{ width: "35%", height: 12, borderRadius: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
