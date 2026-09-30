-- 0002: atomic onboarding + cross-family reference hardening.
-- Additive to 0001; nothing in 0001's RLS policies is weakened or replaced.

-- ---------------------------------------------------------------------------
-- 1. A row may only reference a child of ITS OWN family.
--    0001 checked family_id via RLS but child_id was a plain FK, so a caller
--    could attach their memory/reminder/appointment to another family's child
--    (and probe which child ids exist). Composite FKs close that.
-- ---------------------------------------------------------------------------

alter table public.children add constraint children_id_family_key unique (id, family_id);

alter table public.appointments drop constraint appointments_child_id_fkey;
alter table public.appointments add constraint appointments_child_same_family_fkey
  foreign key (child_id, family_id) references public.children (id, family_id) on delete set null (child_id);

alter table public.memories drop constraint memories_child_id_fkey;
alter table public.memories add constraint memories_child_same_family_fkey
  foreign key (child_id, family_id) references public.children (id, family_id) on delete set null (child_id);

alter table public.reminders drop constraint reminders_child_id_fkey;
alter table public.reminders add constraint reminders_child_same_family_fkey
  foreign key (child_id, family_id) references public.children (id, family_id) on delete set null (child_id);

-- ---------------------------------------------------------------------------
-- 2. Onboarding in ONE transaction: family + owner caregiver + first child.
--    Two separate client calls could leave a family with no child (and a retry
--    would create a second family). Idempotent: a user who already belongs to a
--    family gets that family back and nothing new is created.
-- ---------------------------------------------------------------------------

create function public.onboard_family(my_display_name text, child_name text, child_date_of_birth date)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  fid uuid;
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '28000';
  end if;

  -- Serialise concurrent calls (double taps, retries) for the same user.
  perform pg_advisory_xact_lock(hashtext(uid::text));

  select c.family_id into fid from public.caregivers c where c.user_id = uid order by c.created_at limit 1;
  if fid is not null then
    return fid;
  end if;

  if child_date_of_birth > current_date then
    raise exception 'date of birth cannot be in the future' using errcode = '22023';
  end if;

  insert into public.families (name) values (left(btrim(my_display_name), 50) || '''s family') returning id into fid;
  insert into public.caregivers (family_id, user_id, display_name, role, can_edit, can_manage_family)
    values (fid, uid, btrim(my_display_name), 'owner', true, true);
  insert into public.children (family_id, name, date_of_birth)
    values (fid, btrim(child_name), child_date_of_birth);

  return fid;
end $$;

revoke all on function public.onboard_family(text, text, date) from public, anon;
grant execute on function public.onboard_family(text, text, date) to authenticated;
