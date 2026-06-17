import BrandStar from "@/components/BrandStar";

// Fresh main page — just the brand star with an outline that draws itself around it.
export default function SandboxHome() {
  return (
    <section className="sb-home">
      <div className="sb-home-mark">
        <svg className="sb-home-ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="54" />
        </svg>
        <BrandStar className="sb-home-star" size={72} />
      </div>
    </section>
  );
}
