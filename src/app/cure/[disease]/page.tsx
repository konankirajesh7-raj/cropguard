'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  Leaf, ChevronRight, ArrowLeft, Share2, Clock,
  IndianRupee, Droplets, FlaskConical, MapPin, Phone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DISEASE_DB, LANGUAGES, DiseaseInfo } from '@/lib/diseases'

export default function CurePage({ params }: { params: Promise<{ disease: string }> }) {
  const { disease } = use(params)
  const [selectedLang, setSelectedLang] = useState('en')

  const diseaseInfo = DISEASE_DB[disease]

  if (!diseaseInfo) {
    return (
      <div className="min-h-screen bg-[#03070f] text-[#e2e8f0] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Disease Not Found</h1>
          <p className="text-[#64748b] mb-6">The disease &quot;{disease}&quot; was not found in our database.</p>
          <Link href="/diagnose">
            <Button className="bg-[#3ecf8e] hover:bg-[#2eb97a] text-[#03070f]">
              Scan Your Crop
            </Button>
          </Link>
        </div>
      </div>
    )
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

  const handleShareWhatsApp = () => {
    const text = `🌿 CropGuard Cure Guide\n\nDisease: ${diseaseInfo.display_name}\nSeverity: ${diseaseInfo.severity.toUpperCase()}\n\nOrganic: ${diseaseInfo.organic_cure}\n\nChemical: ${diseaseInfo.chemical_cure}\n\nCost: ₹${diseaseInfo.cost_inr}\nAct within: ${diseaseInfo.days_to_act} days`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const nearbySuppliers = [
    { name: 'Krishi Seva Kendra', address: 'Main Road, Visakhapatnam', phone: '+91 891 274 5632' },
    { name: 'AP Agri Inputs', address: 'RTC Complex, Gajuwaka', phone: '+91 891 256 7890' },
    { name: 'Farmers Choice Store', address: 'MVP Colony, Vizag', phone: '+91 891 289 1234' }
  ]

  return (
    <div className="min-h-screen bg-[#03070f] text-[#e2e8f0]">
      {/* Background */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-[#0f1f35]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/diagnose" className="flex items-center gap-2 text-[#64748b] hover:text-[#e2e8f0] transition-colors">
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
          <Button onClick={handleShareWhatsApp} variant="outline" size="sm" className="border-[#25D366] text-[#25D366]">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[#64748b] mb-6">
            <Link href="/" className="hover:text-[#e2e8f0]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/diagnose" className="hover:text-[#e2e8f0]">Diagnose</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#e2e8f0]">{diseaseInfo.display_name}</span>
          </nav>

          {/* Hero */}
          <div className={`rounded-2xl p-6 mb-6 border ${getSeverityBg(diseaseInfo.severity)}`}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${getSeverityColor(diseaseInfo.severity)}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                  {diseaseInfo.display_name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className={`border-current ${getSeverityColor(diseaseInfo.severity)}`}>
                    {diseaseInfo.severity.toUpperCase()} SEVERITY
                  </Badge>
                  {diseaseInfo.crops.map(crop => (
                    <Badge key={crop} variant="secondary" className="bg-[#080f1c]">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
              {diseaseInfo.days_to_act > 0 && (
                <div className="text-right">
                  <div className="text-sm text-[#64748b]">Act within</div>
                  <div className="text-2xl font-bold text-[#ff5c5c]" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                    {diseaseInfo.days_to_act} days
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <Tabs value={selectedLang} onValueChange={setSelectedLang}>
              <TabsList className="bg-[#080f1c] border border-[#0f1f35]">
                {LANGUAGES.map(lang => (
                  <TabsTrigger
                    key={lang.code}
                    value={lang.code}
                    className="data-[state=active]:bg-[#3ecf8e] data-[state=active]:text-[#03070f]"
                  >
                    {lang.native}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* What is this */}
              <Card className="bg-[#080f1c] border-[#0f1f35]">
                <CardHeader>
                  <CardTitle className="text-lg">What is this?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94a3b8] leading-relaxed">
                    {diseaseInfo.description}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Steps */}
              <Card className="bg-[#080f1c] border-[#0f1f35]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#f5a623]" />
                    Quick Treatment Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {diseaseInfo.quick_steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#3ecf8e]/20 text-[#3ecf8e] flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-[#94a3b8]">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Treatment Options */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Organic */}
                <Card className="bg-[#080f1c] border-[#0f1f35]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-[#3ecf8e]" />
                      Organic Treatment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#94a3b8] text-sm mb-4">
                      {diseaseInfo.organic_cure}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4 text-[#3ecf8e]" />
                      <span>~₹{diseaseInfo.cost_inr} estimated</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chemical */}
                <Card className="bg-[#080f1c] border-[#0f1f35]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-[#4285f4]" />
                      Chemical Treatment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#94a3b8] text-sm mb-4">
                      {diseaseInfo.chemical_cure}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="w-4 h-4 text-[#4285f4]" />
                      <span>~₹{diseaseInfo.cost_inr + 150} estimated</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Warning */}
              {diseaseInfo.days_to_act > 0 && (
                <Card className="bg-[#ff5c5c]/10 border-[#ff5c5c]/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#ff5c5c] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#ff5c5c]">Act Fast!</p>
                      <p className="text-sm text-[#94a3b8]">
                        You have approximately {diseaseInfo.days_to_act} days before significant yield loss occurs.
                        Start treatment immediately and monitor plants daily.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Cost Summary */}
              <Card className="bg-[#080f1c] border-[#0f1f35]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-[#f5a623]" />
                    Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Organic</span>
                    <span className="font-mono font-semibold text-[#3ecf8e]">₹{diseaseInfo.cost_inr}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Chemical</span>
                    <span className="font-mono font-semibold text-[#4285f4]">₹{diseaseInfo.cost_inr + 150}</span>
                  </div>
                  <div className="pt-2 border-t border-[#0f1f35]">
                    <p className="text-xs text-[#64748b]">
                      Estimated cost per acre. Actual costs may vary based on local prices and severity.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Suppliers */}
              <Card className="bg-[#080f1c] border-[#0f1f35]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#4285f4]" />
                    Nearby Suppliers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {nearbySuppliers.map((supplier, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#03070f] border border-[#0f1f35]">
                      <p className="font-medium text-sm">{supplier.name}</p>
                      <p className="text-xs text-[#64748b] mb-2">{supplier.address}</p>
                      <a
                        href={`tel:${supplier.phone.replace(/\s/g, '')}`}
                        className="inline-flex items-center gap-1 text-xs text-[#3ecf8e] hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {supplier.phone}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="bg-[#080f1c] border-[#0f1f35]">
                <CardContent className="p-4">
                  <Button
                    onClick={handleShareWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#1da855] text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on WhatsApp
                  </Button>
                  <p className="text-xs text-center text-[#64748b] mt-2">
                    Share this cure guide with fellow farmers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
