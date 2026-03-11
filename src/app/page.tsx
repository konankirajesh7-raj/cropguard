'use client'

import Link from 'next/link'
import { Camera, MapPin, Shield, Zap, Leaf, ChevronRight, Smartphone, Clock, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#03070f] text-[#e2e8f0]">
      {/* Background pattern */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3ecf8e] to-[#4285f4] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#03070f]" />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>
            CropGuard<span className="text-[#3ecf8e]">.ai</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[#64748b] hover:text-[#3ecf8e] transition-colors hidden sm:block">
            Dashboard
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg border border-[#0f1f35] hover:border-[#3ecf8e] text-sm transition-colors"
          >
            Register
          </Link>
          <Link
            href="/diagnose"
            className="px-4 py-2 rounded-lg bg-[#3ecf8e] text-[#03070f] font-semibold text-sm hover:bg-[#2eb97a] transition-colors"
          >
            Scan Crop
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a4a35]/30 border border-[#3ecf8e]/30 text-[#3ecf8e] text-sm mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Detection
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Detect crop disease{' '}
                <span className="gradient-text">in 10 seconds</span>
              </h1>
              <p className="text-lg text-[#64748b] mb-8 max-w-xl mx-auto lg:mx-0">
                Turn your smartphone into a crop doctor. Get instant AI diagnosis, treatment advice, and protect your harvest from disease outbreaks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/diagnose"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3ecf8e] text-[#03070f] font-semibold hover:bg-[#2eb97a] transition-all glow-green"
                >
                  <Camera className="w-5 h-5" />
                  Scan Your Crop
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#0f1f35] hover:border-[#3ecf8e] transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  View Outbreak Map
                </Link>
              </div>
            </div>

            {/* Right content - Stats */}
            <div className="flex-1 w-full max-w-md">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#080f1c] border border-[#0f1f35] text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#3ecf8e] mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>21</div>
                  <div className="text-xs text-[#64748b]">Days Earlier Detection</div>
                </div>
                <div className="p-4 rounded-xl bg-[#080f1c] border border-[#0f1f35] text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#4285f4] mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>10s</div>
                  <div className="text-xs text-[#64748b]">Diagnosis Time</div>
                </div>
                <div className="p-4 rounded-xl bg-[#080f1c] border border-[#0f1f35] text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#f5a623] mb-1" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>200+</div>
                  <div className="text-xs text-[#64748b]">Diseases Known</div>
                </div>
              </div>
              {/* Mini stat cards */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#080f1c] border border-[#0f1f35]">
                  <div className="w-10 h-10 rounded-lg bg-[#1a4a35] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#3ecf8e]" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">3 weeks head start</div>
                    <div className="text-xs text-[#64748b]">Before visible symptoms appear</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#080f1c] border border-[#0f1f35]">
                  <div className="w-10 h-10 rounded-lg bg-[#1a3a4a] flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#4285f4]" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Works offline</div>
                    <div className="text-xs text-[#64748b]">No internet needed in field</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 lg:px-12 py-20 bg-[#080f1c]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              How It Works
            </h2>
            <p className="text-[#64748b] max-w-xl mx-auto">
              Three simple steps to protect your crops from disease
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl bg-[#03070f] border border-[#0f1f35] hover:border-[#3ecf8e]/50 transition-colors group">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#3ecf8e] text-[#03070f] font-bold flex items-center justify-center text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                1
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#1a4a35] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-[#3ecf8e]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Snap a Photo</h3>
              <p className="text-[#64748b] text-sm">
                Take a clear photo of any affected leaf, stem, or fruit using your phone camera. Works with any smartphone.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-[#03070f] border border-[#0f1f35] hover:border-[#4285f4]/50 transition-colors group">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#4285f4] text-white font-bold flex items-center justify-center text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                2
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#1a3a4a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-[#4285f4]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Diagnoses</h3>
              <p className="text-[#64748b] text-sm">
                Our AI model analyzes your image in seconds, identifying the disease with high accuracy and confidence score.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-[#03070f] border border-[#0f1f35] hover:border-[#f5a623]/50 transition-colors group">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#f5a623] text-[#03070f] font-bold flex items-center justify-center text-sm" style={{ fontFamily: 'IBM Plex Mono, monospace' }}>
                3
              </div>
              <div className="w-14 h-14 rounded-xl bg-[#3a3a1a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7 text-[#f5a623]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Cure</h3>
              <p className="text-[#64748b] text-sm">
                Receive instant treatment recommendations with organic and chemical options, costs, and timeline to act.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: 'Syne, sans-serif' }}>
                Real-time Outbreak{' '}
                <span className="gradient-text">Alerts</span>
              </h2>
              <p className="text-[#64748b] mb-8">
                Get WhatsApp alerts when disease is detected near your farm. Our system monitors reports across Andhra Pradesh and warns you before disease spreads to your area.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff5c5c]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-[#ff5c5c]" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Early Warning System</div>
                    <div className="text-sm text-[#64748b]">Alerts sent when 3+ cases detected within 10km in 1 hour</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3ecf8e]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#3ecf8e]" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">Live Outbreak Map</div>
                    <div className="text-sm text-[#64748b]">Track disease spread in real-time across all districts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4285f4]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Smartphone className="w-4 h-4 text-[#4285f4]" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">WhatsApp Notifications</div>
                    <div className="text-sm text-[#64748b]">Receive alerts directly on WhatsApp — no app install required</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="p-6 rounded-2xl bg-[#080f1c] border border-[#0f1f35]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5c5c]" />
                  <div className="w-3 h-3 rounded-full bg-[#f5a623]" />
                  <div className="w-3 h-3 rounded-full bg-[#3ecf8e]" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#ff5c5c]/10 border border-[#ff5c5c]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-[#ff5c5c]" />
                      <span className="font-semibold text-sm text-[#ff5c5c]">Late Blight Alert</span>
                    </div>
                    <p className="text-xs text-[#64748b]">5 cases in Visakhapatnam — Act within 3 days</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#f5a623]/10 border border-[#f5a623]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-[#f5a623]" />
                      <span className="font-semibold text-sm text-[#f5a623]">Early Blight Warning</span>
                    </div>
                    <p className="text-xs text-[#64748b]">3 cases in East Godavari — Monitor closely</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#3ecf8e]/10 border border-[#3ecf8e]/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-[#3ecf8e]" />
                      <span className="font-semibold text-sm text-[#3ecf8e]">Your Area: Safe</span>
                    </div>
                    <p className="text-xs text-[#64748b]">No outbreaks detected within 20km</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-[#0f1f35]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#3ecf8e]" />
            <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
              CropGuard<span className="text-[#3ecf8e]">.ai</span>
            </span>
          </div>
          <p className="text-sm text-[#64748b]">
            Built for farmers of Andhra Pradesh 🇮🇳
          </p>
          <div className="flex items-center gap-4 text-sm text-[#64748b]">
            <Link href="/dashboard" className="hover:text-[#3ecf8e] transition-colors">Dashboard</Link>
            <Link href="/diagnose" className="hover:text-[#3ecf8e] transition-colors">Diagnose</Link>
            <Link href="/register" className="hover:text-[#3ecf8e] transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
