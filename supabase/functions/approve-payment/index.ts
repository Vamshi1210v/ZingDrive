import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        )

        // 1. Validate Admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

        const { data: profile } =
            await supabase.from('profiles').select('role').eq('id', user.id).single()

        if (profile?.role !== 'admin')
            return new Response('Forbidden', { status: 403, headers: corsHeaders })

        // 2. Parse & Validate Body
        const { payment_request_id, action, amount_credits = 1000 } = await req.json()

        if (!payment_request_id || !action)
            return new Response('Invalid request', { status: 400, headers: corsHeaders })

        if (!['approve', 'reject'].includes(action)) {
            return new Response('Invalid action', { status: 400, headers: corsHeaders })
        }

        if (action === 'approve' && amount_credits <= 0) {
            return new Response('Invalid credit amount', { status: 400, headers: corsHeaders })
        }

        // 3. Handle Rejection
        if (action === 'reject') {
            const { error } = await supabase
                .from('payment_requests')
                .update({ status: 'rejected' })
                .eq('id', payment_request_id)
                .eq('status', 'pending') // Optimistic lock

            if (error) throw error

            // Audit Rejection
            await supabase.from('audit_logs').insert({
                actor_id: user.id,
                action: 'reject_payment',
                target_table: 'payment_requests',
                target_id: payment_request_id,
                metadata: { action: 'reject' }
            })

            return new Response(JSON.stringify({ success: true, message: 'Rejected' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        // 4. Handle Approval (Atomic RPC)
        const { error } = await supabase.rpc('approve_payment_transaction', {
            p_payment_request_id: payment_request_id,
            p_admin_id: user.id,
            p_credits: amount_credits
        })

        if (error) {
            if (error.message.includes('already processed')) {
                return new Response(JSON.stringify({ error: error.message }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            if (error.message.includes('not found')) {
                return new Response(JSON.stringify({ error: error.message }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            throw error
        }

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (err) {
        console.error('approve-payment error:', err)
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
