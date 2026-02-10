export type AnalysisDepth = "quick" | "standard" | "deep"

export type AppState = "idle" | "scanning" | "results" | "error"

export interface AIArtifact {
  name: string
  detected: boolean
  severity: "none" | "low" | "medium" | "high"
  value: number | null
  description: string
  probability: number
  domain: string
  weight: number
  tier: 1 | 2 | 3 | 4
}

export interface DomainResult {
  domain: string
  display_name: string
  score: number
  active: boolean
  weight: number
  artifacts: AIArtifact[]
}

export interface AnalysisResult {
  scan_id: string
  analyzed_at: string
  tool_version: string
  filename: string
  duration_seconds: number
  sample_rate: number
  channels: number
  peak_db: number
  rms_db: number
  overall_score: number
  confidence: "low" | "medium" | "high"
  confidence_value: number
  depth_used: string
  domain_results: DomainResult[]
  ai_artifacts: AIArtifact[]
  overall_ai_likelihood: "unknown" | "unlikely" | "possible" | "likely"
  high_freq_cutoff_hz: number | null
  stereo_correlation: number | null
  concordance_boost: boolean
  watermark_detected: boolean
  loudness_range_lufs: number | null
}
