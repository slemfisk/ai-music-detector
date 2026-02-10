import { Sparkles } from "lucide-react"

export function ConcordanceBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
      <Sparkles className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-semibold text-primary">Agreement Bonus Applied</span>
    </div>
  )
}
