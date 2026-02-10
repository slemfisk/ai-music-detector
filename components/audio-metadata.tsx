import { Clock, Radio, Waves, Volume2 } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface AudioMetadataProps {
  result: AnalysisResult
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function AudioMetadata({ result }: AudioMetadataProps) {
  const items = [
    { Icon: Clock, label: "Duration", value: formatDuration(result.duration_seconds) },
    { Icon: Waves, label: "Sample Rate", value: `${(result.sample_rate / 1000).toFixed(1)} kHz` },
    { Icon: Radio, label: "Channels", value: result.channels === 2 ? "Stereo" : "Mono" },
    { Icon: Volume2, label: "Loudness (EBU R128)", value: result.loudness_range_lufs ? `${result.loudness_range_lufs} LUFS` : "N/A" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ Icon, label, value }) => (
        <div key={label} className="bg-card rounded-lg border border-border px-3 py-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
        </div>
      ))}
    </div>
  )
}
