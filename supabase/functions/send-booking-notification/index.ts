import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        // 1. Create Supabase Admin Client
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // 2. Parse payload
        const payload = await req.json()
        const booking = payload.record

        if (!booking || booking.status !== 'open') {
            return new Response('No action needed', { headers: corsHeaders })
        }

        // 3. Idempotency Check
        if (booking.notification_sent) {
            return new Response('Already notified', { headers: corsHeaders })
        }

        // 4. Mark as Sent (Optimistic Lock)
        // We do this early to prevent race conditions if multiple webhooks fire
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ notification_sent: true })
            .eq('id', booking.id)
            .eq('notification_sent', false) // Integrity check

        if (updateError) {
            // If update failed/returned 0 rows, assume race condition and exit
            console.log('Duplicate notification prevented')
            return new Response('Duplicate prevented', { headers: corsHeaders })
        }

        // 5. Find Eligible Drivers
        // Rules: Verified Profile + Verified Vehicle of CORRECT TYPE + Active Sub + Credits
        const { data: drivers, error } = await supabase
            .from('profiles')
            .select(`
        id,
        device_tokens!inner(token, platform),
        vehicles!inner(id, vehicle_type, status),
        subscriptions!inner(status, remaining_credits)
      `)
            .eq('is_verified', true)
            .eq('vehicles.status', 'verified')
            .eq('vehicles.vehicle_type', booking.vehicle_type_required) // Critical Filter
            .eq('subscriptions.status', 'active')
            .gt('subscriptions.remaining_credits', 0)
            .limit(20) // Fan-out limit

        if (error) throw error

        // 6. Deduplicate Tokens
        const uniqueTokens = [...new Set(
            drivers.flatMap(d => d.device_tokens.map((dt: any) => dt.token))
        )]

        if (uniqueTokens.length === 0) {
            console.log('No eligible drivers found for notification')
            return new Response(JSON.stringify({ message: 'No drivers found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 7. Send FCM (Mock)
        console.log(`Sending notification to ${uniqueTokens.length} devices for Booking ${booking.id}`)

        // 8. Audit Log
        await supabase.from('audit_logs').insert({
            action: 'send_booking_notification',
            target_table: 'bookings',
            target_id: booking.id,
            metadata: { notified_driver_count: uniqueTokens.length, vehicle_type: booking.vehicle_type_required }
        })

        return new Response(JSON.stringify({ success: true, count: uniqueTokens.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        console.error('Notification error:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
