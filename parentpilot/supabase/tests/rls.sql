-- Family-isolation tests. Run by scripts/test-rls.sh against a throwaway Postgres
-- (with a stub of Supabase's auth schema) after every migration has been applied.
-- Any failed assertion raises an exception and the script exits non-zero.
\set ON_ERROR_STOP on
\set QUIET on
set client_min_messages = notice;

create schema t;
grant usage on schema t to anon, authenticated;

create function t.eq(actual bigint, expected bigint, label text) returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FAIL: % (expected %, got %)', label, expected, actual;
  end if;
  raise notice 'PASS: %', label;
end $$;

-- The statement must raise (RLS violation, constraint, permission...).
create function t.denied(stmt text, label text) returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    raise notice 'PASS: % (%)', label, sqlstate;
    return;
  end;
  raise exception 'FAIL: was allowed: %', label;
end $$;

-- The statement must run but touch exactly `expected` rows (RLS hides others' rows).
create function t.affects(stmt text, expected int, label text) returns void language plpgsql as $$
declare n int;
begin
  execute stmt;
  get diagnostics n = row_count;
  if n <> expected then
    raise exception 'FAIL: % (expected % rows affected, got %)', label, expected, n;
  end if;
  raise notice 'PASS: %', label;
end $$;

create function t.login(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid::text, false);
  set role authenticated;
end $$;
grant execute on all functions in schema t to anon, authenticated;

-- ------------------------------------------------------------- fixtures --
insert into auth.users (id) values
  ('00000000-0000-0000-0000-00000000000a'),  -- Alice: family A
  ('00000000-0000-0000-0000-00000000000b'),  -- Bob: family B
  ('00000000-0000-0000-0000-00000000000c'),  -- Cara: no family
  ('00000000-0000-0000-0000-00000000000d');  -- Dan: viewer in family A

select t.login('00000000-0000-0000-0000-00000000000a');
select public.onboard_family('Alice', 'Emma', '2026-07-15') as fam_a \gset
select t.login('00000000-0000-0000-0000-00000000000b');
select public.onboard_family('Bob', 'Noah', '2026-01-02') as fam_b \gset

reset role;
select id as child_b from public.children where family_id = :'fam_b' \gset
insert into public.caregivers (family_id, user_id, display_name, role, can_edit, can_manage_family)
  values (:'fam_a', '00000000-0000-0000-0000-00000000000d', 'Dan', 'viewer', false, false);

-- Alice adds a second child (twin), a memory, reminder and appointment.
select t.login('00000000-0000-0000-0000-00000000000a');
select t.affects(format($q$insert into public.children (family_id, name, date_of_birth) values (%L, 'Ella', '2026-07-15')$q$, :'fam_a'), 1, 'A can add a second child (twins supported)');
select id as child_a from public.children where family_id = :'fam_a' and name = 'Emma' \gset
select t.affects(format($q$insert into public.memories (family_id, child_id, kind, content) values (%L, %L, 'child_note', 'Emma doesn''t like the blue bottle.')$q$, :'fam_a', :'child_a'), 1, 'A can save a memory');
select t.affects(format($q$insert into public.reminders (family_id, title, due_at) values (%L, 'Pack changing bag', now())$q$, :'fam_a'), 1, 'A can create a reminder');
select t.affects(format($q$insert into public.appointments (family_id, child_id, title, starts_at) values (%L, %L, 'Health visitor', now())$q$, :'fam_a', :'child_a'), 1, 'A can create an appointment');

select t.login('00000000-0000-0000-0000-00000000000b');
select t.affects(format($q$insert into public.memories (family_id, kind, content) values (%L, 'general', 'Bob note')$q$, :'fam_b'), 1, 'B can save a memory');
select t.affects(format($q$insert into public.reminders (family_id, title, due_at) values (%L, 'Bob reminder', now())$q$, :'fam_b'), 1, 'B can create a reminder');

-- ------------------------------------------------------------ isolation --
reset role; select id as mem_a from public.memories where family_id = :'fam_a' \gset
select id as rem_a from public.reminders where family_id = :'fam_a' \gset
select id as appt_a from public.appointments where family_id = :'fam_a' \gset
select id as mem_b from public.memories where family_id = :'fam_b' \gset

\echo == Family A user
select t.login('00000000-0000-0000-0000-00000000000a');
select t.eq((select count(*) from public.children), 2, 'A sees exactly its own 2 children');
select t.eq((select count(*) from public.children where family_id = :'fam_b'), 0, 'A cannot read B children');
select t.eq((select count(*) from public.families), 1, 'A sees only its own family');
select t.eq((select count(*) from public.caregivers where family_id = :'fam_b'), 0, 'A cannot read B caregivers');
select t.eq((select count(*) from public.memories where family_id = :'fam_b'), 0, 'A cannot read B memories');
select t.eq((select count(*) from public.reminders where family_id = :'fam_b'), 0, 'A cannot read B reminders');
select t.denied(format($q$insert into public.children (family_id, name, date_of_birth) values (%L, 'Intruder', '2026-01-01')$q$, :'fam_b'), 'A cannot add a child to B');
select t.denied(format($q$insert into public.memories (family_id, kind, content) values (%L, 'general', 'x')$q$, :'fam_b'), 'A cannot write a memory into B');
select t.denied(format($q$insert into public.reminders (family_id, title, due_at) values (%L, 'x', now())$q$, :'fam_b'), 'A cannot write a reminder into B');
select t.denied(format($q$insert into public.appointments (family_id, title, starts_at) values (%L, 'x', now())$q$, :'fam_b'), 'A cannot write an appointment into B');
select t.affects(format($q$update public.children set name = 'Hacked' where id = %L$q$, :'child_b'), 0, 'A cannot update B child');
select t.affects(format($q$delete from public.children where id = %L$q$, :'child_b'), 0, 'A cannot delete B child');
select t.affects(format($q$update public.memories set content = 'Hacked' where id = %L$q$, :'mem_b'), 0, 'A cannot update B memory');
select t.affects(format($q$delete from public.memories where id = %L$q$, :'mem_b'), 0, 'A cannot delete B memory');
select t.affects(format($q$update public.families set name = 'Hacked' where id = %L$q$, :'fam_b'), 0, 'A cannot rename B family');
select t.denied(format($q$insert into public.caregivers (family_id, user_id, display_name, role) values (%L, '00000000-0000-0000-0000-00000000000a', 'Alice', 'owner')$q$, :'fam_b'), 'A cannot add itself to family B');
-- cross-family references (migration 0002 hardening)
select t.denied(format($q$insert into public.memories (family_id, child_id, kind, content) values (%L, %L, 'general', 'x')$q$, :'fam_a', :'child_b'), 'A cannot attach a memory to B child');
select t.denied(format($q$insert into public.reminders (family_id, child_id, title, due_at) values (%L, %L, 'x', now())$q$, :'fam_a', :'child_b'), 'A cannot attach a reminder to B child');
select t.denied(format($q$insert into public.appointments (family_id, child_id, title, starts_at) values (%L, %L, 'x', now())$q$, :'fam_a', :'child_b'), 'A cannot attach an appointment to B child');
-- A's own edit/complete/delete works
select t.affects(format($q$update public.reminders set completed_at = now() where id = %L$q$, :'rem_a'), 1, 'A can complete its own reminder');
select t.affects(format($q$delete from public.reminders where id = %L$q$, :'rem_a'), 1, 'A can delete its own reminder');

\echo == Family B user
select t.login('00000000-0000-0000-0000-00000000000b');
select t.eq((select count(*) from public.children), 1, 'B sees exactly its own child');
select t.eq((select count(*) from public.memories where id = :'mem_a'), 0, 'B cannot read A memory');
select t.eq((select count(*) from public.appointments), 0, 'B cannot read A appointments');
select t.affects(format($q$update public.memories set content = 'Hacked' where id = %L$q$, :'mem_a'), 0, 'B cannot update A memory');
select t.affects(format($q$update public.appointments set title = 'Hacked' where id = %L$q$, :'appt_a'), 0, 'B cannot update A appointment');
select t.affects(format($q$delete from public.appointments where id = %L$q$, :'appt_a'), 0, 'B cannot delete A appointment');

\echo == User with no family
select t.login('00000000-0000-0000-0000-00000000000c');
select t.eq((select count(*) from public.families), 0, 'C sees no families');
select t.eq((select count(*) from public.children), 0, 'C sees no children');
select t.eq((select count(*) from public.memories), 0, 'C sees no memories');
select t.denied(format($q$insert into public.families (name) values ('direct insert')$q$), 'C cannot insert a family directly (must use onboard_family)');
select t.denied(format($q$insert into public.caregivers (family_id, user_id, display_name, role, can_edit, can_manage_family) values (%L, '00000000-0000-0000-0000-00000000000c', 'Cara', 'owner', true, true)$q$, :'fam_a'), 'C cannot join family A by inserting a caregiver row');

\echo == Viewer caregiver (read-only)
select t.login('00000000-0000-0000-0000-00000000000d');
select t.eq((select count(*) from public.children), 2, 'Viewer can read family A children');
select t.denied(format($q$insert into public.memories (family_id, kind, content) values (%L, 'general', 'x')$q$, :'fam_a'), 'Viewer cannot write memories');
select t.affects(format($q$update public.children set name = 'X' where family_id = %L$q$, :'fam_a'), 0, 'Viewer cannot update children');
select t.affects(format($q$delete from public.reminders where family_id = %L$q$, :'fam_a'), 0, 'Viewer cannot delete reminders');

\echo == Signed out (anon role)
reset role;
set role anon;
select set_config('request.jwt.claim.sub', '', false);
select t.eq((select count(*) from public.children), 0, 'Anon sees no children');
select t.eq((select count(*) from public.memories), 0, 'Anon sees no memories');
select t.denied($q$select public.onboard_family('Eve', 'Baby', '2026-01-01')$q$, 'Anon cannot call onboard_family');
select t.denied($q$insert into public.memories (family_id, kind, content) values (gen_random_uuid(), 'general', 'x')$q$, 'Anon cannot write');

\echo == onboard_family
reset role;
select t.login('00000000-0000-0000-0000-00000000000a');
select public.onboard_family('Alice', 'Another', '2026-02-02') = :'fam_a'::uuid as same_family \gset
select t.eq(case when :'same_family' then 1 else 0 end, 1, 'onboarding again returns the existing family');
select t.eq((select count(*) from public.children where name = 'Another'), 0, 'onboarding again creates nothing new');
select t.login('00000000-0000-0000-0000-00000000000c');
select t.denied($q$select public.onboard_family('Cara', 'Future', (current_date + 10))$q$, 'future date of birth rejected');
select t.denied($q$select public.onboard_family('   ', 'Baby', '2026-01-01')$q$, 'blank caregiver name rejected');
select t.eq((select count(*) from public.families), 0, 'failed onboarding leaves nothing behind (atomic)');
select public.onboard_family('Cara', 'Baby', '2026-01-01') as fam_c \gset
select t.eq((select count(*) from public.children where family_id = :'fam_c'), 1, 'C onboarding creates family + caregiver + child together');

reset role;
\echo ALL RLS TESTS PASSED
