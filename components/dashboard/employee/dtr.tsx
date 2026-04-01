"use client"

import React, { useState, useEffect, useCallback } from "react"
import { StatusBadge } from "@/components/custom/status-badge"
import { DtrChangeModal } from "@/components/custom/dtr-change-modal"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { attendanceRecords } from "@/lib/mock-data"

const statusVariant: Record<string, "green" | "red" | "amber" | "gray" | "blue" | "purple"> = {
  present: "green",
  late: "amber",
  absent: "red",
  leave: "blue",
  holiday: "purple",
  restday: "gray",
}

interface DtrBreak {
  label: string
  allowMins: number
  elapsed: number
  active: boolean
  startTime: number | null
  done: boolean
  otOnly?: boolean
}

const INITIAL_BREAKS: Record<string, DtrBreak> = {
  morning: { label: "Morning", allowMins: 15, elapsed: 0, active: false, startTime: null, done: false },
  lunch: { label: "Lunch", allowMins: 60, elapsed: 0, active: false, startTime: null, done: false },
  afternoon: { label: "Afternoon", allowMins: 15, elapsed: 0, active: false, startTime: null, done: false },
  dinner: { label: "Dinner", allowMins: 30, elapsed: 0, active: false, startTime: null, done: false, otOnly: true },
}

