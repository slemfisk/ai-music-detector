"use client"

import { FileAudio, RotateCcw, Download } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"
import { ScoreGauge } from "./score-gauge"
import { DomainCard } from "./domain-card"
import { AudioMetadata } from "./audio-metadata"
import { WatermarkAlert } from "./watermark-alert"
import { ConcordanceBadge } from "./concordance-badge"

interface AnalysisResultsProps {
  result: AnalysisResult
  onReset: () => void
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const activeDomains = result.domain_results.filter((d) => d.active)
  const inactiveDomains = result.domain_results.filter((d) => !d.active)
  const sortedActive = [...activeDomains].sort((a, b) => b.score - a.score)

  const handleExportJSON = () => {
    const exportData = {
      ...result,
      export_metadata: {
        exported_at: new Date().toISOString(),
        export_format_version: "1.0",
      },
    }
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const baseName = result.filename.replace(/\.[^/.]+$/, "")
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
    const link = document.createElement("a")
    link.href = url
    link.download = `${baseName}_analysis_${timestamp}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileAudio className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">{result.filename}</h2>
            <p className="text-xs text-muted-foreground">
              {"Analyzed at "}
              <span className="text-foreground font-medium">{result.depth_used}</span>
              {" depth"}
              {result.scan_id && (
                <span className="ml-2 text-muted-foreground/50 font-mono" title={`Scan ID: ${result.scan_id}`}>
                  {result.scan_id.slice(0, 8)}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze Another</span>
          </button>
        </div>
      </div>

      {/* Watermark Alert */}
      {result.watermark_detected && <WatermarkAlert />}

      {/* Audio Metadata Grid */}
      <AudioMetadata result={result} />

      {/* Score + Domains layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score gauge column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center">
            <ScoreGauge
              score={result.overall_score}
              confidence={result.confidence}
              likelihood={result.overall_ai_likelihood}
            />
            {result.concordance_boost && (
              <div className="mt-4">
                <ConcordanceBadge />
              </div>
            )}
          </div>

          {/* Detection summary */}
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Detection Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Domains analyzed</span>
              <span className="text-foreground font-medium font-mono">
                {activeDomains.length} / {result.domain_results.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Artifacts detected</span>
              <span className="text-foreground font-medium font-mono">
                {result.ai_artifacts.filter((a) => a.detected).length} / {result.ai_artifacts.length}
              </span>
            </div>
            {result.high_freq_cutoff_hz && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">HF cutoff</span>
                <span className="text-foreground font-medium font-mono">
                  {(result.high_freq_cutoff_hz / 1000).toFixed(1)} kHz
                </span>
              </div>
            )}
            {result.stereo_correlation !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stereo correlation</span>
                <span className="text-foreground font-medium font-mono">
                  {result.stereo_correlation?.toFixed(3)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Domain cards column */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain Analysis</h3>
          {sortedActive.map((domain) => (
            <DomainCard key={domain.domain} domain={domain} />
          ))}
          {inactiveDomains.length > 0 && (
            <>
              <h3 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mt-4">
                Inactive Domains
              </h3>
              {inactiveDomains.map((domain) => (
                <DomainCard key={domain.domain} domain={domain} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
