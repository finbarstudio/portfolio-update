/**
 * Hero option B — selected-works index. The hero doubles as an editorial
 * contents page: a short statement up top, then a ruled list of recent homes
 * (name + place + year) that fills the lower viewport. No index numbers (those
 * read as templated); the rules and the hover tint carry the structure.
 */
const HOMES = [
  { name: "Lake House", place: "Lake Macdonald", year: "2024" },
  { name: "MacPhee Residence", place: "Sunshine Beach", year: "2023" },
  { name: "Watson House", place: "Peregian", year: "2022" },
  { name: "KI House", place: "Noosa Heads", year: "2021" },
  { name: "Curra’s Annex", place: "Cooroy", year: "2020" },
];

export default function HeroB() {
  return (
    <section className="frame flex flex-col justify-center relative" style={{ minHeight: "100svh", paddingTop: "clamp(96px,12vh,140px)", paddingBottom: "clamp(40px,6vh,80px)" }}>
      <span className="arl-opt">Hero option B · index</span>
      <div className="wrap w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 items-end" style={{ gap: "clamp(20px,3vw,48px)", marginBottom: "clamp(28px,4vw,56px)" }}>
          <div className="md:col-span-7">
            <p className="eyebrow">Fourth-generation Sunshine Coast builders</p>
            <h1 className="display" style={{ fontSize: "clamp(28px,3.6vw,52px)", maxWidth: "16ch", marginTop: "clamp(14px,1.6vw,22px)" }}>
              Homes you&rsquo;ll want to call <span className="display-italic accent">home</span>.
            </h1>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="lead" style={{ fontSize: "clamp(15px,1.05vw,18px)", maxWidth: "32ch", marginLeft: "auto" }}>
              A selected record of homes built on the Coast since 1968.
            </p>
          </div>
        </div>

        <div>
          {HOMES.map((h) => (
            <a key={h.name} href="#work" className="idx-row" data-cursor="View">
              <span className="idx-name">{h.name}</span>
              <span className="idx-meta">{h.place} &middot; {h.year}</span>
            </a>
          ))}
        </div>

        <div className="flex justify-end" style={{ marginTop: "clamp(18px,2vw,28px)" }}>
          <a href="#work" className="eyebrow" data-cursor="View">View all projects &rarr;</a>
        </div>
      </div>
    </section>
  );
}
