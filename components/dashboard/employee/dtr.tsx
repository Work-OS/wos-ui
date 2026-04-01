"use client"

import { useState, useEffect, useCallback } from "react"
import { StatusBadge } from "@/components/custom/status-badge"
import { DtrChangeModal } from "@/components/custom/dtr-change-modal"
import { Button } from "@/components/ui/button"
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

/** "10:49" countdown or "+1:00" for overbreak */
function fmtCountdown(secs: number): string {
  const abs = Math.abs(secs)
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return (secs < 0 ? "+" : "") + m + ":" + String(s).padStart(2, "0")
}

function fmtDuration(secs: number): string {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return `${h}h ${String(m).padStart(2, "0")}m`
}

function fmtTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
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
        <div className="col-span-3 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-col items-center px-6 py-5">

            {/* Label */}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Current time
            </p>

            {/* Big clock */}
            <p
              className="mt-2 font-bold tabular-nums leading-none"
              style={{ fontSize: 40, letterSpacing: "-1px" }}
            >
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
                <span>OT: {fmtDuration(otSecs)}</span>
              </div>
            )}

            {/* Clock in/out button */}
            <Button
              onClick={handleClockToggle}
              className={cn(
                "mt-3 w-full justify-center",
                clocked
                  ? "border border-red-200 bg-red-50 text-red-700 shadow-none hover:bg-red-100 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950"
                  : "",
              )}
              variant={clocked ? "ghost" : "default"}
            >
              {clocked ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  Clock out
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
                  </svg>
                  Clock in
                </>
              )}
            </Button>

            {/* Break panel — revealed when clocked in */}
            {clocked && (
              <>
                <div className="my-4 h-px w-full bg-border" />
                <div className="w-full">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Break controls
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {Object.entries(breaks).map(([type, b]) => {
                      const remaining = getBreakRemaining(b)
                      const isOverbreak = remaining < 0
                      const isDisabled = !!b.otOnly && otSecs === 0
                      return (
                        <div
                          key={type}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-2.5 py-2 transition-colors",
                            b.active && !isOverbreak && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
                            b.active && isOverbreak && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
                            !b.active && "border-border bg-muted/40",
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-[12px] font-medium">{b.label} break</p>
                              {b.otOnly && (
                                <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                  OT only
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              {b.allowMins} min allowance
                              {b.active && (
                                <span
                                  className={cn(
                                    "ml-1 font-semibold tabular-nums",
                                    isOverbreak
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-green-600 dark:text-green-400",
                                  )}
                                >
                                  · {isOverbreak ? "⚠ " : ""}{fmtCountdown(remaining)}
                                </span>
                              )}
                              {!b.active && b.elapsed > 0 && (
                                <span
                                  className={cn(
                                    "ml-1 tabular-nums",
                                    b.elapsed > b.allowMins * 60
                                      ? "text-red-500 dark:text-red-400"
                                      : "",
                                  )}
                                >
                                  · {fmtDuration(b.elapsed)} used
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            disabled={isDisabled || b.done}
                            onClick={() => !isDisabled && toggleBreak(type)}
                            className={cn(
                              "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all",
                              b.done && "cursor-not-allowed opacity-40",
                              isDisabled && !b.done && "cursor-not-allowed opacity-30",
                              !isDisabled && !b.done && !b.active && "bg-secondary text-foreground hover:bg-accent",
                              !isDisabled && !b.done && b.active && !isOverbreak && "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-400",
                              !isDisabled && !b.done && b.active && isOverbreak && "animate-pulse bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-400",
                            )}
                          >
                            {b.done ? "Done" : b.active ? "End break" : "Start break"}
                          </button>
                        </div>
                      )
                    })}
                  </div>
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
                  <span className="text-amber-600 dark:text-amber-400">Overtime</span>
                  <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">
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
                        used > b.allowMins * 60 ? "text-red-600 dark:text-red-400" : "",
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
              <StatusBadge variant={clocked ? "green" : clockOutTime ? "blue" : "gray"}>
                {clocked ? "Online" : clockOutTime ? "Clocked out" : "Offline"}
              </StatusBadge>
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
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Date", "Day", "Time in", "Time out", "Hours worked", "OT hours", "Status"].map((h) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
                      h === "Hours worked" || h === "OT hours" ? "text-right" : "text-left",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{r.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.day}</td>
                  <td className="px-4 py-3 tabular-nums">{r.timeIn}</td>
                  <td className="px-4 py-3 tabular-nums">{r.timeOut}</td>
                  <td className="px-4 py-3 tabular-nums text-right">{r.hoursWorked}</td>
                  <td className="px-4 py-3 tabular-nums text-right">
                    {r.otHours !== "—" ? (
                      <span className="font-medium text-primary">+{r.otHours}h</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={statusVariant[r.status] ?? "gray"}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DtrChangeModal open={dtrOpen} onClose={() => setDtrOpen(false)} />
    </div>
  )
}
