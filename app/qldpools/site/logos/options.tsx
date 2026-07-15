import type { ReactNode } from "react";

export type LogoOption = { name: string; node: ReactNode };

const INK = "var(--qpi-ink)";
const BLUE = "var(--qpi-blue)";
const AQUA = "var(--qpi-aqua)";
const WHITE = "#fff";

function wrap(children: ReactNode): ReactNode {
  return (
    <div
      className="relative inline-flex flex-col items-center justify-center"
      style={{ minWidth: 40, minHeight: 40 }}
    >
      {children}
    </div>
  );
}

export const logoOptions: LogoOption[] = [
  {
    name: "Arch Outline Stack",
    node: wrap(
      <div
        style={{
          width: 150,
          height: 190,
          borderRadius: "75px 75px 0 0",
          border: `1.5px solid ${INK}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, color: INK }}>QLD</span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: INK, textAlign: "center", lineHeight: 1.5 }}>
          POOL
          <br />
          INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Ink Arch Reverse",
    node: wrap(
      <div
        style={{
          width: 150,
          height: 190,
          borderRadius: "75px 75px 0 0",
          background: INK,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 3, color: WHITE }}>QLD</span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: WHITE, textAlign: "center", lineHeight: 1.5 }}>
          POOL
          <br />
          INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Doorway Portal",
    node: wrap(
      <>
        <div
          style={{
            width: 190,
            height: 110,
            borderRadius: "95px 95px 0 0",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2, color: WHITE }}>QLD</span>
        </div>
        <span style={{ marginTop: 10, fontSize: 12, fontWeight: 500, letterSpacing: 4, color: INK }}>
          POOL INSTALLS
        </span>
      </>
    ),
  },
  {
    name: "Q Arch Monogram",
    node: wrap(
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ position: "relative", width: 60, height: 74 }}>
          <div
            style={{
              width: 60,
              height: 70,
              borderRadius: "30px 30px 0 0",
              border: `6px solid ${BLUE}`,
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 2,
              bottom: 0,
              width: 24,
              height: 6,
              background: BLUE,
              transform: "rotate(-40deg)",
              borderRadius: 2,
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 1, color: INK }}>LD</span>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: INK }}>POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Arch Cutout",
    node: wrap(
      <>
        <div style={{ position: "relative", width: 170, height: 120, background: INK }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              transform: "translateX(-50%)",
              width: 70,
              height: 90,
              borderRadius: "35px 35px 0 0",
              background: WHITE,
            }}
          />
        </div>
        <span style={{ marginTop: 10, fontSize: 13, fontWeight: 700, letterSpacing: 3, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </>
    ),
  },
  {
    name: "Pool Steps Row",
    node: wrap(
      <>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ width: 34, height: 46, borderRadius: "17px 17px 0 0", background: BLUE, opacity: 0.55 }} />
          <div style={{ width: 34, height: 62, borderRadius: "17px 17px 0 0", background: INK }} />
          <div style={{ width: 34, height: 46, borderRadius: "17px 17px 0 0", background: BLUE, opacity: 0.55 }} />
        </div>
        <span style={{ marginTop: 12, fontSize: 13, fontWeight: 700, letterSpacing: 3, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </>
    ),
  },
  {
    name: "Breaking Curve",
    node: wrap(
      <div style={{ position: "relative", width: 170, height: 170 }}>
        <div
          style={{
            width: 170,
            height: 170,
            borderRadius: "85px 85px 0 0",
            border: `1.5px solid ${INK}`,
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: WHITE,
            padding: "0 8px",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            color: INK,
          }}
        >
          QLD
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 34,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 2,
            color: INK,
          }}
        >
          POOL INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Quarter Round Bracket",
    node: wrap(
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 50,
            height: 100,
            borderRadius: "50px 0 0 0",
            border: `1.5px solid ${BLUE}`,
            borderRight: "none",
            borderBottom: "none",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: INK }}>POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Arch Cradle",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: INK, marginBottom: 8 }}>
          POOL INSTALLS
        </span>
        <div
          style={{
            width: 140,
            height: 36,
            borderRadius: "0 0 70px 70px",
            border: `1.5px solid ${BLUE}`,
            borderTop: "none",
          }}
        />
      </div>
    ),
  },
  {
    name: "Nested Arches",
    node: wrap(
      <div style={{ position: "relative", width: 190, height: 190 }}>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 190,
            height: 190,
            borderRadius: "95px 95px 0 0",
            border: `1.5px solid ${INK}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 140,
            height: 140,
            borderRadius: "70px 70px 0 0",
            border: `1.5px solid ${INK}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: 2, color: INK }}>POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Gradient Arch",
    node: wrap(
      <div
        style={{
          width: 160,
          height: 190,
          borderRadius: "80px 80px 0 0",
          background: `linear-gradient(180deg, ${AQUA}, ${BLUE})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: WHITE }}>QLD</span>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: WHITE }}>POOL INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Squat Arch Line",
    node: wrap(
      <div
        style={{
          width: 260,
          height: 90,
          borderRadius: "130px 130px 0 0",
          background: INK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, color: WHITE }}>QLD POOL INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Waterline Arch",
    node: wrap(
      <div
        style={{
          position: "relative",
          width: 170,
          height: 180,
          borderRadius: "85px 85px 0 0",
          border: `1.5px solid ${INK}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 36,
          boxSizing: "border-box",
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: INK, marginTop: 4 }}>
          POOL INSTALLS
        </span>
        <div style={{ position: "absolute", bottom: 44, left: 14, right: 14, height: 1.5, background: BLUE }} />
      </div>
    ),
  },
  {
    name: "Arch Dot Mark",
    node: wrap(
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 16, height: 20, borderRadius: "8px 8px 0 0", background: BLUE }} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD POOL INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Tapered Stack",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 4, color: INK }}>QLD</span>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: 3, color: INK, marginTop: 4 }}>POOL</span>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: 3, color: INK, marginTop: 2 }}>INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Arced Text Path",
    node: wrap(
      <svg width="200" height="140" viewBox="0 0 200 140">
        <path id="archCurve16" d="M20,120 A80,80 0 0 1 180,120" fill="none" stroke={BLUE} strokeWidth={1.5} />
        <text fontSize={14} fontWeight={700} letterSpacing={2} fill={INK}>
          <textPath href="#archCurve16" startOffset="50%" textAnchor="middle">
            QLD POOL INSTALLS
          </textPath>
        </text>
      </svg>
    ),
  },
  {
    name: "QPI Badge",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 90,
            height: 100,
            borderRadius: "45px 45px 0 0",
            background: INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1, color: WHITE }}>QPI</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 3, color: INK }}>QLD POOL INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Split Arch Flank",
    node: wrap(
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 40,
            height: 110,
            borderRadius: "80px 0 0 0",
            border: `1.5px solid ${INK}`,
            borderRight: "none",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: 2, color: INK }}>POOL INSTALLS</span>
        </div>
        <div
          style={{
            width: 40,
            height: 110,
            borderRadius: "0 80px 0 0",
            border: `1.5px solid ${INK}`,
            borderLeft: "none",
          }}
        />
      </div>
    ),
  },
  {
    name: "Stepped Base Arch",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 150,
            height: 110,
            borderRadius: "75px 75px 0 0",
            background: BLUE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, color: WHITE }}>QLD</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
          <div style={{ width: 50, height: 8, background: BLUE }} />
          <div style={{ width: 50, height: 14, background: BLUE }} />
          <div style={{ width: 50, height: 8, background: BLUE }} />
        </div>
        <span style={{ marginTop: 10, fontSize: 10, fontWeight: 500, letterSpacing: 2, color: INK }}>
          POOL INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Blue Baseline Arch",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 150,
            height: 130,
            borderRadius: "75px 75px 0 0",
            border: `1.5px solid ${INK}`,
            borderBottom: "none",
            boxSizing: "border-box",
          }}
        />
        <div style={{ width: 150, height: 36, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: WHITE }}>QLD POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Negative Space Arch",
    node: wrap(
      <>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <div style={{ width: 70, height: 100, background: INK, borderRadius: "0 60px 0 0" }} />
          <div style={{ width: 20 }} />
          <div style={{ width: 70, height: 100, background: INK, borderRadius: "60px 0 0 0" }} />
        </div>
        <span style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: 3, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </>
    ),
  },
  {
    name: "Ripple Rule Arch",
    node: wrap(
      <>
        <div
          style={{
            width: 160,
            height: 140,
            borderRadius: "80px 80px 0 0",
            border: `1.5px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="100" height="24" viewBox="0 0 100 24">
            <path d="M0,12 Q12,0 25,12 T50,12 T75,12 T100,12" fill="none" stroke={BLUE} strokeWidth={2.5} />
          </svg>
        </div>
        <span style={{ marginTop: 10, fontSize: 12, fontWeight: 700, letterSpacing: 3, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </>
    ),
  },
  {
    name: "Pool Inline Arch",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 3, color: INK }}>QLD</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 46,
              height: 26,
              borderRadius: "13px 13px 0 0",
              background: BLUE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 700, color: WHITE, letterSpacing: 1 }}>POOL</span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 2, color: INK }}>INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Flat Lintel",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 220, height: 40, borderRadius: "110px 110px 0 0", background: INK }} />
        <div style={{ width: 220, height: 3, background: INK, marginTop: 2 }} />
        <span style={{ marginTop: 14, fontSize: 14, fontWeight: 600, letterSpacing: 4, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Vertical Portal",
    node: wrap(
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 40,
            height: 170,
            borderRadius: "20px 20px 0 0",
            border: `1.5px solid ${BLUE}`,
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 4,
            color: INK,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          QLD POOL INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Aqua On Ink",
    node: wrap(
      <div
        style={{
          width: 190,
          height: 200,
          background: INK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 130,
            height: 150,
            borderRadius: "65px 65px 0 0",
            background: AQUA,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: WHITE }}>QLD</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, color: WHITE }}>POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Double Rule Arch",
    node: wrap(
      <div
        style={{
          width: 160,
          height: 190,
          borderRadius: "80px 80px 0 0",
          border: `1.5px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "72px 72px 0 0",
            border: `1px solid ${INK}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: 2, color: INK }}>POOL INSTALLS</span>
        </div>
      </div>
    ),
  },
  {
    name: "Arch Cap",
    node: wrap(
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 90, height: 45, borderRadius: "45px 45px 0 0", background: BLUE }} />
        <span style={{ marginTop: 12, fontSize: 16, fontWeight: 800, letterSpacing: 3, color: INK }}>QLD</span>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 2, color: INK, marginTop: 2 }}>
          POOL INSTALLS
        </span>
      </div>
    ),
  },
  {
    name: "Tight Block Arch",
    node: wrap(
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: "85px 85px 0 0",
          border: `1.5px solid ${BLUE}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: INK }}>QLD</span>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: INK }}>POOL</span>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: INK }}>INSTALLS</span>
      </div>
    ),
  },
  {
    name: "Fluted Column Arch",
    node: wrap(
      <>
        <div
          style={{
            position: "relative",
            width: 150,
            height: 140,
            borderRadius: "75px 75px 0 0",
            overflow: "hidden",
            background: WHITE,
            border: `1px solid ${INK}`,
            boxSizing: "border-box",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: i * 15 + 6,
                width: 1,
                background: INK,
                opacity: 0.45,
              }}
            />
          ))}
        </div>
        <span style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: 3, color: INK }}>
          QLD POOL INSTALLS
        </span>
      </>
    ),
  },
];
