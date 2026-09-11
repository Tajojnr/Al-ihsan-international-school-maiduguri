-- =========================================================
-- 1. Custom Types & Enums
-- =========================================================

create type public.academic_track as enum (
  'conventional',
  'tahfeez'
);

create type public.admission_application_status as enum (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'waitlisted',
  'withdrawn'
);

create type public.job_application_status as enum (
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'hired',
  'rejected',
  'withdrawn'
);

create type public.document_type as enum (
  'birth_certificate',
  'previous_result',
  'medical_report',
  'passport_photo',
  'cv',
  'certificate',
  'other'
);

-- =========================================================
-- 2. Cycles, Offerings & Job Openings
-- =========================================================

create table public.admission_cycles (
  id uuid primary key default gen_random_uuid(),
  academic_session text not null, -- e.g. "2026/2027"
  title text not null,
  opening_date timestamptz not null default now(),
  closing_date timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admission_cycles_session_length
    check (char_length(btrim(academic_session)) between 4 and 20)
);

alter table public.admission_cycles enable row level security;

create trigger admission_cycles_set_updated_at
before update on public.admission_cycles
for each row
execute function private.set_updated_at();


create table public.admission_offerings (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles(id) on delete cascade,
  campus_id uuid not null references public.campuses(id) on delete restrict,
  track public.academic_track not null,
  entry_class text not null, -- e.g. "Nursery 1", "Primary 1", "JSS 1", "Tahfeez Level 1"
  is_accepting_applications boolean not null default true,
  created_at timestamptz not null default now(),

  constraint unique_offering_per_campus_class
    unique (cycle_id, campus_id, track, entry_class)
);

alter table public.admission_offerings enable row level security;


create table public.job_openings (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid references public.campuses(id) on delete set null, -- null means school-wide / central
  title text not null,
  slug text not null unique,
  department text,
  description text not null,
  requirements text,
  closing_date timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint job_openings_title_length
    check (char_length(btrim(title)) between 2 and 200),

  constraint job_openings_slug_format
    check (
      char_length(slug) between 2 and 120
      and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    )
);

alter table public.job_openings enable row level security;

create trigger job_openings_set_updated_at
before update on public.job_openings
for each row
execute function private.set_updated_at();

-- =========================================================
-- 3. Application Reference Sequence Helpers
-- =========================================================

create sequence if not exists private.admission_ref_seq start with 1001;
create sequence if not exists private.job_ref_seq start with 1001;

create function private.generate_reference_number(prefix text, seq_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_val bigint;
  current_year text;
begin
  execute format('select nextval(%L)', 'private.' || seq_name) into next_val;
  current_year := to_char(now(), 'YYYY');
  return prefix || '-' || current_year || '-' || lpad(next_val::text, 5, '0');
end;
$$;

revoke all on function private.generate_reference_number(text, text) from public;

-- =========================================================
-- 4. Admission Applications
-- =========================================================

create table public.admission_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  offering_id uuid not null references public.admission_offerings(id) on delete restrict,
  reference_number text unique,
  status public.admission_application_status not null default 'draft',

  -- Student Information
  student_first_name text not null default '',
  student_middle_name text,
  student_last_name text not null default '',
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other') or gender is null),

  -- Guardian Contact Information
  guardian_relationship text,
  guardian_phone text,
  guardian_alt_phone text,
  guardian_address text,

  -- Prior History & Safeguarding
  previous_school text,
  medical_conditions text,
  emergency_contact_name text,
  emergency_contact_phone text,

  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admission_applications enable row level security;

create trigger admission_applications_set_updated_at
before update on public.admission_applications
for each row
execute function private.set_updated_at();

-- =========================================================
-- 5. Job Applications
-- =========================================================

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  job_opening_id uuid not null references public.job_openings(id) on delete restrict,
  reference_number text unique,
  status public.job_application_status not null default 'draft',

  cover_letter text,
  highest_qualification text,
  years_of_experience integer check (years_of_experience is null or years_of_experience >= 0),
  linkedin_or_portfolio_url text,

  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_applications enable row level security;

create trigger job_applications_set_updated_at
before update on public.job_applications
for each row
execute function private.set_updated_at();

-- =========================================================
-- 6. Applicant-Visible Status History & Admin Notes
-- =========================================================

-- Visible timeline for admission applicants
create table public.admission_application_status_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.admission_applications(id) on delete cascade,
  from_status public.admission_application_status,
  to_status public.admission_application_status not null,
  public_message text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.admission_application_status_events enable row level security;

-- Visible timeline for job applicants
create table public.job_application_status_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(id) on delete cascade,
  from_status public.job_application_status,
  to_status public.job_application_status not null,
  public_message text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.job_application_status_events enable row level security;

-- Strictly private admin notes (Admission)
create table public.admission_application_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.admission_applications(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),

  constraint admission_note_not_empty check (char_length(btrim(note)) > 0)
);

