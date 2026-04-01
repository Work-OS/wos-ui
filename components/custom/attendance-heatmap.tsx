"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const TODAY = new Date(2026, 3, 1) // April 1, 2026
const CELL = 14
const GAP = 3
const DAY_LABEL_W = 28
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

// ── Types ──────────────────────────────────────────────────────────────────────

type DayStatus = "present" | "overtime" | "late" | "undertime" | "absent" | "leave" | "weekend" | "future"

type DayData = { date: Date; status: DayStatus } | null

// ── Color map ──────────────────────────────────────────────────────────────────

const STATUS_BG: Record<DayStatus, string> = {
  present: "bg-green-500",
  overtime: "bg-blue-500",
  late: "bg-amber-400",
  undertime: "bg-amber-400",
  absent: "bg-red-500",
  leave: "bg-purple-400",
  weekend: "bg-border",
  future: "bg-muted",
}

const STATUS_LABEL: Record<DayStatus, string> = {
  present: "Present",
  overtime: "Overtime",
  late: "Late",
  undertime: "Undertime",
  absent: "Absent",
  leave: "On leave",
  weekend: "Weekend",
  future: "—",
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function hashDate(date: Date): number {
  const str = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff
  }
  return hash % 100
}

function mockStatus(date: Date): DayStatus {
  const dow = date.getDay()
  if (dow === 0 || dow === 6) return "weekend"
  if (date > TODAY) return "future"
  const n = hashDate(date)
  if (n < 2) return "absent"
  if (n < 8) return "late"
  if (n < 13) return "undertime"
  if (n < 23) return "overtime"
  if (n < 26) return "leave"
  return "present"
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function buildYearData(year: number): DayData[][] {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)
  const days: DayData[] = []

  // Pad to start of week (Sun = 0)
  for (let i = 0; i < start.getDay(); i++) days.push(null)

  const d = new Date(start)
  while (d <= end) {
    days.push({ date: new Date(d), status: mockStatus(d) })
    d.setDate(d.getDate() + 1)
  }

  // Pad end to complete last week
  while (days.length % 7 !== 0) days.push(null)

  const weeks: DayData[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

function getMonthLabels(weeks: DayData[][]): (string | null)[] {
  return weeks.map((week) => {
    for (const day of week) {
      if (day && day.date.getDate() === 1) {
        return MONTHS[day.date.getMonth()]
      }
    }
    return null
  })
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AttendanceHeatmap() {
  const [year, setYear] = useState(2025)
  const weeks = buildYearData(year)
  const monthLabels = getMonthLabels(weeks)

  const allDays = weeks.flat()
  const workDays = allDays.filter(
    (d): d is NonNullable<DayData> => d !== null && d.status !== "weekend" && d.status !== "future",
  )
  const stats = {
    total: workDays.length,
    overtime: workDays.filter((d) => d.status === "overtime").length,
    late: workDays.filter((d) => d.status === "late").length,
    absent: workDays.filter((d) => d.status === "absent").length,
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[13px] font-semibold">Attendance history</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {stats.total} days recorded &middot; {stats.overtime} overtime &middot;{" "}
            {stats.late} late &middot; {stats.absent} absent
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[2023, 2024, 2025, 2026].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={cn(
                "rounded px-2 py-0.5 text-[12px] font-medium transition-colors",
                year === y
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div style={{ display: "inline-flex", flexDirection: "column", gap: GAP }}>

          {/* Month labels row */}
          <div style={{ display: "flex", gap: GAP, paddingLeft: DAY_LABEL_W + GAP }}>
            {monthLabels.map((label, wi) => (
              <div
                key={wi}
                style={{ width: CELL, fontSize: 10, lineHeight: 1 }}
                className="text-muted-foreground"
              >
                {label ?? ""}
              </div>
            ))}
          </div>

          {/* Day labels + grid */}
          <div style={{ display: "flex", gap: GAP }}>

            {/* Day label column */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: GAP, width: DAY_LABEL_W }}
            >
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  style={{ height: CELL, fontSize: 10 }}
                  className="flex items-center justify-end text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div style={{ display: "flex", gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                  {week.map((day, di) =>
                    day ? (
                      <div
                        key={di}
                        style={{ width: CELL, height: CELL, borderRadius: 3 }}
                        className={cn(
                          STATUS_BG[day.status],
                          "cursor-default transition-opacity hover:opacity-70",
                        )}
                        title={`${formatDay(day.date)} — ${STATUS_LABEL[day.status]}`}
                      />
                    ) : (
                      <div key={di} style={{ width: CELL, height: CELL }} />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
        <span>Less</span>
        {(["future", "present", "overtime", "late", "absent"] as DayStatus[]).map((s) => (
          <div
            key={s}
            style={{ width: 11, height: 11, borderRadius: 2 }}
            className={STATUS_BG[s]}
          />
        ))}
        <span className="mr-2">More</span>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {(
            [
              ["present", "Present"],
              ["overtime", "Overtime"],
              ["late", "Late"],
              ["absent", "Absent"],
              ["weekend", "Weekend"],
            ] as [DayStatus, string][]
          ).map(([s, label]) => (
            <div key={s} className="flex items-center gap-1">
              <div style={{ width: 10, height: 10, borderRadius: 2 }} className={STATUS_BG[s]} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
