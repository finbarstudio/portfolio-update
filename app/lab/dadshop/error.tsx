"use client";

/** Something broke while loading the page. Calm words and a way to try again. */
export default function DadShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="dad-app">
      <div style={{ padding: "48px 20px", maxWidth: 420, margin: "0 auto", display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>That didn&apos;t load.</h1>
        <p style={{ margin: 0 }}>It&apos;s probably the signal, or the shop is having a moment. Your list is safe.</p>
        <button type="button" style={{ justifySelf: "start", minHeight: 44, padding: "0 18px", display: "inline-flex", alignItems: "center", borderRadius: 10, border: 0, background: "var(--accent)", color: "#fff", font: "inherit", fontWeight: 600, textDecoration: "none" }} onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
