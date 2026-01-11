import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Initialize Supabase client with auth
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 2. Get authenticated user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 3. Verify admin role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Forbidden: Admins only' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 4. Parse request body
        const { driver_id, status, rejection_reason } = await req.json()
        if (!driver_id || !status) {
            return new Response(JSON.stringify({ error: 'Missing driver_id or status' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return new Response(JSON.stringify({ error: 'Invalid status value' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 5. Call RPC function for atomic KYC verification
        const { error: rpcError } = await supabase.rpc('verify_driver_kyc', {
            p_driver_id: driver_id,
            p_status: status,
            p_admin_id: user.id,
            p_rejection_reason: rejection_reason || null
        })

        if (rpcError) throw rpcError

        return new Response(JSON.stringify({ success: true, message: 'Driver KYC verified successfully' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('verify-driver-kyc error:', error)
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})
