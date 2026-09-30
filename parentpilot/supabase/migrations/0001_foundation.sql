-- ParentPilot foundation schema.
-- Everything hangs off a family. Row-level security (RLS) is enabled on every
-- table: a user can only see rows belonging to families they are a caregiver in.
-- The AI never gets a database connection; it only calls typed tools that use
-- these same RLS-protected tables on behalf of the signed-in user.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- family --

create table public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  created_at timestamptz not null default now()
);

create table public.caregivers (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null, -- null until an invited caregiver signs up
  display_name text not null check (char_length(display_name) between 1 and 60),
  role text not null check (role in ('owner', 'parent', 'carer', 'viewer')),
  can_edit boolean not null default false,
  can_manage_family boolean not null default false,
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);
create index caregivers_user_idx on public.caregivers (user_id);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  date_of_birth date not null,
  important_notes text[] not null default '{}',
  feeding jsonb, -- { method?, notes? }
  sleep jsonb,   -- { notes? }
  created_at timestamptz not null default now()
);
create index children_family_idx on public.children (family_id);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  title text not null check (char_length(title) between 1 and 140),
  starts_at timestamptz not null,
  location text,
  notes text,
  created_at timestamptz not null default now()
);
create index appointments_family_starts_idx on public.appointments (family_id, starts_at);

-- ---------------------------------------------------------------- memory --
-- One atomic, typed fact per row (not a giant text blob).

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  kind text not null check (kind in ('preference', 'contact', 'child_note', 'medical_guidance', 'question', 'general')),
  content text not null check (char_length(content) between 1 and 2000),
  tags text[] not null default '{}',
  source text not null default 'parent' check (source in ('parent', 'assistant_confirmed')),
  created_at timestamptz not null default now()
);
create index memories_family_idx on public.memories (family_id, created_at desc);
-- Full-text search over content; tags are matched with the array operators (tags && array[...]).
create index memories_search_idx on public.memories using gin (to_tsvector('english', content));
create index memories_tags_idx on public.memories using gin (tags);

-- ------------------------------------------------------------- reminders --

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid references public.children (id) on delete set null,
  title text not null check (char_length(title) between 1 and 140),
  description text check (char_length(description) <= 1000),
  due_at timestamptz not null,
  recurrence jsonb, -- { frequency: daily|weekly|monthly, interval, until? }
  completed_at timestamptz,
  -- Written ONLY by the notification system after it really scheduled/sent one.
  notification_scheduled_at timestamptz,
  created_at timestamptz not null default now()
);
create index reminders_family_due_idx on public.reminders (family_id, due_at) where completed_at is null;

-- ------------------------------------------------------------- community --
-- Data model only for now. Display names only; no real names or emails exposed.

