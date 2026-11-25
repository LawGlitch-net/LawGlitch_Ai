-- ============================================================
-- Fix: profiles_plan_check constraint & convert plan to ENUM
-- Run this in your Supabase SQL Editor (or run profiles_setup.sql).
-- ============================================================

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

alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  alter column plan drop default;

update public.profiles
set plan = 'free'
where plan::text not in ('free', 'beta', 'pro', 'suspended');

alter table public.profiles
  alter column plan type public.profile_plan
  using (plan::text::public.profile_plan);

alter table public.profiles
  alter column plan set default 'free'::public.profile_plan,
  alter column account_active set default false,
  alter column credits_remaining set default 0;

update public.profiles
set
  plan              = 'pro'::public.profile_plan,
  account_active    = true,
  credits_remaining = greatest(credits_remaining, 1000)
where email in ('lawglitch@gmail.com', 'lawglitchofficial@gmail.com');

select id, email, plan, account_active, credits_remaining
from public.profiles;
