import Link from "next/link";
import BrandStar from "@/components/BrandStar";

// Fresh main page — intentionally minimal for now; to be designed.
export default function SandboxHome() {
  return (
    <section className="sb-home">
      <BrandStar className="sb-home-star" size="2.4em" />
      <h1 className="sb-home-title">fs.sandbox</h1>
      <p className="sb-home-lede">
        A workshop of small, free tools, pulled out of the finbar✶studio site.
      </p>
      <Link href="/mockups" className="sb-home-link">
        Mockups →
      </Link>
    </section>
  );
}
