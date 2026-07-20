import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import ProductDetail, { type CommerceProduct } from "@/components/ui/e-commerce-product-detail";
import { getPublishedCategory, getPublishedCollection, isSupabaseConfigured, type DbCategory } from "@/lib/supabase";

export type Product = [name: string, description: string, price: string, alt: string];
export type Collection = {
  key: "kurta-surwal" | "lehenga" | "pants" | "tops-blouses";
  route: string;
  title: string;
  intro: string;
  searchLabel: string;
  searchPlaceholder: string;
  metaTitle: string;
  metaDescription: string;
  products: Product[];
};

export const collections: Record<string, Collection> = {
  "/kurta-surwal.html": {
    key: "kurta-surwal",
    route: "kurta-surwal.html",
    title: "KURTA SURWAL COLLECTION",
    intro: "From breathable daily favorites to celebration-ready sets.",
    searchLabel: "Search the Kurta Surwal collection",
    searchPlaceholder: "Try “sage chikankari”",
    metaTitle: "Kurta Surwal Collection | Economic Boutique",
    metaDescription: "Shop Kurta Surwal sets at Economic Boutique in Sanepa, Lalitpur. Everyday cottons, festive embroidery and custom stitching available.",
    products: [
      ["Sage Chikankari Set", "Soft cotton embroidery", "NPR 3,850", "Woman in a sage chikankari Kurta Surwal"],
      ["Powder Blue Chanderi", "Light festive detailing", "NPR 4,250", "Woman in a powder blue Chanderi Kurta Surwal"],
      ["Mustard Printed Set", "Everyday cotton comfort", "NPR 2,950", "Woman in a mustard printed Kurta Surwal"],
      ["Maroon Embroidered Set", "Wedding-ready finish", "NPR 5,650", "Woman in a maroon embroidered Kurta Surwal"],
      ["Ivory & Olive Set", "Cutwork and contrast", "NPR 4,750", "Woman in an ivory and olive Kurta Surwal"],
      ["Coral Block Print", "Bright casual dressing", "NPR 3,250", "Woman in a coral block print Kurta Surwal"],
      ["Slate Blue Silk Set", "Refined occasion wear", "NPR 4,950", "Woman in a slate blue silk Kurta Surwal"],
      ["Lavender Festive Set", "Delicate tonal embroidery", "NPR 5,250", "Woman in a lavender festive Kurta Surwal"],
      ["Teal Cotton Set", "Relaxed everyday shape", "NPR 3,150", "Woman in a teal cotton Kurta Surwal"],
      ["Black & Gold Set", "Evening embroidery", "NPR 5,850", "Woman in a black and gold Kurta Surwal"],
      ["Rose Floral Set", "Soft festive color", "NPR 4,550", "Woman in a rose floral Kurta Surwal"],
      ["White Blue Threadwork", "Clean, airy detailing", "NPR 3,950", "Woman in a white Kurta Surwal with blue threadwork"],
    ],
  },
  "/lehenga.html": {
    key: "lehenga", route: "lehenga.html", title: "LEHENGA COLLECTION",
    intro: "Celebration silhouettes with movement, color and intricate detail.",
    searchLabel: "Search the Lehenga collection", searchPlaceholder: "Try “crimson zardozi”",
    metaTitle: "Lehenga Collection | Economic Boutique",
    metaDescription: "Shop lehengas at Economic Boutique in Sanepa, Lalitpur, with festive embroidery and custom stitching available.",
    products: [
      ["Crimson Zardozi Lehenga", "Regal wedding embroidery", "NPR 12,850", "Crimson embroidered lehenga in a heritage palace courtyard"],
      ["Powder Blue Floral Lehenga", "Airy organza florals", "NPR 9,750", "Powder blue floral lehenga on a rooftop at dawn"],
      ["Mustard Mirrorwork Lehenga", "Bright festive shimmer", "NPR 8,950", "Mustard mirrorwork lehenga in a botanical conservatory"],
      ["Emerald Velvet Lehenga", "Rich evening texture", "NPR 13,500", "Emerald velvet lehenga in a modern art gallery"],
      ["Ivory Pearl Lehenga", "Soft pearl embellishment", "NPR 11,250", "Ivory pearl lehenga on a lakeside stone terrace"],
      ["Coral Threadwork Lehenga", "Detailed tonal embroidery", "NPR 8,650", "Coral threadwork lehenga in an old brick lane"],
      ["Navy Sequin Lehenga", "Midnight celebration shine", "NPR 10,950", "Navy sequin lehenga in a marigold garden"],
      ["Lavender Organza Lehenga", "Light layered volume", "NPR 9,450", "Lavender organza lehenga on a carved wooden veranda"],
      ["Teal Brocade Lehenga", "Woven occasion finish", "NPR 10,250", "Teal brocade lehenga at a concrete pavilion"],
      ["Black Antique Gold Lehenga", "Dramatic heritage border", "NPR 14,250", "Black and antique gold lehenga in a desert garden"],
      ["Rose Embroidered Lehenga", "Romantic tonal detail", "NPR 9,950", "Rose embroidered lehenga in a candlelit banquet hall"],
      ["White Cobalt Lehenga", "Crisp blue threadwork", "NPR 10,650", "White and cobalt lehenga in a sunlit library"],
    ],
  },
  "/pants.html": {
    key: "pants", route: "pants.html", title: "PANTS COLLECTION",
    intro: "Easy tailoring, versatile shapes and considered everyday comfort.",
    searchLabel: "Search the Pants collection", searchPlaceholder: "Try “olive wide-leg”",
    metaTitle: "Pants Collection | Economic Boutique",
    metaDescription: "Shop women's pants at Economic Boutique in Sanepa, Lalitpur, with versatile tailoring and custom fitting available.",
    products: [
      ["Olive Wide-Leg Linen", "Breathable relaxed tailoring", "NPR 2,950", "Woman in olive wide-leg linen pants in a tailoring studio"],
      ["Ivory Straight Cotton", "Clean everyday shape", "NPR 2,450", "Woman in ivory straight cotton pants on a tree-lined promenade"],
      ["Black Tailored Pleat", "Polished ankle-length fit", "NPR 3,250", "Woman in black tailored pants at a cafe terrace"],
      ["Rust Fluid Palazzo", "Soft movement and drape", "NPR 2,850", "Woman in rust palazzo pants in a modern office lobby"],
      ["Powder Blue Cigarette Pant", "Refined slim tailoring", "NPR 2,650", "Woman in powder blue cigarette pants on museum steps"],
      ["Navy Easy Trouser", "Comfort with a smart finish", "NPR 2,750", "Woman in navy fluid trousers in a flower market lane"],
      ["Sand Tapered Pant", "A versatile neutral fit", "NPR 2,550", "Woman in sand tapered pants at a university arcade"],
      ["Deep Green Culotte", "Cropped wide-leg ease", "NPR 2,950", "Woman in deep green culottes on a riverside boardwalk"],
      ["Charcoal High-Waist Trouser", "Structured classic tailoring", "NPR 3,350", "Woman in charcoal high-waist trousers in a minimalist apartment"],
      ["Rose Relaxed Pant", "Fluid day-to-evening style", "NPR 2,850", "Woman in rose relaxed pants in an art-filled lounge"],
      ["White Embroidered Palazzo", "Delicate hem detailing", "NPR 3,150", "Woman in white embroidered palazzo pants in a sunlit courtyard"],
      ["Cobalt Wide-Leg Pant", "Bold tailored color", "NPR 3,250", "Woman in cobalt wide-leg pants at a green hillside overlook"],
    ],
  },
  "/shirt-tops-blouses.html": {
    key: "tops-blouses", route: "shirt-tops-blouses.html", title: "SHIRT TOPS & BLOUSES COLLECTION",
    intro: "Detailed separates for everyday dressing and special occasions.",
    searchLabel: "Search the Shirt Tops and Blouses collection", searchPlaceholder: "Try “blue chikankari”",
    metaTitle: "Shirt Tops & Blouses Collection | Economic Boutique",
    metaDescription: "Shop women's shirts, tops and blouses at Economic Boutique in Sanepa, Lalitpur. Everyday cottons and festive embroidery available.",
    products: [
      ["Red Embroidered Blouse", "Delicate floral threadwork", "NPR 2,950", "Woman in a red embroidered blouse in a textile workshop"],
      ["Powder Blue Chikankari Top", "Soft cotton embroidery", "NPR 2,650", "Woman in a powder blue chikankari top by a garden wall"],
      ["Mustard Cotton Shirt Top", "Relaxed everyday tailoring", "NPR 2,250", "Woman in a mustard cotton shirt top in a bookshop"],
      ["Ivory Cutwork Blouse", "Airy scalloped detail", "NPR 2,850", "Woman in an ivory cutwork blouse in a ceramic studio"],
      ["Olive Wrap Top", "Flattering adjustable shape", "NPR 2,450", "Woman in an olive wrap top in a heritage corridor"],
      ["Coral Printed Tunic", "Easy artisanal pattern", "NPR 2,350", "Woman in a coral printed tunic at a tea house patio"],
      ["Slate Blue Silk Blouse", "Polished evening drape", "NPR 3,250", "Woman in a slate blue silk blouse at a sculpture park"],
      ["Lavender Tie-Neck Top", "Soft statement detailing", "NPR 2,650", "Woman in a lavender tie-neck top at a colorful doorway"],
      ["Teal Pintuck Shirt", "Textured everyday cotton", "NPR 2,550", "Woman in a teal pintuck shirt in a bright home kitchen"],
      ["Black Gold Evening Blouse", "Subtle festive embroidery", "NPR 3,450", "Woman in a black and gold blouse in a rooftop garden"],
      ["Rose Floral Top", "Gentle printed color", "NPR 2,350", "Woman in a rose floral top on a lakeside pier"],
      ["White Cobalt Blouse", "Crisp traditional threadwork", "NPR 2,950", "Woman in a white and cobalt blouse in an elegant music room"],
    ],
  },
};

