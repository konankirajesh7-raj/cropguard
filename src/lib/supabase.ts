import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Farmer {
  id: string
  phone: string
  name: string | null
  district: string | null
  state: string
  lat: number | null
  lng: number | null
  language: string
  created_at: string
}

export interface Diagnosis {
  id: string
  farmer_id: string | null
  disease_name: string
  confidence: number | null
  severity: 'low' | 'medium' | 'high' | null
  image_url: string | null
  crop_type: string | null
  lat: number | null
  lng: number | null
  created_at: string
}

export interface Treatment {
  id: string
  disease_name: string
  language: string
  steps: string[]
  organic_cure: string
  chemical_cure: string
  cost_inr: number
  days_to_act: number
  cached_at: string
}

export interface AlertLog {
  id: string
  disease_name: string
  district: string
  farmers_alerted: number
  message_sent: string
  created_at: string
}

// Helper functions
export async function getNearbyOutbreaks(lat: number, lng: number, radiusKm: number = 20) {
  const { data, error } = await supabase.rpc('nearby_outbreaks', {
    p_lat: lat,
    p_lng: lng,
    radius_km: radiusKm
  })

  if (error) {
    console.error('Error fetching nearby outbreaks:', error)
    return []
  }
  return data
}

export async function uploadImage(file: File | Blob, fileName: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('leaf-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('leaf-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function saveDiagnosis(diagnosis: Omit<Diagnosis, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert(diagnosis)
    .select()
    .single()

  if (error) {
    console.error('Error saving diagnosis:', error)
    return null
  }
  return data
}

export async function getRecentDiagnoses(hours: number = 48) {
  const { data, error } = await supabase
    .from('diagnoses')
    .select('*')
    .gte('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching diagnoses:', error)
    return []
  }
  return data
}

export async function registerFarmer(farmer: Omit<Farmer, 'id' | 'created_at' | 'state'>) {
  const { data, error } = await supabase
    .from('farmers')
    .insert({ ...farmer, state: 'Andhra Pradesh' })
    .select()
    .single()

  if (error) {
    console.error('Error registering farmer:', error)
    return null
  }
  return data
}

export async function getFarmerCount() {
  const { count, error } = await supabase
    .from('farmers')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error fetching farmer count:', error)
    return 0
  }
  return count || 0
}
