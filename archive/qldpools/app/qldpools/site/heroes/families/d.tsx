import { HERO_SRC, LOGO_WHITE, LOGO_DARK, TAGLINE, SUB, PHONE, PHONE_HREF, ACCOLADES, type Hero } from "../kit";

export const familyD: Hero[] = [
  // D-01 · Background-clip text — photo bleeds through the letterforms
  {
    name: "Photo Through Letters",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-[#0b2a4a]/40" />
        <div className="relative z-10 text-center px-4 select-none" style={{ maxWidth: "100vw" }}>
          <div
            className="qpi-display block font-black leading-none"
            style={{
              fontSize: "clamp(5rem, 20vw, 22rem)",
              letterSpacing: "-0.04em",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              backgroundImage: `url(${HERO_SRC})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              /* solid fallback colour painted as fallback via the outer container's bg */
            }}
          >
            POOLS
          </div>
          <p className="qpi-caps text-white/80 mt-6" style={{ fontSize: "clamp(0.7rem, 1.4vw, 1rem)", letterSpacing: "0.22em" }}>
            {TAGLINE}
          </p>
        </div>
      </section>
    ),
  },

  // D-02 · Oversized navy on white, one word blue, thin image strip at bottom
  {
    name: "Navy on White, Strip",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-[clamp(24px,5vw,80px)] pt-[clamp(40px,8vh,100px)]">
          <p className="qpi-caps text-[var(--qpi-blue)] mb-4" style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)", letterSpacing: "0.25em" }}>
            Queensland&apos;s Premium
          </p>
          <h1
            className="qpi-display leading-none text-[var(--qpi-ink)]"
            style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)", letterSpacing: "-0.03em" }}
          >
            POOL{" "}
            <span className="text-[var(--qpi-blue)]">BUILDERS</span>
          </h1>
          <p className="mt-6 text-[var(--qpi-ink)]/60 max-w-lg" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", lineHeight: 1.55 }}>
            {SUB}
          </p>
        </div>
        {/* thin image strip */}
        <div className="h-[clamp(80px,18vh,200px)] w-full flex-shrink-0 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover object-center" />
        </div>
      </section>
    ),
  },

  // D-03 · Stacked huge words left-aligned, very tight leading
  {
    name: "Stacked Full-Measure",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="relative z-10 w-full px-[clamp(20px,4vw,60px)]">
          {(["QUEENSLAND'S", "PREMIUM", "POOL", "BUILDERS"] as const).map((word, i) => (
            <div
              key={word}
              className="qpi-display block text-white leading-none"
              style={{
                fontSize: "clamp(3rem, 14vw, 16rem)",
                letterSpacing: "-0.035em",
                lineHeight: 0.87,
                color: i === 2 ? "var(--qpi-blue)" : "#fff",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // D-04 · Three-line headline, each line a different weight (300 / 800 / 400)
  {
    name: "Three-Weight Headline",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-center px-[clamp(24px,5vw,80px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-5" />
        <div className="relative z-10">
          <div
            className="block text-[var(--qpi-ink)]"
            style={{ fontSize: "clamp(2.8rem, 8.5vw, 9.5rem)", fontWeight: 300, letterSpacing: "-0.01em", lineHeight: 1 }}
          >
            Queensland&apos;s
          </div>
          <div
            className="block text-[var(--qpi-blue)]"
            style={{ fontSize: "clamp(2.8rem, 8.5vw, 9.5rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            PREMIUM
          </div>
          <div
            className="block text-[var(--qpi-ink)]"
            style={{ fontSize: "clamp(2.8rem, 8.5vw, 9.5rem)", fontWeight: 400, letterSpacing: "-0.01em", lineHeight: 1 }}
          >
            Pool Builders
          </div>
          <div className="mt-8 flex items-center gap-6">
            {ACCOLADES.map((a) => (
              <div key={a.primary}>
                <p className="qpi-caps text-[var(--qpi-blue)]" style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>{a.primary}</p>
                <p className="text-[var(--qpi-ink)]/50 text-xs mt-0.5">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // D-05 · Enormous "QUEENSLAND" wordmark + TAGLINE small beneath
  {
    name: "Colossus Wordmark",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-12 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[#0b2a4a]/75" />
        <div className="relative z-10 text-center w-full px-2 overflow-hidden">
          <div
            className="qpi-display text-white block leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(2.5rem, 14.5vw, 18rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}
          >
            QUEEN<span style={{ color: "var(--qpi-blue)" }}>SLAND</span>
          </div>
          <div className="mt-3 flex justify-center">
            <div className="h-px bg-[var(--qpi-blue)] w-24 opacity-60" />
          </div>
          <p className="qpi-caps text-white/70 mt-3" style={{ fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)", letterSpacing: "0.28em" }}>
            {TAGLINE}
          </p>
          <p className="text-white/45 mt-2" style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)" }}>
            {PHONE}
          </p>
        </div>
      </section>
    ),
  },

  // D-06 · Vertical rotated caps label on left edge + big headline filling the rest
  {
    name: "Rotated Label + Headline",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-6" />
        {/* vertical label strip */}
        <div className="relative z-10 flex-shrink-0 w-[clamp(36px,4vw,60px)] flex items-center justify-center border-r border-[var(--qpi-ink)]/15">
          <span
            className="qpi-caps text-[var(--qpi-blue)] whitespace-nowrap"
            style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.22em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Queensland&apos;s Premium Pool Builders
          </span>
        </div>
        {/* main headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-[clamp(20px,4vw,60px)]">
          <h1
            className="qpi-display text-[var(--qpi-ink)] leading-none"
            style={{ fontSize: "clamp(3rem, 12vw, 13rem)", letterSpacing: "-0.04em" }}
          >
            PREMIUM
            <br />
            <span style={{ color: "var(--qpi-blue)" }}>POOL</span>
            <br />
            BUILDERS
          </h1>
          <a href={PHONE_HREF} className="qpi-caps text-[var(--qpi-ink)]/50 mt-6 hover:text-[var(--qpi-blue)] transition-colors" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textDecoration: "none" }}>
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  // D-07 · Outline/stroke headline over image
  {
    name: "Stroke Headline on Photo",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[#0b2a4a]/30" />
        <div className="relative z-10 text-center px-[clamp(16px,3vw,48px)]">
          <div
            className="qpi-display block leading-none"
            style={{
              fontSize: "clamp(4rem, 16vw, 18rem)",
              letterSpacing: "-0.03em",
              WebkitTextStroke: "2px #fff",
              color: "transparent",
            }}
          >
            POOL
          </div>
          <div
            className="qpi-display block leading-none"
            style={{
              fontSize: "clamp(4rem, 16vw, 18rem)",
              letterSpacing: "-0.03em",
              WebkitTextStroke: "2px var(--qpi-blue)",
              color: "transparent",
            }}
          >
            BUILDERS
          </div>
          <p className="qpi-caps text-white/80 mt-6" style={{ fontSize: "clamp(0.65rem, 1.1vw, 0.85rem)", letterSpacing: "0.22em" }}>
            {TAGLINE}
          </p>
        </div>
      </section>
    ),
  },

  // D-08 · Mixed-case tracking play — exaggerated letter-spacing + blue underline sweep
  {
    name: "Tracking Play + Underline",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-center px-[clamp(24px,5vw,80px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-4" />
        <div className="relative z-10">
          <p className="qpi-caps text-[var(--qpi-ink)]/40 mb-3" style={{ fontSize: "clamp(0.6rem, 1vw, 0.75rem)", letterSpacing: "0.35em" }}>
            Est. in Queensland
          </p>
          <h1
            className="qpi-display text-[var(--qpi-ink)] leading-tight"
            style={{ fontSize: "clamp(2.2rem, 7.5vw, 8.5rem)", letterSpacing: "0.12em" }}
          >
            Queensland&apos;s
            <br />
            <span className="relative inline-block">
              <span className="text-[var(--qpi-blue)]">Premium</span>
              <span
                className="absolute bottom-0 left-0 w-full"
                style={{ height: "clamp(3px,0.5vw,6px)", background: "var(--qpi-blue)", borderRadius: "2px" }}
              />
            </span>
            <br />
            Pool&nbsp;Builders
          </h1>
          <p className="text-[var(--qpi-ink)]/50 mt-6 max-w-md" style={{ fontSize: "clamp(0.85rem, 1.3vw, 1rem)", lineHeight: 1.6, letterSpacing: "0.04em" }}>
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // D-09 · Oversized decorative blue asterisk as graphic anchor
  {
    name: "Asterisk Anchor",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-[#0b2a4a]/70" />
        <div className="relative z-10 w-full px-[clamp(24px,5vw,80px)] flex items-start gap-[clamp(16px,3vw,48px)]">
          {/* big asterisk */}
          <div
            className="text-[var(--qpi-blue)] leading-none flex-shrink-0 select-none"
            style={{ fontSize: "clamp(6rem, 22vw, 24rem)", fontWeight: 800, lineHeight: 0.85, marginTop: "0.05em" }}
            aria-hidden="true"
          >
            *
          </div>
          {/* headline + meta */}
          <div className="flex flex-col justify-center" style={{ paddingTop: "clamp(0.5rem, 2vw, 2rem)" }}>
            <h1
              className="qpi-display text-white leading-none"
              style={{ fontSize: "clamp(2.5rem, 8vw, 9rem)", letterSpacing: "-0.03em" }}
            >
              QUEENSLAND&apos;S
              <br />
              <span style={{ color: "var(--qpi-blue)" }}>PREMIUM</span>
              <br />
              POOL BUILDERS
            </h1>
            <div className="mt-6 flex flex-wrap gap-6">
              {ACCOLADES.map((a) => (
                <div key={a.primary}>
                  <p className="qpi-caps text-white/90" style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>{a.primary}</p>
                  <p className="text-white/40 text-xs mt-0.5">{a.secondary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // D-10 · Numbers-led — giant "2500+" in blue
  {
    name: "Numbers-Led 2500+",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-5" />
        <div className="relative z-10 px-[clamp(24px,5vw,80px)]">
          <div
            className="qpi-display text-[var(--qpi-blue)] leading-none"
            style={{ fontSize: "clamp(6rem, 24vw, 28rem)", letterSpacing: "-0.05em", lineHeight: 0.85 }}
          >
            2500+
          </div>
          <div
            className="qpi-display text-[var(--qpi-ink)] leading-none"
            style={{ fontSize: "clamp(2rem, 7vw, 8rem)", letterSpacing: "-0.02em", marginTop: "-0.05em" }}
          >
            POOLS INSTALLED
          </div>
          <div className="mt-6 h-px bg-[var(--qpi-ink)]/15 max-w-xl" />
          <p className="mt-6 text-[var(--qpi-ink)]/60 max-w-md" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", lineHeight: 1.55 }}>
            {TAGLINE}
          </p>
        </div>
      </section>
    ),
  },

  // D-11 · Justified typographic block — headline + SUB as dense paragraph
  {
    name: "Dense Justified Block",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col justify-center px-[clamp(24px,5vw,80px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-[#0b2a4a]/80" />
        <div className="relative z-10 max-w-[90vw]">
          <p className="qpi-caps text-[var(--qpi-blue)] mb-5" style={{ fontSize: "clamp(0.55rem, 1vw, 0.75rem)", letterSpacing: "0.28em" }}>
            Queensland&apos;s Premier Pool Company
          </p>
          <p
            className="qpi-display text-white leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 5.5vw, 6rem)",
              letterSpacing: "-0.015em",
              textAlign: "justify",
              hyphens: "auto",
            }}
          >
            Queensland&apos;s{" "}
            <span style={{ color: "var(--qpi-blue)" }}>Premium</span>{" "}
            Pool Builders. Fibreglass & Concrete Installations across{" "}
            Brisbane, Gold Coast & Sunshine Coast.
          </p>
          <div className="mt-8 h-px bg-white/20 max-w-2xl" />
          <p className="qpi-caps text-white/50 mt-4" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>{PHONE}</p>
        </div>
      </section>
    ),
  },

  // D-12 · Headline bottom-aligned on a full-width blue rule, image faint above
  {
    name: "Bottom Baseline on Rule",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col">
        {/* faint image fills upper space */}
        <div className="flex-1 relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-15" />
        </div>
        {/* blue rule */}
        <div className="w-full flex-shrink-0" style={{ height: "clamp(4px,0.6vw,8px)", background: "var(--qpi-blue)" }} />
        {/* headline sitting below the rule */}
        <div className="flex-shrink-0 px-[clamp(16px,3vw,48px)] pb-[clamp(24px,4vh,56px)] pt-[clamp(12px,2vh,28px)] bg-white">
          <h1
            className="qpi-display text-[var(--qpi-ink)] leading-none"
            style={{ fontSize: "clamp(2.8rem, 9.5vw, 11rem)", letterSpacing: "-0.04em" }}
          >
            QUEENSLAND&apos;S{" "}
            <span style={{ color: "var(--qpi-blue)" }}>PREMIUM</span>{" "}
            POOL BUILDERS
          </h1>
          <p className="qpi-caps text-[var(--qpi-ink)]/45 mt-3" style={{ fontSize: "0.65rem", letterSpacing: "0.22em" }}>{SUB}</p>
        </div>
      </section>
    ),
  },

  // D-13 · Two enormous words per line, navy, image peeking in gaps
  {
    name: "Two Words Per Line",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        {/* white panels that leave horizontal gaps — image shows through the gaps */}
        <div className="absolute inset-0 flex flex-col justify-center gap-[clamp(8px,1.5vw,20px)]">
          {(["QUEENSLAND'S PREMIUM", "POOL BUILDERS"] as const).map((line) => (
            <div
              key={line}
              className="w-full bg-white/92 flex items-center px-[clamp(16px,3vw,48px)]"
              style={{ height: "clamp(80px, 18vw, 200px)" }}
            >
              <span
                className="qpi-display text-[var(--qpi-ink)] leading-none w-full"
                style={{ fontSize: "clamp(2rem, 7.5vw, 9rem)", letterSpacing: "-0.03em" }}
              >
                {line.split(" ").map((word, i) => (
                  <span key={word} style={{ color: i === 1 && line.startsWith("POOL") ? "var(--qpi-blue)" : undefined }}>
                    {i > 0 ? " " : ""}{word}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // D-14 · Centred headline with huge negative letter-spacing (compressed modern look)
  {
    name: "Compressed Centre",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col items-center justify-center text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-[#0b2a4a]/70" />
        <div className="relative z-10 px-[clamp(16px,3vw,48px)]">
          <p className="qpi-caps text-[var(--qpi-blue)] mb-4" style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.3em" }}>
            Fibreglass & Concrete
          </p>
          <h1
            className="qpi-display text-white block leading-none"
            style={{ fontSize: "clamp(3.5rem, 13vw, 15rem)", letterSpacing: "-0.06em", fontWeight: 900 }}
          >
            QUEENS
            <br />
            LAND&apos;S
            <br />
            <span style={{ color: "var(--qpi-blue)" }}>POOLS</span>
          </h1>
          <p className="text-white/50 mt-6 max-w-sm mx-auto" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", lineHeight: 1.55 }}>
            {TAGLINE}
          </p>
        </div>
      </section>
    ),
  },

  // D-15 · Left column: tiny SUB + phone; right: one colossal word
  {
    name: "Colossal Word Right Column",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-5" />
        {/* left info column */}
        <div className="relative z-10 flex flex-col justify-between py-[clamp(40px,7vh,80px)] px-[clamp(20px,3vw,48px)] w-[clamp(160px,22vw,320px)] flex-shrink-0 border-r border-[var(--qpi-ink)]/12">
          <div>
            <p className="qpi-caps text-[var(--qpi-blue)]" style={{ fontSize: "0.6rem", letterSpacing: "0.25em" }}>
              Queensland
            </p>
            <p className="qpi-caps text-[var(--qpi-ink)]/50 mt-1" style={{ fontSize: "0.6rem", letterSpacing: "0.2em" }}>
              Est. 2003
            </p>
          </div>
          <div>
            <p className="text-[var(--qpi-ink)]/60" style={{ fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)", lineHeight: 1.6 }}>
              {SUB}
            </p>
            <a href={PHONE_HREF} className="qpi-caps block mt-4 text-[var(--qpi-blue)]" style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textDecoration: "none" }}>
              {PHONE}
            </a>
          </div>
          <div>
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="mb-3">
                <p className="qpi-caps text-[var(--qpi-ink)]" style={{ fontSize: "0.58rem", letterSpacing: "0.18em" }}>{a.primary}</p>
                <p className="text-[var(--qpi-ink)]/40 text-xs mt-0.5">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
        {/* colossal word right */}
        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          <div
            className="qpi-display text-[var(--qpi-ink)] leading-none select-none"
            style={{ fontSize: "clamp(8rem, 26vw, 32rem)", letterSpacing: "-0.06em", fontWeight: 900, color: "var(--qpi-blue)", opacity: 0.12, userSelect: "none", pointerEvents: "none" }}
            aria-hidden="true"
          >
            POOLS
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="qpi-display text-[var(--qpi-ink)] leading-none text-center"
              style={{ fontSize: "clamp(4rem, 12vw, 14rem)", letterSpacing: "-0.04em", fontWeight: 900 }}
            >
              POOL
              <br />
              <span style={{ color: "var(--qpi-blue)" }}>BUILDS</span>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // D-16 · Alternating word tints (navy / blue / navy / blue)
  {
    name: "Alternating Word Tints",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-center px-[clamp(24px,5vw,80px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-5" />
        <div className="relative z-10">
          <p className="qpi-caps text-[var(--qpi-ink)]/35 mb-5" style={{ fontSize: "0.6rem", letterSpacing: "0.28em" }}>
            Fibreglass & Concrete
          </p>
          <h1 className="qpi-display leading-none" style={{ fontSize: "clamp(3rem, 10vw, 11.5rem)", letterSpacing: "-0.035em" }}>
            {(["Queensland's", "Premium", "Pool", "Builders"] as const).map((word, i) => (
              <span
                key={word}
                style={{ color: i % 2 === 0 ? "var(--qpi-ink)" : "var(--qpi-blue)" }}
              >
                {word}{" "}
              </span>
            ))}
          </h1>
          <div className="mt-8 h-px bg-[var(--qpi-ink)]/10 max-w-2xl" />
          <div className="mt-6 flex flex-wrap gap-8">
            {ACCOLADES.map((a) => (
              <div key={a.primary}>
                <p className="qpi-caps text-[var(--qpi-ink)]" style={{ fontSize: "0.62rem", letterSpacing: "0.2em" }}>{a.primary}</p>
                <p className="text-[var(--qpi-ink)]/40 text-xs mt-0.5">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // D-17 · Poster: top rule + eyebrow, colossal centred headline, bottom rule + phone
  {
    name: "Poster Rules + Phone",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-[#0b2a4a] flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover opacity-18 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-[#0b2a4a]/80" />
        {/* top rule + eyebrow */}
        <div className="relative z-10 flex-shrink-0 pt-[clamp(32px,5vh,64px)] px-[clamp(20px,4vw,60px)]">
          <div className="w-full h-px bg-white/30" />
          <div className="flex justify-between items-center mt-3">
            <p className="qpi-caps text-[var(--qpi-blue)]" style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.28em" }}>
              Queensland&apos;s Premium Pool Builders
            </p>
            <p className="qpi-caps text-white/35" style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.2em" }}>
              QBCC Licensed
            </p>
          </div>
        </div>
        {/* colossal centred headline */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-[clamp(16px,3vw,40px)]">
          <div
            className="qpi-display text-white leading-none"
            style={{ fontSize: "clamp(4rem, 16.5vw, 19rem)", letterSpacing: "-0.045em", fontWeight: 900 }}
          >
            POOL
            <br />
            <span style={{ color: "var(--qpi-blue)" }}>BUILDS</span>
            <br />
            QLD
          </div>
        </div>
        {/* bottom rule + phone */}
        <div className="relative z-10 flex-shrink-0 pb-[clamp(28px,5vh,60px)] px-[clamp(20px,4vw,60px)]">
          <div className="flex justify-between items-center mb-3">
            <p className="qpi-caps text-white/35" style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.2em" }}>
              2500+ Pools Installed
            </p>
            <a href={PHONE_HREF} className="qpi-caps text-white hover:text-[var(--qpi-blue)] transition-colors" style={{ fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)", letterSpacing: "0.22em", textDecoration: "none" }}>
              {PHONE}
            </a>
          </div>
          <div className="w-full h-px bg-white/30" />
        </div>
      </section>
    ),
  },
];
