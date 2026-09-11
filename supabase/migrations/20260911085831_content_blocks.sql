create table public.content_blocks (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  content jsonb not null default '{}',
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (page_key, section_key)
);

alter table public.content_blocks enable row level security;

grant select on public.content_blocks to anon, authenticated;
create policy content_blocks_public_read
on public.content_blocks for select
to anon, authenticated
using (true);

grant insert, update, delete on public.content_blocks to authenticated;
create policy content_blocks_admin_manage
on public.content_blocks for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create trigger content_blocks_set_updated_at
before update on public.content_blocks
for each row
execute function private.set_updated_at();

-- Seed default home page content
insert into public.content_blocks (page_key, section_key, content) values
('home', 'hero', '{"headline": "Nurturing Faith, Knowledge & Excellence", "subtext": "Al-Ihsan International Islamic School combines rigorous Conventional education with comprehensive Tahfeez (Quran memorization) to cultivate well-rounded leaders of tomorrow.", "badge": "Maiduguri · Six Campuses"}'),
('home', 'stats', '{"campuses": "6", "tracks": "2", "faculty": "100%", "quran": "Tajweed"}'),
('about', 'mission', '{"text": "To provide an inspiring, disciplined, and nurturing educational environment where students achieve outstanding academic competency while internalizing the teachings of the Quran and the Sunnah."}'),
('about', 'vision', '{"text": "To be the premier Islamic educational institution in Northern Nigeria, recognized nationally for producing morally upright scholars, innovators, and leaders equipped for contemporary challenges."}'),
('about', 'intro', '{"text": "Founded in Maiduguri, Borno State, Al-Ihsan International Islamic School was established to provide sound, modern education rooted firmly in Islamic moral principles across six distinct campuses."}')
on conflict (page_key, section_key) do nothing;