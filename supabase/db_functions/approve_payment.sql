-- RPC: Approve Payment Transaction (Fixed)
-- Handles atomic approval of payment requests and subscription updates.
create or replace function public.approve_payment_transaction(
  p_payment_request_id uuid,
  p_admin_id uuid,
  p_credits int
)
returns json
language plpgsql
security definer
as $$
declare
  v_payment public.payment_requests%rowtype;
  v_sub public.subscriptions%rowtype;
  v_has_sub boolean := false;
  v_start timestamp;
  v_end timestamp;
begin
  -- 1. Lock payment request to prevent double processing
  select * into v_payment
  from public.payment_requests
  where id = p_payment_request_id
  for update;

  if not found then
    raise exception 'Payment request not found';
  end if;

  if v_payment.status <> 'pending' then
    raise exception 'Payment already processed';
  end if;

  -- 2. Lock or get subscription
  select * into v_sub
  from public.subscriptions
  where driver_id = v_payment.driver_id
  for update;

  v_has_sub := found; -- Capture 'found' status immediately

  -- 3. Calculate Dates
  -- If sub exists and is valid in future, add 30 days to existing end_date. 
  -- If expired or new, add 30 days to NOW.
  v_start := now();
  v_end := (case
    when v_has_sub and v_sub.end_date > now() then v_sub.end_date
    else now()
  end) + interval '30 days';

  -- 4. Upsert Subscription
  if not v_has_sub then
    insert into public.subscriptions (
      driver_id, status, total_credits, remaining_credits, start_date, end_date
    ) values (
      v_payment.driver_id, 'active', p_credits, p_credits, now(), v_end
    );
  else
    update public.subscriptions
    set
      total_credits = total_credits + p_credits,
      remaining_credits = remaining_credits + p_credits,
      status = 'active',
      end_date = v_end
    where id = v_sub.id;
  end if;

  -- 5. Mark payment approved
  update public.payment_requests
  set status = 'approved'
  where id = p_payment_request_id;

  -- 6. Audit Log
  insert into public.audit_logs (
    actor_id, action, target_table, target_id, metadata
  ) values (
    p_admin_id,
    'approve_payment',
    'payment_requests',
    p_payment_request_id,
    jsonb_build_object('credits', p_credits)
  );

  return json_build_object('success', true);
end;
$$;
