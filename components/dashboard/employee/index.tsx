"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/custom/stat-card"
import { ClockWidget } from "@/components/custom/clock-widget"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useEmployeeStats, useLeaveBalances } from "@/hooks/use-employee"

const ACTIVITIES = [
  {
    dot: "bg-success",
    title: "Leave request approved",
    meta: "Jun 14–16 vacation · approved by Sandra R.",
    time: "2d ago",
  },
  {
    dot: "bg-primary",
    title: "May payslip available",
    meta: "Net pay: ₱42,575 · download available",
    time: "Jun 1",
  },
  {
    dot: "bg-warning",
    title: "DTR correction pending",
    meta: "May 28 · missed clock-out · under review",
    time: "May 30",
  },
]

const LEAVE_COLOR_MAP: Record<string, string> = {
  "Vacation Leave": "bg-primary",
  "Sick Leave":     "bg-success",
  "Emergency Leave": "bg-warning",
  "Special Leave":  "bg-purple-500",
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export function OverviewSection() {
  const router    = useRouter()
  const { user }  = useAuthStore()
  const statsQ    = useEmployeeStats()
  const balancesQ = useLeaveBalances()

  const firstName = user?.firstName ?? "—"
  const dateStr   = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
  })

  const stats    = statsQ.data
  const balances = balancesQ.data ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[15px] font-semibold leading-snug">
          {getGreeting()}, {firstName}
        </p>
        <p className="text-sm text-muted-foreground">{dateStr} · 2 pending items</p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total days present"
          value={stats ? String(stats.totalDaysPresent) : "—"}
          delta="Year to date"
          deltaUp={true}
          accent="blue"
        />
        <StatCard
          title="Total leave used"
          value={
            <>
              {stats ? stats.totalLeaveUsed : "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">days</span>
            </>
          }
          meta={stats ? `${stats.leaveVacation} vacation · ${stats.leaveSick} sick` : ""}
          accent="amber"
        />
        <StatCard
          title="Total hours worked"
          value={
            <>
              {stats ? stats.totalHoursWorked.toLocaleString() : "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">hrs</span>
            </>
          }
          delta="Year to date"
          deltaUp={true}
          accent="green"
        />
        <StatCard
          title="Total hours late"
          value={
            <span className="text-danger">
              {stats ? stats.totalHoursLate : "—"}{" "}
              <span className="text-sm font-normal text-muted-foreground">hrs</span>
            </span>
          }
          delta={stats ? `${stats.lateIncidents} incidents this year` : ""}
          deltaUp={false}
          accent="red"
        />
      </div>

      {/* Clock widget + Leave balance */}
      <div className="grid grid-cols-2 gap-4">
        <ClockWidget />

        {/* Leave balance */}
        <Card>
          <CardHeader>
            <CardTitle>Leave balance</CardTitle>
            <CardAction>
              <Button size="sm" onClick={() => router.push("/dashboard/employee/request")}>
                + File leave
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {balancesQ.isLoading ? (
              <p className="text-[13px] text-muted-foreground">Loading…</p>
            ) : balances.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No leave balance data</p>
            ) : (
              balances.map((l) => (
                <div key={l.type}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[13px] text-muted-foreground">{l.type}</span>
                    <span className="text-[13px] font-semibold">{l.remaining} days</span>
                  </div>
                  <Progress
                    value={(l.remaining / l.total) * 100}
                    className="h-1.5"
                    indicatorClassName={LEAVE_COLOR_MAP[l.type] ?? "bg-primary"}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardAction>
            <button className="text-xs text-primary hover:underline">View all</button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={cn("mt-1 size-2 shrink-0 rounded-full", a.dot)} />
              <div className="flex-1">
                <p className="text-[13px] font-medium">{a.title}</p>
                <p className="text-[12px] text-muted-foreground">{a.meta}</p>
              </div>
              <span className="shrink-0 text-[12px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
