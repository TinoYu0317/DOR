-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text,
  created_at timestamptz default now()
);

-- Table: sessions
create table sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  device_id text,
  is_archived boolean default false
);

-- Table: items
create table items (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references sessions(id) not null,
  user_id uuid references auth.users not null,
  source_type text check (source_type in ('text', 'voice', 'file', 'image')),
  raw_text text,
  raw_url text,
  created_at timestamptz default now()
);

-- Table: nodes
create table nodes (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references sessions(id) not null,
  user_id uuid references auth.users not null,
  title text,
  gist text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: sync_log
create table sync_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  entity text,
  entity_id uuid,
  op text,
  client_ts timestamptz,
  server_ts timestamptz default now()
);

-- Indexes
create index sessions_user_id_updated_at_idx on sessions (user_id, updated_at desc);
create index items_session_id_created_at_idx on items (session_id, created_at);
create index nodes_session_id_updated_at_idx on nodes (session_id, updated_at);

-- RLS
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table items enable row level security;
alter table nodes enable row level security;
alter table sync_log enable row level security;

-- Policies
create policy "Users can only access their own profiles" on profiles
  for all using (auth.uid() = id);

create policy "Users can only access their own sessions" on sessions
  for all using (auth.uid() = user_id);

create policy "Users can only access their own items" on items
  for all using (auth.uid() = user_id);

create policy "Users can only access their own nodes" on nodes
  for all using (auth.uid() = user_id);

create policy "Users can only access their own sync_log" on sync_log
  for all using (auth.uid() = user_id);

-- Setup new user profile trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
