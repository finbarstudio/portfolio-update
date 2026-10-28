import Link from "next/link";
import { BASE_PATH } from "@/lib/dad-shop/types";

export default function NotFound() {
  return (
    <div className="dad-app">
      <div style={{ padding: "48px 20px", maxWidth: 420, margin: "0 auto", display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Couldn&apos;t find that.</h1>
        <p style={{ margin: 0 }}>The shop lives on one page now.</p>
        <Link style={{ justifySelf: "start", minHeight: 44, padding: "0 18px", display: "inline-flex", alignItems: "center", borderRadius: 10, border: 0, background: "var(--accent)", color: "#fff", font: "inherit", fontWeight: 600, textDecoration: "none" }} href={BASE_PATH}>
          Back to the shop
        </Link>
      </div>
    </div>
  );
}
