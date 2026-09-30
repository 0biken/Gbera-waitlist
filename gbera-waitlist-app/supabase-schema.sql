-- ===========================================
-- Gbera Waitlist — Supabase SQL Setup
-- Run this in your Supabase SQL Editor
-- ===========================================

-- 1. Main waitlist table
create table if not exists public.waitlist (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  phone             text,
  is_ui_student     boolean not null,
  faculty           text,
  year_or_level     text,
  has_graduated     boolean,
  occupation        text,
  role_interest     text not null check (role_interest in ('Rider', 'Driver', 'Both')),
  uses_keke         boolean not null,
  uses_uber         boolean not null,
  frequency         text,
  preferred_zones   text[], -- array of zone names
  waitlist_position integer,
  source            text,
  user_agent        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 2. Auto-assign sequential waitlist_position on insert
create sequence if not exists waitlist_position_seq start 1;

create or replace function public.assign_waitlist_position()
returns trigger language plpgsql as $$
begin
  if new.waitlist_position is null then
    new.waitlist_position := nextval('waitlist_position_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists before_insert_waitlist on public.waitlist;
create trigger before_insert_waitlist
  before insert on public.waitlist
  for each row execute function public.assign_waitlist_position();

-- 3. Auto-update updated_at on upsert
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists before_update_waitlist on public.waitlist;
create trigger before_update_waitlist
  before update on public.waitlist
  for each row execute function public.set_updated_at();

-- 4. Page-view counter table
create table if not exists public.page_views (
  id    integer primary key default 1 check (id = 1), -- single-row table
  count bigint not null default 0
);

insert into public.page_views (id, count) values (1, 0)
  on conflict (id) do nothing;

-- 5. Function to increment page views atomically
create or replace function public.increment_page_views()
returns bigint language plpgsql security definer set search_path = public as $$
declare
  new_count bigint;
begin
  update public.page_views set count = count + 1 where id = 1
    returning count into new_count;
  return new_count;
end;
$$;

-- 6. Read-only public view for aggregate stats (no PII)
create or replace view public.waitlist_stats as
  select
    (select count(*) from public.waitlist)                         as total_signups,
    (select count(*) from public.waitlist where role_interest = 'Rider')   as rider_count,
    (select count(*) from public.waitlist where role_interest = 'Driver')  as driver_count,
    (select count(*) from public.waitlist where role_interest = 'Both')    as both_count,
    (select coalesce(count,0) from public.page_views where id = 1)        as page_views;

-- 7. Row Level Security
-- All writes go through the Next.js API routes using the service-role key, which
-- bypasses RLS. Anon and authenticated roles get NO direct table access. Do not
-- add permissive insert/update policies: they would apply to every role,
-- including anon, letting anyone with the public key write to these tables.
alter table public.waitlist   enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "no anon select on waitlist"          on public.waitlist;
drop policy if exists "service role insert waitlist"        on public.waitlist;
drop policy if exists "service role update waitlist"        on public.waitlist;
drop policy if exists "no anon select on page_views"        on public.page_views;

create policy "no anon select on waitlist"   on public.waitlist   for select using (false);
create policy "no anon select on page_views" on public.page_views for select using (false);

revoke all on public.waitlist   from anon, authenticated;
revoke all on public.page_views from anon, authenticated;

-- The public counter function and the aggregate (no-PII) view are the only
-- things the browser-facing roles may touch.
grant execute on function public.increment_page_views() to anon, authenticated;
grant select on public.waitlist_stats to anon, authenticated;
