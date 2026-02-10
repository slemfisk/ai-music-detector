"use client"

import { useState, useEffect } from "react"

type Status = "online" | "offline" | "checking"

export function HealthStatus() {
  const [status, setStatus] = useState<Status>("checking")

  useEffect(() => {
    const timer = setTimeout(() => setStatus("online"), 1200)
    return () => clearTimeout(timer)
  }, [])

  const config: Record<Status, { dot: string; label: string }> = {
    online: { dot: "bg-primary", label: "System Online" },
    offline: { dot: "bg-destructive", label: "Offline" },
    checking: { dot: "bg-chart-2 animate-pulse", label: "Connecting..." },
  }

  const { dot, label } = config[status]

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
      <div className={`w-2 h-2 rounded-full ${dot}`} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
