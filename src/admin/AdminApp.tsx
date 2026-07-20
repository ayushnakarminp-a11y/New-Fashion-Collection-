import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowSquareOut,
  Check,
  FloppyDisk,
  Image as ImageIcon,
  MagnifyingGlass,
  Plus,
  SignOut,
  SpinnerGap,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { collections, getCollectionImage, type Collection } from "@/App";
import { isSupabaseConfigured, supabase, type DbCategory, type DbProduct } from "@/lib/supabase";
import "./admin.css";

type Notice = { kind: "success" | "error"; message: string } | null;
type ProductDraft = Omit<DbProduct, "id" | "created_at" | "updated_at"> & { id?: string };

const blankProduct = (categoryId: string, sortOrder: number): ProductDraft => ({
  category_id: categoryId,
  name: "",
  summary: "",
  price_npr: 0,
  image_url: "",
  alt_text: "",
  details: "",
  care: "Dry clean recommended. Store folded in a cool, dry place.",
  delivery: "Boutique pickup or local delivery can be arranged.",
  active: true,
  sort_order: sortOrder,
});

function fallbackCategory(collection: Collection): DbCategory {
  const names: Record<Collection["key"], string> = {
    "kurta-surwal": "Kurta Surwal",
    lehenga: "Lehenga",
    pants: "Pants",
    "tops-blouses": "Shirt Tops & Blouses",
  };
  return {
    id: collection.key,
    slug: collection.key,
    name: names[collection.key],
    title: collection.title,
    intro: collection.intro,
    search_label: collection.searchLabel,
    search_placeholder: collection.searchPlaceholder,
    meta_title: collection.metaTitle,
    meta_description: collection.metaDescription,
  };
}

function Login({ onReady }: { onReady: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) setError(authError.message);
    else onReady();
  };

  return <main className="admin-login">
    <section className="login-card" aria-labelledby="login-title">
      <img src="/images/economic-boutique-mark.png" alt="" width="64" height="64" />
      <p className="admin-kicker">Economic Boutique</p>
      <h1 id="login-title">Catalog admin</h1>
      <p>Sign in with the staff account created in Supabase.</p>
      <form onSubmit={submit}>
        <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="admin-button admin-button-primary" type="submit" disabled={busy}>{busy ? <SpinnerGap className="spin" size={18} /> : null}{busy ? "Signing in" : "Sign in"}</button>
      </form>
      <a href="index.html">Return to the storefront</a>
    </section>
  </main>;
}

function SetupRequired() {
  return <main className="admin-login">
    <section className="login-card setup-card" aria-labelledby="setup-title">
      <img src="/images/economic-boutique-mark.png" alt="" width="64" height="64" />
      <p className="admin-kicker">One-time setup</p>
      <h1 id="setup-title">Connect Supabase</h1>
      <p>The admin is ready. Add your project URL and anon key to a <code>.env</code> file, then run the included database setup script in Supabase.</p>
      <div className="setup-code"><span>VITE_SUPABASE_URL</span><span>VITE_SUPABASE_ANON_KEY</span></div>
      <p className="setup-note">Copy <strong>.env.example</strong> to <strong>.env</strong>. The database script is at <strong>supabase/schema.sql</strong>.</p>
      <a className="admin-button admin-button-secondary" href="index.html">View storefront</a>
    </section>
  </main>;
}

