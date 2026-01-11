import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Initialize Supabase client
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 2. Auth & Admin Check
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (profile?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 3. Parse Body
        const { vehicle_id, status } = await req.json()
        if (!vehicle_id || !status) {
            return new Response(JSON.stringify({ error: 'Missing vehicle_id or status' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return new Response(JSON.stringify({ error: 'Invalid status value' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 4. Call RPC (Atomic Update)
        const { error } = await supabase.rpc('verify_vehicle_transaction', {
            p_vehicle_id: vehicle_id,
            p_status: status,
            p_admin_id: user.id
        })

        if (error) {
            // Handle specific RPC errors if needed
            if (error.message.includes('not found')) {
                return new Response(JSON.stringify({ error: 'Vehicle not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            throw error
        }

        return new Response(JSON.stringify({ success: true, message: 'Vehicle verified successfully' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        console.error('verify-vehicle error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
