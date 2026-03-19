-- Run this in your Supabase SQL editor

-- User profiles table
create table if not exists public.user_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id text unique not null,
  plan text default 'free' check (plan in ('free', 'pro', 'teams')),
  compressions_today integer default 0,
  total_compressions integer default 0,
  total_tokens_saved integer default 0,
  total_cost_saved numeric(10,6) default 0,
  last_reset_date date default current_date,
  created_at timestamptz default now()
);

-- Compression history table
create table if not exists public.compressions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  original_text text not null,
  compressed_text text not null,
  original_tokens integer not null,
  compressed_tokens integer not null,
  saved_pct integer not null,
  mode text not null check (mode in ('balanced', 'aggressive', 'smart')),
  model text not null,
  cost_saved numeric(10,6) default 0,
  created_at timestamptz default now()
);

-- Indexes for fast queries
create index if not exists compressions_user_id_idx on public.compressions(user_id);
create index if not exists compressions_created_at_idx on public.compressions(created_at desc);
create index if not exists user_profiles_user_id_idx on public.user_profiles(user_id);

-- Disable RLS for now (we'll use Clerk user_id to filter)
alter table public.user_profiles disable row level security;
alter table public.compressions disable row level security;

-- ── Run this migration to fix the race condition in stat updates ──
-- Atomic increment function — avoids read-then-write race condition
create or replace function public.increment_user_stats(
  p_user_id text,
  p_tokens_saved integer,
  p_cost_saved numeric
)
returns void
language sql
as $$
  update public.user_profiles
  set
    total_tokens_saved = total_tokens_saved + p_tokens_saved,
    total_cost_saved = total_cost_saved + p_cost_saved
  where user_id = p_user_id;
$$;