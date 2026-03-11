'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin } from 'lucide-react'
import { DISEASE_DB } from '@/lib/diseases'

interface Diagnosis {
  id: string
  disease_name: string
  lat: number | null
  lng: number | null
  severity: string
  crop_type?: string
  confidence?: number
  created_at: string
}

interface MapViewProps {
  diagnoses: Diagnosis[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (diagnosis: Diagnosis) => void
}

export function MapView({
  diagnoses,
  center = { lat: 17.6868, lng: 83.2185 },
  zoom = 8,
  onMarkerClick
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#3ecf8e'
      case 'medium': return '#f5a623'
      case 'high': return '#ff5c5c'
      default: return '#64748b'
    }
  }

  const addMarker = useCallback((diagnosis: Diagnosis) => {
    if (!map.current || !diagnosis.lat || !diagnosis.lng) return

    const color = getSeverityColor(diagnosis.severity)

    const el = document.createElement('div')
    el.className = 'w-4 h-4 rounded-full cursor-pointer transition-transform hover:scale-125'
    el.style.backgroundColor = color
    el.style.boxShadow = `0 0 10px ${color}`

    if (onMarkerClick) {
      el.addEventListener('click', () => onMarkerClick(diagnosis))
    }

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2 min-w-[150px]">
        <h3 class="font-bold text-sm mb-1">${diagnosis.disease_name}</h3>
        <p class="text-xs text-gray-400">${diagnosis.crop_type || 'Unknown crop'}</p>
        <div class="flex items-center justify-between mt-2 text-xs">
          <span style="color: ${color}">${diagnosis.severity.toUpperCase()}</span>
          <span class="text-gray-500">${diagnosis.confidence ? `${(diagnosis.confidence * 100).toFixed(0)}%` : ''}</span>
        </div>
      </div>
    `)

    const marker = new mapboxgl.Marker(el)
      .setLngLat([diagnosis.lng, diagnosis.lat])
      .setPopup(popup)
      .addTo(map.current)

    markers.current.push(marker)
  }, [onMarkerClick])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || token === 'pk.placeholder') return

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [center.lng, center.lat],
      zoom
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    return () => {
      map.current?.remove()
    }
  }, [center, zoom])

  // Update markers when diagnoses change
  useEffect(() => {
    if (!map.current) return

    markers.current.forEach(m => m.remove())
    markers.current = []

    diagnoses.forEach(d => {
      if (d.lat && d.lng) {
        addMarker(d)
      }
    })
  }, [diagnoses, addMarker])

  // Placeholder when no Mapbox token
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN === 'pk.placeholder') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#080f1c] rounded-lg border border-[#0f1f35]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#0f1f35] flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-[#3ecf8e] opacity-50" />
          </div>
          <p className="text-[#64748b]">Map requires Mapbox token</p>
          <p className="text-xs text-[#64748b] mt-1">{diagnoses.length} data points loaded</p>
        </div>
      </div>
    )
  }

  return <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
}