const navItems = [
  ["kurta-surwal.html", "Kurta Surwal"], ["lehenga.html", "Lehenga"], ["pants.html", "Pants"],
  ["shirt-tops-blouses.html", "Shirt Tops & Blouses"], ["#custom-stitching", "Custom Stitching"],
] as const;

const kurtaImageFiles = [
  "01-sage-chikankari.webp", "02-powder-blue-chanderi.webp", "03-mustard-print.webp",
  "04-maroon-embroidered.webp", "05-ivory-olive.webp", "06-coral-block-print.webp",
  "07-slate-blue-silk.webp", "08-lavender-festive.webp", "09-teal-cotton.webp",
  "10-black-gold.webp", "11-rose-floral.webp", "12-white-blue-threadwork.webp",
];

export function getCollectionImage(collection: Collection, index: number) {
  const number = String(index + 1).padStart(2, "0");
  const filename = collection.key === "kurta-surwal" ? kurtaImageFiles[index] : `${number}.webp`;
  return `/images/${collection.key}/${filename}`;
}

function Brand({ home = false }: { home?: boolean }) {
  return <a className="wordmark brand-logo-link" href={home ? "#main" : "index.html"} aria-label="New Fashion Collection Economic Boutique home">
    <img className="brand-logo" src="/images/economic-boutique-mark.png" alt="" width="256" height="256" />
    <span className="brand-name"><span className="brand-name__collection">NEW FASHION COLLECTION</span><span className="brand-name__boutique">ECONOMIC BOUTIQUE</span></span>
  </a>;
}

