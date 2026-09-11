-- =========================================================
-- Media Categories & Assets Table
-- =========================================================

create type public.media_category as enum (
  'campus',
  'classroom',
  'graduation',
  'staff',
  'excursion',
  'logo',
  'proprietor',
  'general'
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  caption text,
  alt_text text not null default '',
  category public.media_category not null default 'general',
  storage_path text not null unique,
  public_url text not null,
  file_size_bytes bigint,
  mime_type text,
  is_featured boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

-- Public can view all published media records
grant select on public.media to anon, authenticated;
create policy media_public_select
on public.media for select
to anon, authenticated
using (true);

-- Admins can insert, update, and delete media
grant insert, update, delete on public.media to authenticated;
create policy media_admin_manage
on public.media for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));