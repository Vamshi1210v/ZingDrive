import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS')
        return new Response('ok', { headers: corsHeaders })

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader)
            return new Response('Unauthorized', { status: 401, headers: corsHeaders })

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user } } = await supabase.auth.getUser()
        if (!user)
            return new Response('Unauthorized', { status: 401, headers: corsHeaders })

        const { booking_id, reason } = await req.json()
        if (!booking_id)
            return new Response('Missing booking_id', { status: 400, headers: corsHeaders })

        const { error } = await supabase.rpc('cancel_booking_transaction', {
            p_booking_id: booking_id,
            p_driver_id: user.id,
            p_reason: reason ?? null
        })

        if (error) {
            if (error.message.includes('Unauthorized'))
                return new Response(error.message, { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            if (error.message.includes('not cancellable'))
                return new Response(error.message, { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

            // Default to 400 or 500 depending on preference, throwing to catch block usually 500
            throw error
        }

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (err) {
        console.error('cancel-booking error:', err)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
