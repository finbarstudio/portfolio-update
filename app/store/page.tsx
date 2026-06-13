import type { Metadata } from "next";
import Script from "next/script";
import ClientImage from "@/components/ClientImage";
import BrandStar from "@/components/BrandStar";
import { isShopifyConfigured, getProduct, formatPrice } from "@/lib/shopify";
import { startCheckout } from "@/lib/store-actions";
import { STORE_PRODUCT } from "@/content/store";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Digital products from finbar✶studio — tools and templates drawn from client work, by a Brisbane graphic designer.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Store | Finbar Studio",
    description: "Digital products and tools from finbar✶studio.",
    url: "/store",
    type: "website",
  },
};

export default async function StorePage() {
  const product = isShopifyConfigured() ? await getProduct(STORE_PRODUCT.handle) : null;
  const live = !!product && !!product.variantId && product.availableForSale;

  const fb = STORE_PRODUCT.fallback;
  const name = product?.title ?? fb.name;
  const priceLabel = product ? formatPrice(product.price.amount, product.price.currencyCode) : fb.priceLabel;
  const imageUrl = product?.image?.url ?? fb.image;
  const imageAlt = product?.image?.altText ?? name;

  const productJsonLd = live && product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: fb.tagline,
        image: product.image?.url ? [product.image.url] : undefined,
        brand: { "@type": "Brand", name: "finbar✶studio" },
        offers: {
          "@type": "Offer",
          price: product.price.amount,
          priceCurrency: product.price.currencyCode,
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/store`,
        },
      }
    : null;

  return (
    <div className="px-5 md:px-10 pt-8 md:pt-14 pb-10">
      {productJsonLd && (
        <Script
          id="ld-product"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}

      <p className="mono-label text-ink-soft mb-6">Studio products</p>

      <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Media */}
        <div className="md:col-span-6">
          <div className="store-media">
            {imageUrl ? (
              <ClientImage src={imageUrl} alt={imageAlt} fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            ) : (
              <div className="store-media-placeholder" aria-hidden="true"><BrandStar size={64} /></div>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="md:col-span-6">
          {!live && <span className="tag tag-teal mb-5 inline-block">Coming soon</span>}

          <h1 className="home-display-sm text-ink">{name}</h1>

          {priceLabel && (
            <p className="font-sans font-bold text-ink mt-3" style={{ fontSize: "var(--text-h2)" }}>{priceLabel}</p>
          )}

          <div className="mt-6 max-w-prose text-ink leading-relaxed" style={{ fontSize: "var(--text-body)" }}>
            {product ? (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
            ) : (
              <p>{fb.blurb}</p>
            )}
          </div>

          {!live && fb.features.length > 0 && (
            <ul className="home-list mt-8 max-w-md" style={{ fontSize: "var(--text-small)" }}>
              {fb.features.map((f) => (
                <li key={f} className="text-ink">{f}</li>
              ))}
            </ul>
          )}

          <div className="mt-9">
            {live && product?.variantId ? (
              <form action={startCheckout}>
                <input type="hidden" name="variantId" value={product.variantId} />
                <button type="submit" className="store-buy">
                  Buy now{priceLabel ? ` — ${priceLabel}` : ""}
                </button>
              </form>
            ) : (
              <div>
                <a
                  href="mailto:finbar@finbar.studio?subject=Plugin%20launch"
                  className="store-buy store-buy-ghost"
                >
                  Email me at launch
                </a>
                <p className="mono-label text-ink-soft mt-4">In development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
