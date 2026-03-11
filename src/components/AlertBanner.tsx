'use client'

import { AlertTriangle, X, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AlertBannerProps {
  diseaseName: string
  district: string
  count: number
  onClose?: () => void
}

export function AlertBanner({ diseaseName, district, count, onClose }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleClose = () => {
    setDismissed(true)
    onClose?.()
  }

  return (
    <Card className="bg-[#ff5c5c]/10 border-[#ff5c5c]/30 rounded-none border-x-0 border-t-0">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff5c5c]/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#ff5c5c]" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                ⚠ Outbreak Alert: {diseaseName} in {district}
              </p>
              <p className="text-xs text-[#64748b]">
                {count} cases reported in the last hour within 10km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="border-[#ff5c5c] text-[#ff5c5c] hover:bg-[#ff5c5c]/10">
                <MapPin className="w-4 h-4 mr-1" />
                View Map
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={handleClose} className="text-[#64748b] hover:text-[#e2e8f0]">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