alter table public.admission_application_notes enable row level security;

-- Strictly private admin notes (Jobs)
create table public.job_application_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),

  constraint job_note_not_empty check (char_length(btrim(note)) > 0)
);

alter table public.job_application_notes enable row level security;

-- =========================================================
-- 7. Secure Application Documents Table
-- =========================================================

create table public.application_documents (
  id uuid primary key default gen_random_uuid(),
  admission_application_id uuid references public.admission_applications(id) on delete cascade,
  job_application_id uuid references public.job_applications(id) on delete cascade,
  uploader_id uuid not null references public.profiles(id) on delete cascade,
  document_type public.document_type not null,
  storage_path text not null unique,
  original_file_name text not null,
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes > 0),
  mime_type text not null,
  created_at timestamptz not null default now(),

  constraint document_must_belong_to_one_app
    check (
      (admission_application_id is not null and job_application_id is null)
      or
      (admission_application_id is null and job_application_id is not null)
    )
);

alter table public.application_documents enable row level security;

-- =========================================================
-- 8. Controlled Submission RPC Functions
-- =========================================================

create function public.submit_admission_application(p_application_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_applicant_id uuid;
  v_status public.admission_application_status;
  v_first_name text;
  v_last_name text;
  v_ref text;
begin
  select applicant_id, status, student_first_name, student_last_name
  into v_applicant_id, v_status, v_first_name, v_last_name
  from public.admission_applications
  where id = p_application_id;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Application not found');
  end if;

  if v_applicant_id <> (select auth.uid()) and not (select private.is_admin()) then
    return jsonb_build_object('success', false, 'error', 'Unauthorized');
  end if;

  if v_status <> 'draft' then
    return jsonb_build_object('success', false, 'error', 'Only draft applications can be submitted');
  end if;

  -- Validate minimum required fields
  if char_length(btrim(v_first_name)) = 0 or char_length(btrim(v_last_name)) = 0 then
    return jsonb_build_object('success', false, 'error', 'Student first and last name are required before submission');
  end if;

  v_ref := private.generate_reference_number('ADM', 'admission_ref_seq');

  update public.admission_applications
  set
    status = 'submitted',
    reference_number = v_ref,
    submitted_at = now()
  where id = p_application_id;

  -- Record status history event
  insert into public.admission_application_status_events (
    application_id,
    from_status,
    to_status,
    public_message,
    created_by
  ) values (
    p_application_id,
    'draft',
    'submitted',
    'Application successfully submitted.',
    auth.uid()
  );

  return jsonb_build_object(
    'success', true,
    'reference_number', v_ref,
    'submitted_at', now()
  );
end;
$$;

revoke all on function public.submit_admission_application(uuid) from public;
grant execute on function public.submit_admission_application(uuid) to authenticated;


create function public.submit_job_application(p_application_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_applicant_id uuid;
  v_status public.job_application_status;
  v_ref text;
begin
  select applicant_id, status
  into v_applicant_id, v_status
  from public.job_applications
  where id = p_application_id;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Application not found');
  end if;

  if v_applicant_id <> (select auth.uid()) and not (select private.is_admin()) then
    return jsonb_build_object('success', false, 'error', 'Unauthorized');
  end if;

  if v_status <> 'draft' then
    return jsonb_build_object('success', false, 'error', 'Only draft applications can be submitted');
  end if;

  v_ref := private.generate_reference_number('JOB', 'job_ref_seq');

  update public.job_applications
  set
    status = 'submitted',
    reference_number = v_ref,
    submitted_at = now()
  where id = p_application_id;

  -- Record status history event
  insert into public.job_application_status_events (
    application_id,
    from_status,
    to_status,
    public_message,
    created_by
  ) values (
    p_application_id,
    'draft',
    'submitted',
    'Job application successfully submitted.',
    auth.uid()
  );

  return jsonb_build_object(
    'success', true,
    'reference_number', v_ref,
    'submitted_at', now()
  );
end;
$$;

revoke all on function public.submit_job_application(uuid) from public;
grant execute on function public.submit_job_application(uuid) to authenticated;

-- =========================================================
-- 9. Row Level Security Policies
-- =========================================================

-- Public Read for Active Cycles, Offerings, and Published Job Openings
grant select on public.admission_cycles to anon, authenticated;
create policy admission_cycles_public_read
on public.admission_cycles for select
to anon, authenticated
using (is_active = true or (select private.is_admin()));

grant insert, update, delete on public.admission_cycles to authenticated;
create policy admission_cycles_admin_manage
on public.admission_cycles for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));


