"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { StatusBadge } from "./status-badge"

// ── types ─────────────────────────────────────────────────────────────────────

interface BreakState {
  label: string
  allowMins: number
  elapsed: number
  active: boolean
  startTime: number | null
}

const INIT_BREAKS: Record<string, BreakState> = {
  morning:   { label: "Morning",   allowMins: 15, elapsed: 0, active: false, startTime: null },
  lunch:     { label: "Lunch",     allowMins: 60, elapsed: 0, active: false, startTime: null },
  afternoon: { label: "Afternoon", allowMins: 15, elapsed: 0, active: false, startTime: null },
}

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

// ── RingButton ────────────────────────────────────────────────────────────────

function RingButton({
  size, progress, ringColor, onClick, children, label, sublabel, pulse,
}: {
  size: number
  progress: number
  ringColor: string
  onClick: () => void
  children: React.ReactNode
  label: string
  sublabel?: string
  pulse?: boolean
}) {
  const sw = 3
  const r = (size - sw * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(1, Math.max(0, progress)))

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onClick}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-muted/50 transition-all duration-150 hover:bg-muted",
          pulse && "animate-pulse",
        )}
        style={{ width: size, height: size }}
      >
        <svg className="absolute inset-0" width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bdr)" strokeWidth={sw} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={ringColor} strokeWidth={sw} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
        <span className="relative z-10">{children}</span>
      </button>
      <div className="text-center leading-tight">
        <p className="text-[11px] font-semibold text-foreground">{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  )
}

// ── icons ─────────────────────────────────────────────────────────────────────

const BREAK_ICON: Record<string, (color: string) => React.ReactNode> = {
  morning: (c) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  lunch: (c) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <path d="M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </svg>
  ),
  afternoon: (c) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  ),
}

// ── ClockWidget ───────────────────────────────────────────────────────────────

export function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null)
  const [clocked, setClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [breaks, setBreaks] = useState<Record<string, BreakState>>(INIT_BREAKS)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const toggleBreak = useCallback((type: string) => {
    setBreaks((prev) => {
      const b = prev[type]
      if (!b) return prev
      if (!b.active) {
        const next = Object.fromEntries(
          Object.entries(prev).map(([k, v]) =>
            v.active && v.startTime
              ? [k, { ...v, elapsed: v.elapsed + Math.floor((Date.now() - v.startTime) / 1000), active: false, startTime: null }]
              : [k, v]
          )
        )
        next[type] = { ...b, active: true, startTime: Date.now() }
        return next
      } else {
        const elapsed = b.elapsed + (b.startTime ? Math.floor((Date.now() - b.startTime) / 1000) : 0)
        return { ...prev, [type]: { ...b, elapsed, active: false, startTime: null } }
      }
    })
  }, [])

  const getBreakData = (b: BreakState) => {
    const used = b.active && b.startTime && now
      ? b.elapsed + Math.floor((now.getTime() - b.startTime) / 1000)
      : b.elapsed
    const remaining = b.allowMins * 60 - used
    const isOver = remaining < 0
    const progress = Math.max(0, remaining / (b.allowMins * 60))
    return { remaining, isOver, progress }
  }

  const timeStr = now?.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true,
  }) ?? "—"
  const dateStr = now?.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  }) ?? ""

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col items-center px-6 py-5">

        {/* Current time label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Current time
        </p>

        {/* Big clock */}
        <p className="mt-2 font-bold tabular-nums leading-none" style={{ fontSize: 40, letterSpacing: "-1px" }}>
          {timeStr}
        </p>

        {/* Date */}
        <p className="mt-1 text-[12px] text-muted-foreground">{dateStr}</p>

        {/* Status badge */}
        <div className="mt-3">
          <StatusBadge variant={clocked ? "green" : "gray"}>
            {clocked ? `Clocked in · ${clockInTime ? fmtTime(clockInTime) : ""}` : "Not clocked in"}
          </StatusBadge>
        </div>

        {/* Clock in/out button */}
        <button
          onClick={() => {
            if (!clocked) {
              setClocked(true)
              setClockInTime(new Date())
              setBreaks(INIT_BREAKS)
            } else {
              setClocked(false)
              setClockInTime(null)
            }
          }}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all duration-150",
            clocked
              ? "border border-danger-border bg-danger-light text-danger hover:bg-rt"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {clocked ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Clock Out
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
              </svg>
              Clock In
            </>
          )}
        </button>

        {/* Break controls — only when clocked in */}
        {clocked && (
          <>
            <div className="my-4 h-px w-full bg-border" />
            <p className="mb-3 w-full text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Break controls
            </p>
            <div className="flex w-full items-start justify-around">
              {Object.entries(breaks).map(([type, b]) => {
                const { remaining, isOver, progress } = getBreakData(b)
                const hasStarted = b.elapsed > 0 || b.active
                const ringColor = !hasStarted ? "transparent" : isOver ? "var(--red)" : "var(--green)"
                const iconColor = b.active
                  ? isOver ? "var(--red)" : "var(--green)"
                  : hasStarted ? "var(--tx3)" : "var(--tx2)"
                const sublabel = b.active
                  ? isOver ? `⚠ +${Math.ceil(Math.abs(remaining) / 60)}m` : `${Math.ceil(remaining / 60)}m left`
                  : b.elapsed > 0 ? `${Math.round(b.elapsed / 60)}m used` : `${b.allowMins}m`

                return (
                  <RingButton
                    key={type}
                    size={56}
                    progress={hasStarted ? progress : 1}
                    ringColor={ringColor}
                    onClick={() => toggleBreak(type)}
                    label={b.label}
                    sublabel={sublabel}
                    pulse={b.active && isOver}
                  >
                    {BREAK_ICON[type]?.(iconColor)}
                  </RingButton>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