create table public.community_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  display_name text not null unique check (char_length(display_name) between 2 and 30)
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_profile_id uuid not null references public.community_profiles (id) on delete cascade,
  topic text not null,
  title text not null check (char_length(title) between 1 and 140),
  body text not null check (char_length(body) between 1 and 5000),
  status text not null default 'visible' check (status in ('visible', 'hidden_by_moderation')),
  created_at timestamptz not null default now()
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts (id) on delete cascade,
  author_profile_id uuid not null references public.community_profiles (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table public.community_saved_posts (
  profile_id uuid not null references public.community_profiles (id) on delete cascade,
  post_id uuid not null references public.community_posts (id) on delete cascade,
  primary key (profile_id, post_id)
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_profile_id uuid not null references public.community_profiles (id) on delete cascade,
  post_id uuid references public.community_posts (id) on delete cascade,
  comment_id uuid references public.community_comments (id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 500),
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);

create table public.community_blocks (
  blocker_profile_id uuid not null references public.community_profiles (id) on delete cascade,
  blocked_profile_id uuid not null references public.community_profiles (id) on delete cascade,
  primary key (blocker_profile_id, blocked_profile_id),
  check (blocker_profile_id <> blocked_profile_id)
);

-- ------------------------------------------------------- access helpers --
-- SECURITY DEFINER so policies can consult caregivers without recursing into its own RLS.

create function public.is_family_member(fid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.caregivers c where c.family_id = fid and c.user_id = auth.uid());
$$;

create function public.can_edit_family(fid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.caregivers c
                 where c.family_id = fid and c.user_id = auth.uid() and (c.can_edit or c.can_manage_family));
$$;

create function public.can_manage_family(fid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.caregivers c
                 where c.family_id = fid and c.user_id = auth.uid() and c.can_manage_family);
$$;

create function public.my_community_profile_id() returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.community_profiles where user_id = auth.uid();
$$;

-- Creates a family and makes the caller its owner in one atomic step.
create function public.create_family(family_name text, my_display_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare fid uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into public.families (name) values (family_name) returning id into fid;
  insert into public.caregivers (family_id, user_id, display_name, role, can_edit, can_manage_family)
  values (fid, auth.uid(), my_display_name, 'owner', true, true);
  return fid;
end $$;

revoke all on function public.create_family(text, text) from public, anon;
grant execute on function public.create_family(text, text) to authenticated;

-- ------------------------------------------------------------------ RLS --

alter table public.families enable row level security;
alter table public.caregivers enable row level security;
alter table public.children enable row level security;
alter table public.appointments enable row level security;
alter table public.memories enable row level security;
alter table public.reminders enable row level security;
alter table public.community_profiles enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_saved_posts enable row level security;
alter table public.community_reports enable row level security;
alter table public.community_blocks enable row level security;

create policy families_select on public.families for select to authenticated using (public.is_family_member(id));
create policy families_update on public.families for update to authenticated
  using (public.can_manage_family(id)) with check (public.can_manage_family(id));

create policy caregivers_select on public.caregivers for select to authenticated using (public.is_family_member(family_id));
create policy caregivers_manage on public.caregivers for all to authenticated
  using (public.can_manage_family(family_id)) with check (public.can_manage_family(family_id));

-- Family data tables share one pattern: members read, editors write.
create policy children_select on public.children for select to authenticated using (public.is_family_member(family_id));
create policy children_write on public.children for all to authenticated
  using (public.can_edit_family(family_id)) with check (public.can_edit_family(family_id));

create policy appointments_select on public.appointments for select to authenticated using (public.is_family_member(family_id));
create policy appointments_write on public.appointments for all to authenticated
  using (public.can_edit_family(family_id)) with check (public.can_edit_family(family_id));

create policy memories_select on public.memories for select to authenticated using (public.is_family_member(family_id));
create policy memories_write on public.memories for all to authenticated
  using (public.can_edit_family(family_id)) with check (public.can_edit_family(family_id));

create policy reminders_select on public.reminders for select to authenticated using (public.is_family_member(family_id));
create policy reminders_write on public.reminders for all to authenticated
  using (public.can_edit_family(family_id)) with check (public.can_edit_family(family_id));

-- Community: minimal, safe defaults. TODO(stage: community): blocked-user filtering, moderation, rate limits.
create policy cprofiles_select on public.community_profiles for select to authenticated using (true);
create policy cprofiles_insert on public.community_profiles for insert to authenticated with check (user_id = auth.uid());
create policy cprofiles_update on public.community_profiles for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy cposts_select on public.community_posts for select to authenticated using (status = 'visible');
create policy cposts_insert on public.community_posts for insert to authenticated
  with check (author_profile_id = public.my_community_profile_id());
create policy cposts_delete on public.community_posts for delete to authenticated
  using (author_profile_id = public.my_community_profile_id());

create policy ccomments_select on public.community_comments for select to authenticated using (true);
create policy ccomments_insert on public.community_comments for insert to authenticated
  with check (author_profile_id = public.my_community_profile_id());
create policy ccomments_delete on public.community_comments for delete to authenticated
  using (author_profile_id = public.my_community_profile_id());

create policy csaved_own on public.community_saved_posts for all to authenticated
  using (profile_id = public.my_community_profile_id()) with check (profile_id = public.my_community_profile_id());

create policy creports_insert on public.community_reports for insert to authenticated
  with check (reporter_profile_id = public.my_community_profile_id());

create policy cblocks_own on public.community_blocks for all to authenticated
  using (blocker_profile_id = public.my_community_profile_id())
  with check (blocker_profile_id = public.my_community_profile_id());
