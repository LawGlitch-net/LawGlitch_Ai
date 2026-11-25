-- ============================================================
-- LawGlitch — Profiles Table: Fresh Setup & Security Policies
-- Run ALL of this in Supabase SQL Editor in one go.
-- Safe to run on a fresh database or re-run on an existing one.
-- ============================================================

-- ── Step 1: Create ENUM type for plan (multiple-choice dropdown in Supabase UI)
do $$
begin
  if not exists (
    select 1 from pg_type
    where typname = 'profile_plan'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.profile_plan as enum ('free', 'beta', 'pro', 'suspended');
  end if;
end $$;

-- ── Step 2: Create the profiles table ────────────────────────────────────────
create table if not exists public.profiles (
  id uuid not null,
  email text not null,
  display_name text null,

  -- Legal acceptance
  terms_accepted boolean not null default false,
  terms_accepted_at timestamp with time zone null,
  terms_version text null,

  -- Optional marketing consent (independent of terms)
  marketing_consent boolean not null default false,
  marketing_consent_at timestamp with time zone null,

  -- Account access control (single source of truth)
  account_active boolean not null default false,
  plan public.profile_plan not null default 'free'::public.profile_plan,

  -- Credits: n8n decrements credits_remaining; credits_used is lifetime total used
  credits_remaining integer not null default 0,
  credits_used integer not null default 0,

  -- Gateway credentials
  gateway_key_hash text null,
  gateway_key_active boolean not null default false,

  -- Timestamps
  created_at timestamp with time zone not null default now(),
  last_used_at timestamp with time zone null,

  constraint profiles_pkey primary key (id),

  constraint profiles_id_fkey
    foreign key (id)
    references auth.users (id)
    on delete cascade,

  constraint profiles_credits_remaining_check
    check (credits_remaining >= 0),

  constraint profiles_credits_used_check
    check (credits_used >= 0)
);

-- ── Step 3: Indexes for fast gateway & dashboard lookups ─────────────────────
create index if not exists idx_profiles_email
  on public.profiles using btree (email);

create index if not exists idx_profiles_gateway_key
  on public.profiles using btree (gateway_key_hash)
  where gateway_key_active = true;

-- ── Step 4: Row Level Security (RLS) ─────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- No UPDATE policy for ordinary users — all writes go through the Edge Function
-- using the secret/service-role key, preventing client-side tampering.

-- ── Verification: inspect table structure / rows ─────────────────────────────
select id, email, plan, account_active, credits_remaining, terms_accepted, terms_version
from public.profiles;
