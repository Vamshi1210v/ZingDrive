-- RPC: Cancel Booking Transaction
-- Handles atomic cancellation of bookings.
create or replace function public.cancel_booking_transaction(
  p_booking_id uuid,
  p_driver_id uuid,
  p_reason text
)
returns json
language plpgsql
security definer
as $$
declare
  v_booking public.bookings%rowtype;
begin
  -- 1. Lock booking
  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'Booking not found';
  end if;

  -- 2. Authorization
  if v_booking.assigned_driver_id <> p_driver_id then
    raise exception 'Unauthorized cancellation';
  end if;

  -- 3. State validation
  if v_booking.status = 'started' then
    raise exception 'Cannot cancel started booking';
  end if;

  if v_booking.status <> 'accepted' then
    raise exception 'Booking not cancellable';
  end if;

  -- 4. Return booking to pool
  update public.bookings
  set
    status = 'open',
    assigned_driver_id = null,
    assigned_vehicle_id = null,
    accepted_at = null
  where id = p_booking_id;

  -- OPTIONAL: Penalty logic (commented for now)
  /*
  update public.subscriptions
  set remaining_credits = greatest(remaining_credits - 1, 0)
  where driver_id = p_driver_id;
  */

  -- 5. Audit
  insert into public.audit_logs (
    actor_id, action, target_table, target_id, metadata
  ) values (
    p_driver_id,
    'cancel_booking',
    'bookings',
    p_booking_id,
    jsonb_build_object('reason', p_reason)
  );

  return json_build_object('success', true);
end;
$$;
