'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Leaf, MapPin, AlertTriangle, Activity, Clock, ChevronRight,
  TrendingUp, Users, AlertCircle, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, Diagnosis } from '@/lib/supabase'
import { DISEASE_DB, AP_DISTRICTS } from '@/lib/diseases'

// Visakhapatnam coordinates
const CENTER = { lat: 17.6868, lng: 83.2185 }

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.placeholder'

interface DiagnosisWithSeverity extends Diagnosis {
  severity: 'low' | 'medium' | 'high'
}

interface DiseaseStats {
  name: string
  count: number
  severity: string
}

export default function DashboardPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])

  const [loading, setLoading] = useState(true)
  const [diagnoses, setDiagnoses] = useState<DiagnosisWithSeverity[]>([])
  const [stats, setStats] = useState({
    activeOutbreaks: 0,
    totalReports: 0,
    topDiseases: [] as DiseaseStats[],
    recentReports: [] as DiagnosisWithSeverity[]
  })
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all')
  const [mapLoaded, setMapLoaded] = useState(false)

  // Fetch diagnoses from Supabase
  const fetchDiagnoses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching diagnoses:', error)
        return []
      }

      const enrichedData = (data || []).map(d => {
        const slug = d.disease_name.toLowerCase().replace(/\s+/g, '-')
        const diseaseInfo = DISEASE_DB[slug]
        return {
          ...d,
          severity: diseaseInfo?.severity || 'medium'
        } as DiagnosisWithSeverity
      })

      return enrichedData
    } catch (err) {
      console.error('Fetch error:', err)
      return []
    }
  }, [])

  // Calculate stats from diagnoses
  const calculateStats = useCallback((data: DiagnosisWithSeverity[]) => {
    const diseaseCounts: Record<string, number> = {}
    let activeOutbreaks = 0

    data.forEach(d => {
      if (d.disease_name !== 'Healthy') {
        diseaseCounts[d.disease_name] = (diseaseCounts[d.disease_name] || 0) + 1
      }
    })

    Object.values(diseaseCounts).forEach(count => {
      if (count >= 3) activeOutbreaks++
    })

    const topDiseases = Object.entries(diseaseCounts)
      .map(([name, count]) => {
        const slug = name.toLowerCase().replace(/\s+/g, '-')
        const info = DISEASE_DB[slug]
        return { name, count, severity: info?.severity || 'medium' }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      activeOutbreaks,
      totalReports: data.length,
      topDiseases,
      recentReports: data.slice(0, 10)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.placeholder'
    if (token === 'pk.placeholder') {
      setMapLoaded(true)
      setLoading(false)
      return
    }

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [CENTER.lng, CENTER.lat],
      zoom: 8
    })

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  // Fetch data and set up realtime
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await fetchDiagnoses()
      setDiagnoses(data)
      setStats(calculateStats(data))
      setLoading(false)
    }

    loadData()

    const channel = supabase
      .channel('live-diagnoses')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'diagnoses'
      }, (payload) => {
        const newDiagnosis = payload.new as Diagnosis
        const slug = newDiagnosis.disease_name.toLowerCase().replace(/\s+/g, '-')
        const diseaseInfo = DISEASE_DB[slug]
        const enriched = {
          ...newDiagnosis,
          severity: diseaseInfo?.severity || 'medium'
        } as DiagnosisWithSeverity

        setDiagnoses(prev => [enriched, ...prev])
        setStats(prev => calculateStats([enriched, ...diagnoses]))

        if (map.current && newDiagnosis.lat && newDiagnosis.lng) {
          addMarkerToMap(enriched)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchDiagnoses, calculateStats])

  // Add markers to map
  const addMarkerToMap = useCallback((diagnosis: DiagnosisWithSeverity) => {
    if (!map.current || !diagnosis.lat || !diagnosis.lng) return

    const color =
      diagnosis.severity === 'high' ? '#ff5c5c' :
      diagnosis.severity === 'medium' ? '#f5a623' :
      '#3ecf8e'

    const el = document.createElement('div')
    el.className = 'w-4 h-4 rounded-full cursor-pointer'
    el.style.backgroundColor = color
    el.style.boxShadow = `0 0 10px ${color}`

    const marker = new mapboxgl.Marker(el)
      .setLngLat([diagnosis.lng, diagnosis.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${diagnosis.disease_name}</h3>
          <p class="text-xs text-gray-400">${diagnosis.crop_type || 'Unknown crop'}</p>
          <p class="text-xs mt-1">${diagnosis.confidence ? `${(diagnosis.confidence * 100).toFixed(0)}% confidence` : ''}</p>
          <p class="text-xs text-gray-500">${new Date(diagnosis.created_at).toLocaleTimeString()}</p>
        </div>
      `))
      .addTo(map.current)

    markers.current.push(marker)
  }, [])

  // Update markers when diagnoses change
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    markers.current.forEach(m => m.remove())
    markers.current = []

    diagnoses.forEach(d => {
      if (d.lat && d.lng) {
        addMarkerToMap(d)
      }
    })
  }, [diagnoses, mapLoaded, addMarkerToMap])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#3ecf8e'
      case 'medium': return '#f5a623'
      case 'high': return '#ff5c5c'
      default: return '#64748b'
    }
  }

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-[#03070f] text-[#e2e8f0] flex">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-[#0f1f35] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#0f1f35]">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3ecf8e] to-[#4285f4] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#03070f]" />
            </div>
            <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
              CropGuard<span className="text-[#3ecf8e]">.ai</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Outbreak Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="p-4 space-y-4 flex-1 overflow-auto">
          {/* Active Outbreaks */}
          <Card className="bg-[#080f1c] border-[#0f1f35]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">Active Outbreaks</p>
                  <p className="text-3xl font-bold text-[#ff5c5c]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {stats.activeOutbreaks}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#ff5c5c]/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-[#ff5c5c]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Reports */}
          <Card className="bg-[#080f1c] border-[#0f1f35]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">Reports (48h)</p>
                  <p className="text-3xl font-bold text-[#4285f4]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {stats.totalReports}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#4285f4]/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#4285f4]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* District Filter */}
          <div>
            <label className="block text-sm text-[#64748b] mb-2">Filter by District</label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger className="bg-[#080f1c] border-[#0f1f35]">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="bg-[#080f1c] border-[#0f1f35]">
                <SelectItem value="all">All Districts</SelectItem>
                {AP_DISTRICTS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Top Diseases */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3ecf8e]" />
              Top Diseases
            </h3>
            <div className="space-y-2">
              {stats.topDiseases.length === 0 ? (
                <p className="text-sm text-[#64748b]">No disease reports yet</p>
              ) : (
                stats.topDiseases.map((disease, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#03070f]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getSeverityColor(disease.severity) }}
                      />
                      <span className="text-sm">{disease.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {disease.count}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reports */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4285f4]" />
              Recent Reports
            </h3>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {stats.recentReports.length === 0 ? (
                  <p className="text-sm text-[#64748b]">No recent reports</p>
                ) : (
                  stats.recentReports.map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#03070f]">
                      <div>
                        <p className="text-sm font-medium">{report.disease_name}</p>
                        <p className="text-xs text-[#64748b]">{report.crop_type || 'Unknown'}</p>
                      </div>
                      <span className="text-xs text-[#64748b]">{timeAgo(report.created_at)}</span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link href="/diagnose">
              <Button className="w-full bg-[#3ecf8e] hover:bg-[#2eb97a] text-[#03070f]">
                Scan Your Crop
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="w-full border-[#0f1f35] hover:border-[#3ecf8e]">
                <Users className="w-4 h-4 mr-1" />
                Register for Alerts
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#03070f]/80 z-20">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#3ecf8e]" />
              <span>Loading outbreak data...</span>
            </div>
          </div>
        )}

        {/* Map or placeholder */}
        <div ref={mapContainer} className="w-full h-full">
          {(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN === 'pk.placeholder') && (
            <div className="w-full h-full flex items-center justify-center bg-[#080f1c]">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#0f1f35] flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-[#3ecf8e] opacity-50" />
                </div>
                <h2 className="text-xl font-bold mb-2">Map View</h2>
                <p className="text-[#64748b] mb-1">Configure Mapbox token to enable the map</p>
                <p className="text-xs text-[#64748b]">{diagnoses.length} data points loaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 p-4 rounded-xl bg-[#080f1c]/90 border border-[#0f1f35] z-10">
          <h4 className="text-xs font-semibold mb-2 text-[#64748b]">SEVERITY</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5c5c]" />
              <span className="text-xs">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f5a623]" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3ecf8e]" />
              <span className="text-xs">Low / Healthy</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
