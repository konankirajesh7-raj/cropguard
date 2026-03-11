'use client'

import Link from 'next/link'
import { Check, MapPin, Share2, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface DiagnoseCardProps {
  disease: string
  slug: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  treatments: string[]
  imageUrl?: string
  onReport?: () => void
  onShare?: () => void
  reported?: boolean
}

export function DiagnoseCard({
  disease,
  slug,
  confidence,
  severity,
  treatments,
  onReport,
  onShare,
  reported = false
}: DiagnoseCardProps) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'low': return 'text-[#3ecf8e]'
      case 'medium': return 'text-[#f5a623]'
      case 'high': return 'text-[#ff5c5c]'
      default: return 'text-[#64748b]'
    }
  }

  const getSeverityBg = (sev: string) => {
    switch (sev) {
      case 'low': return 'bg-[#3ecf8e]/20 border-[#3ecf8e]/30'
      case 'medium': return 'bg-[#f5a623]/20 border-[#f5a623]/30'
      case 'high': return 'bg-[#ff5c5c]/20 border-[#ff5c5c]/30'
      default: return 'bg-[#64748b]/20'
    }
  }

  return (
    <Card className="bg-[#080f1c] border-[#0f1f35] overflow-hidden">
      <CardHeader className={`p-4 border-b border-[#0f1f35] ${getSeverityBg(severity)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#64748b] mb-1">Diagnosis Result</p>
            <CardTitle className={`text-2xl ${getSeverityColor(severity)}`}>
              {disease}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-semibold border-current ${getSeverityColor(severity)}`}
          >
            {severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Confidence */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#64748b]">Confidence</span>
            <span className="font-mono font-semibold">{(confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress value={confidence * 100} className="h-2" />
        </div>

        {/* Quick Treatment Steps */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-[#3ecf8e]" />
            Quick Treatment Steps
          </h3>
          <ol className="space-y-2">
            {treatments.map((step, i) => (
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
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/cure/${slug}`}>
            <Button variant="outline" className="w-full border-[#3ecf8e] text-[#3ecf8e] hover:bg-[#3ecf8e]/10">
              Full Cure Guide
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Button
            onClick={onShare}
            variant="outline"
            className="border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
          >
            <Share2 className="w-4 h-4 mr-1" />
            WhatsApp
          </Button>
        </div>

        {/* Report to Map */}
        {onReport && (
          <div className="mt-6 pt-6 border-t border-[#0f1f35]">
            <Button
              onClick={onReport}
              disabled={reported}
              variant={reported ? 'outline' : 'default'}
              className={`w-full ${reported ? 'border-[#3ecf8e] text-[#3ecf8e]' : 'bg-[#4285f4] hover:bg-[#3b7ae0]'}`}
            >
              {reported ? (
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
        )}
      </CardContent>
    </Card>
  )
}
