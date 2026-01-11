-- RPC: Verify Vehicle Transaction
-- Handles atomic verification of vehicles and audit logging.
create or replace function public.verify_vehicle_transaction(
    p_vehicle_id uuid,
    p_status text,
    p_admin_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
    -- 1. Validate status
    if p_status not in ('pending', 'verified', 'rejected') then
        raise exception 'Invalid status value: %', p_status;
    end if;

    -- 2. Update vehicles table
    update public.vehicles
    set
        status = p_status,
        verified_by = p_admin_id,
        verified_at = timezone('utc', now())
    where id = p_vehicle_id;

    if not found then
        raise exception 'Vehicle not found';
    end if;

    -- 3. Insert audit log
    insert into public.audit_logs(actor_id, action, target_table, target_id, metadata, created_at)
    values (
        p_admin_id,
        'verify_vehicle',
        'vehicles',
        p_vehicle_id,
        jsonb_build_object(
            'status', p_status,
            'timestamp', timezone('utc', now())
        ),
        timezone('utc', now())
    );

end;
$$;
