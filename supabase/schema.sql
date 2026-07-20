-- Economic Boutique catalog schema
-- Run this once in the Supabase SQL editor, then create a staff user in Authentication.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('kurta-surwal', 'lehenga', 'pants', 'tops-blouses')),
  name text not null,
  title text not null,
  intro text not null default '',
  search_label text not null default '',
  search_placeholder text not null default '',
  meta_title text not null default '',
  meta_description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  summary text not null default '',
  price_npr numeric(12, 2) not null default 0 check (price_npr >= 0),
  image_url text not null default '',
  alt_text text not null default '',
  details text not null default '',
  care text not null default '',
  delivery text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_order_idx on public.products(category_id, sort_order);
create index if not exists products_public_idx on public.products(category_id, active) where active = true;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select using (true);

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (active = true or auth.role() = 'authenticated');

drop policy if exists "Staff can insert categories" on public.categories;
create policy "Staff can insert categories" on public.categories for insert to authenticated with check (true);
drop policy if exists "Staff can update categories" on public.categories;
create policy "Staff can update categories" on public.categories for update to authenticated using (true) with check (true);
drop policy if exists "Staff can delete categories" on public.categories;
create policy "Staff can delete categories" on public.categories for delete to authenticated using (true);

drop policy if exists "Staff can insert products" on public.products;
create policy "Staff can insert products" on public.products for insert to authenticated with check (true);
drop policy if exists "Staff can update products" on public.products;
create policy "Staff can update products" on public.products for update to authenticated using (true) with check (true);
drop policy if exists "Staff can delete products" on public.products;
create policy "Staff can delete products" on public.products for delete to authenticated using (true);

insert into public.categories (slug, name, title, intro, search_label, search_placeholder, meta_title, meta_description, sort_order)
values
  ('kurta-surwal', 'Kurta Surwal', 'KURTA SURWAL COLLECTION', 'From breathable daily favorites to celebration-ready sets.', 'Search the Kurta Surwal collection', 'Try “sage chikankari”', 'Kurta Surwal Collection | Economic Boutique', 'Shop Kurta Surwal sets at Economic Boutique in Sanepa, Lalitpur. Everyday cottons, festive embroidery and custom stitching available.', 1),
  ('lehenga', 'Lehenga', 'LEHENGA COLLECTION', 'Celebration silhouettes with movement, color and intricate detail.', 'Search the Lehenga collection', 'Try “crimson zardozi”', 'Lehenga Collection | Economic Boutique', 'Shop lehengas at Economic Boutique in Sanepa, Lalitpur, with festive embroidery and custom stitching available.', 2),
  ('pants', 'Pants', 'PANTS COLLECTION', 'Easy tailoring, versatile shapes and considered everyday comfort.', 'Search the Pants collection', 'Try “olive wide-leg”', 'Pants Collection | Economic Boutique', 'Shop women''s pants at Economic Boutique in Sanepa, Lalitpur, with versatile tailoring and custom fitting available.', 3),
  ('tops-blouses', 'Shirt Tops & Blouses', 'SHIRT TOPS & BLOUSES COLLECTION', 'Detailed separates for everyday dressing and special occasions.', 'Search the Shirt Tops and Blouses collection', 'Try “blue chikankari”', 'Shirt Tops & Blouses Collection | Economic Boutique', 'Shop women''s shirts, tops and blouses at Economic Boutique in Sanepa, Lalitpur. Everyday cottons and festive embroidery available.', 4)
on conflict (slug) do update set
  name = excluded.name,
  title = excluded.title,
  intro = excluded.intro,
  search_label = excluded.search_label,
  search_placeholder = excluded.search_placeholder,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  sort_order = excluded.sort_order;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "Staff can upload product images" on storage.objects;
create policy "Staff can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
drop policy if exists "Staff can update product images" on storage.objects;
create policy "Staff can update product images" on storage.objects for update to authenticated using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
drop policy if exists "Staff can delete product images" on storage.objects;
create policy "Staff can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