export function AdminApp() {
  const [sessionReady, setSessionReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [selectedId, setSelectedId] = useState<string | "new">("");
  const [draft, setDraft] = useState<ProductDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<DbCategory | null>(null);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categoryEditing, setCategoryEditing] = useState(false);

  useEffect(() => {
    if (!supabase) { setSessionReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setSessionReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    if (!supabase) return;
    setBusy(true);
    const [categoryResult, productResult] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }).returns<DbCategory[]>(),
      supabase.from("products").select("*").order("sort_order", { ascending: true }).returns<DbProduct[]>(),
    ]);
    setBusy(false);
    if (categoryResult.error || productResult.error) {
      setNotice({ kind: "error", message: categoryResult.error?.message || productResult.error?.message || "Could not load the catalog." });
      return;
    }
    const nextCategories = categoryResult.data ?? [];
    setCategories(nextCategories);
    setProducts(productResult.data ?? []);
    setCategoryId((current) => current || nextCategories[0]?.id || "");
  };

  useEffect(() => { if (signedIn) void loadData(); }, [signedIn]);

  const activeCategory = categories.find((category) => category.id === categoryId) ?? null;
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = product.category_id === categoryId;
    const term = query.trim().toLowerCase();
    return matchesCategory && (!term || product.name.toLowerCase().includes(term) || product.summary.toLowerCase().includes(term));
  }), [products, categoryId, query]);

  useEffect(() => {
    setCategoryDraft(activeCategory ? { ...activeCategory } : null);
    setCategoryEditing(false);
    const first = products.find((product) => product.category_id === categoryId);
    setSelectedId(first?.id ?? "");
    setDraft(first ? { ...first } : null);
  }, [categoryId, products.length]);

  const chooseProduct = (product: DbProduct) => {
    setSelectedId(product.id);
    setDraft({ ...product });
    setCategoryEditing(false);
    setNotice(null);
  };

  const addProduct = () => {
    if (!categoryId) return;
    setSelectedId("new");
    setDraft(blankProduct(categoryId, products.filter((product) => product.category_id === categoryId).length + 1));
    setCategoryEditing(false);
    setNotice(null);
  };

  const updateDraft = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft) return;
    if (!draft.name.trim() || !draft.image_url.trim() || !draft.alt_text.trim()) {
      setNotice({ kind: "error", message: "Name, product image and image description are required." });
      return;
    }
    setBusy(true);
    const payload = { ...draft, price_npr: Number(draft.price_npr), sort_order: Number(draft.sort_order) };
    const result = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id).select().single<DbProduct>()
      : await supabase.from("products").insert(payload).select().single<DbProduct>();
    setBusy(false);
    if (result.error) { setNotice({ kind: "error", message: result.error.message }); return; }
    setProducts((current) => draft.id ? current.map((item) => item.id === result.data.id ? result.data : item) : [...current, result.data]);
    setDraft({ ...result.data });
    setSelectedId(result.data.id);
    setNotice({ kind: "success", message: "Product saved and the storefront is up to date." });
  };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !categoryDraft) return;
    setBusy(true);
    const { data, error } = await supabase.from("categories").update(categoryDraft).eq("id", categoryDraft.id).select().single<DbCategory>();
    setBusy(false);
    if (error) { setNotice({ kind: "error", message: error.message }); return; }
    setCategories((current) => current.map((item) => item.id === data.id ? data : item));
    setCategoryEditing(false);
    setNotice({ kind: "success", message: "Collection text saved." });
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !supabase || !activeCategory) return;
    if (!file.type.startsWith("image/")) { setNotice({ kind: "error", message: "Choose an image file." }); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice({ kind: "error", message: "Images must be smaller than 8 MB." }); return; }
    setUploading(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `${activeCategory.slug}/${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) { setUploading(false); setNotice({ kind: "error", message: error.message }); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    updateDraft("image_url", data.publicUrl);
    setUploading(false);
    setNotice({ kind: "success", message: "Image uploaded. Save the product to publish it." });
  };

  const removeProduct = async () => {
    if (!supabase || !draft?.id || !window.confirm(`Delete “${draft.name}”? This cannot be undone.`)) return;
    setBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", draft.id);
    setBusy(false);
    if (error) { setNotice({ kind: "error", message: error.message }); return; }
    const remaining = products.filter((item) => item.id !== draft.id);
    setProducts(remaining);
    const next = remaining.find((item) => item.category_id === categoryId);
    setSelectedId(next?.id ?? "");
    setDraft(next ? { ...next } : null);
    setNotice({ kind: "success", message: "Product deleted." });
  };

  const signOut = async () => { await supabase?.auth.signOut(); };
  const importStarterCatalog = async () => {
    if (!supabase || products.length) return;
    setBusy(true);
    setNotice(null);
    for (const [categoryIndex, entry] of starterCatalog.entries()) {
      const categoryPayload = { ...entry.category, id: undefined, sort_order: categoryIndex + 1 };
      const { data: savedCategory, error: categoryError } = await supabase
        .from("categories")
        .upsert(categoryPayload, { onConflict: "slug" })
        .select()
        .single<DbCategory>();
      if (categoryError) {
        setBusy(false);
        setNotice({ kind: "error", message: categoryError.message });
        return;
      }
      const { error: productError } = await supabase.from("products").insert(
        entry.products.map((product) => ({ ...product, category_id: savedCategory.id })),
      );
      if (productError) {
        setBusy(false);
        setNotice({ kind: "error", message: productError.message });
        return;
      }
    }
    await loadData();
    setNotice({ kind: "success", message: "All 48 storefront products are now managed in Supabase." });
  };
  if (!isSupabaseConfigured) return <SetupRequired />;
  if (!sessionReady) return <main className="admin-loading"><SpinnerGap className="spin" size={28} /><span>Opening catalog</span></main>;
  if (!signedIn) return <Login onReady={() => setSignedIn(true)} />;

  return <div className="admin-shell">
    <header className="admin-header">
      <a className="admin-brand" href="index.html"><img src="/images/economic-boutique-mark.png" alt="" width="42" height="42" /><span><strong>Economic Boutique</strong><small>Catalog admin</small></span></a>
      <div className="admin-header-actions"><a href="index.html" target="_blank" rel="noreferrer"><ArrowSquareOut size={18} />View store</a><button type="button" onClick={signOut}><SignOut size={18} />Sign out</button></div>
    </header>

    <main className="admin-main">
      <aside className="admin-sidebar">
        <div className="sidebar-heading"><div><p className="admin-kicker">Catalog</p><h1>Products</h1></div><button className="icon-action" type="button" onClick={addProduct} aria-label="Add product"><Plus size={20} weight="bold" /></button></div>
        <nav className="category-tabs" aria-label="Product categories">{categories.map((category) => {
          const count = products.filter((product) => product.category_id === category.id).length;
          return <button type="button" key={category.id} className={category.id === categoryId ? "active" : ""} onClick={() => setCategoryId(category.id)}><span>{category.name}</span><small>{count}</small></button>;
        })}</nav>
        <label className="admin-search"><span className="sr-only">Search products</span><MagnifyingGlass size={18} /><input type="search" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <div className="product-list" aria-label="Products">{busy && !products.length ? <div className="list-empty"><SpinnerGap className="spin" size={22} />Loading products</div> : visibleProducts.length ? visibleProducts.map((product) => <button type="button" key={product.id} className={selectedId === product.id ? "active" : ""} onClick={() => chooseProduct(product)}><span className="product-thumb">{product.image_url ? <img src={product.image_url} alt="" /> : <ImageIcon size={20} />}</span><span><strong>{product.name}</strong><small>NPR {Number(product.price_npr).toLocaleString("en-NP")}</small></span>{!product.active && <em>Hidden</em>}</button>) : <div className="list-empty">No products found.</div>}</div>
        <button className="admin-button admin-button-secondary add-product-mobile" type="button" onClick={addProduct}><Plus size={18} />Add product</button>
      </aside>

      <section className="admin-workspace">
        <div className="workspace-topbar"><div><p className="admin-kicker">{activeCategory?.name || "Collection"}</p><h2>{categoryEditing ? "Collection settings" : selectedId === "new" ? "New product" : draft?.name || "Choose a product"}</h2></div>{activeCategory && <button className="text-action" type="button" onClick={() => { setCategoryEditing(true); setNotice(null); }}>Edit collection text</button>}</div>
        {notice && <div className={`admin-notice ${notice.kind}`} role="status">{notice.kind === "success" ? <Check size={18} weight="bold" /> : <X size={18} weight="bold" />}<span>{notice.message}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice(null)}><X size={16} /></button></div>}

        {categoryEditing && categoryDraft ? <form className="editor-form collection-form" onSubmit={saveCategory}>
          <div className="form-section"><div className="form-section-heading"><h3>Collection content</h3><p>These words appear at the top of the public collection page and in search results.</p></div><div className="field-grid"><label>Collection name<input required value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} /></label><label>Page heading<input required value={categoryDraft.title} onChange={(event) => setCategoryDraft({ ...categoryDraft, title: event.target.value })} /></label><label className="field-wide">Introduction<textarea rows={3} required value={categoryDraft.intro} onChange={(event) => setCategoryDraft({ ...categoryDraft, intro: event.target.value })} /></label><label>Search label<input required value={categoryDraft.search_label} onChange={(event) => setCategoryDraft({ ...categoryDraft, search_label: event.target.value })} /></label><label>Search suggestion<input required value={categoryDraft.search_placeholder} onChange={(event) => setCategoryDraft({ ...categoryDraft, search_placeholder: event.target.value })} /></label></div></div>
          <div className="form-section"><div className="form-section-heading"><h3>Search preview</h3><p>Title and description used by search engines.</p></div><div className="field-grid"><label className="field-wide">Page title<input required value={categoryDraft.meta_title} onChange={(event) => setCategoryDraft({ ...categoryDraft, meta_title: event.target.value })} /></label><label className="field-wide">Page description<textarea rows={3} required value={categoryDraft.meta_description} onChange={(event) => setCategoryDraft({ ...categoryDraft, meta_description: event.target.value })} /></label></div></div>
          <div className="form-actions"><button className="admin-button admin-button-secondary" type="button" onClick={() => setCategoryEditing(false)}>Cancel</button><button className="admin-button admin-button-primary" type="submit" disabled={busy}><FloppyDisk size={18} />Save collection</button></div>
        </form> : draft ? <form className="editor-form" onSubmit={saveProduct}>
          <div className="product-editor-layout">
            <div className="image-editor"><div className="image-preview">{draft.image_url ? <img src={draft.image_url} alt={draft.alt_text || "Product preview"} /> : <div><ImageIcon size={32} /><span>No image selected</span></div>}</div><label className="admin-button admin-button-secondary upload-button"><UploadSimple size={18} />{uploading ? "Uploading" : "Upload image"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} /></label><p>JPG, PNG or WebP. Maximum 8 MB.</p></div>
            <div className="field-grid product-fields"><label className="field-wide">Product name<input required value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} /></label><label>Price in NPR<input type="number" min="0" step="1" required value={draft.price_npr} onChange={(event) => updateDraft("price_npr", Number(event.target.value))} /></label><label>Display order<input type="number" min="1" step="1" required value={draft.sort_order} onChange={(event) => updateDraft("sort_order", Number(event.target.value))} /></label><label className="field-wide">Short description<textarea rows={2} required value={draft.summary} onChange={(event) => updateDraft("summary", event.target.value)} /></label><label className="field-wide">Image URL<input required type="text" inputMode="url" value={draft.image_url} onChange={(event) => updateDraft("image_url", event.target.value)} /></label><label className="field-wide">Image description<input required value={draft.alt_text} onChange={(event) => updateDraft("alt_text", event.target.value)} /><small>Describe the garment for customers who cannot see the picture.</small></label><label className="visibility-field"><input type="checkbox" checked={draft.active} onChange={(event) => updateDraft("active", event.target.checked)} /><span><strong>Visible in store</strong><small>Turn this off to hide the item without deleting it.</small></span></label></div>
          </div>
          <div className="form-section details-section"><div className="form-section-heading"><h3>Product details</h3><p>Content shown when a customer opens the item.</p></div><div className="field-grid"><label className="field-wide">Full description<textarea rows={4} value={draft.details} onChange={(event) => updateDraft("details", event.target.value)} /></label><label>Care instructions<textarea rows={4} value={draft.care} onChange={(event) => updateDraft("care", event.target.value)} /></label><label>Delivery information<textarea rows={4} value={draft.delivery} onChange={(event) => updateDraft("delivery", event.target.value)} /></label></div></div>
          <div className="form-actions">{draft.id && <button className="admin-button danger-button" type="button" onClick={removeProduct} disabled={busy}><Trash size={18} />Delete</button>}<span /><button className="admin-button admin-button-primary" type="submit" disabled={busy || uploading}>{busy ? <SpinnerGap className="spin" size={18} /> : <FloppyDisk size={18} />}{draft.id ? "Save changes" : "Add product"}</button></div>
        </form> : <div className="workspace-empty"><ImageIcon size={36} /><h3>No products yet</h3><p>{products.length ? "Add the first product to this collection." : "Bring the current storefront catalog into Supabase in one step."}</p>{products.length ? <button className="admin-button admin-button-primary" type="button" onClick={addProduct}><Plus size={18} />Add product</button> : <button className="admin-button admin-button-primary" type="button" onClick={importStarterCatalog} disabled={busy}>{busy ? <SpinnerGap className="spin" size={18} /> : <UploadSimple size={18} />}Import 48 products</button>}</div>}
      </section>
    </main>
  </div>;
}

export const starterCatalog = Object.values(collections).map((collection) => ({
  category: fallbackCategory(collection),
  products: collection.products.map(([name, summary, price, altText], index) => ({
    name,
    summary,
    price_npr: Number(price.replace(/[^0-9]/g, "")),
    image_url: getCollectionImage(collection, index),
    alt_text: altText,
    details: `${summary}. Finished to order by our boutique tailors with careful attention to fit.`,
    care: "Dry clean recommended. Store folded in a cool, dry place.",
    delivery: "Boutique pickup or local delivery can be arranged.",
    active: true,
    sort_order: index + 1,
  })),
}));
