import BrandWordmarkText from "@/components/BrandWordmarkText";

/**
 * The one studio credit every demo site carries in its footer (/lindon, /mt):
 * "Demo built by FINBARSTUDIO*", linking home. Colour and size come from the
 * demo's own footer, so it sits in each site's voice; the wordmark is the
 * type-set BrandWordmarkText, which holds its baseline at small sizes.
 */
export default function DemoCredit({ className }: { className?: string }) {
  return (
    <a href="https://www.finbar.studio" className={`demo-credit ${className ?? ""}`}>
      Demo built by <BrandWordmarkText className="demo-credit-mark" />
    </a>
  );
}
