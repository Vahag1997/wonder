'use client';
import { supabase } from './supabaseClient';

export async function getActiveProducts() {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data, error } = await supabase.from('products')
    .select('id,slug,title,price_cents,preview_url,languages,active,created_at')
    .eq('active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function library(kind, id) {
  const params = new URLSearchParams({ kind });
  if (id) params.set('id', id);
  const response = await fetch(`/api/library?${params}`, {
    credentials: 'same-origin', cache: 'no-store',
  });
  if (!response.ok) throw new Error('Library request failed');
  return (await response.json()).records;
}
export const getMyBooks = () => library('books');
export const getMyOrders = ({ id } = {}) => library('orders', id);
export async function getMyBookById(id) {
  return (await library('books', id))[0] || null;
}
export async function getMyProfile() {
  if (!supabase) throw new Error('Supabase is not configured');
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return null;
  const { data, error } = await supabase.from('profiles').select('id,created_at').eq('id', auth.user.id).single();
  if (error) throw error;
  return data;
}
