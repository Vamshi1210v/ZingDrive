import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders })
    }

    try {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "Missing Authorization header" }),
                { headers: corsHeaders, status: 401 }
            )
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_ANON_KEY")!,
            {
                global: {
                    headers: { Authorization: authHeader },
                },
            }
        )

        // 1️⃣ Get authenticated user
        const { data: { user }, error: authError } =
            await supabase.auth.getUser()

        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { headers: corsHeaders, status: 401 }
            )
        }

        // 2️⃣ Parse & validate body
        const body = await req.json()
        const { booking_id, vehicle_id } = body

        if (!booking_id || !vehicle_id) {
            return new Response(
                JSON.stringify({ error: "booking_id and vehicle_id are required" }),
                { headers: corsHeaders, status: 400 }
            )
        }

        // 3️⃣ Call atomic SQL transaction
        const { data, error } = await supabase.rpc(
            "accept_booking_transaction",
            {
                p_booking_id: booking_id,
                p_driver_id: user.id,
                p_vehicle_id: vehicle_id,
            }
        )

        if (error) {
            // Handle known conflict cases matching SQL Exceptions
            if (error.message.includes("already accepted")) {
                return new Response(
                    JSON.stringify({ error: "Booking already accepted" }),
                    { headers: corsHeaders, status: 409 }
                )
            }

            if (error.message.includes("not eligible")) {
                return new Response(
                    JSON.stringify({ error: error.message }), // Return specific reason (Inactive/No Credits)
                    { headers: corsHeaders, status: 403 }
                )
            }

            throw error
        }

        // 4️⃣ Success
        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        })

    } catch (err) {
        console.error("accept-booking error:", err)

        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { headers: corsHeaders, status: 500 }
        )
    }
})
