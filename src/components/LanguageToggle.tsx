'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LANGUAGES } from '@/lib/diseases'

interface LanguageToggleProps {
  onLanguageChange?: (lang: string) => void
  defaultLang?: string
}

export function LanguageToggle({ onLanguageChange, defaultLang = 'en' }: LanguageToggleProps) {
  const [selected, setSelected] = useState(defaultLang)

  const handleChange = (lang: string) => {
    setSelected(lang)
    onLanguageChange?.(lang)
  }

  return (
    <div className="inline-flex rounded-lg bg-[#080f1c] border border-[#0f1f35] p-1">
      {LANGUAGES.map(lang => (
        <Button
          key={lang.code}
          size="sm"
          variant="ghost"
          onClick={() => handleChange(lang.code)}
          className={`px-3 py-1 text-sm ${
            selected === lang.code
              ? 'bg-[#3ecf8e] text-[#03070f] hover:bg-[#2eb97a]'
              : 'text-[#64748b] hover:text-[#e2e8f0]'
          }`}
        >
          {lang.native}
        </Button>
      ))}
    </div>
  )
}
