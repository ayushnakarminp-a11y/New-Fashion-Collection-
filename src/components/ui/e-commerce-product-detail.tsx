import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  Handbag,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from "@phosphor-icons/react";

export type CommerceProduct = {
  name: string;
  description: string;
  price: string;
  image: string;
  alt: string;
  collection: string;
  details?: string;
  care?: string;
  delivery?: string;
};

type ProductDetailProps = {
  product: CommerceProduct;
  onBack: () => void;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
};

const sizes = ["S", "M", "L", "Custom"];

export default function ProductDetail({ product, onBack, onAddToCart, onBuyNow }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "delivery">("details");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setSelectedSize("M");
    setQuantity(1);
    setIsWishlisted(false);
    setActiveTab("details");
    setImageFailed(false);
  }, [product]);

  return (
    <main id="main" className="min-h-[calc(100dvh-var(--header-height))] bg-[var(--cream)] px-[var(--page-gutter)] py-7 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <button
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#55524d] transition-colors hover:text-[var(--brick)] active:translate-y-px"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft size={18} weight="regular" aria-hidden="true" />
          Back to collection
        </button>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-16">
          <div className="relative min-h-[420px] overflow-hidden bg-[var(--taupe)] sm:min-h-[620px] lg:min-h-[680px]">
            {imageFailed ? (
              <div className="flex h-full min-h-[420px] items-center justify-center px-8 text-center text-sm text-[#66635e]">
                Product image is unavailable. The item details are still ready below.
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.alt}
                className="h-full w-full object-cover"
                width="900"
                height="1100"
                onError={() => setImageFailed(true)}
              />
            )}
            <button
              type="button"
              className={`absolute right-4 top-4 grid size-11 place-items-center border border-black/10 bg-[var(--cream)] text-[var(--ink)] shadow-[0_10px_30px_rgba(71,64,52,0.10)] transition-colors hover:text-[var(--brick)] active:translate-y-px ${imageFailed ? "hidden" : ""}`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              onClick={() => setIsWishlisted((value) => !value)}
            >
              <Heart size={21} weight={isWishlisted ? "fill" : "regular"} aria-hidden="true" />
            </button>
          </div>

          <section className="self-center" aria-labelledby="product-title">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brick-dark)]">{product.collection}</p>
            <h1 id="product-title" className="max-w-[18ch] text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--ink)] sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <strong className="text-xl font-semibold text-[var(--brick-dark)] sm:text-2xl">{product.price}</strong>
              <span className="flex items-center gap-1 text-sm text-[#5d5a55]">
                <span className="flex text-[#b58227]" aria-label="Rated 4.8 out of 5">
                  {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} weight="fill" aria-hidden="true" />)}
                </span>
                Made in Sanepa
              </span>
            </div>

            <p className="mt-6 max-w-[58ch] text-[15px] leading-7 text-[#55524d]">{product.details || `${product.description}. Finished to order by our boutique tailors with careful attention to fit.`}</p>

            <div className="mt-7 border-b border-black/15">
              <div className="flex gap-7" role="tablist" aria-label="Product information">
                {(["details", "care", "delivery"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 pb-3 text-xs font-semibold uppercase tracking-[0.07em] transition-colors ${activeTab === tab ? "border-[var(--brick)] text-[var(--brick-dark)]" : "border-transparent text-[#6b6862] hover:text-[var(--ink)]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-h-24 py-5 text-sm leading-6 text-[#55524d]" role="tabpanel">
              {activeTab === "details" && <ul className="grid gap-2"><li className="flex gap-2"><Check className="mt-1 shrink-0 text-[var(--brick)]" size={16} weight="bold" />Custom fitting available</li><li className="flex gap-2"><Check className="mt-1 shrink-0 text-[var(--brick)]" size={16} weight="bold" />Fabric and finish checked by hand</li><li className="flex gap-2"><Check className="mt-1 shrink-0 text-[var(--brick)]" size={16} weight="bold" />Color may vary slightly in natural light</li></ul>}
              {activeTab === "care" && <p>{product.care || "Dry clean recommended. Store folded in a cool, dry place and keep detailed embroidery away from direct heat."}</p>}
              {activeTab === "delivery" && <div className="grid gap-3"><p className="flex gap-3"><Truck className="shrink-0 text-[var(--brick)]" size={21} />{product.delivery || "Boutique pickup or local delivery can be arranged."}</p><p className="flex gap-3"><ShieldCheck className="shrink-0 text-[var(--brick)]" size={21} />We confirm sizing and timing before the order is finalized.</p></div>}
            </div>

            <fieldset className="mt-2">
              <div className="flex items-center justify-between gap-4">
                <legend className="text-sm font-semibold">Choose your size</legend>
                <a className="text-xs font-semibold text-[var(--brick-dark)] underline underline-offset-4" href="tel:+9779813222995">Need fitting help?</a>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {sizes.map((size) => <button key={size} type="button" aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)} className={`min-h-11 border px-2 text-xs font-semibold transition-colors active:translate-y-px ${selectedSize === size ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]" : "border-black/20 bg-transparent text-[var(--ink)] hover:border-[var(--ink)]"}`}>{size}</button>)}
              </div>
            </fieldset>

            <div className="mt-7 grid grid-cols-[112px_1fr] gap-3">
              <div className="flex min-h-12 items-center border border-black/20 bg-white" aria-label="Quantity">
                <button type="button" className="grid h-full flex-1 place-items-center disabled:opacity-35" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity === 1} aria-label="Decrease quantity"><Minus size={16} /></button>
                <output className="min-w-7 text-center text-sm font-semibold" aria-live="polite">{quantity}</output>
                <button type="button" className="grid h-full flex-1 place-items-center" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button type="button" className="button button-primary gap-2" onClick={() => onAddToCart(quantity)}><Handbag size={18} weight="bold" />Add to bag</button>
            </div>
            <button type="button" className="button mt-3 w-full border border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]" onClick={() => onBuyNow(quantity)}>Buy now</button>
          </section>
        </div>
      </div>
    </main>
  );
}
