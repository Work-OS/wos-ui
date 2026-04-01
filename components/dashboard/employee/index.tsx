"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/custom/stat-card"
import { ClockWidget } from "@/components/custom/clock-widget"
import { CURRENT_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const LEAVE_BALANCES = [
  { label: "Vacation", days: 8, max: 12, indicatorClassName: "bg-primary" },
  { label: "Sick", days: 4, max: 12, indicatorClassName: "bg-success" },
  { label: "Emergency", days: 2, max: 12, indicatorClassName: "bg-warning" },
]

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

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export function OverviewSection() {
  const router = useRouter()

  const firstName = CURRENT_USER.name.split(" ")[0]
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

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
          value="142"
          delta="Year to date"
          deltaUp={true}
          accent="blue"
        />
        <StatCard
          title="Total leave used"
          value={
            <>
              8{" "}
              <span className="text-sm font-normal text-muted-foreground">days</span>
            </>
          }
          meta="5 vacation · 3 sick"
          accent="amber"
        />
        <StatCard
          title="Total hours worked"
          value={
            <>
              1,136{" "}
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
              3.5{" "}
              <span className="text-sm font-normal text-muted-foreground">hrs</span>
            </span>
          }
          delta="4 incidents this year"
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
            {LEAVE_BALANCES.map((l) => (
              <div key={l.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[13px] text-muted-foreground">{l.label}</span>
                  <span className="text-[13px] font-semibold">{l.days} days</span>
                </div>
                <Progress
                  value={(l.days / l.max) * 100}
                  className="h-1.5"
                  indicatorClassName={l.indicatorClassName}
                />
              </div>
            ))}
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
