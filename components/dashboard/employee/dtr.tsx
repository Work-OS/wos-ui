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
  otOnly?: boolean
}

const DTR_BREAKS: Record<string, DtrBreak> = {
  morning: { label: "Morning", allowMins: 15, elapsed: 0, active: false, startTime: null },
  lunch: { label: "Lunch", allowMins: 60, elapsed: 0, active: false, startTime: null },
  afternoon: { label: "Afternoon", allowMins: 15, elapsed: 0, active: false, startTime: null },
  dinner: { label: "Dinner", allowMins: 30, elapsed: 0, active: false, startTime: null, otOnly: true },
}

function fmt(secs: number): string {
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
  const [breaks, setBreaks] = useState<Record<string, DtrBreak>>(DTR_BREAKS)
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
    if (b.active && b.startTime && now) return sum + Math.floor((now.getTime() - b.startTime) / 1000)
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
      setBreaks(DTR_BREAKS)
    } else {
      setClocked(false)
      setClockOutTime(new Date())
    }
  }

  const toggleBreak = useCallback((type: string) => {
    setBreaks((prev) => {
      const b = prev[type]
      if (!b) return prev
      if (!b.active) {
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
        return { ...prev, [type]: { ...b, elapsed, active: false, startTime: null } }
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
    if (b.active && b.startTime && now) return b.elapsed + Math.floor((now.getTime() - b.startTime) / 1000)
    return b.elapsed
  }

  return (
    <div className="space-y-6">
      {/* Clock + summary */}
      <div className="grid grid-cols-5 gap-4">
        {/* Clock panel */}
        <div className="col-span-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className={cn("px-6 py-5 transition-colors", clocked ? "bg-primary" : "bg-muted/50")}>
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
              {clocked && otSecs > 0 && (
                <div className="rounded-lg bg-amber-400/20 px-3 py-1.5 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200">Overtime</p>
                  <p className="text-base font-bold tabular-nums text-amber-100">{fmtDuration(otSecs)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-b border-border px-6 py-4">
            <Button
              onClick={handleClockToggle}
              variant="ghost"
              className={cn(
                "w-full justify-center rounded-lg text-sm font-semibold transition-all duration-150",
                clocked
                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {clocked ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-2"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>Clock Out</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>Clock In</>
              )}
            </Button>
          </div>

          <div className="px-6 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Breaks</p>
            <div className="space-y-2">
              {Object.entries(breaks).map(([type, b]) => {
                const remaining = getBreakRemaining(b)
                const isOverbreak = remaining < 0
                const disabled = !clocked || (!!b.otOnly && otSecs === 0)
                return (
                  <div
                    key={type}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
                      b.active && !isOverbreak && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
                      b.active && isOverbreak && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
                      !b.active && "border-border bg-muted/30",
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[12px] font-medium text-foreground">{b.label}</p>
                        {b.otOnly && (
                          <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                            OT only
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{b.allowMins} min allowed</p>
                    </div>
                    {b.active && (
                      <span className={cn("text-[12px] font-mono font-semibold tabular-nums", isOverbreak ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400")}>
                        {isOverbreak ? "⚠ " : ""}{fmt(remaining)}
                      </span>
                    )}
                    <button
                      onClick={() => !disabled && toggleBreak(type)}
                      disabled={disabled}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all",
                        disabled && "cursor-not-allowed opacity-30",
                        !disabled && b.active && "bg-foreground/10 text-foreground hover:bg-foreground/20",
                        !disabled && !b.active && "bg-primary/10 text-primary hover:bg-primary/20",
                        !disabled && isOverbreak && b.active && "animate-pulse bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
                      )}
                    >
                      {b.active ? "End" : "Start"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Today's summary */}
        <div className="col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Today's summary</p>
          </div>
          <div className="space-y-4 px-5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time in</p>
                <p className="mt-0.5 text-[15px] font-bold tabular-nums">{clockInTime ? fmtTime(clockInTime) : "—"}</p>
              </div>
              <div className="rounded-lg bg-muted/50 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time out</p>
                <p className="mt-0.5 text-[15px] font-bold tabular-nums">{clockOutTime ? fmtTime(clockOutTime) : "—"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Hours worked</span>
                <span className="font-semibold tabular-nums">{clocked ? fmtDuration(netSecs) : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Standard hours</span>
                <span className="tabular-nums text-muted-foreground">8h 00m</span>
              </div>
              {otSecs > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-amber-600 dark:text-amber-400">Overtime</span>
                  <span className="font-semibold tabular-nums text-amber-600 dark:text-amber-400">+{fmtDuration(otSecs)}</span>
                </div>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Progress toward 8h</span>
                <span className="font-medium tabular-nums">{Math.round(progressPct)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000", progressPct >= 100 ? "bg-amber-500" : "bg-primary")}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Break time</p>
              {Object.entries(breaks).map(([type, b]) => {
                const used = getBreakUsed(b)
                return (
                  <div key={type} className="flex items-center justify-between text-[12px]">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className={cn("font-medium tabular-nums", used > b.allowMins * 60 ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                      {used > 0 ? fmtDuration(used) : "—"}
                    </span>
                  </div>
                )
              })}
              <div className="flex items-center justify-between border-t border-border pt-1.5 text-[12px]">
                <span className="font-medium">Total</span>
                <span className="font-semibold tabular-nums">{breakSecs > 0 ? fmtDuration(breakSecs) : "—"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <StatusBadge variant={clocked ? "green" : "gray"}>
                {clocked ? "Online" : clockOutTime ? "Clocked out" : "Offline"}
              </StatusBadge>
              <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => setDtrOpen(true)}>
                Request correction
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance log */}
      <div>
        <div className="mb-3">
          <h3 className="font-semibold">Attendance log</h3>
          <p className="text-[12px] text-muted-foreground">March – April 2025 · 22 days worked · 1 late · 2 on leave</p>
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
                      h === "Hours worked" || h === "OT hours" ? "text-right" : "text-left"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{r.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.day}</td>
                  <td className="px-4 py-3 tabular-nums">{r.timeIn}</td>
                  <td className="px-4 py-3 tabular-nums">{r.timeOut}</td>
                  <td className="px-4 py-3 tabular-nums text-right">{r.hoursWorked}</td>
                  <td className="px-4 py-3 tabular-nums text-right">
                    {r.otHours !== "—" ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">+{r.otHours}h</span>
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
