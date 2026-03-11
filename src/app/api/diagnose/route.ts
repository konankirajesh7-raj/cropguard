import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { DISEASE_DB, getDiseaseSlug, getRandomMockDiagnosis } from '@/lib/diseases'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const cropType = formData.get('cropType') as string || 'Tomato'

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')

    let diagnosis
    const modelUrl = process.env.PLANT_MODEL_URL

    if (modelUrl) {
      try {
        const response = await fetch(`${modelUrl}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: base64 })
        })

        if (response.ok) {
          const data = await response.json()
          diagnosis = {
            disease: data.disease,
            slug: getDiseaseSlug(data.disease),
            confidence: data.confidence,
            severity: DISEASE_DB[getDiseaseSlug(data.disease)]?.severity || 'medium'
          }
        } else {
          diagnosis = getRandomMockDiagnosis()
        }
      } catch {
        console.log('Python model not available, using mock')
        diagnosis = getRandomMockDiagnosis()
      }
    } else {
      diagnosis = getRandomMockDiagnosis()
    }

    const diseaseInfo = DISEASE_DB[diagnosis.slug]
    const treatments = diseaseInfo?.quick_steps || [
      'Remove infected plant parts',
      'Apply appropriate fungicide',
      'Monitor for spread'
    ]

    const imageUrl = `https://storage.example.com/leaf-images/${uuidv4()}.jpg`

    return NextResponse.json({
      disease: diagnosis.disease,
      slug: diagnosis.slug,
      confidence: diagnosis.confidence,
      severity: diagnosis.severity,
      imageUrl,
      treatments
    })
  } catch (error) {
    console.error('Diagnosis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    )
  }
}
