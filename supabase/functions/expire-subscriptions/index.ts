import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // Update Logic
        // Set status = 'expired' where end_date < now() AND status == 'active'
        const { data, error } = await supabase
            .from('subscriptions')
            .update({ status: 'expired' })
            .lt('end_date', new Date().toISOString())
            .eq('status', 'active') // Fix: Only expire active ones
            .limit(500) // Fix: Batch limit
            .select()

        if (error) throw error

        const expiredCount = data?.length ?? 0
        console.log(`Expired ${expiredCount} subscriptions`)

        // Audit Log
        if (expiredCount > 0) {
            // actor_id is null for System
            const auditEntries = data!.map((sub: any) => ({
                actor_id: null,
                action: 'expire_subscription',
                target_table: 'subscriptions',
                target_id: sub.id,
                metadata: { driver_id: sub.driver_id, reason: 'cron_expiry' }
            }))

            const { error: auditError } = await supabase.from('audit_logs').insert(auditEntries)
            if (auditError) console.error('Audit log failed', auditError)
        }

        return new Response(JSON.stringify({ success: true, expired_count: expiredCount }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    } catch (error) {
        console.error('Expire job error:', error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
})
