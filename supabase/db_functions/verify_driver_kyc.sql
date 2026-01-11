-- RPC: Verify Driver KYC
-- Handles atomic verification of driver profile and documents.
create or replace function public.verify_driver_kyc(
    p_driver_id uuid,
    p_status text,
    p_admin_id uuid,
    p_rejection_reason text default null
)
returns void
language plpgsql
security definer -- Needed to allow Admin to write to these tables if RLS is strict
as $$
begin
    -- Validate status
    if p_status not in ('pending', 'verified', 'rejected') then
        raise exception 'Invalid status value: %', p_status;
    end if;

    -- Start atomic transaction (PL/pgSQL is already atomic per function)
    
    -- 1. Update profiles table
    update public.profiles
    set
        verification_status = p_status,
        is_verified = (p_status = 'verified'),
        rejection_reason = p_rejection_reason
    where id = p_driver_id;

    -- 2. Update driver_documents table
    update public.driver_documents
    set
        status = p_status,
        verified_by = p_admin_id,
        verified_at = timezone('utc', now())
    where driver_id = p_driver_id;

    -- 3. Insert audit log
    insert into public.audit_logs(actor_id, action, target_table, target_id, metadata, created_at)
    values (
        p_admin_id,
        'verify_driver_kyc',
        'profiles',
        p_driver_id,
        jsonb_build_object(
            'status', p_status,
            'rejection_reason', p_rejection_reason,
            'timestamp', timezone('utc', now())
        ),
        timezone('utc', now())
    );

end;
$$;
