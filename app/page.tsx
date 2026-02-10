"use client"

import { useState } from "react"
import { AudioLines, AlertCircle } from "lucide-react"
import { FileUploader } from "@/components/file-uploader"
import { DepthSelector } from "@/components/depth-selector"
import AnalysisResults from "@/components/analysis-results"
import type { AnalysisDepth, AnalysisResult, AppState } from "@/lib/types"

async function analyzeAudio(file: File, depth: AnalysisDepth): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`/api/analyze?depth=${depth}`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.detail || `Analysis failed with status ${res.status}`)
  }

  return res.json()
}

export default function Page() {
  const [state, setState] = useState<AppState>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [depth, setDepth] = useState<AnalysisDepth>("standard")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleFileSelected = (file: File) => {
    setSelectedFile(file)
    setError("")
  }

  const handleClearFile = () => {
    setSelectedFile(null)
    setError("")
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setState("scanning")
    setError("")
    setResult(null)

    try {
      const analysisResult = await analyzeAudio(selectedFile, depth)
      setResult(analysisResult)
      setState("results")
    } catch (err: unknown) {
      let message = "An unexpected error occurred"
      if (err instanceof Error) {
        if (err.message.includes("NetworkError") || err.message.includes("Failed to fetch")) {
          message = "Cannot connect to the backend server. Make sure it is running on port 8000."
        } else if (err.message.includes("timeout")) {
          message = "Analysis timed out. Try a shorter audio file or a quicker analysis depth."
        } else {
          message = err.message
        }
      }
      setError(message)
      setState("error")
    }
  }

  const handleReset = () => {
    setState("idle")
    setSelectedFile(null)
    setResult(null)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <AudioLines className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">AI Audio Detector</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">Signal-level AI generation analysis</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results view */}
        {state === "results" && result && (
          <AnalysisResults result={result} onReset={handleReset} />
        )}

        {/* Scanning view */}
        {state === "scanning" && (
          <FileUploader
            onFileSelected={handleFileSelected}
            selectedFile={selectedFile}
            onClear={handleClearFile}
            isScanning
          />
        )}

        {/* Idle / Error view */}
        {(state === "idle" || state === "error") && (
          <div className="space-y-6">
            {/* Intro text */}
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">
                Detect AI-Generated Audio
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto text-pretty">
                Upload an audio file to analyze it for AI generation artifacts across 7 detection
                domains: spectral, spatial, temporal, structural, production, vocal, and watermark.
              </p>
            </div>

            {/* File uploader */}
            <FileUploader
              onFileSelected={handleFileSelected}
              selectedFile={selectedFile}
              onClear={handleClearFile}
            />

            {/* Depth selector + Analyze button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  Analysis Depth
                </label>
                <DepthSelector value={depth} onChange={setDepth} />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile}
                className={`
                  px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                  flex items-center gap-2
                  ${selectedFile
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                <AudioLines className="w-4 h-4" />
                Analyze Audio
              </button>
            </div>

            {/* Error display */}
            {state === "error" && error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-destructive">Analysis Failed</h3>
                  <p className="text-sm text-destructive/70 mt-1">{error}</p>
                  <button
                    onClick={() => {
                      setState("idle")
                      setError("")
                    }}
                    className="text-xs text-destructive hover:text-destructive/80 mt-2 underline underline-offset-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Domain info */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-4 text-center">
                Detection Domains
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { name: "Spectral", desc: "Frequency artifacts", depthReq: "quick" },
                  { name: "Spatial", desc: "Stereo imaging", depthReq: "quick" },
                  { name: "Production", desc: "Dynamics & reverb", depthReq: "quick" },
                  { name: "Temporal", desc: "Transients & rhythm", depthReq: "standard" },
                  { name: "Structural", desc: "Form & entropy", depthReq: "deep" },
                  { name: "Vocal", desc: "Formants & breath", depthReq: "deep" },
                  { name: "Watermark", desc: "AudioSeal check", depthReq: "deep" },
                ].map((d) => {
                  const isActive =
                    depth === "deep" ||
                    (depth === "standard" && d.depthReq !== "deep") ||
                    (depth === "quick" && d.depthReq === "quick")
                  return (
                    <div
                      key={d.name}
                      className={`rounded-lg px-3 py-2.5 text-center border transition-all duration-300 ${
                        isActive
                          ? "bg-card border-border text-foreground"
                          : "bg-secondary/30 border-border/30 text-muted-foreground/50"
                      }`}
                    >
                      <p className={`text-xs font-semibold ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {d.name}
                      </p>
                      <p className="text-[10px] mt-0.5">{d.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>AI Audio Detector v0.1.0</span>
          <span>{"17 checks \u00B7 7 domains \u00B7 Signal-level analysis"}</span>
        </div>
      </footer>
    </div>
  )
}
