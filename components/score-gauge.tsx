"use client"

import { useEffect, useRef } from "react"
import { ShieldAlert, Shield, ShieldCheck, ShieldQuestion } from "lucide-react"

interface ScoreGaugeProps {
  score: number
  confidence: "low" | "medium" | "high"
  likelihood: "unknown" | "unlikely" | "possible" | "likely"
}

export function ScoreGauge({ score, confidence, likelihood }: ScoreGaugeProps) {
  const circleRef = useRef<SVGCircleElement>(null)
  const radius = 90
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.setProperty("--gauge-circumference", String(circumference))
    el.style.setProperty("--gauge-offset", String(offset))
  }, [circumference, offset])

  const getScoreColor = () => {
    if (score >= 65) return { stroke: "url(#gauge-red)", text: "text-destructive" }
    if (score >= 35) return { stroke: "url(#gauge-yellow)", text: "text-chart-2" }
    return { stroke: "url(#gauge-green)", text: "text-primary" }
  }

  const colors = getScoreColor()

  const getLikelihoodInfo = () => {
    switch (likelihood) {
      case "likely":
        return { label: "Likely AI-Generated", Icon: ShieldAlert, classes: "text-destructive bg-destructive/10 border-destructive/30" }
      case "possible":
        return { label: "Possibly AI-Generated", Icon: Shield, classes: "text-chart-2 bg-chart-2/10 border-chart-2/30" }
      case "unlikely":
        return { label: "Unlikely AI-Generated", Icon: ShieldCheck, classes: "text-primary bg-primary/10 border-primary/30" }
      default:
        return { label: "Unable to Determine", Icon: ShieldQuestion, classes: "text-muted-foreground bg-muted/50 border-border" }
    }
  }

  const info = getLikelihoodInfo()
  const Icon = info.Icon

  const confidenceStyles: Record<string, string> = {
    high: "bg-primary/15 text-primary border-primary/30",
    medium: "bg-chart-2/15 text-chart-2 border-chart-2/30",
    low: "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2} className="-rotate-90">
          <defs>
            <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0 84% 60%)" />
              <stop offset="100%" stopColor="hsl(20 90% 55%)" />
            </linearGradient>
            <linearGradient id="gauge-yellow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(48 96% 53%)" />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" />
            </linearGradient>
            <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(142 72% 50%)" />
              <stop offset="100%" stopColor="hsl(160 60% 45%)" />
            </linearGradient>
          </defs>
          <circle
            stroke="hsl(240 4% 14%)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            ref={circleRef}
            stroke={colors.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="animate-gauge-fill"
            style={
              {
                "--gauge-circumference": circumference,
                "--gauge-offset": offset,
              } as React.CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold font-mono tracking-tight ${colors.text}`}>
            {score.toFixed(0)}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            AI Score
          </span>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${info.classes}`}>
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold">{info.label}</span>
      </div>

      <span className={`text-xs px-3 py-1 rounded-full border font-medium ${confidenceStyles[confidence]}`}>
        {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
      </span>
    </div>
  )
}
