import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const DISEASES = [
  { name: 'Early Blight', severity: 'medium' as const, crop: 'Tomato' },
  { name: 'Late Blight', severity: 'high' as const, crop: 'Potato' },
  { name: 'Leaf Mold', severity: 'medium' as const, crop: 'Tomato' },
  { name: 'Bacterial Spot', severity: 'high' as const, crop: 'Tomato' },
  { name: 'Healthy', severity: 'low' as const, crop: 'Tomato' },
  { name: 'Powdery Mildew', severity: 'medium' as const, crop: 'Cucumber' },
  { name: 'Gray Mold', severity: 'high' as const, crop: 'Tomato' }
]

const VIZAG_BOUNDS = {
  latMin: 17.6,
  latMax: 17.9,
  lngMin: 83.0,
  lngMax: 83.4
}

function randomCoord(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomDate(hoursAgo: number) {
  const now = Date.now()
  const range = hoursAgo * 60 * 60 * 1000
  return new Date(now - Math.random() * range).toISOString()
}

export async function GET() {
  try {
    const diagnoses = []

    for (let i = 0; i < 30; i++) {
      const disease = DISEASES[Math.floor(Math.random() * DISEASES.length)]
      const confidence = disease.name === 'Healthy'
        ? 0.92 + Math.random() * 0.07
        : 0.80 + Math.random() * 0.18

      diagnoses.push({
        disease_name: disease.name,
        confidence: parseFloat(confidence.toFixed(2)),
        severity: disease.severity,
        image_url: `https://storage.example.com/demo/image-${i}.jpg`,
        crop_type: disease.crop,
        lat: randomCoord(VIZAG_BOUNDS.latMin, VIZAG_BOUNDS.latMax),
        lng: randomCoord(VIZAG_BOUNDS.lngMin, VIZAG_BOUNDS.lngMax),
        created_at: randomDate(48)
      })
    }

    const { data, error } = await supabase
      .from('diagnoses')
      .insert(diagnoses)
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({
        inserted: 30,
        message: 'Demo data generated (mock mode - Supabase not configured)',
        data: diagnoses.slice(0, 5)
      })
    }

    return NextResponse.json({
      inserted: data?.length || 30,
      message: 'Demo data seeded successfully',
      data: data?.slice(0, 5)
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    )
  }
}
