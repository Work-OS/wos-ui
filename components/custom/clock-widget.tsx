"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./status-badge"

interface Break {
  label: string
  allowMins: number
  elapsed: number
  active: boolean
  startTime: number | null
}

const BREAKS: Record<string, Break> = {
  morning: { label: "Morning", allowMins: 15, elapsed: 0, active: false, startTime: null },
  lunch: { label: "Lunch", allowMins: 60, elapsed: 0, active: false, startTime: null },
  afternoon: { label: "Afternoon", allowMins: 15, elapsed: 0, active: false, startTime: null },
}

function fmt(secs: number): string {
  const abs = Math.abs(secs)
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return (secs < 0 ? "+" : "") + m + ":" + String(s).padStart(2, "0")
}

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${h}h ${String(m).padStart(2, "0")}m`
}

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null)
  const [clocked, setClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [breaks, setBreaks] = useState<Record<string, Break>>(BREAKS)
  const [activeBreak, setActiveBreak] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => {
      setNow(new Date())
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const workSecs = clocked && clockInTime && now
    ? Math.floor((now.getTime() - clockInTime.getTime()) / 1000)
    : 0

  const breakSecs = Object.values(breaks).reduce((sum, b) => {
    if (b.active && b.startTime && now) {
      return sum + Math.floor((now.getTime() - b.startTime) / 1000)
    }
    return sum + b.elapsed
  }, 0)

  const netSecs = Math.max(0, workSecs - breakSecs)

  const handleClockToggle = () => {
    if (!clocked) {
      setClocked(true)
      setClockInTime(new Date())
      setBreaks(BREAKS)
      setActiveBreak(null)
    } else {
      setClocked(false)
      setClockInTime(null)
      setActiveBreak(null)
    }
  }

  const toggleBreak = useCallback((type: string) => {
    setBreaks((prev) => {
      const b = prev[type]
      if (!b) return prev
      if (!b.active) {
        // end any other active break first
        const updated = Object.fromEntries(
          Object.entries(prev).map(([k, v]) => {
            if (v.active && v.startTime) {
              return [k, { ...v, elapsed: v.elapsed + Math.floor((Date.now() - v.startTime) / 1000), active: false, startTime: null }]
            }
            return [k, v]
          })
        )
        updated[type] = { ...b, active: true, startTime: Date.now() }
        setActiveBreak(type)
        return updated
      } else {
        const elapsed = b.elapsed + (b.startTime ? Math.floor((Date.now() - b.startTime) / 1000) : 0)
        setActiveBreak(null)
        return { ...prev, [type]: { ...b, elapsed, active: false, startTime: null } }
      }
    })
  }, [])

  const getBreakRemaining = (b: Break): number => {
    const totalElapsed = b.active && b.startTime && now
      ? b.elapsed + Math.floor((now.getTime() - b.startTime) / 1000)
      : b.elapsed
    return b.allowMins * 60 - totalElapsed
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className={cn(
        "px-6 py-5 transition-colors",
        clocked ? "bg-primary" : "bg-muted/50"
      )}>
        <div className="flex items-start justify-between">
          <div>
            <p className={cn("text-xs font-semibold uppercase tracking-widest", clocked ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {clocked ? "Currently working" : "Ready to clock in"}
            </p>
            <p className={cn("mt-1 text-3xl font-bold tabular-nums tracking-tight", clocked ? "text-primary-foreground" : "text-foreground")}>
              {now?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }) ?? "—"}
            </p>
            <p className={cn("mt-0.5 text-sm", clocked ? "text-primary-foreground/70" : "text-muted-foreground")}>
              {now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) ?? ""}
            </p>
          </div>
          {clocked && (
            <div className="text-right">
              <p className="text-xs text-primary-foreground/70">Clocked in</p>
              <p className="text-sm font-semibold text-primary-foreground">{clockInTime ? fmtTime(clockInTime) : "—"}</p>
              <p className="mt-1 text-xs text-primary-foreground/70">Net time</p>
              <p className="text-base font-bold tabular-nums text-primary-foreground">{fmtDuration(netSecs)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Clock button */}
      <div className="px-6 py-4 border-b border-border">
        <Button
          onClick={handleClockToggle}
          className={cn(
            "w-full justify-center rounded-lg text-sm font-semibold transition-all duration-150",
            clocked
              ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          variant="ghost"
        >
          {clocked ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Clock Out
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
              </svg>
              Clock In
            </>
          )}
        </Button>
      </div>

      {/* Breaks */}
      {clocked && (
        <div className="px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Breaks
          </p>
          <div className="space-y-2">
            {Object.entries(breaks).map(([type, b]) => {
              const remaining = getBreakRemaining(b)
              const isOverbreak = remaining < 0
              const isActive = b.active

              return (
                <div
                  key={type}
                  id={`brk-row-${type}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                    isActive && !isOverbreak && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
                    isActive && isOverbreak && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
                    !isActive && "border-border bg-muted/30"
                  )}
                >
                  <div className="flex-1">
                    <p className="text-[12px] font-medium text-foreground">{b.label}</p>
                    <p className="text-[11px] text-muted-foreground">{b.allowMins} min allowed</p>
                  </div>
                  {isActive && (
                    <span className={cn(
                      "text-[12px] font-mono font-semibold tabular-nums",
                      isOverbreak ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    )}>
                      {isOverbreak ? "⚠ " : ""}{fmt(remaining)}
                    </span>
                  )}
                  <button
                    onClick={() => toggleBreak(type)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all",
                      isActive
                        ? "bg-foreground/10 text-foreground hover:bg-foreground/20"
                        : "bg-primary/10 text-primary hover:bg-primary/20",
                      isOverbreak && isActive && "animate-pulse bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                    )}
                  >
                    {isActive ? "End" : "Start"}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
