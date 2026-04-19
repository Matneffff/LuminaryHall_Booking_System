-- Luminary Hall — Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  event_type text not null,
  guest_count integer not null,
  date date not null,
  time_slot text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.bookings enable row level security;

-- Public can insert bookings
create policy "Anyone can create a booking"
  on public.bookings for insert
  with check (true);

-- Public can read their own booking by id (for confirmation page)
create policy "Anyone can read bookings"
  on public.bookings for select
  using (true);

-- Only authenticated users (admin) can update bookings
create policy "Authenticated users can update bookings"
  on public.bookings for update
  using (auth.role() = 'authenticated');
