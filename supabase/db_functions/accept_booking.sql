-- RPC: Accept Booking Transaction (Exception Mode)
-- Replaces previous JSON-returning version to support semantic error codes in Edge Function.
create or replace function public.accept_booking_transaction(
  p_booking_id uuid,
  p_driver_id uuid,
  p_vehicle_id uuid
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_booking public.bookings%rowtype;
  v_sub public.subscriptions%rowtype;
  v_credits_deduction int := 1;
begin
  -- 1. Lock the booking row
  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  if v_booking.status <> 'open' then
    -- Matches TS check: error.message.includes("already accepted")
    raise exception 'Booking already accepted';
  end if;

  -- 2. Check Subscription
  select * into v_sub
  from public.subscriptions
  where driver_id = p_driver_id
  limit 1;

  if not found or v_sub.status <> 'active' then
    -- Matches TS check: error.message.includes("not eligible")
    raise exception 'Driver not eligible: Subscription inactive';
  end if;

  if v_sub.remaining_credits < v_credits_deduction then
    raise exception 'Driver not eligible: Insufficient credits';
  end if;
  
  -- 3. Check Vehicle
  perform 1 from public.vehicles 
  where id = p_vehicle_id and driver_id = p_driver_id and status = 'verified';
  
  if not found then
    raise exception 'Driver not eligible: Invalid vehicle';
  end if;

  -- 4. Execute Updates
  update public.subscriptions
  set remaining_credits = remaining_credits - v_credits_deduction
  where id = v_sub.id;

  update public.bookings
  set 
    status = 'accepted',
    assigned_driver_id = p_driver_id,
    assigned_vehicle_id = p_vehicle_id,
    accepted_at = now()
  where id = p_booking_id;

  -- 5. Audit
  insert into public.audit_logs (actor_id, action, target_table, target_id, metadata)
  values (
    p_driver_id, 
    'accept_booking', 
    'bookings', 
    p_booking_id, 
    jsonb_build_object('vehicle_id', p_vehicle_id, 'cost', v_credits_deduction)
  );

  return jsonb_build_object('success', true);
end;
$$;
