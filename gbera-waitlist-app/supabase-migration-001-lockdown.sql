-- ===========================================
-- Gbera Waitlist - Migration 001: lock down direct table access
-- Run once in the Supabase SQL Editor on the LIVE project.
--
-- Problem: the original policies "service role insert waitlist" (insert with
-- check (true)) and "service role update waitlist" (update using (true)) were
-- not scoped to a role, so they applied to anon. Anyone holding the public anon
-- key could insert or overwrite any waitlist row via the PostgREST API.
-- ===========================================

drop policy if exists "service role insert waitlist" on public.waitlist;
drop policy if exists "service role update waitlist" on public.waitlist;

revoke all on public.waitlist   from anon, authenticated;
revoke all on public.page_views from anon, authenticated;

-- Keep the two things the browser legitimately needs
grant execute on function public.increment_page_views() to anon, authenticated;
grant select  on public.waitlist_stats               to anon, authenticated;

-- Pin the search_path of the SECURITY DEFINER function
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

-- Verify (both should return zero rows for anon-facing grants on the tables):
--   select grantee, privilege_type from information_schema.role_table_grants
--   where table_name in ('waitlist','page_views') and grantee in ('anon','authenticated');
