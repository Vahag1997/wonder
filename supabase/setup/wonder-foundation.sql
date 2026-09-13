-- Reviewed against project uvosriooywkdckotnvsv on 2026-09-13.
-- Additive schema changes; preserves existing users and records.
-- No generation, charges, public child photos, or customer-controlled payment state.
begin;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.profiles enable row level security;
alter table public.my_books enable row level security;
revoke all on public.products, public.orders, public.profiles, public.my_books from public, anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.orders, public.profiles, public.my_books to authenticated;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists my_books_select_own on public.my_books;
drop policy if exists my_books_insert_own on public.my_books;
drop policy if exists my_books_update_own on public.my_books;
drop policy if exists products_active_read on public.products;
drop policy if exists profiles_owner_read on public.profiles;
drop policy if exists orders_owner_read on public.orders;
drop policy if exists books_owner_read on public.my_books;
create policy products_active_read on public.products for select to anon, authenticated using (active = true);
create policy profiles_owner_read on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy orders_owner_read on public.orders for select to authenticated using ((select auth.uid()) = user_id);
create policy books_owner_read on public.my_books for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
alter function public.touch_updated_at() set search_path = '';
revoke all on function public.touch_updated_at() from public, anon, authenticated;
insert into public.profiles(id) select id from auth.users on conflict(id) do nothing;

alter table public.products add column if not exists slug text unique;
alter table public.products add column if not exists template_id text;
alter table public.products add column if not exists currency text not null default 'RUB';
alter table public.products add column if not exists checkout_enabled boolean not null default false;
alter table public.orders add column if not exists book_id uuid references public.my_books(id);
alter table public.orders add column if not exists amount_cents integer check (amount_cents >= 0);
alter table public.orders add column if not exists currency text;
alter table public.orders add column if not exists payment_provider text;
alter table public.orders add column if not exists provider_payment_id text;
alter table public.my_books add column if not exists template_version text;
alter table public.my_books add column if not exists child_photo_path text;
alter table public.my_books add column if not exists preview_paths text[] not null default '{}';
alter table public.my_books add column if not exists output_path text;
alter table public.my_books add column if not exists consent_at timestamptz;
alter table public.my_books add column if not exists consent_version text;
alter table public.my_books add column if not exists expires_at timestamptz;
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists my_books_user_created_idx on public.my_books(user_id, created_at desc);
create index if not exists orders_product_idx on public.orders(product_id);
create index if not exists orders_book_idx on public.orders(book_id);
create index if not exists my_books_product_idx on public.my_books(product_id);
create unique index if not exists orders_provider_payment_unique on public.orders(payment_provider, provider_payment_id) where provider_payment_id is not null;

insert into public.products (slug, template_id, title, price_cents, age_min, age_max, gender, genre, pages, preview_url, gallery_urls, languages, active, checkout_enabled)
values ('amir-and-new-friends', 'amir-new-cover-20x20', 'Маленький герой. Большая дружба.', 0, 1, 12, 'unisex', 'friendship', 19, '/images/books/amir-1.webp', array['/images/books/amir-1.webp','/images/books/amir-3.webp','/images/books/amir-5.webp'], array['ru'], true, false)
on conflict (slug) do update set template_id = excluded.template_id, title = excluded.title, pages = excluded.pages, preview_url = excluded.preview_url, gallery_urls = excluded.gallery_urls;
-- Price 0 is an unset placeholder, NOT a free offer. Checkout stays disabled.

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types) values
 ('child-photos', 'child-photos', false, 10485760, array['image/jpeg','image/png','image/webp']),
 ('book-previews', 'book-previews', false, 20971520, array['image/jpeg','image/png','image/webp']),
 ('finished-books', 'finished-books', false, 104857600, array['application/pdf']),
 ('book-templates', 'book-templates', false, 104857600, array['application/pdf','application/json','image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
-- No storage.objects client policies: server-only delivery and verified order
-- entitlements are required before exposing private objects.
commit;
