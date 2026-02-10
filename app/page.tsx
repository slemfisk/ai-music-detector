"use client"

import { useState, useCallback } from "react"
import { AudioLines, AlertCircle, Activity, Radio, Sliders, Clock, Layers, Mic, Fingerprint } from "lucide-react"
import type { AnalysisDepth, AppState, AnalysisResult } from "@/lib/types"
import { MOCK_RESULT } from "@/lib/mock-data"
import { FileUploader } from "@/components/file-uploader"
import { DepthSelector } from "@/components/depth-selector"
import { HealthStatus } from "@/components/health-status"
import { AnalysisResults } from "@/components/analysis-results"

const DOMAIN_INFO = [
  { name: "Spectral", desc: "Frequency artifacts", depth: "quick", weight: "40%", Icon: Activity },
  { name: "Structural", desc: "Form & entropy", depth: "deep", weight: "20%", Icon: Layers },
  { name: "Vocal", desc: "Formants & breath", depth: "deep", weight: "20%", Icon: Mic },
  { name: "Temporal", desc: "Transients & rhythm", depth: "standard", weight: "10%", Icon: Clock },
  { name: "Spatial", desc: "Stereo imaging", depth: "quick", weight: "5%", Icon: Radio },
  { name: "Production", desc: "Dynamics & reverb", depth: "quick", weight: "5%", Icon: Sliders },
]

function isDomainActive(depth: AnalysisDepth, domainDepth: string) {
  if (depth === "deep") return true
  if (depth === "standard") return domainDepth !== "deep"
  return domainDepth === "quick"
}

export default function Page() {
  const [state, setState] = useState<AppState>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [depth, setDepth] = useState<AnalysisDepth>("standard")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleFileSelected = useCallback((file: File) => {
    setSelectedFile(file)
    setError("")
  }, [])

  const handleClearFile = useCallback(() => {
    setSelectedFile(null)
    setError("")
  }, [])

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return
    setState("scanning")
    setError("")
    setResult(null)

    // Simulate analysis delay based on depth
    const delays: Record<AnalysisDepth, number> = { quick: 2000, standard: 3500, deep: 5000 }
    await new Promise((resolve) => setTimeout(resolve, delays[depth]))

    try {
      // In production, this would call the backend API
      // const analysisResult = await analyzeAudio(selectedFile, depth)
      setResult({ ...MOCK_RESULT, filename: selectedFile.name, depth_used: depth })
      setState("results")
    } catch {
      setError("Analysis failed. Please check your backend connection.")
      setState("error")
    }
  }, [selectedFile, depth])

  const handleReset = useCallback(() => {
    setState("idle")
    setSelectedFile(null)
    setResult(null)
    setError("")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <AudioLines className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">Audio Artifact Detector</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Signal-level forensic analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HealthStatus />
            {state === "idle" || state === "error" ? (
              <DepthSelector value={depth} onChange={setDepth} />
            ) : null}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results view */}
        {state === "results" && result && (
          <AnalysisResults result={result} onReset={handleReset} />
        )}

        {/* Scanning / Idle / Error views */}
        {(state === "idle" || state === "error" || state === "scanning") && (
          <div className="space-y-6">
            {/* Intro */}
            {state !== "scanning" && (
              <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-foreground text-balance">
                  Detect AI-Generated Audio
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto mt-2 leading-relaxed">
                  Upload an audio file to analyze it for AI generation artifacts across 6 detection
                  domains: spectral, spatial, temporal, structural, production, and vocal.
                </p>
              </div>
            )}

            {/* File uploader */}
            <FileUploader
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              onClear={handleClearFile}
              isScanning={state === "scanning"}
            />

            {/* Analyze button */}
            {state !== "scanning" && (
              <div className="flex justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile}
                  className={`
                    px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                    flex items-center gap-2
                    ${selectedFile
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:brightness-110"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                    }
                  `}
                >
                  <AudioLines className="w-4 h-4" />
                  Analyze Audio
                </button>
              </div>
            )}

            {/* Error display */}
            {state === "error" && error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-destructive">Analysis Failed</h3>
                  <p className="text-sm text-destructive/70 mt-1">{error}</p>
                  <button
                    onClick={() => { setState("idle"); setError("") }}
                    className="text-xs text-destructive hover:text-destructive/80 mt-2 underline underline-offset-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Domain info grid */}
            {state !== "scanning" && (
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4 text-center">
                  Detection Domains
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {DOMAIN_INFO.map((d) => {
                    const isActive = isDomainActive(depth, d.depth)
                    const Icon = d.Icon
                    return (
                      <div
                        key={d.name}
                        className={`rounded-xl px-3 py-3 border transition-all duration-300 ${
                          isActive
                            ? "bg-card border-border text-foreground"
                            : "bg-card/30 border-border/30 text-muted-foreground/40"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
                          <span className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground/40"}`}>
                            {d.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground/60">{d.desc}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-[10px] font-mono ${isActive ? "text-primary/70" : "text-muted-foreground/30"}`}>
                            {d.weight}
                          </span>
                          <span className={`text-[9px] uppercase tracking-wider ${
                            isActive ? "text-primary/50" : "text-muted-foreground/20"
                          }`}>
                            {d.depth}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">Audio Artifact Detector v0.2.0</span>
          <span>{"17 checks \u00B7 6 domains \u00B7 Signal-level analysis"}</span>
        </div>
      </footer>
    </div>
  )
}