grant select on public.admission_offerings to anon, authenticated;
create policy admission_offerings_public_read
on public.admission_offerings for select
to anon, authenticated
using (is_accepting_applications = true or (select private.is_admin()));

grant insert, update, delete on public.admission_offerings to authenticated;
create policy admission_offerings_admin_manage
on public.admission_offerings for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));


grant select on public.job_openings to anon, authenticated;
create policy job_openings_public_read
on public.job_openings for select
to anon, authenticated
using (is_published = true or (select private.is_admin()));

grant insert, update, delete on public.job_openings to authenticated;
create policy job_openings_admin_manage
on public.job_openings for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));


-- Admission Applications RLS
grant select, insert on public.admission_applications to authenticated;
grant update (
  student_first_name, student_middle_name, student_last_name,
  date_of_birth, gender, guardian_relationship, guardian_phone,
  guardian_alt_phone, guardian_address, previous_school,
  medical_conditions, emergency_contact_name, emergency_contact_phone
) on public.admission_applications to authenticated;

create policy admission_apps_select
on public.admission_applications for select
to authenticated
using (applicant_id = (select auth.uid()) or (select private.is_admin()));

create policy admission_apps_insert_draft
on public.admission_applications for insert
to authenticated
with check (
  applicant_id = (select auth.uid())
  and status = 'draft'
  and reference_number is null
);

create policy admission_apps_update_draft
on public.admission_applications for update
to authenticated
using (
  (applicant_id = (select auth.uid()) and status = 'draft')
  or (select private.is_admin())
)
with check (
  (applicant_id = (select auth.uid()) and status = 'draft')
  or (select private.is_admin())
);


-- Job Applications RLS
grant select, insert on public.job_applications to authenticated;
grant update (
  cover_letter, highest_qualification,
  years_of_experience, linkedin_or_portfolio_url
) on public.job_applications to authenticated;

create policy job_apps_select
on public.job_applications for select
to authenticated
using (applicant_id = (select auth.uid()) or (select private.is_admin()));

create policy job_apps_insert_draft
on public.job_applications for insert
to authenticated
with check (
  applicant_id = (select auth.uid())
  and status = 'draft'
  and reference_number is null
);

create policy job_apps_update_draft
on public.job_applications for update
to authenticated
using (
  (applicant_id = (select auth.uid()) and status = 'draft')
  or (select private.is_admin())
)
with check (
  (applicant_id = (select auth.uid()) and status = 'draft')
  or (select private.is_admin())
);


-- Status Events Policies
grant select on public.admission_application_status_events to authenticated;
create policy admission_status_events_select
on public.admission_application_status_events for select
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1 from public.admission_applications a
    where a.id = application_id and a.applicant_id = (select auth.uid())
  )
);

grant select on public.job_application_status_events to authenticated;
create policy job_status_events_select
on public.job_application_status_events for select
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1 from public.job_applications a
    where a.id = application_id and a.applicant_id = (select auth.uid())
  )
);


-- Admin-Only Notes Policies
grant all on public.admission_application_notes to authenticated;
create policy admission_notes_admin_only
on public.admission_application_notes for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

grant all on public.job_application_notes to authenticated;
create policy job_notes_admin_only
on public.job_application_notes for all
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));


-- Documents Table Policies
grant select, insert, delete on public.application_documents to authenticated;

create policy application_docs_select
on public.application_documents for select
to authenticated
using (
  uploader_id = (select auth.uid())
  or (select private.is_admin())
);

create policy application_docs_insert
on public.application_documents for insert
to authenticated
with check (
  uploader_id = (select auth.uid())
);

create policy application_docs_delete
on public.application_documents for delete
to authenticated
using (
  (uploader_id = (select auth.uid()) and exists (
    select 1 from public.admission_applications a
    where a.id = admission_application_id and a.status = 'draft'
  ))
  or (uploader_id = (select auth.uid()) and exists (
    select 1 from public.job_applications j
    where j.id = job_application_id and j.status = 'draft'
  ))
  or (select private.is_admin())
);

-- =========================================================
-- 10. Private & Public Storage Buckets
-- =========================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('applicant-documents', 'applicant-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png']),
  ('public-media', 'public-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do nothing;

create policy storage_public_media_read
on storage.objects for select
to anon, authenticated
using (bucket_id = 'public-media');

create policy storage_public_media_admin_manage
on storage.objects for all
to authenticated
using (bucket_id = 'public-media' and (select private.is_admin()))
with check (bucket_id = 'public-media' and (select private.is_admin()));

create policy storage_applicant_docs_upload
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'applicant-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy storage_applicant_docs_select
on storage.objects for select
to authenticated
using (
  bucket_id = 'applicant-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or (select private.is_admin())
  )
);