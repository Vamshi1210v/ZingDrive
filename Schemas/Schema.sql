-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- 1. PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text default 'driver' check (role in ('admin', 'driver')) not null,
  full_name text,
  phone text,
  dob date,
  gender text,
  disabilities text,
  department text,
  rating numeric(3,2) default 5.00, -- Fixed precision
  is_verified boolean default false,
  verification_status text default 'new' check (verification_status in ('new', 'pending', 'verified', 'rejected')),
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;
-- FIX 1: Split Profile Visibility
create policy "Users view own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Admins view all profiles" on public.profiles for select
using ( exists ( select 1 from public.profiles where id = auth.uid() and role = 'admin' ) );
create policy "Users insert own profile" on public.profiles for insert with check ( auth.uid() = id );
-- FIX 2: Drivers update safe fields only (Implemented via Trigger for column safety)
create policy "Users update own profile" on public.profiles for update using ( auth.uid() = id );
-- Trigger to protect sensitive columns on Profile
create or replace function public.handle_profile_update() 
returns trigger as $$
begin
  if (auth.uid() = new.id) and (old.role = 'driver') then
    -- Driver attempting to change sensitive fields
    if (new.role <> old.role) or (new.is_verified <> old.is_verified) or (new.rating <> old.rating) or (new.verification_status <> old.verification_status) then
      raise exception 'Drivers cannot change sensitive status fields.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;
create trigger on_profile_update
  before update on public.profiles
  for each row execute procedure public.handle_profile_update();
-- 2. DRIVER DOCUMENTS (KYC)
create table public.driver_documents (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles(id) on delete cascade not null,
  pan_number text,
  aadhaar_number text,
  driving_license_number text,
  pan_image_url text,
  aadhaar_image_url text,
  license_image_url text,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references public.profiles(id),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.driver_documents enable row level security;
create policy "Drivers see own documents" on public.driver_documents for select using ( auth.uid() = driver_id );
create policy "Drivers upload own documents" on public.driver_documents for insert with check ( auth.uid() = driver_id );
create policy "Admins manage documents" on public.driver_documents for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- 3. VEHICLES
create table public.vehicles (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles(id) on delete cascade not null,
  vehicle_type text check (vehicle_type in ('SUV', 'Sedan', 'Hatchback', 'Mini Bus', 'Bus', 'Heavy')),
  seats int,
  model_no text,
  rc_number text,
  rc_image_url text,
  vehicle_image_url text,
  pet_allowed boolean default false,
  fuel_type text,
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.vehicles enable row level security;
-- FIX 3: Split Vehicle Policies
create policy "Drivers select own vehicles" on public.vehicles for select using ( auth.uid() = driver_id );
create policy "Drivers insert own vehicles" on public.vehicles for insert with check ( auth.uid() = driver_id );
create policy "Drivers update own vehicles" on public.vehicles for update using ( auth.uid() = driver_id );
-- Admins verify
create policy "Admins verify vehicles" on public.vehicles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- Trigger to protect Vehicle Status from Driver updates
create or replace function public.handle_vehicle_update() 
returns trigger as $$
begin
  -- Check if user is NOT admin (assuming admin role check logic or relying on RLS context if passed)
  -- Safer: Check if the user trying to update status is the owner (Driver)
  if (auth.uid() = new.driver_id) then
     if (new.status <> old.status) then
        raise exception 'Drivers cannot verify their own vehicles.';
     end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;
create trigger on_vehicle_update
  before update on public.vehicles
  for each row execute procedure public.handle_vehicle_update();
-- 4. SUBSCRIPTIONS & CREDITS
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles(id) on delete cascade not null,
  total_credits int default 0,
  remaining_credits int default 0,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  status text default 'inactive' check (status in ('active', 'inactive', 'expired')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.subscriptions enable row level security;
create policy "Drivers view own subscription" on public.subscriptions for select using ( auth.uid() = driver_id );
create policy "Admins manage subscriptions" on public.subscriptions for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- 5. PAYMENT REQUESTS
create table public.payment_requests (
  id uuid default uuid_generate_v4() primary key,
  driver_id uuid references public.profiles(id) not null,
  transaction_id text,
  payment_mode text,
  amount numeric(10,2), -- Fixed precision
  screenshot_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.payment_requests enable row level security;
create policy "Drivers view own payments" on public.payment_requests for select using ( auth.uid() = driver_id );
create policy "Drivers create payments" on public.payment_requests for insert with check ( auth.uid() = driver_id );
create policy "Admins manage payments" on public.payment_requests for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- 6. BOOKINGS
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  pickup_address text not null,
  drop_address text not null,
  pickup_lat float,
  pickup_lng float,
  drop_lat float,
  drop_lng float,
  vehicle_type_required text,
  seats_required int,
  fare_estimate numeric(10,2), -- Fixed precision
  customer_name text,
  customer_phone text,
  
  -- Assignment
  assigned_driver_id uuid references public.profiles(id),
  assigned_vehicle_id uuid references public.vehicles(id),
  accepted_at timestamp with time zone,
  
  status text default 'open' check (status in ('open', 'accepted', 'started', 'completed', 'cancelled')),
  notification_sent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.bookings enable row level security;
-- FIX 4: NO Driver Update Policy for Bookings (Enforces Edge Function)
-- Only Select policies for drivers
create policy "Qualified drivers see open bookings" on public.bookings for select
using (
  status = 'open' 
  AND exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() 
    and profiles.is_verified = true
  )
  AND exists (
    select 1 from public.subscriptions
    where subscriptions.driver_id = auth.uid()
    and subscriptions.status = 'active'
    and subscriptions.remaining_credits > 0
  )
);
create policy "Drivers see assigned bookings" on public.bookings for select using ( assigned_driver_id = auth.uid() );
-- Admins manage all
create policy "Admins manage bookings" on public.bookings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- 7. AUDIT LOGS (NEW)
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references public.profiles(id),
  action text,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.audit_logs enable row level security;
create policy "Admins view audit logs" on public.audit_logs for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
-- Allow inserts from triggers/functions might require 'security definer' functions or specific policies
-- For simplicity, assuming Edge Functions/Admins write to this.
-- 8. INDEXES (Performance)
create index idx_bookings_status_created on public.bookings(status, created_at);
create index idx_vehicles_driver on public.vehicles(driver_id);
create index idx_bookings_assigned_driver on public.bookings(assigned_driver_id);
create index idx_subscriptions_driver_status on public.subscriptions(driver_id, status);
create index idx_driver_docs_driver on public.driver_documents(driver_id);
create index idx_payment_requests_driver on public.payment_requests(driver_id);
-- 9. NOTIFICATIONS & CONFIG
create table public.device_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  token text not null,
  platform text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.device_tokens enable row level security;
create policy "Users manage own tokens" on public.device_tokens for all using ( auth.uid() = user_id );
create table public.ui_config (
  id uuid default uuid_generate_v4() primary key,
  theme jsonb,
  features jsonb,
  assets jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.ui_config enable row level security;
create policy "Public read config" on public.ui_config for select using ( true );
create policy "Admins manage config" on public.ui_config for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);