import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS')
        return new Response('ok', { headers: corsHeaders })

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader)
            return new Response('Unauthorized', { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

        // Client for user validation
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        )

        // Admin client for deletion
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user)
            return new Response('Unauthorized', { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

        // 🔒 SAFETY CHECK: Active bookings
        const { data: activeBooking } = await supabaseClient
            .from('bookings')
            .select('id')
            .eq('assigned_driver_id', user.id)
            .in('status', ['accepted', 'started'])
            .maybeSingle()

        if (activeBooking) {
            return new Response(
                JSON.stringify({ error: 'Cannot delete account with active bookings' }),
                { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // 🧾 AUDIT LOG BEFORE DELETE
        await supabaseAdmin.from('audit_logs').insert({
            actor_id: user.id,
            action: 'delete_account',
            target_id: user.id,
            metadata: { source: 'user_request' }
        })

        // ❌ HARD DELETE AUTH USER (CASCADE CLEANS DATA)
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)
        if (error) throw error

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (err) {
        console.error('delete-account error:', err)
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
