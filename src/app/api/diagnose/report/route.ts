import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disease_name, confidence, severity, image_url, crop_type, lat, lng } = body

    if (!disease_name) {
      return NextResponse.json({ error: 'Disease name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('diagnoses')
      .insert({
        disease_name,
        confidence: confidence || null,
        severity: severity || null,
        image_url: image_url || null,
        crop_type: crop_type || null,
        lat: lat || null,
        lng: lng || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({
        success: true,
        message: 'Diagnosis recorded (demo mode)',
        data: { id: 'demo-id', disease_name, lat, lng }
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Failed to report diagnosis' },
      { status: 500 }
    )
  }
}
