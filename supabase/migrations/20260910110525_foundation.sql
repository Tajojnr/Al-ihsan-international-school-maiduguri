-- =========================================================
-- 1. Private helpers and roles
-- =========================================================

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

create type public.user_role as enum (
  'applicant',
  'admin'
);

-- =========================================================
-- 2. Profiles
-- =========================================================

create table public.profiles (
  id uuid primary key
    references auth.users (id) on delete cascade,

  role public.user_role not null default 'applicant',

  full_name text not null default '',
  phone text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_full_name_length
    check (char_length(full_name) <= 200),

  constraint profiles_phone_length
    check (phone is null or char_length(phone) <= 40)
);

alter table public.profiles enable row level security;

-- =========================================================
-- 3. Timestamp helper
-- =========================================================

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function private.set_updated_at();

-- =========================================================
-- 4. Automatically create applicant profiles
-- Never trust signup metadata to assign an admin role.
-- =========================================================

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    role,
    full_name
  )
  values (
    new.id,
    'applicant'::public.user_role,
    left(
      coalesce(new.raw_user_meta_data ->> 'full_name', ''),
      200
    )
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function private.handle_new_user();

-- Backfill profiles if Auth users already exist.
insert into public.profiles (
  id,
  role,
  full_name
)
select
  id,
  'applicant'::public.user_role,
  left(
    coalesce(raw_user_meta_data ->> 'full_name', ''),
    200
  )
from auth.users
on conflict (id) do nothing;

-- =========================================================
-- 5. Administrator check
-- SECURITY DEFINER avoids recursive profile RLS checks.
-- This function only checks the current user's role.
-- =========================================================

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'::public.user_role
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.is_admin() from anon;
grant execute on function private.is_admin() to authenticated;

-- =========================================================
-- 6. Profile privileges and policies
-- No browser-side inserts, deletes, or role changes.
-- =========================================================

revoke all on public.profiles from anon, authenticated;

grant select on public.profiles to authenticated;

grant update (full_name, phone)
on public.profiles
to authenticated;

create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.is_admin())
);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (
  id = (select auth.uid())
)
with check (
  id = (select auth.uid())
);

-- =========================================================
-- 7. Campuses
-- Campus information stays private until published.
-- =========================================================

create table public.campuses (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,
  address text,
  description text,
  phone text,
  email text,

  order_index integer not null default 0,
  is_published boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint campuses_name_length
    check (char_length(btrim(name)) between 1 and 200),

  constraint campuses_slug_format
    check (
      char_length(slug) between 1 and 120
      and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    ),

  constraint campuses_order_nonnegative
    check (order_index >= 0),

  constraint campuses_published_address
    check (
      not is_published
      or (
        address is not null
        and char_length(btrim(address)) > 0
      )
    )
);

alter table public.campuses enable row level security;

create trigger campuses_set_updated_at
before update on public.campuses
for each row
execute function private.set_updated_at();

-- =========================================================
-- 8. Campus privileges and policies
-- =========================================================

revoke all on public.campuses from anon, authenticated;

grant select on public.campuses to anon, authenticated;

grant insert, update, delete
on public.campuses
to authenticated;

create policy campuses_public_read
on public.campuses
for select
to anon, authenticated
using (
  is_published = true
);

create policy campuses_admin_manage
on public.campuses
for all
to authenticated
using (
  (select private.is_admin())
)
with check (
  (select private.is_admin())
);