function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${h}h ${String(m).padStart(2, "0")}m`
}

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

// ── Ring button ───────────────────────────────────────────────────────────────

function DtrRingButton({
  size, progress, ringColor, onClick, disabled, children, label, sublabel, pulse,
}: {
  size: number
  progress: number
  ringColor: string
  onClick: () => void
  disabled?: boolean
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
        disabled={disabled}
        className={cn(
          "relative flex items-center justify-center rounded-full bg-muted/50 transition-all duration-150",
          "hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
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

const BREAK_ICONS: Record<string, (color: string) => React.ReactNode> = {
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
  dinner: (c) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
      <path d="M12 3a6 6 0 009 9 9 9 0 11-9-9z" />
    </svg>
  ),
}

export function DTRSection() {
  const [now, setNow] = useState<Date | null>(null)
  const [clocked, setClocked] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [clockOutTime, setClockOutTime] = useState<Date | null>(null)
  const [breaks, setBreaks] = useState<Record<string, DtrBreak>>(INITIAL_BREAKS)
  const [dtrOpen, setDtrOpen] = useState(false)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const workSecs = clocked && clockInTime && now
    ? Math.floor((now.getTime() - clockInTime.getTime()) / 1000)
    : 0

  const breakSecs = Object.values(breaks).reduce((sum, b) => {
    if (b.active && b.startTime && now)
      return sum + Math.floor((now.getTime() - b.startTime) / 1000)
    return sum + b.elapsed
  }, 0)

  const netSecs = Math.max(0, workSecs - breakSecs)
  const stdSecs = 8 * 3600
  const otSecs = Math.max(0, netSecs - stdSecs)
  const progressPct = Math.min(100, (netSecs / stdSecs) * 100)

  const handleClockToggle = () => {
    if (!clocked) {
      setClocked(true)
      setClockInTime(new Date())
      setClockOutTime(null)
      setBreaks(INITIAL_BREAKS)
    } else {
      setClocked(false)
      setClockOutTime(new Date())
    }
  }

  const toggleBreak = useCallback((type: string) => {
    setBreaks((prev) => {
      const b = prev[type]
      if (!b || b.done) return prev
      if (!b.active) {
        // End any other active break first
        const updated = Object.fromEntries(
          Object.entries(prev).map(([k, v]) => {
            if (v.active && v.startTime) {
              return [k, { ...v, elapsed: v.elapsed + Math.floor((Date.now() - v.startTime) / 1000), active: false, startTime: null }]
            }
            return [k, v]
          })
        )
        updated[type] = { ...b, active: true, startTime: Date.now() }
        return updated
      } else {
        const elapsed = b.elapsed + (b.startTime ? Math.floor((Date.now() - b.startTime) / 1000) : 0)
        return { ...prev, [type]: { ...b, elapsed, active: false, startTime: null, done: true } }
      }
    })
  }, [])

  const getBreakRemaining = (b: DtrBreak) => {
    const used = b.active && b.startTime && now
      ? b.elapsed + Math.floor((now.getTime() - b.startTime) / 1000)
      : b.elapsed
    return b.allowMins * 60 - used
  }

  const getBreakUsed = (b: DtrBreak) => {
    if (b.active && b.startTime && now)
      return b.elapsed + Math.floor((now.getTime() - b.startTime) / 1000)
    return b.elapsed
  }

  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:-- --"

  const dateStr = now
    ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : ""

  const clockStatus = clocked ? "green" : clockOutTime ? "blue" : "gray"
  const clockLabel = clocked ? "Clocked in" : clockOutTime ? "Complete" : "Not clocked in"

  return (
    <div className="space-y-6">
      {/* Clock + summary */}
      <div className="grid grid-cols-5 gap-4">

        {/* ── Clock panel ── */}
        <div className="col-span-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className={cn("flex flex-col items-center px-6 py-5", !clocked && "h-full justify-center")}>

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
              <StatusBadge variant={clockStatus}>{clockLabel}</StatusBadge>
            </div>

            {/* OT banner */}
            {clocked && otSecs > 0 && (
              <div className="mt-2.5 flex w-full items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-[12px] font-medium text-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                OT: {fmtDuration(otSecs)}
              </div>
            )}

            {/* Clock in/out button */}
            <button
              onClick={handleClockToggle}
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
                    const remaining = getBreakRemaining(b)
                    const isOverbreak = remaining < 0
                    const isDisabled = !!b.otOnly && otSecs === 0
                    const hasStarted = b.elapsed > 0 || b.active
                    const breakProgress = Math.max(0, remaining / (b.allowMins * 60))
                    const ringColor = isDisabled || !hasStarted
                      ? "transparent"
                      : isOverbreak ? "var(--red)" : "var(--green)"
                    const iconColor = b.active
                      ? isOverbreak ? "var(--red)" : "var(--green)"
                      : isDisabled ? "var(--tx3)" : hasStarted ? "var(--tx3)" : "var(--tx2)"

                    return (
                      <DtrRingButton
                        key={type}
                        size={56}
                        progress={hasStarted ? breakProgress : 1}
                        ringColor={ringColor}
                        onClick={() => !isDisabled && !b.done && toggleBreak(type)}
                        disabled={isDisabled || b.done}
                        label={b.label}
                        sublabel={
                          b.otOnly && isDisabled ? "OT only" :
                          b.done ? "Done" :
                          b.active
                            ? isOverbreak ? `⚠ +${Math.ceil(Math.abs(remaining) / 60)}m` : `${Math.ceil(remaining / 60)}m left`
                            : b.elapsed > 0 ? `${Math.round(b.elapsed / 60)}m used`
                            : `${b.allowMins}m`
                        }
                        pulse={b.active && isOverbreak}
                      >
                        {BREAK_ICONS[type]?.(iconColor)}
                      </DtrRingButton>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Today's summary ── */}
        <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Today's summary
            </p>
          </div>
          <div className="space-y-4 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time in</p>
                <p className="mt-0.5 text-[15px] font-bold tabular-nums">
                  {clockInTime ? fmtTime(clockInTime) : "—"}
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time out</p>
                <p className="mt-0.5 text-[15px] font-bold tabular-nums">
                  {clockOutTime ? fmtTime(clockOutTime) : "—"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Hours worked</span>
                <span className="font-semibold tabular-nums">
                  {clocked ? fmtDuration(netSecs) : clockOutTime ? fmtDuration(netSecs) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Standard hours</span>
                <span className="tabular-nums text-muted-foreground">8h 00m</span>
              </div>
              {otSecs > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-warning">Overtime</span>
                  <span className="font-semibold tabular-nums text-warning">
                    +{fmtDuration(otSecs)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Progress toward 8h</span>
                <span className="font-medium tabular-nums">{Math.round(progressPct)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    progressPct >= 100 ? "bg-amber-500" : "bg-primary",
                  )}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Break summary
              </p>
              {Object.entries(breaks).map(([type, b]) => {
                const used = getBreakUsed(b)
                return (
                  <div key={type} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        used > b.allowMins * 60 ? "text-danger" : "",
                      )}
                    >
                      {used > 0 ? fmtDuration(used) : "—"}
                    </span>
                  </div>
                )
              })}
              <div className="flex items-center justify-between border-t border-border pt-1.5 text-[12px]">
                <span className="font-medium">Total break</span>
                <span className="font-semibold tabular-nums">
                  {breakSecs > 0 ? fmtDuration(breakSecs) : "—"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <StatusBadge variant={clockStatus}>{clockLabel}</StatusBadge>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px]"
                onClick={() => setDtrOpen(true)}
              >
                Request correction
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Attendance log ── */}
      <div>
        <div className="mb-3">
          <h3 className="font-semibold">Attendance log</h3>
          <p className="text-[12px] text-muted-foreground">
            March – April 2025 · 22 days worked · 1 late · 2 on leave
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {["Date", "Day", "Time in", "Time out", "Hours worked", "OT hours", "Status"].map((h) => (
                <TableHead
                  key={h}
                  className={h === "Hours worked" || h === "OT hours" ? "text-right" : undefined}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceRecords.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.date}</TableCell>
                <TableCell className="text-muted-foreground">{r.day}</TableCell>
                <TableCell className="tabular-nums">{r.timeIn}</TableCell>
                <TableCell className="tabular-nums">{r.timeOut}</TableCell>
                <TableCell className="tabular-nums text-right">{r.hoursWorked}</TableCell>
                <TableCell className="tabular-nums text-right">
                  {r.otHours !== "—" ? (
                    <span className="font-medium text-primary">+{r.otHours}h</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge variant={statusVariant[r.status] ?? "gray"}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DtrChangeModal open={dtrOpen} onClose={() => setDtrOpen(false)} />
    </div>
  )
}
