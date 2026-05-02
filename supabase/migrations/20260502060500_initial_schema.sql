-- Encore OS Database Migration

create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  inputs_json jsonb not null,
  results_json jsonb not null,
  share_token text unique not null,
  created_at timestamptz default now()
);

create index if not exists idx_assessments_share_token on assessments(share_token);
create index if not exists idx_assessments_user_id on assessments(user_id);

create table if not exists email_captures (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  assessment_id uuid references assessments(id),
  created_at timestamptz default now()
);

create index if not exists idx_email_captures_email on email_captures(email);

-- Enable Row Level Security
alter table assessments enable row level security;
alter table email_captures enable row level security;

-- All reads/writes are handled by Next.js API routes using the service role.
-- Keep direct anonymous access closed so private assessment inputs and paid
-- recommendations cannot be queried or updated from the browser.
drop policy if exists "Allow anonymous insert" on assessments;
drop policy if exists "Allow read by share token" on assessments;
drop policy if exists "Allow email capture insert" on email_captures;
drop policy if exists "Allow update assessments" on assessments;

-- Payment columns
alter table assessments add column if not exists paid boolean default false;
alter table assessments add column if not exists stripe_session_id text;
alter table assessments add column if not exists paid_at timestamptz;