function Header({ collection, notify, cartCount }: { collection?: Collection; notify: (message: string) => void; cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [remoteCategory, setRemoteCategory] = useState<DbCategory | null>(null);
  useEffect(() => {
    if (!collection) { setRemoteCategory(null); return; }
    let active = true;
    getPublishedCategory(collection.key).then((result) => { if (active && result) setRemoteCategory(result); }).catch(() => undefined);
    return () => { active = false; };
  }, [collection]);
  const toggleMenu = () => { setMenuOpen((open) => !open); setSearchOpen(false); };
  const toggleSearch = () => { setSearchOpen((open) => !open); setMenuOpen(false); };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); notify(query.trim() ? `Searching for “${query.trim()}”` : "Enter a search term"); };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" id="siteHeader">
      <div className="header-inner">
        <button className="icon-button menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobileMenu" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={toggleMenu}><i className={`ph ph-${menuOpen ? "x" : "list"}`} aria-hidden="true" /></button>
        <Brand home={!collection} />
        <nav className="desktop-nav" aria-label="Primary navigation">{navItems.map(([href, label]) => <a key={href} href={href} className={collection?.route === href ? "active" : undefined} aria-current={collection?.route === href ? "page" : undefined}>{label}</a>)}</nav>
        <div className="header-actions">
          <button className="icon-button" type="button" aria-expanded={searchOpen} aria-controls="searchPanel" aria-label="Search" onClick={toggleSearch}><i className="ph ph-magnifying-glass" aria-hidden="true" /></button>
          <button className="icon-button account-button" type="button" aria-label="Account" onClick={() => notify("Account sign-in is ready to connect.")}><i className="ph ph-user" aria-hidden="true" /></button>
          <button className="icon-button cart-button" type="button" aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => notify(cartCount ? `${cartCount} ${cartCount === 1 ? "item" : "items"} in your bag.` : "Your shopping bag is empty.")}><i className="ph ph-handbag" aria-hidden="true" /><span className="cart-count" aria-hidden="true">{cartCount}</span></button>
        </div>
      </div>
      <nav className="mobile-menu" id="mobileMenu" aria-label="Mobile navigation" hidden={!menuOpen}>{navItems.map(([href, label]) => <a key={href} href={href} className={collection?.route === href ? "active" : undefined} aria-current={collection?.route === href ? "page" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <div className="search-panel" id="searchPanel" hidden={!searchOpen}><form className="search-form" role="search" onSubmit={submitSearch}><label htmlFor="siteSearch">{remoteCategory?.search_label ?? collection?.searchLabel ?? "Search the collection"}</label><div className="search-field-row"><input id="siteSearch" name="q" type="search" placeholder={remoteCategory?.search_placeholder ?? collection?.searchPlaceholder ?? "Try “powder blue lehenga”"} autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus={searchOpen} /><button className="button button-primary" type="submit">Search</button></div></form></div>
    </header>
  </>;
}

function Newsletter() {
  const [message, setMessage] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    if (!email.validity.valid) { setMessage("Please enter a valid email address."); email.focus(); return; }
    setMessage("You’re in. Watch your inbox for our next edit."); form.reset();
  };
  return <section className="newsletter" id="newsletter" aria-labelledby="newsletter-title">
    <div className="newsletter-still-life image-shell"><img src="/images/14-footer-still-life.webp" alt="Ceramic vase and bowl still life" loading="lazy" decoding="async" width="2172" height="724" /></div>
    <div className="newsletter-copy"><h2 id="newsletter-title">STAY IN THE FOLD</h2><p>New collection updates, styling notes and boutique news.</p><form className="newsletter-form" noValidate onSubmit={submit}><label htmlFor="email">Email address</label><div className="newsletter-row"><input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required aria-describedby="formMessage" /><button className="button button-primary" type="submit">Subscribe</button></div><p className="form-message" id="formMessage" aria-live="polite">{message}</p></form></div>
  </section>;
}

function Footer({ home = false }: { home?: boolean }) {
  return <footer className="site-footer"><div className="footer-grid">
    <div className="footer-brand"><Brand home={home} /><p>Indian-style clothing, custom stitched in Sanepa.</p><div className="social-links" aria-label="Social media"><a href="#" aria-label="Instagram"><i className="ph ph-instagram-logo" aria-hidden="true" /></a><a href="#" aria-label="Facebook"><i className="ph ph-facebook-logo" aria-hidden="true" /></a><a href="#" aria-label="Pinterest"><i className="ph ph-pinterest-logo" aria-hidden="true" /></a></div></div>
    <div className="footer-column"><h2>Shop</h2><a href="lehenga.html">Lehengas</a><a href="kurta-surwal.html">Kurtas</a><a href="shirt-tops-blouses.html">Tops</a><a href="kurta-surwal.html">Surwals</a><a href="pants.html">Pants</a></div>
    <div className="footer-column"><h2>Custom Stitching</h2><a href="#custom-stitching">Exact Measurements</a><a href="#custom-stitching">Bring Your Fabric</a><a href="#custom-stitching">Choose Our Fabrics</a><a href="#custom-stitching">Alterations</a><a href="#custom-stitching">Style Preferences</a></div>
    <div className="footer-column"><h2>Why Shop Here</h2><a href="#">Affordable Quality</a><a href="#">Wide Selection</a><a href="#custom-stitching">Custom Stitching</a><a href="#">Careful Alterations</a><a href="#">Personal Service</a></div>
    <div className="footer-column"><h2>Visit Us</h2><a href="#">Sanepa, Lalitpur</a><a href="tel:+9779813222995">Call the Boutique</a><a href="#">11:00 a.m. - 7:30 p.m.</a><a href={home ? "#categories" : "#collection"}>View Collection</a><a href="#custom-stitching">Stitching Service</a></div>
    <div className="footer-column contact-column"><h2>Contact</h2><p>Sanepa, Lalitpur</p><a href="tel:+9779813222995">981-322-2995</a><p>11:00 a.m. - 7:30 p.m.</p></div>
  </div><div className="footer-bottom"><p>© 2026 Economic Boutique. All rights reserved.</p><div><a href={home ? "#categories" : "#collection"}>Our Collection</a><a href="#custom-stitching">Custom Stitching</a><label className="region-select"><span className="sr-only">Region and currency</span><select defaultValue="Nepal (NPR)"><option>Nepal (NPR)</option></select></label></div></div></footer>;
}

function CollectionPage({ collection, onSelect }: { collection: Collection; onSelect: (product: CommerceProduct) => void }) {
  const [remote, setRemote] = useState<Awaited<ReturnType<typeof getPublishedCollection>> | undefined>(undefined);
  const [catalogError, setCatalogError] = useState(false);
  const [catalogRevision, setCatalogRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setRemote(undefined);
    setCatalogError(false);
    getPublishedCollection(collection.key)
      .then((result) => { if (active) setRemote(result); })
      .catch(() => { if (active) { setRemote(null); setCatalogError(true); } });
    return () => { active = false; };
  }, [collection.key, catalogRevision]);
  useEffect(() => {
    if (!remote?.category) return;
    document.title = remote.category.meta_title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", remote.category.meta_description);
  }, [remote]);
  const catalogLoading = remote === undefined;
  const category = remote?.category;
  const useBundledCatalog = !isSupabaseConfigured && !remote && !catalogLoading;
  const products: (CommerceProduct & { catalogId: string })[] = catalogLoading
    ? []
    : remote
    ? remote.products.map((product) => ({
        catalogId: product.id,
        name: product.name,
        description: product.summary,
        price: `NPR ${Number(product.price_npr).toLocaleString("en-NP")}`,
        image: product.image_url,
        alt: product.alt_text,
        collection: category?.name ?? collection.title.replace(" COLLECTION", ""),
        details: product.details,
        care: product.care,
        delivery: product.delivery,
      }))
    : useBundledCatalog ? collection.products.map(([name, description, price, alt], index) => ({
        catalogId: `${collection.key}-${index + 1}`,
        name, description, price, alt, image: getCollectionImage(collection, index),
        collection: collection.title.replace(" COLLECTION", ""),
      })) : [];
  return <main id="main">
    <section className="catalog-section" id="collection" aria-labelledby="catalog-title" aria-busy={catalogLoading}><div className="catalog-heading"><div><h1 id="catalog-title">{category?.title ?? collection.title}</h1><p>{category?.intro ?? collection.intro}</p></div><p className="catalog-count">{catalogLoading ? "Loading styles" : `${products.length} styles`}</p></div>
      {catalogError && <div className="catalog-error" role="status"><p>The live collection could not be loaded. We have not substituted older product images.</p><button className="button button-primary" type="button" onClick={() => setCatalogRevision((value) => value + 1)}>Try again</button></div>}
      {!catalogLoading && !catalogError && !products.length && <p className="catalog-empty" role="status">This collection does not have any visible styles right now.</p>}
      <div className="catalog-grid">{catalogLoading
        ? Array.from({ length: collection.products.length }, (_, index) => <div className="catalog-card catalog-card-loading" key={index} aria-hidden="true"><div className="catalog-image image-shell" /><div className="catalog-info"><span /><strong /></div></div>)
        : products.map((product, index) => <article className="catalog-card" key={product.catalogId}><button className="catalog-image image-shell" type="button" aria-label={`View ${product.name} details`} onClick={() => onSelect(product)}><img src={product.image} alt={product.alt} loading={index === 0 ? "eager" : "lazy"} decoding="async" width="362" height="362" /></button><button className="catalog-info catalog-info-button" type="button" onClick={() => onSelect(product)} aria-label={`Choose ${product.name}`}><span><span className="catalog-product-name">{product.name}</span><span className="catalog-product-description">{product.description}</span></span><strong>{product.price}</strong></button></article>)}</div>
    </section>
    <section className="catalog-stitching" id="custom-stitching" aria-labelledby="stitching-title"><div className="catalog-stitching-media image-shell"><img src="/images/07-tailoring-fitting.webp" alt="Tailor measuring a client's shoulder" loading="lazy" decoding="async" width="1448" height="1086" /></div><div className="catalog-stitching-copy"><h2 id="stitching-title">MADE FOR<br />YOUR MEASUREMENTS</h2><p>Choose a set from the collection, bring your own fabric, or ask us to adapt a style. Our in-house tailors fit every piece with care.</p><a className="button button-primary" href="tel:+9779813222995">Call 981-322-2995</a></div></section>
    <Newsletter />
  </main>;
}

