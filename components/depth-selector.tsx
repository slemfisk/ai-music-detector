"use client"

import { Zap, Settings, Search } from "lucide-react"
import type { AnalysisDepth } from "@/lib/types"

interface DepthSelectorProps {
  value: AnalysisDepth
  onChange: (depth: AnalysisDepth) => void
  disabled?: boolean
}

const options = [
  { value: "quick" as const, label: "Quick", Icon: Zap },
  { value: "standard" as const, label: "Standard", Icon: Settings },
  { value: "deep" as const, label: "Deep", Icon: Search },
]

export function DepthSelector({ value, onChange, disabled }: DepthSelectorProps) {
  return (
    <div className="flex rounded-lg border border-border bg-secondary/50 p-1">
      {options.map((opt) => {
        const isSelected = value === opt.value
        const Icon = opt.Icon
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium
              transition-all duration-200
              ${isSelected
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
