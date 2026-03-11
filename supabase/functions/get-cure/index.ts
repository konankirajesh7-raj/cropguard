// Supabase Edge Function: get-cure
// Checks treatment cache first, calls Gemini API if not cached
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
    const { disease_name, language = 'en' } = await req.json()

    if (!disease_name) {
      return new Response(
        JSON.stringify({ error: 'disease_name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 1. Check cache
    const { data: cached } = await supabase
      .from('treatments')
      .select('*')
      .eq('disease_name', disease_name)
      .eq('language', language)
      .single()

    if (cached) {
      return new Response(
        JSON.stringify(cached),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Call Gemini API
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_KEY) {
      const mockTreatment = {
        disease_name,
        language,
        steps: [
          'Remove infected plant parts immediately',
          'Apply appropriate fungicide as per label instructions',
          'Improve air circulation around plants',
          'Monitor plants daily for spread'
        ],
        organic_cure: 'Neem oil spray (5ml per liter water) applied every 5-7 days can help control many fungal diseases.',
        chemical_cure: 'Consult local agricultural extension officer for recommended fungicides for your specific crop and disease.',
        cost_inr: 300,
        days_to_act: 7
      }

      return new Response(
        JSON.stringify(mockTreatment),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const langMap: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      te: 'Telugu',
      ta: 'Tamil'
    }

    const prompt = `You are an expert agricultural advisor for Indian farmers.
Disease: ${disease_name}
Respond ONLY in ${langMap[language] || 'English'}.
Return ONLY this JSON structure, no other text:
{
  "steps": ["step 1", "step 2", "step 3", "step 4"],
  "organic_cure": "detailed organic treatment using locally available materials",
  "chemical_cure": "specific pesticide name available in Indian markets with exact dosage",
  "cost_inr": <estimated cost in Indian Rupees as integer>,
  "days_to_act": <days before significant yield loss as integer>
}`

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    )

    const geminiData = await geminiRes.json()
    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    let treatment
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      treatment = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        steps: ['Consult local agricultural expert'],
        organic_cure: 'Consult local expert',
        chemical_cure: 'Consult local expert',
        cost_inr: 200,
        days_to_act: 7
      }
    } catch {
      treatment = {
        steps: ['Consult local agricultural expert'],
        organic_cure: 'Consult local expert',
        chemical_cure: 'Consult local expert',
        cost_inr: 200,
        days_to_act: 7
      }
    }

    // 3. Cache it
    const { data: insertedTreatment } = await supabase
      .from('treatments')
      .insert({
        disease_name,
        language,
        ...treatment
      })
      .select()
      .single()

    return new Response(
      JSON.stringify(insertedTreatment || treatment),
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
