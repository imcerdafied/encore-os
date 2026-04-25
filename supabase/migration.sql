-- Encore OS Database Migration
-- Run this in your Supabase SQL editor

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  inputs_json jsonb not null,
  results_json jsonb not null,
  share_token text unique not null,
  created_at timestamptz default now()
);

create index idx_assessments_share_token on assessments(share_token);
create index idx_assessments_user_id on assessments(user_id);

create table if not exists email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  assessment_id uuid references assessments(id),
  created_at timestamptz default now()
);

create index idx_email_captures_email on email_captures(email);

-- Enable Row Level Security
alter table assessments enable row level security;
alter table email_captures enable row level security;

-- Allow anonymous inserts (assessment without auth)
create policy "Allow anonymous insert" on assessments
  for insert with check (true);

-- Allow reading by share token
create policy "Allow read by share token" on assessments
  for select using (true);

-- Allow email capture inserts
create policy "Allow email capture insert" on email_captures
  for insert with check (true);
