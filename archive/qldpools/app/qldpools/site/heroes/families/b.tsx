import { HERO_SRC, LOGO_WHITE, TAGLINE, SUB, PHONE, PHONE_HREF, ACCOLADES, type Hero } from "../kit";

export const familyB: Hero[] = [
  // 1. Bottom-anchored white headline over a strong bottom→top black gradient scrim
  {
    name: "B1 · Bottom Gradient",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0) 65%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-[clamp(2rem,6vw,6rem)] pb-[clamp(2.5rem,6vh,5rem)]">
          <p className="qpi-caps text-white/70 text-[11px] mb-4">Queensland&apos;s Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight text-balance"
            style={{ fontSize: "clamp(3.2rem, 8vw, 8rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 2. Dead-centre headline with a radial vignette darkening the edges
  {
    name: "B2 · Radial Vignette",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.72) 100%)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p className="qpi-caps text-white/60 text-[11px] mb-6 tracking-[0.22em]">Premium Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.92] tracking-tight text-balance max-w-4xl"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/75 mt-6 text-lg max-w-xl font-light leading-relaxed">{SUB}</p>
        </div>
      </section>
    ),
  },

  // 3. Top-left headline + SUB, a corner (top-left) dark gradient wedge
  {
    name: "B3 · Top-Left Wedge",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(11,42,74,0.92) 0%, rgba(11,42,74,0.7) 30%, rgba(0,0,0,0) 65%)",
          }}
        />
        <div className="absolute top-0 left-0 px-[clamp(2rem,5vw,5rem)] pt-[clamp(2.5rem,7vh,6rem)] max-w-[55%]">
          <p className="qpi-caps text-white/60 text-[11px] mb-6">QLD Pool Installs</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/75 mt-5 text-base leading-relaxed max-w-sm">{SUB}</p>
        </div>
      </section>
    ),
  },

  // 4. Full left→right dark gradient; type sits on the dark left half
  {
    name: "B4 · Left-to-Right Dark",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(6,26,48,0.95) 0%, rgba(6,26,48,0.82) 35%, rgba(6,26,48,0.3) 60%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-[clamp(2.5rem,6vw,6rem)] max-w-[52%]">
          <p className="qpi-caps text-white/55 text-[10px] mb-6 tracking-[0.2em]">Premium Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 5.8vw, 5.8rem)" }}
          >
            {TAGLINE}
          </h1>
          <div className="w-12 h-px bg-white/40 mt-7 mb-5" />
          <p className="text-white/70 text-base leading-relaxed">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="qpi-caps text-white mt-7 text-[12px] hover:text-white/80 transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  // 5. Framed: a thin white inset border near the screen edges + centred type
  {
    name: "B5 · Inset Frame",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
        <div className="absolute inset-[clamp(16px,2.5vw,32px)] border border-white/40 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[clamp(4rem,10vw,10rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-10 mb-8 opacity-90" />
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight text-balance"
            style={{ fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/70 mt-5 text-base max-w-lg leading-relaxed">{SUB}</p>
        </div>
      </section>
    ),
  },

  // 6. Headline bottom-left, ACCOLADES bottom-right, sharing one baseline over a bottom scrim
  {
    name: "B6 · Split Bottom Baseline",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 70%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-[clamp(2rem,5vw,5rem)] pb-[clamp(2rem,5vh,4.5rem)] flex items-end justify-between gap-8">
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight flex-1"
            style={{ fontSize: "clamp(2.4rem, 5vw, 5rem)" }}
          >
            {TAGLINE}
          </h1>
          <div className="flex gap-[clamp(1.5rem,3vw,3rem)] flex-shrink-0">
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="text-right">
                <p className="text-white font-bold text-sm leading-tight">{a.primary}</p>
                <p className="text-white/60 text-xs mt-0.5 qpi-caps">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7. Light top scrim only; small white logo top-centre + headline mid
  {
    name: "B7 · Logo Top, Headline Mid",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-x-0 top-0 h-[40%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[30%]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div className="absolute top-0 left-0 right-0 flex justify-center pt-[clamp(1.5rem,4vh,3rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-9 opacity-90" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 mt-8">
          <h1
            className="text-white font-bold leading-[0.92] tracking-tight text-balance max-w-5xl"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 8. Letterbox: solid ink bars top and bottom, centred white type between
  {
    name: "B8 · Letterbox Bars",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.22)" }}
        />
        {/* Top bar */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center px-[clamp(2rem,5vw,5rem)]"
          style={{ height: "clamp(60px, 12vh, 110px)", background: "var(--qpi-ink)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-8 opacity-90" />
        </div>
        {/* Bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center px-[clamp(2rem,5vw,5rem)]"
          style={{ height: "clamp(60px, 12vh, 110px)", background: "var(--qpi-ink)" }}
        >
          <p className="qpi-caps text-white/60 text-[11px]">{PHONE}</p>
          <p className="qpi-caps text-white/40 text-[11px] ml-auto">{SUB}</p>
        </div>
        {/* Centre type */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight text-balance"
            style={{ fontSize: "clamp(3rem, 7.5vw, 7.5rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 9. Heavy bottom scrim with headline + a white outline "Get a quote" pill
  {
    name: "B9 · CTA Pill",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(6,26,48,0.94) 0%, rgba(6,26,48,0.65) 40%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-[clamp(2rem,5.5vw,5.5rem)] pb-[clamp(2.5rem,6vh,5.5rem)]">
          <p className="qpi-caps text-white/55 text-[11px] mb-5">Brisbane · Gold Coast · Sunshine Coast</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight max-w-3xl"
            style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)" }}
          >
            {TAGLINE}
          </h1>
          <div className="mt-7">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 border border-white/70 text-white font-semibold rounded-full px-7 py-3.5 text-sm hover:bg-white hover:text-[var(--qpi-ink)] transition-colors"
            >
              Get a Quote
              <span className="opacity-60 text-xs qpi-caps">{PHONE}</span>
            </a>
          </div>
        </div>
      </section>
    ),
  },

  // 10. A navy multiply overlay over the whole image (deep blue mood) + centred white type
  {
    name: "B10 · Navy Multiply",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(11,42,74,0.72)", mixBlendMode: "multiply" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-10 mb-10 opacity-80" />
          <h1
            className="text-white font-bold leading-[0.92] tracking-tight text-balance max-w-4xl"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/65 mt-6 text-base max-w-lg leading-relaxed">{SUB}</p>
          <div className="flex gap-8 mt-10">
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="text-center">
                <p className="text-white font-bold text-sm">{a.primary}</p>
                <p className="text-white/50 text-xs mt-0.5 qpi-caps">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11. Headline lower-third, a single thin blue horizontal rule above it spanning the width
  {
    name: "B11 · Blue Rule",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        <div
          className="absolute left-0 right-0"
          style={{ bottom: "clamp(180px, 38vh, 340px)" }}
        >
          <div style={{ height: "1.5px", background: "var(--qpi-blue)", opacity: 0.9 }} />
        </div>
        <div
          className="absolute left-0 right-0 px-[clamp(2rem,5vw,5rem)]"
          style={{ bottom: "clamp(2rem,8vh,7rem)" }}
        >
          <p className="qpi-caps text-white/55 text-[11px] mb-4">Queensland&apos;s Premium Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight max-w-4xl"
            style={{ fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 12. Off-centre (golden-ratio) headline right side, scrim feathered from the right
  {
    name: "B12 · Golden-Ratio Right",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to left, rgba(6,26,48,0.93) 0%, rgba(6,26,48,0.78) 38%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 flex flex-col justify-center pr-[clamp(2.5rem,6vw,6rem)] pl-[clamp(1rem,2vw,2rem)]"
          style={{ width: "55%" }}
        >
          <p className="qpi-caps text-white/55 text-[10px] mb-6">Premium Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight text-right"
            style={{ fontSize: "clamp(2.4rem, 5.2vw, 5.2rem)" }}
          >
            {TAGLINE}
          </h1>
          <div className="w-12 h-px bg-white/35 mt-7 mb-5 ml-auto" />
          <p className="text-white/65 text-sm leading-relaxed text-right">{SUB}</p>
        </div>
      </section>
    ),
  },

  // 13. Big headline with SUB directly under, tight, over a wide soft bottom gradient
  {
    name: "B13 · Headline + Sub Tight",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-[clamp(2rem,5.5vw,5.5rem)] pb-[clamp(2.5rem,6vh,5.5rem)]">
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight text-balance"
            style={{ fontSize: "clamp(3.2rem, 8vw, 8rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/70 mt-3 text-[clamp(0.95rem,1.4vw,1.2rem)] leading-relaxed max-w-2xl">
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 14. Top scrim + bottom scrim (double), type split: kicker top-left, headline bottom-left
  {
    name: "B14 · Double Scrim Split",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-x-0 top-0 h-[35%]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[40%]"
          style={{ background: "linear-gradient(to top, rgba(6,26,48,0.9) 0%, rgba(0,0,0,0) 100%)" }}
        />
        {/* Top-left kicker */}
        <div className="absolute top-0 left-0 px-[clamp(2rem,5vw,5rem)] pt-[clamp(2rem,5vh,4.5rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="h-8 opacity-85" />
        </div>
        <div className="absolute top-0 right-0 px-[clamp(2rem,5vw,5rem)] pt-[clamp(2.2rem,5.5vh,5rem)]">
          <p className="qpi-caps text-white/55 text-[11px]">Est. Since 2000</p>
        </div>
        {/* Bottom-left headline */}
        <div className="absolute bottom-0 left-0 px-[clamp(2rem,5vw,5rem)] pb-[clamp(2.5rem,6vh,5.5rem)]">
          <p className="qpi-caps text-white/55 text-[10px] mb-4">Brisbane · Gold Coast · Sunshine Coast</p>
          <h1
            className="text-white font-bold leading-[0.93] tracking-tight max-w-2xl"
            style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 15. Minimal: tiny centred qpi-caps kicker high, enormous headline low, nothing else
  {
    name: "B15 · Minimal Kicker + Giant Low",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          className="absolute left-0 right-0 flex justify-center"
          style={{ top: "clamp(2.5rem,6vh,5rem)" }}
        >
          <p className="qpi-caps text-white/50 text-[11px] tracking-[0.25em]">Queensland&apos;s Premium Pool Builders</p>
        </div>
        <div
          className="absolute left-0 right-0 px-[clamp(1.5rem,4vw,4rem)]"
          style={{ bottom: "clamp(2rem,6vh,5rem)" }}
        >
          <h1
            className="text-white font-bold leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(4rem, 10vw, 10rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 16. Corner brackets (thin white L-shapes) at the four corners framing centred type
  {
    name: "B16 · Corner Brackets",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.42)" }} />
        {/* Corner bracket helper */}
        {(
          [
            { top: "clamp(20px,4vh,44px)", left: "clamp(20px,3.5vw,44px)", borderTop: "1.5px solid rgba(255,255,255,0.7)", borderLeft: "1.5px solid rgba(255,255,255,0.7)" },
            { top: "clamp(20px,4vh,44px)", right: "clamp(20px,3.5vw,44px)", borderTop: "1.5px solid rgba(255,255,255,0.7)", borderRight: "1.5px solid rgba(255,255,255,0.7)" },
            { bottom: "clamp(20px,4vh,44px)", left: "clamp(20px,3.5vw,44px)", borderBottom: "1.5px solid rgba(255,255,255,0.7)", borderLeft: "1.5px solid rgba(255,255,255,0.7)" },
            { bottom: "clamp(20px,4vh,44px)", right: "clamp(20px,3.5vw,44px)", borderBottom: "1.5px solid rgba(255,255,255,0.7)", borderRight: "1.5px solid rgba(255,255,255,0.7)" },
          ] as React.CSSProperties[]
        ).map((style, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{ width: "clamp(28px,4vw,52px)", height: "clamp(28px,4vw,52px)", ...style }}
          />
        ))}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[clamp(4rem,10vw,12rem)]">
          <p className="qpi-caps text-white/55 text-[11px] mb-7 tracking-[0.22em]">Queensland&apos;s Premium Pool Builders</p>
          <h1
            className="text-white font-bold leading-[0.92] tracking-tight text-balance"
            style={{ fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/65 mt-5 text-base max-w-md leading-relaxed">{SUB}</p>
        </div>
      </section>
    ),
  },

  // 17. A translucent black lower band (like a caption bar) holding headline + phone
  {
    name: "B17 · Caption Bar",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 50%)" }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 flex items-center justify-between gap-6 px-[clamp(2rem,5vw,5rem)] py-[clamp(1.2rem,3vh,2.4rem)]"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(2px)" }}
        >
          <h1
            className="text-white font-bold leading-tight tracking-tight flex-1"
            style={{ fontSize: "clamp(1.3rem, 2.8vw, 2.8rem)" }}
          >
            {TAGLINE}
          </h1>
          <a
            href={PHONE_HREF}
            className="qpi-caps text-white/80 text-[12px] flex-shrink-0 hover:text-white transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },
];
