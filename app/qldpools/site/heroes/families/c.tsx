import {
  HERO_SRC,
  LOGO_WHITE,
  LOGO_DARK,
  TAGLINE,
  SUB,
  PHONE,
  PHONE_HREF,
  ACCOLADES,
  type Hero,
} from "../kit";

/* ─── C · Split & Panel ─────────────────────────────────────────────────────
   Compositions that divide the frame between the photo and a solid colour
   panel (navy or blue) or white. The type lives in the panel or a floating
   card. 17 entries.
──────────────────────────────────────────────────────────────────────────── */

export const familyC: Hero[] = [
  /* 1 ─ Left navy panel / right image */
  {
    name: "C01 · Left Navy Panel",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left: 45% solid navy */}
        <div
          className="flex flex-col justify-center px-12 py-16 gap-8 shrink-0"
          style={{ width: "45%", background: "var(--qpi-ink)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-40 object-contain" />
          <div>
            <p className="qpi-caps text-white/60 mb-3 text-xs tracking-widest uppercase">
              Est. Queensland
            </p>
            <h1
              className="qpi-display text-white leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.8rem)" }}
            >
              {TAGLINE}
            </h1>
          </div>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="self-start text-white text-sm font-semibold border border-white/30 px-5 py-2.5 hover:bg-white/10 transition-colors"
          >
            {PHONE}
          </a>
        </div>
        {/* Right: 55% image */}
        <div className="flex-1 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
        </div>
      </section>
    ),
  },

  /* 2 ─ Right blue panel / left image */
  {
    name: "C02 · Right Blue Panel",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left: 60% image */}
        <div className="flex-1 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
        </div>
        {/* Right: 40% solid blue */}
        <div
          className="flex flex-col justify-center px-10 py-16 gap-7 shrink-0"
          style={{ width: "40%", background: "var(--qpi-blue)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-36 object-contain" />
          <h1
            className="qpi-display text-white leading-tight"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.5rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">{SUB}</p>
          <div className="flex flex-col gap-2 pt-2">
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="flex items-baseline gap-2">
                <span className="text-white font-bold text-sm">{a.primary}</span>
                <span className="text-white/60 text-xs">{a.secondary}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  /* 3 ─ Top image / bottom navy panel */
  {
    name: "C03 · Bottom Navy Band",
    node: (
      <section className="relative h-full w-full overflow-hidden flex flex-col">
        {/* Top: 60% image */}
        <div className="relative" style={{ height: "60%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          <div className="absolute top-8 left-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-32 object-contain" />
          </div>
        </div>
        {/* Bottom: 40% navy */}
        <div
          className="flex-1 flex items-center px-12 gap-16"
          style={{ background: "var(--qpi-ink)" }}
        >
          <div className="flex-1">
            <h1
              className="qpi-display text-white leading-tight"
              style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.6rem)" }}
            >
              {TAGLINE}
            </h1>
            <p className="text-white/70 text-sm mt-3 leading-relaxed max-w-md">{SUB}</p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="text-right">
                <p className="text-white font-bold text-sm">{a.primary}</p>
                <p className="text-white/50 text-xs">{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  /* 4 ─ Diagonal clip-path split */
  {
    name: "C04 · Diagonal Split",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Full image underneath */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Diagonal navy overlay — left triangle */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-12 py-16 gap-8"
          style={{
            background: "var(--qpi-ink)",
            clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-36 object-contain" />
          <h1
            className="qpi-display text-white leading-tight max-w-xs"
            style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/70 text-sm leading-relaxed max-w-52">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="self-start text-white text-sm font-semibold bg-[var(--qpi-blue)] px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Call {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 5 ─ Inset image on white + type below */
  {
    name: "C05 · Inset Frame",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center gap-8 px-12 py-10">
        {/* Logo top */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_DARK} alt="QLD Pool Installs" className="w-36 object-contain" />
        {/* Inset image — framed rectangle */}
        <div
          className="w-full max-w-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "16/7", outline: "1px solid #e5e7eb" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
        </div>
        {/* Type below */}
        <div className="text-center max-w-lg">
          <h1
            className="qpi-display leading-tight"
            style={{
              fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
              color: "var(--qpi-ink)",
            }}
          >
            {TAGLINE}
          </h1>
          <p className="text-sm mt-3 text-black/60 leading-relaxed">{SUB}</p>
        </div>
      </section>
    ),
  },

  /* 6 ─ Full image + floating navy card bottom-left */
  {
    name: "C06 · Floating Navy Card",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Full bleed image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Floating card bottom-left */}
        <div
          className="absolute bottom-10 left-10 flex flex-col gap-5 px-9 py-8 max-w-sm shadow-2xl"
          style={{ background: "var(--qpi-ink)", zIndex: 10 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-28 object-contain" />
          <h1
            className="qpi-display text-white leading-tight"
            style={{ fontSize: "clamp(1.3rem, 2vw, 2rem)" }}
          >
            {TAGLINE}
          </h1>
          <a
            href={PHONE_HREF}
            className="text-white text-sm font-semibold border-b border-white/40 pb-1 self-start hover:border-white transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 7 ─ Three vertical bands: image | blue | image */
  {
    name: "C07 · Triptych Bands",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left image strip */}
        <div className="relative overflow-hidden" style={{ width: "30%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            className="h-full w-full object-cover"
            style={{ objectPosition: "left center" }}
          />
        </div>
        {/* Centre blue panel */}
        <div
          className="flex flex-col items-center justify-center px-8 py-12 gap-7 text-center"
          style={{ width: "40%", background: "var(--qpi-blue)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-32 object-contain" />
          <h1
            className="qpi-display text-white leading-tight"
            style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.4rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/80 text-xs leading-relaxed">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="text-white text-sm font-semibold border border-white/40 px-5 py-2 hover:bg-white/10 transition-colors"
          >
            {PHONE}
          </a>
        </div>
        {/* Right image strip */}
        <div className="relative flex-1 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            className="h-full w-full object-cover"
            style={{ objectPosition: "right center" }}
          />
        </div>
      </section>
    ),
  },

  /* 8 ─ Left image / right white panel with accolades */
  {
    name: "C08 · White Panel Accolades",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left: 55% image */}
        <div className="relative" style={{ width: "55%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
        </div>
        {/* Right: 45% white */}
        <div className="flex-1 flex flex-col justify-center px-12 py-14 gap-8 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="w-36 object-contain" />
          <h1
            className="qpi-display leading-tight"
            style={{
              fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)",
              color: "var(--qpi-ink)",
            }}
          >
            {TAGLINE}
          </h1>
          <p className="text-black/60 text-sm leading-relaxed">{SUB}</p>
          {/* Accolades */}
          <div className="flex flex-col gap-4 pt-2 border-t border-black/10">
            {ACCOLADES.map((a) => (
              <div key={a.primary} className="flex items-baseline gap-3">
                <span
                  className="font-bold text-sm"
                  style={{ color: "var(--qpi-blue)" }}
                >
                  {a.primary}
                </span>
                <span className="text-black/50 text-xs">{a.secondary}</span>
              </div>
            ))}
          </div>
          <a
            href={PHONE_HREF}
            className="self-start text-sm font-semibold px-5 py-2.5 text-white hover:opacity-90 transition-opacity"
            style={{ background: "var(--qpi-ink)" }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 9 ─ Full image + frosted glass centred panel */
  {
    name: "C09 · Frosted Glass Centre",
    node: (
      <section className="relative h-full w-full overflow-hidden flex items-center justify-center">
        {/* Full bleed image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Frosted panel */}
        <div
          className="relative flex flex-col items-center text-center gap-6 px-12 py-12 max-w-xl shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.3)",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-36 object-contain" />
          <h1
            className="qpi-display text-white leading-tight drop-shadow"
            style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.6rem)" }}
          >
            {TAGLINE}
          </h1>
          <p className="text-white/90 text-sm leading-relaxed">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="text-white text-sm font-semibold border border-white/60 px-6 py-2.5 hover:bg-white/20 transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 10 ─ Image above + slim blue ribbon with accolades */
  {
    name: "C10 · Blue Ribbon Accolades",
    node: (
      <section className="relative h-full w-full overflow-hidden flex flex-col">
        {/* Image fills most of the frame */}
        <div className="relative flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Headline overlaid bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 px-10 pb-8 pt-20"
            style={{
              background:
                "linear-gradient(to top, rgba(11,42,74,0.85) 0%, transparent 100%)",
            }}
          >
            <h1
              className="qpi-display text-white leading-tight max-w-2xl"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
            >
              {TAGLINE}
            </h1>
          </div>
          {/* Logo top-left */}
          <div className="absolute top-8 left-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-32 object-contain" />
          </div>
        </div>
        {/* Blue ribbon */}
        <div
          className="flex items-center justify-between px-10 shrink-0"
          style={{ background: "var(--qpi-blue)", height: "72px" }}
        >
          {ACCOLADES.map((a, i) => (
            <div
              key={a.primary}
              className="flex items-baseline gap-2 text-white"
              style={{
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.25)" : undefined,
                paddingLeft: i > 0 ? "2rem" : undefined,
              }}
            >
              <span className="font-bold text-sm">{a.primary}</span>
              <span className="text-white/70 text-xs">{a.secondary}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  /* 11 ─ Full image + tall narrow navy left column */
  {
    name: "C11 · Narrow Left Column",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Narrow navy column */}
        <div
          className="relative flex flex-col items-center justify-between py-10 px-4 shrink-0"
          style={{ width: "88px", background: "var(--qpi-ink)", zIndex: 10 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_WHITE}
            alt="QLD Pool Installs"
            className="w-12 object-contain"
          />
          {/* Vertical text */}
          <p
            className="qpi-caps text-white/60 text-xs tracking-widest"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            {TAGLINE}
          </p>
          <a
            href={PHONE_HREF}
            className="text-white/80 text-xs font-mono hover:text-white transition-colors"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            {PHONE}
          </a>
        </div>
        {/* Image fills the rest */}
        <div className="flex-1 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          {/* Floating headline */}
          <div className="absolute bottom-10 left-8 right-8">
            <h1
              className="qpi-display text-white leading-tight drop-shadow-lg"
              style={{ fontSize: "clamp(2rem, 3.8vw, 4rem)" }}
            >
              {TAGLINE}
            </h1>
          </div>
        </div>
      </section>
    ),
  },

  /* 12 ─ White header strip + image below with headline */
  {
    name: "C12 · White Header Strip",
    node: (
      <section className="relative h-full w-full overflow-hidden flex flex-col">
        {/* White header */}
        <div
          className="flex items-center justify-between px-10 bg-white shrink-0"
          style={{ height: "72px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-9 object-contain" />
          <p className="qpi-caps text-xs tracking-widest" style={{ color: "var(--qpi-ink)" }}>
            Brisbane · Gold Coast · Sunshine Coast
          </p>
        </div>
        {/* Image below with headline */}
        <div className="relative flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute bottom-0 left-0 right-0 px-10 pb-10 pt-24"
            style={{
              background:
                "linear-gradient(to top, rgba(11,42,74,0.9) 0%, transparent 100%)",
            }}
          >
            <h1
              className="qpi-display text-white leading-tight max-w-2xl"
              style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
            >
              {TAGLINE}
            </h1>
            <p className="text-white/75 text-sm mt-3 max-w-lg leading-relaxed">{SUB}</p>
          </div>
        </div>
      </section>
    ),
  },

  /* 13 ─ Two pure-colour stacked panels, no image */
  {
    name: "C13 · Pure Colour Stack",
    node: (
      <section className="relative h-full w-full overflow-hidden flex flex-col">
        {/* Top: navy headline panel */}
        <div
          className="flex-1 relative flex flex-col justify-center px-14 py-10 gap-6"
          style={{ background: "var(--qpi-ink)" }}
        >
          {/* Faint watermark wave logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_WHITE}
            alt=""
            aria-hidden="true"
            className="absolute right-10 top-1/2 -translate-y-1/2 w-64 object-contain pointer-events-none select-none"
            style={{ opacity: 0.05 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-36 object-contain relative" />
          <h1
            className="qpi-display text-white leading-tight relative max-w-2xl"
            style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Bottom: blue SUB + phone panel */}
        <div
          className="flex items-center justify-between px-14 py-8 gap-8 shrink-0"
          style={{ background: "var(--qpi-blue)" }}
        >
          <p className="text-white/90 text-sm leading-relaxed max-w-lg">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="shrink-0 text-white text-base font-bold border border-white/40 px-6 py-3 hover:bg-white/10 transition-colors"
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 14 ─ Full image + large white rounded card centred */
  {
    name: "C14 · White Centred Card",
    node: (
      <section className="relative h-full w-full overflow-hidden flex items-center justify-center">
        {/* Full bleed image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* White card */}
        <div
          className="relative flex flex-col items-center text-center gap-7 px-14 py-12 shadow-2xl max-w-lg w-full"
          style={{
            background: "#fff",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" className="w-36 object-contain" />
          <h1
            className="qpi-display leading-tight"
            style={{
              fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)",
              color: "var(--qpi-ink)",
            }}
          >
            {TAGLINE}
          </h1>
          <p className="text-black/60 text-sm leading-relaxed">{SUB}</p>
          <a
            href={PHONE_HREF}
            className="text-white text-sm font-semibold px-7 py-3 hover:opacity-90 transition-opacity"
            style={{ background: "var(--qpi-blue)" }}
          >
            Call {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 15 ─ Left image / right split navy top + white bottom */
  {
    name: "C15 · Right Double Split",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left: image */}
        <div className="relative" style={{ width: "55%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
        </div>
        {/* Right: split vertically — navy top / white bottom */}
        <div className="flex-1 flex flex-col">
          {/* Navy top: headline */}
          <div
            className="flex flex-col justify-end px-10 pb-8 pt-10 gap-4"
            style={{ flex: "0 0 55%", background: "var(--qpi-ink)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-28 object-contain" />
            <h1
              className="qpi-display text-white leading-tight"
              style={{ fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              {TAGLINE}
            </h1>
          </div>
          {/* White bottom: SUB + phone */}
          <div className="flex-1 flex flex-col justify-center px-10 py-8 gap-4 bg-white">
            <p className="text-black/70 text-sm leading-relaxed">{SUB}</p>
            <a
              href={PHONE_HREF}
              className="text-sm font-bold self-start hover:opacity-80 transition-opacity"
              style={{ color: "var(--qpi-blue)" }}
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    ),
  },

  /* 16 ─ Full image + translucent navy sidebar right with vertical type */
  {
    name: "C16 · Right Navy Sidebar",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Full bleed image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Headline overlaid on image */}
        <div
          className="absolute bottom-10 left-10"
          style={{ zIndex: 8 }}
        >
          <h1
            className="qpi-display text-white leading-tight max-w-lg drop-shadow-lg"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Translucent navy right sidebar */}
        <div
          className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-between py-10 px-5"
          style={{
            width: "100px",
            background: "rgba(11,42,74,0.82)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" className="w-10 object-contain" />
          <span
            className="qpi-caps text-white/70 text-xs tracking-widest"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            Queensland&apos;s Premium Pool Builders
          </span>
          <a
            href={PHONE_HREF}
            className="text-white/80 text-xs font-mono hover:text-white transition-colors"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  /* 17 ─ Postcard: image inset with white mat border, headline in bottom mat */
  {
    name: "C17 · Postcard Mat",
    node: (
      <section
        className="relative h-full w-full overflow-hidden flex items-center justify-center"
        style={{ background: "#fff" }}
      >
        {/* White mat + inset structure */}
        <div
          className="relative w-full h-full flex flex-col"
          style={{ padding: "5% 6%" }}
        >
          {/* Top mat row: logo left */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" className="h-8 object-contain" />
            <p
              className="qpi-caps text-xs tracking-widest"
              style={{ color: "var(--qpi-ink)" }}
            >
              {PHONE}
            </p>
          </div>
          {/* Inset image */}
          <div
            className="flex-1 overflow-hidden shadow-lg"
            style={{ outline: "1px solid #e5e7eb" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" />
          </div>
          {/* Bottom mat: headline */}
          <div className="flex items-baseline justify-between mt-4 gap-8 shrink-0">
            <h1
              className="qpi-display leading-tight"
              style={{
                fontSize: "clamp(1.4rem, 2.2vw, 2.2rem)",
                color: "var(--qpi-ink)",
              }}
            >
              {TAGLINE}
            </h1>
            <p className="text-black/50 text-xs leading-relaxed text-right max-w-48 shrink-0">
              {SUB}
            </p>
          </div>
        </div>
      </section>
    ),
  },
];
