import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

export type DbCategory = {
  id: string;
  slug: string;
  name: string;
  title: string;
  intro: string;
  search_label: string;
  search_placeholder: string;
  meta_title: string;
  meta_description: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type DbProduct = {
  id: string;
  category_id: string;
  name: string;
  summary: string;
  price_npr: number;
  image_url: string;
  alt_text: string;
  details: string;
  care: string;
  delivery: string;
  active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export async function getPublishedCollection(slug: string) {
  if (!supabase) return null;
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<DbCategory>();
  if (categoryError) throw categoryError;
  if (!category) return null;

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .returns<DbProduct[]>();
  if (productsError) throw productsError;
  return products?.length ? { category, products } : null;
}

export async function getPublishedCategory(slug: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<DbCategory>();
  if (error) throw error;
  return data;
}
