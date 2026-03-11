// Supabase Edge Function: send-alert
// Called by Supabase DB Webhook on every new diagnosis INSERT
// Checks outbreak threshold — if >= 3 same disease in 10km/1hr, sends WhatsApp alerts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    const record = payload.record || payload
    const { disease_name, lat, lng, district } = record

    if (!disease_name || !lat || !lng) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Check outbreak threshold
    const { data: countData } = await supabase.rpc('check_outbreak_threshold', {
      p_disease: disease_name,
      p_lat: lat,
      p_lng: lng
    })

    const count = countData || 0

    if (count < 3) {
      return new Response(
        JSON.stringify({ message: 'Threshold not met', count }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Check if we already alerted this zone in last 2 hours
    const { data: recentAlert } = await supabase
      .from('alerts_log')
      .select('id')
      .eq('disease_name', disease_name)
      .eq('district', district)
      .gte('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
      .single()

    if (recentAlert) {
      return new Response(
        JSON.stringify({ message: 'Already alerted recently' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Get farmers in district
    const { data: farmers } = await supabase
      .from('farmers')
      .select('phone, name')
      .eq('district', district)

    if (!farmers?.length) {
      return new Response(
        JSON.stringify({ message: 'No farmers registered in district' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Send WhatsApp via Twilio
    const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const TWILIO_FROM = Deno.env.get('TWILIO_WHATSAPP_FROM') || 'whatsapp:+14155238886'

    const diseaseSlug = disease_name.toLowerCase().replace(/\s+/g, '-')
    const message = `🌿 *CropGuard Alert*\n\n*${disease_name}* detected in your area (${district}).\n\n⚠️ Act within 7 days to protect your harvest.\n\n💊 Get cure: https://cropguard.app/cure/${diseaseSlug}\n\n_Reply STOP to unsubscribe_`

    let alerted = 0

    if (TWILIO_SID && TWILIO_TOKEN) {
      for (const farmer of farmers) {
        try {
          const formData = new URLSearchParams({
            From: TWILIO_FROM,
            To: `whatsapp:+91${farmer.phone}`,
            Body: message
          })

          await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formData.toString()
            }
          )
          alerted++
        } catch (e) {
          console.error(`Failed to send to ${farmer.phone}:`, e)
        }
      }
    } else {
      alerted = farmers.length
    }

    // 5. Log the alert
    await supabase.from('alerts_log').insert({
      disease_name,
      district,
      farmers_alerted: alerted,
      message_sent: message
    })

    return new Response(
      JSON.stringify({ alerted, district, disease_name }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
