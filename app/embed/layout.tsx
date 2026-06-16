import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed",
  // Embeds are framed fragments, not destinations.
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Force a transparent, marginless document so `allowtransparency` iframes
          show the host page through any transparent background. */}
      <style>{`html,body{background:transparent !important;margin:0;padding:0;}`}</style>
      <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>{children}</div>
    </>
  );
}
