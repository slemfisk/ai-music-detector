"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, FileAudio, X, Loader2 } from "lucide-react"

interface FileUploaderProps {
  onFileSelected: (file: File) => void
  selectedFile: File | null
  onClear: () => void
  isScanning?: boolean
}

const SUPPORTED = [".wav", ".mp3", ".flac", ".ogg", ".m4a", ".aac", ".wma"]

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploader({ onFileSelected, selectedFile, onClear, isScanning }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validate = useCallback((file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (!SUPPORTED.includes(ext)) return false
    if (file.size > 500 * 1024 * 1024) return false
    return true
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (isScanning) return
      const file = e.dataTransfer.files[0]
      if (file && validate(file)) onFileSelected(file)
    },
    [isScanning, onFileSelected, validate]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file && validate(file)) onFileSelected(file)
      e.target.value = ""
    },
    [onFileSelected, validate]
  )

  if (isScanning) {
    return (
      <div className="relative rounded-xl border-2 border-primary/30 bg-primary/5 p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent animate-scan-line" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-primary/20 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Scanning Audio...</p>
            <p className="text-xs text-muted-foreground mt-1">Analyzing signal patterns across detection domains</p>
          </div>
        </div>
      </div>
    )
  }

  if (selectedFile) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileAudio className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">{formatSize(selectedFile.size)}</p>
        </div>
        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        rounded-xl border-2 border-dashed p-12 text-center cursor-pointer
        transition-all duration-200
        ${isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/40 hover:bg-card/50"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED.map((ext) => `audio/${ext.slice(1)}`).join(",") + "," + SUPPORTED.join(",")}
        onChange={handleChange}
        className="hidden"
      />
      <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`} />
      <p className="text-sm text-foreground font-medium">
        {isDragging ? "Drop your audio file here" : "Drag & drop an audio file, or click to browse"}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Supports {SUPPORTED.map((f) => f.slice(1).toUpperCase()).join(", ")} up to 500 MB
      </p>
    </div>
  )
}