const homeCollections = [
  ["Kurta Surwal", "A timeless traditional outfit combining graceful comfort, refined tailoring, and everyday elegance.", "/images/02-sage-kurta-surwal.webp", "Sage embroidered kurta surwal", "kurta-surwal.html"],
  ["Lehenga", "A celebratory statement piece featuring flowing silhouettes, rich textures, and beautiful detailing for special occasions.", "/images/03-yellow-lehenga.webp", "Mustard embroidered lehenga", "lehenga.html"],
  ["Pants", "Modern, versatile bottoms designed for comfort, confidence, and effortless styling.", "/images/05-ivory-top-olive-pants.webp", "Ivory top with olive tailored pants", "pants.html"],
  ["Shirts, Tops & Blouses", "Chic essentials that bring together contemporary cuts, flattering fits, and easy elegance.", "/images/04-blue-embroidered-top.webp", "Powder blue embroidered top and blouse", "shirt-tops-blouses.html"],
] as const;

function LogoReveal() {
  const fragments = ["hook", "left", "right", "sash", "hem"] as const;

  return <section className="logo-reveal" aria-label="Economic Boutique logo reveal">
    <div className="logo-reveal__stage">
      <div className="logo-reveal__wash logo-reveal__wash--blue" aria-hidden="true" />
      <div className="logo-reveal__wash logo-reveal__wash--red" aria-hidden="true" />
      <div className="logo-reveal__frame" aria-hidden="true">
        <div className="logo-reveal__fragments">
          <div className="logo-reveal__pieces">
            {fragments.map((fragment) => <img
              className={`logo-reveal__fragment logo-reveal__fragment--${fragment}`}
              src="/images/economic-boutique-mark.png"
              alt=""
              width="256"
              height="256"
              key={fragment}
            />)}
          </div>
          <img className="logo-reveal__resolved" src="/images/economic-boutique-mark.png" alt="" width="256" height="256" />
        </div>
        <div className="logo-reveal__name">
          <span>NEW FASHION COLLECTION</span>
          <strong>ECONOMIC BOUTIQUE</strong>
        </div>
      </div>
      <p className="sr-only">New Fashion Collection, Economic Boutique</p>
    </div>
  </section>;
}

