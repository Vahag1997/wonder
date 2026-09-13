-- Disposable fixtures are rolled back; no emails, customers, or charges created.
begin;
do $$
declare owner_id uuid; product_id uuid;
begin
 select id into strict owner_id from public.profiles limit 1;
 select id into strict product_id from public.products where slug='amir-and-new-friends';
 perform set_config('wonder.audit_owner', owner_id::text, true);
 insert into public.my_books(id,user_id,product_id) values ('00000000-0000-4000-8000-000000000019',owner_id,product_id);
 insert into public.orders(id,user_id,product_id,book_id) values ('00000000-0000-4000-8000-000000000020',owner_id,product_id,'00000000-0000-4000-8000-000000000019');
end $$;
set local role authenticated;
do $$
begin
 perform set_config('request.jwt.claims',json_build_object('sub',current_setting('wonder.audit_owner'),'role','authenticated')::text,true);
 if (select count(*) from public.profiles) <> 1 then raise exception 'owner profile check failed'; end if;
 if (select count(*) from public.my_books where id='00000000-0000-4000-8000-000000000019') <> 1 then raise exception 'owner book check failed'; end if;
 if (select count(*) from public.orders where id='00000000-0000-4000-8000-000000000020') <> 1 then raise exception 'owner order check failed'; end if;
 begin
  update public.my_books set status='paid' where id='00000000-0000-4000-8000-000000000019';
  raise exception 'customer could forge paid book';
 exception when insufficient_privilege then null;
 end;
 begin
  update public.orders set status='paid' where id='00000000-0000-4000-8000-000000000020';
  raise exception 'customer could forge paid order';
 exception when insufficient_privilege then null;
 end;
 perform set_config('request.jwt.claims',json_build_object('sub','00000000-0000-4000-8000-000000000099','role','authenticated')::text,true);
 if (select count(*) from public.profiles) <> 0 then raise exception 'cross-user profile leak'; end if;
 if (select count(*) from public.my_books) <> 0 then raise exception 'cross-user book leak'; end if;
 if (select count(*) from public.orders) <> 0 then raise exception 'cross-user order leak'; end if;
end $$;
reset role;
rollback;
select 'PASS: owner isolation, forbidden paid-state writes; test rows rolled back' as verification;
