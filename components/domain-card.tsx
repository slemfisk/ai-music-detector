"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Activity,
  Radio,
  Sliders,
  Clock,
  Layers,
  Mic,
} from "lucide-react"
import type { DomainResult, AIArtifact } from "@/lib/types"

const DOMAIN_ICONS: Record<string, typeof Activity> = {
  spectral: Activity,
  spatial: Radio,
  production: Sliders,
  temporal: Clock,
  structural: Layers,
  vocal: Mic,
}

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  spectral: "Frequency-domain analysis of neural synthesis artifacts",
  spatial: "Stereo imaging and phase coherence analysis",
  production: "Mixing and mastering quality metrics",
  temporal: "Transient sharpness and rhythmic integrity",
  structural: "Musical form and compositional coherence",
  vocal: "Vocal synthesis artifact detection",
}

const TIER_LABELS: Record<number, string> = { 1: "Definitive", 2: "Strong", 3: "Moderate", 4: "Weak" }

const TIER_STYLES: Record<number, string> = {
  1: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  2: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  3: "bg-muted text-muted-foreground border-border",
  4: "bg-muted/50 text-muted-foreground/60 border-border/50",
}

function getScoreBarColor(score: number) {
  if (score >= 0.65) return "bg-destructive"
  if (score >= 0.35) return "bg-chart-2"
  return "bg-primary"
}

function getScoreTextColor(score: number) {
  if (score >= 0.65) return "text-destructive"
  if (score >= 0.35) return "text-chart-2"
  return "text-primary"
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    high: "bg-destructive/15 text-destructive border-destructive/30",
    medium: "bg-chart-2/15 text-chart-2 border-chart-2/30",
    low: "bg-chart-4/15 text-chart-4 border-chart-4/30",
    none: "bg-muted/50 text-muted-foreground/60 border-border/50",
  }
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${styles[severity] || styles.none}`}>
      {severity}
    </span>
  )
}

function TierBadge({ tier }: { tier: number }) {
  return (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border ${TIER_STYLES[tier] || TIER_STYLES[3]}`}>
      {TIER_LABELS[tier] || "Unknown"}
    </span>
  )
}

function ArtifactRow({ artifact }: { artifact: AIArtifact }) {
  const pct = Math.round(artifact.probability * 100)
  const barColor = artifact.probability >= 0.65 ? "bg-destructive" : artifact.probability >= 0.35 ? "bg-chart-2" : "bg-primary"

  return (
    <div className={`px-4 py-3 border-b border-border/50 last:border-b-0 ${artifact.detected ? "bg-secondary/30" : ""}`}>
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${artifact.detected ? "bg-destructive animate-pulse-glow" : "bg-muted-foreground/30"}`} />
          <span className="text-sm font-medium text-foreground truncate">
            {artifact.name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
          <TierBadge tier={artifact.tier} />
          <SeverityBadge severity={artifact.severity} />
        </div>
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%`, transition: "width 0.6s ease" }} />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono w-8 text-right">{pct}%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground ml-4 leading-relaxed">{artifact.description}</p>
      {artifact.value !== null && artifact.value !== undefined && (
        <div className="text-[11px] text-muted-foreground/60 ml-4 mt-1 font-mono">
          {"Measured: "}
          {typeof artifact.value === "number" ? artifact.value.toLocaleString() : artifact.value}
        </div>
      )}
    </div>
  )
}

interface DomainCardProps {
  domain: DomainResult
}

export function DomainCard({ domain }: DomainCardProps) {
  const [expanded, setExpanded] = useState(domain.active && domain.score > 0.2)

  const Icon = DOMAIN_ICONS[domain.domain] || Activity
  const description = DOMAIN_DESCRIPTIONS[domain.domain] || ""
  const scorePct = Math.round(domain.score * 100)
  const detectedCount = domain.artifacts.filter((a) => a.detected).length

  if (!domain.active) {
    return (
      <div className="bg-card/30 rounded-xl border border-border/30 p-4 opacity-60">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-muted-foreground/40" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground">{domain.display_name}</h3>
            <p className="text-xs text-muted-foreground/60 mt-0.5">{"Inactive -- requires deeper analysis"}</p>
          </div>
          <span className="text-xs text-muted-foreground/50 bg-secondary/50 px-2 py-1 rounded">Skipped</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          domain.score >= 0.65 ? "bg-destructive/10" : domain.score >= 0.35 ? "bg-chart-2/10" : "bg-primary/10"
        }`}>
          <Icon className={`w-4 h-4 ${getScoreTextColor(domain.score)}`} />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{domain.display_name}</h3>
            <span className="text-[10px] text-muted-foreground font-mono">{(domain.weight * 100).toFixed(0)}% wt</span>
            {detectedCount > 0 && (
              <span className="text-[10px] bg-destructive/15 text-destructive px-1.5 py-0.5 rounded-full font-medium">
                {detectedCount} detected
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{description}</p>
        </div>

        <div className="flex items-center gap-3 mr-2">
          <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getScoreBarColor(domain.score)}`}
              style={{ width: `${scorePct}%`, transition: "width 0.8s ease" }}
            />
          </div>
          <span className={`text-sm font-bold font-mono min-w-[36px] text-right ${getScoreTextColor(domain.score)}`}>
            {scorePct}%
          </span>
        </div>

        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && domain.artifacts.length > 0 && (
        <div className="border-t border-border">
          {domain.artifacts.map((artifact) => (
            <ArtifactRow key={artifact.name} artifact={artifact} />
          ))}
        </div>
      )}
    </div>
  )
}
