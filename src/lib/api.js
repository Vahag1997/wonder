// lib/api.js
'use client';

import { supabase } from './supabaseClient';

/** PRODUCTS **/
export async function getActiveProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, price_cents, preview_url, languages, active, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/** MY BOOKS (library / personalization instances) **/
export async function getMyBooks({ limit = 50, offset = 0 } = {}) {
  // Includes related product fields via FK join
  const { data, error } = await supabase
    .from('my_books')
    .select(`
      id, user_id, product_id, status, data, file_url, created_at, updated_at,
      product:products!my_books_product_id_fkey (
        id, title, price_cents, preview_url, languages
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

export async function getMyBookById(myBookId) {
  const { data, error } = await supabase
    .from('my_books')
    .select(`
      id, user_id, product_id, status, data, file_url, created_at, updated_at,
      product:products!my_books_product_id_fkey (
        id, title, price_cents, preview_url, languages
      )
    `)
    .eq('id', myBookId)
    .single();

  if (error) throw error;
  return data;
}

/** ORDERS (simple: one product per row) **/
export async function getMyOrders({ limit = 50, offset = 0 } = {}) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, user_id, product_id, quantity, status, created_at,
      product:products!orders_product_id_fkey (
        id, title, price_cents, preview_url, languages
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}

/** OPTIONAL: get the current profile row (id matches auth.users.id) **/
export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, created_at')
    .eq('id', auth.user.id)
    .single();

  if (error) throw error;
  return data;
}
