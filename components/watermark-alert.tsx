import { Fingerprint } from "lucide-react"

export function WatermarkAlert() {
  return (
    <div className="bg-destructive/10 border-2 border-destructive/40 rounded-xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
        <Fingerprint className="w-5 h-5 text-destructive animate-pulse-glow" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-destructive">AudioSeal Detected</h3>
        <p className="text-xs text-destructive/70 mt-0.5">
          An AI provenance watermark was detected in this audio file, strongly indicating machine-generated content.
        </p>
      </div>
      <div className="bg-destructive/20 text-destructive text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0">
        Override Active
      </div>
    </div>
  )
}
