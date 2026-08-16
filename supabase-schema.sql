-- Run this in your Supabase project's SQL Editor (one time setup)

-- Profiles: one row per user, created automatically on signup
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz default now()
);

-- Rooms: chat rooms/channels (e.g. "General", "Homework Help")
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.rooms(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- Auto-create a profile row when someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed a default "General" room
insert into public.rooms (name) values ('General')
on conflict do nothing;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.messages enable row level security;

-- Any logged-in user can read all profiles/rooms/messages (adjust later if you add private rooms)
create policy "Logged-in users can view profiles" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Logged-in users can view rooms" on public.rooms
  for select using (auth.role() = 'authenticated');

create policy "Logged-in users can view messages" on public.messages
  for select using (auth.role() = 'authenticated');

create policy "Logged-in users can send messages" on public.messages
  for insert with check (auth.uid() = user_id);

-- Enable realtime on messages
alter publication supabase_realtime add table public.messages;