function HomePage({ onSelect }: { onSelect: (product: CommerceProduct) => void }) {
  const [activeCollection, setActiveCollection] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const collectionStoryRef = useRef<HTMLElement>(null);
  const collectionStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const story = collectionStoryRef.current;
    const stage = collectionStageRef.current;
    if (!hero || !story || !stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const panels = Array.from(story.querySelectorAll<HTMLElement>("[data-collection-panel]"));
    let frame = 0;
    let heroVisible = true;
    let storyVisible = false;
    let currentPanel = 0;

    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = (start: number, end: number, value: number) => {
      const progress = clamp((value - start) / (end - start));
      return progress * progress * (3 - 2 * progress);
    };

    const resetMotion = () => {
      hero.style.removeProperty("--hero-progress");
      panels.forEach((panel) => {
        panel.style.removeProperty("opacity");
        panel.querySelector<HTMLElement>(".collection-panel__media img")?.style.removeProperty("transform");
        panel.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
          element.style.removeProperty("opacity");
          element.style.removeProperty("transform");
        });
      });
    };

    const renderFrame = () => {
      frame = 0;
      if (reducedMotion.matches) {
        resetMotion();
        return;
      }

      if (heroVisible) {
        const rect = hero.getBoundingClientRect();
        const progress = clamp(-rect.top / Math.max(1, rect.height));
        hero.style.setProperty("--hero-progress", progress.toFixed(4));
      }

      if (storyVisible && panels.length) {
        const rect = story.getBoundingClientRect();
        const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
        const scrollDistance = Math.max(1, story.offsetHeight - stage.offsetHeight);
        const progress = clamp((headerHeight - rect.top) / scrollDistance);
        const timeline = progress * panels.length;
        const nextPanel = Math.min(panels.length - 1, Math.floor(timeline));

        if (nextPanel !== currentPanel) {
          currentPanel = nextPanel;
          setActiveCollection(nextPanel);
        }

        panels.forEach((panel, index) => {
          const local = timeline - index;
          const entering = index === 0 ? 1 : smoothstep(-0.18, 0.12, local);
          const leaving = index === panels.length - 1 ? 0 : smoothstep(0.76, 1.08, local);
          const visibility = clamp(entering * (1 - leaving));
          panel.style.opacity = visibility.toFixed(4);

          const image = panel.querySelector<HTMLElement>(".collection-panel__media img");
          if (image) {
            const shift = (1 - entering) * 7 - leaving * 7;
            const scale = 1.065 - visibility * 0.025;
            image.style.transform = `translate3d(0, ${shift.toFixed(3)}%, 0) scale(${scale.toFixed(4)})`;
          }

          panel.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
            const order = Number(element.dataset.reveal ?? 0);
            const revealIn = index === 0 ? 1 : smoothstep(-0.14 + order * 0.035, 0.09 + order * 0.035, local);
            const revealVisibility = clamp(revealIn * (1 - leaving));
            const shift = (1 - revealIn) * (28 + order * 4) - leaving * 18;
            element.style.opacity = revealVisibility.toFixed(4);
            element.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
          });
        });
      }

      if (heroVisible || storyVisible) frame = window.requestAnimationFrame(renderFrame);
    };

    const requestRender = () => {
      if (!frame && !reducedMotion.matches) frame = window.requestAnimationFrame(renderFrame);
    };

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      requestRender();
    });
    const storyObserver = new IntersectionObserver(([entry]) => {
      storyVisible = entry.isIntersecting;
      requestRender();
    });

    heroObserver.observe(hero);
    storyObserver.observe(story);
    window.addEventListener("resize", requestRender, { passive: true });
    reducedMotion.addEventListener("change", requestRender);
    requestRender();

    return () => {
      window.cancelAnimationFrame(frame);
      heroObserver.disconnect();
      storyObserver.disconnect();
      window.removeEventListener("resize", requestRender);
      reducedMotion.removeEventListener("change", requestRender);
      resetMotion();
    };
  }, []);

  const jumpToCollection = (index: number) => {
    const story = collectionStoryRef.current;
    const stage = collectionStageRef.current;
    if (!story || !stage) return;
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
    const storyTop = window.scrollY + story.getBoundingClientRect().top;
    const scrollDistance = Math.max(0, story.offsetHeight - stage.offsetHeight);
    const progress = index === 0 ? 0 : (index + 0.08) / homeCollections.length;
    setActiveCollection(index);
    window.scrollTo({
      top: storyTop - headerHeight + scrollDistance * progress,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return <main id="main">
    <LogoReveal />
    <section className="hero" ref={heroRef} aria-labelledby="hero-title"><div className="hero-shape hero-circle" aria-hidden="true" /><div className="hero-shape hero-panel" aria-hidden="true" /><div className="hero-shape hero-arch" aria-hidden="true" /><div className="hero-copy"><h1 id="hero-title"><span className="hero-line-mask"><span className="hero-line hero-line--one">TRADITION</span></span><span className="hero-line-mask"><span className="hero-line hero-line--two">MEETS STYLE</span></span></h1><p className="hero-reveal hero-reveal--copy">Indian-style clothing for weddings, festivals and beautiful everyday dressing.</p><a className="button button-primary hero-reveal hero-reveal--cta" href="#new-arrivals">Explore the New Collection</a></div><div className="hero-media image-shell"><img src="/images/01-hero-red-blue-lehenga.webp" alt="Woman wearing a red embroidered blouse and powder blue lehenga" width="1672" height="941" /></div><figure className="hero-swatch image-shell"><img src="/images/15-texture-powder-blue-gold.webp" alt="Powder blue fabric with gold floral embroidery" width="1254" height="1254" /></figure></section>
    <section className="collection-story" ref={collectionStoryRef} id="categories" aria-label="Collections"><div className="collection-stage" ref={collectionStageRef}><div className="collection-panels">{homeCollections.map(([title, description, image, alt, href], index) => <article className={`collection-panel${index === activeCollection ? " is-active" : ""}`} data-collection-panel key={title} aria-labelledby={`collection-${index}-title`} aria-hidden={index !== activeCollection}><div className="collection-panel__media image-shell"><img src={image} alt={alt} loading={index === 0 ? "eager" : "lazy"} /></div><div className="collection-panel__content"><span className="collection-panel__number" data-reveal="0">{String(index + 1).padStart(2, "0")}</span><h2 id={`collection-${index}-title`} data-reveal="1">{title}</h2><p data-reveal="2">{description}</p><a className="collection-panel__link" data-reveal="3" href={href} tabIndex={index === activeCollection ? 0 : -1}>Explore Collection <i className="ph ph-arrow-right" aria-hidden="true" /></a></div></article>)}</div><nav className="collection-progress" aria-label="Choose a collection"><ol>{homeCollections.map(([title], index) => <li key={title}><button className={index === activeCollection ? "is-active" : undefined} type="button" aria-label={`Show ${title} collection`} aria-current={index === activeCollection ? "step" : undefined} onClick={() => jumpToCollection(index)}>{String(index + 1).padStart(2, "0")}</button></li>)}</ol></nav></div></section>
    <section className="collection-banner" aria-labelledby="collection-title"><div className="collection-media image-shell"><img src="/images/06-olive-collection-banner.webp" alt="Two women in olive and mustard embroidered dresses" loading="lazy" width="1983" height="793" /></div><div className="collection-copy"><h2 id="collection-title">NEW<br />COLLECTION</h2><p>Elegant color, versatile silhouettes and traditional detail for every occasion.</p><a className="button button-outline" href="#new-arrivals">Explore the Collection</a></div></section>
    <Arrivals onSelect={onSelect} />
    <section className="fit-section" id="custom-stitching" aria-labelledby="fit-title"><div className="fit-copy"><h2 id="fit-title">THE FIT BEGINS<br />WITH YOU</h2><div className="fit-steps"><article><i className="ph-light ph-dress" aria-hidden="true" /><h3>Choose Your Style</h3><p>Bring your fabric or choose from our collection.</p></article><article><i className="ph-light ph-ruler" aria-hidden="true" /><h3>Share Your Measurements</h3><p>Our tailors measure for your exact fit.</p></article><article><i className="ph-light ph-hand" aria-hidden="true" /><h3>Finished by Hand</h3><p>Finished to your style preference with care.</p></article></div><a className="button button-primary" href="#newsletter">Discuss Your Outfit</a></div><div className="fit-collage" aria-label="Custom stitching process"><div className="fit-image fit-main image-shell"><img src="/images/07-tailoring-fitting.webp" alt="Tailor measuring a client's shoulder" loading="lazy" /></div><div className="fit-image fit-pattern image-shell"><img src="/images/08-tailoring-patterns.webp" alt="Pattern pieces, scissors and measuring tape" loading="lazy" /></div><div className="fit-image fit-embroidery image-shell"><img src="/images/09-hand-embroidery.webp" alt="Artisan embroidering powder blue fabric by hand" loading="lazy" /></div></div></section>
    <section className="swatch-strip" aria-label="Fabric swatches">{[["15-texture-powder-blue-gold.webp", "Dusty blue floral embroidery"], ["16-texture-mustard-silver.webp", "Mustard silver embroidery"], ["17-texture-olive-gold.webp", "Olive gold embroidery"], ["18-texture-slate-blue-floral.webp", "Slate blue floral embroidery"], ["19-texture-ivory-beaded-stripes.webp", "Ivory beaded stripe embroidery"]].map(([src, alt]) => <div className="image-shell" key={src}><img src={`/images/${src}`} alt={alt} loading="lazy" /></div>)}</section>
    <Newsletter />
  </main>;
}

function Arrivals({ onSelect }: { onSelect: (product: CommerceProduct) => void }) {
  const items = [
    ["product-large product-a", "/images/13-pale-blue-kurta-set.webp", "Pale blue Chanderi kurta set", "Kurtas", "Comfortable everyday style"],
    ["", "/images/10-red-embroidered-blouse.webp", "Red embroidered blouse", "Tops", "Traditional or modern styling"],
    ["", "/images/05-ivory-top-olive-pants.webp", "Olive tailored linen pants", "Pants", "Well-tailored essentials"],
    ["product-large product-c", "/images/11-powder-blue-lehenga.webp", "Powder blue embroidered lehenga", "Lehengas", "Wedding and festive wear"],
    ["", "/images/12-yellow-shirt-top.webp", "Mustard cotton shirt top", "Surwals", "Classic comfort and fit"],
    ["", "/images/02-sage-kurta-surwal.webp", "Sage Chikankari kurta", "Custom Stitching", "Made to your measurements"],
  ];
  const card = (item: string[]) => {
    const product: CommerceProduct = { name: item[3], description: item[4], price: "Price confirmed at boutique", image: item[1], alt: item[2], collection: "New arrivals" };
    return <article className={`product-card ${item[0]}`} key={item[3]}><button className="product-image image-shell" type="button" aria-label={`View ${item[3]} details`} onClick={() => onSelect(product)}><img src={item[1]} alt={item[2]} loading="lazy" /></button><button className="product-info product-info-button" type="button" onClick={() => onSelect(product)}><span className="product-info-title">{item[3]}</span><span>{item[4]}</span></button></article>;
  };
  return <section className="arrivals-section" id="new-arrivals" aria-labelledby="arrivals-title"><div className="section-heading-row"><h2 id="arrivals-title">NEW ARRIVALS</h2><a href="#product-grid">View All <i className="ph ph-arrow-right" aria-hidden="true" /></a></div><div className="product-grid" id="product-grid">{card(items[0])}<div className="product-stack product-b">{items.slice(1, 3).map(card)}</div>{card(items[3])}<div className="product-stack product-d">{items.slice(4).map(card)}</div></div></section>;
}

export function App() {
  const pathname = window.location.pathname === "/" ? "/index.html" : window.location.pathname;
  const collection = collections[pathname];
  const [toast, setToast] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CommerceProduct | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const meta = useMemo(() => collection ?? {
    metaTitle: "Economic Boutique | New Fashion Collection in Sanepa",
    metaDescription: "Explore Economic Boutique's new collection of lehengas, kurtas, tops, surwals and pants, with custom stitching in Sanepa, Lalitpur.",
  }, [collection]);
  useEffect(() => {
    document.title = meta.metaTitle;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", meta.metaDescription);
  }, [meta]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const selectProduct = (product: CommerceProduct) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addToCart = (quantity: number) => {
    setCartCount((count) => count + quantity);
    setToast(`${quantity} ${quantity === 1 ? "item" : "items"} added to your bag.`);
  };
  const buyNow = (quantity: number) => {
    setCartCount((count) => count + quantity);
    setToast("Item reserved. Call the boutique to confirm payment and fitting.");
  };
  return <>
    <Header collection={collection} notify={setToast} cartCount={cartCount} />
    {selectedProduct
      ? <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} onBuyNow={buyNow} />
      : collection
        ? <CollectionPage collection={collection} onSelect={selectProduct} />
        : <HomePage onSelect={selectProduct} />}
    <Footer home={!collection} />
    <div className="toast" role="status" aria-live="polite" hidden={!toast}>{toast}</div>
  </>;
}
