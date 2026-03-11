'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Camera, Upload, Loader2, AlertCircle, Check, MapPin, Share2, ChevronRight, Leaf, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DISEASE_DB, CROP_TYPES, getDiseaseSlug } from '@/lib/diseases'

interface DiagnosisResult {
  disease: string
  slug: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  imageUrl: string
  treatments: string[]
}

export default function DiagnosePage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [cropType, setCropType] = useState<string>('Tomato')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reportedToMap, setReportedToMap] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      setResult(null)
      setError(null)
      setReportedToMap(false)
    }
  }, [])

  const handleAnalyze = async () => {
    if (!imageFile) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('cropType', cropType)

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReportToMap = async () => {
    if (!result || reportedToMap) return
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        })
      })

      const { latitude: lat, longitude: lng } = position.coords

      const response = await fetch('/api/diagnose/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disease_name: result.disease,
          confidence: result.confidence,
          severity: result.severity,
          image_url: result.imageUrl,
          crop_type: cropType,
          lat,
          lng
        })
      })

      if (response.ok) {
        setReportedToMap(true)
      }
    } catch (err) {
      console.error('Failed to report:', err)
    }
  }

  const handleShareWhatsApp = () => {
    if (!result) return
    const text = `🌿 CropGuard Alert\n\nDisease: ${result.disease}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\nSeverity: ${result.severity.toUpperCase()}\n\nGet cure: ${window.location.origin}/cure/${result.slug}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-[#3ecf8e]'
      case 'medium': return 'text-[#f5a623]'
      case 'high': return 'text-[#ff5c5c]'
      default: return 'text-[#64748b]'
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-[#3ecf8e]/20 border-[#3ecf8e]/30'
      case 'medium': return 'bg-[#f5a623]/20 border-[#f5a623]/30'
      case 'high': return 'bg-[#ff5c5c]/20 border-[#ff5c5c]/30'
      default: return 'bg-[#64748b]/20'
    }
  }

  return (
    <div className="min-h-screen bg-[#03070f] text-[#e2e8f0]">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-[#0f1f35]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#64748b] hover:text-[#e2e8f0] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3ecf8e] to-[#4285f4] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#03070f]" />
            </div>
            <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
              CropGuard<span className="text-[#3ecf8e]">.ai</span>
            </span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 p-3 rounded-2xl bg-[#080f1c] border border-[#0f1f35] mb-4">
              <Camera className="w-6 h-6 text-[#3ecf8e]" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Scan Your Crop
            </h1>
            <p className="text-[#64748b]">
              Take a photo or upload an image to diagnose crop diseases
            </p>
          </div>

          {/* Input Section */}
          {!result && (
            <Card className="bg-[#080f1c] border-[#0f1f35] mb-6">
              <CardContent className="p-6">
                {/* Image Preview */}
                {image ? (
                  <div className="relative mb-6">
                    <img
                      src={image}
                      alt="Crop preview"
                      className="w-full aspect-[4/3] object-cover rounded-xl border border-[#0f1f35]"
                    />
                    <button
                      onClick={() => { setImage(null); setImageFile(null); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#03070f]/80 hover:bg-[#ff5c5c] transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Camera Button */}
                    <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-[#0f1f35] hover:border-[#3ecf8e] cursor-pointer transition-colors group">
                      <Camera className="w-10 h-10 text-[#64748b] group-hover:text-[#3ecf8e] transition-colors mb-3" />
                      <span className="font-medium">Take Photo</span>
                      <span className="text-sm text-[#64748b]">Use camera</span>
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {/* Upload Button */}
                    <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-[#0f1f35] hover:border-[#4285f4] cursor-pointer transition-colors group">
                      <Upload className="w-10 h-10 text-[#64748b] group-hover:text-[#4285f4] transition-colors mb-3" />
                      <span className="font-medium">Upload</span>
                      <span className="text-sm text-[#64748b]">From gallery</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Crop Type Selector */}
                {image && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Crop Type</label>
                    <Select value={cropType} onValueChange={setCropType}>
                      <SelectTrigger className="bg-[#03070f] border-[#0f1f35]">
                        <SelectValue placeholder="Select crop type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#080f1c] border-[#0f1f35]">
                        {CROP_TYPES.map((crop) => (
                          <SelectItem key={crop} value={crop} className="hover:bg-[#0f1f35]">
                            {crop}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Analyze Button */}
                {image && (
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading || !imageFile}
                    className="w-full py-6 bg-[#3ecf8e] hover:bg-[#2eb97a] text-[#03070f] font-semibold text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI is analyzing your crop...
                      </>
                    ) : (
                      <>
                        Analyze Disease
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="bg-[#ff5c5c]/10 border-[#ff5c5c]/30 mb-6">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#ff5c5c]" />
                <span>{error}</span>
              </CardContent>
            </Card>
          )}

          {/* Result */}
          {result && (
            <Card className="bg-[#080f1c] border-[#0f1f35] overflow-hidden">
              <CardHeader className={`p-4 border-b border-[#0f1f35] ${getSeverityBg(result.severity)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748b] mb-1">Diagnosis Result</p>
                    <CardTitle className={`text-2xl ${getSeverityColor(result.severity)}`}>
                      {result.disease}
                    </CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={`px-3 py-1 text-sm font-semibold border-current ${getSeverityColor(result.severity)}`}
                  >
                    {result.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Confidence */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#64748b]">Confidence</span>
                    <span className="font-mono font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence * 100} className="h-2" />
                </div>

                {/* Quick Treatment Steps */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-[#3ecf8e]" />
                    Quick Treatment Steps
                  </h3>
                  <ol className="space-y-2">
                    {result.treatments.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1a4a35] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[#94a3b8]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Link href={`/cure/${result.slug}`}>
                    <Button variant="outline" className="w-full border-[#3ecf8e] text-[#3ecf8e] hover:bg-[#3ecf8e]/10">
                      Full Cure Guide
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>

                {/* Report to Map */}
                <div className="pt-6 border-t border-[#0f1f35]">
                  <Button
                    onClick={handleReportToMap}
                    disabled={reportedToMap}
                    variant={reportedToMap ? 'outline' : 'default'}
                    className={`w-full ${reportedToMap ? 'border-[#3ecf8e] text-[#3ecf8e]' : 'bg-[#4285f4] hover:bg-[#3b7ae0]'}`}
                  >
                    {reportedToMap ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Reported to Outbreak Map
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Report to Outbreak Map
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-[#64748b] mt-2">
                    Help warn other farmers by sharing your diagnosis location
                  </p>
                </div>

                {/* Scan Another */}
                <div className="mt-4">
                  <Button
                    onClick={() => { setResult(null); setImage(null); setImageFile(null); setReportedToMap(false); }}
                    variant="ghost"
                    className="w-full text-[#64748b] hover:text-[#e2e8f0]"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Another Crop
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
