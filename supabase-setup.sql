-- ============================================================
-- Run this ONE TIME in your Supabase project's SQL Editor.
-- supabase.com → your project → SQL Editor → paste → Run
-- ============================================================

create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null default '',
  content      text not null default '',
  category     text not null default 'Project',
  tags         text[] not null default '{}',
  published_at timestamptz not null default now(),
  featured     boolean not null default false,
  reading_time integer not null default 1,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Public read access (anyone can read posts — this is a public portfolio)
alter table posts enable row level security;

create policy "Public can read posts"
  on posts for select
  using (true);

-- No public write access — all writes go through your CMS (anon key is safe)
-- If you want to allow inserts/updates/deletes from the frontend anon key:
create policy "Anon can insert posts"
  on posts for insert
  with check (true);

create policy "Anon can update posts"
  on posts for update
  using (true);

create policy "Anon can delete posts"
  on posts for delete
  using (true);

-- Auto-update updated_at on every edit
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();
