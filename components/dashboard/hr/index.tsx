"use client"

import { StatCard } from "@/components/custom/stat-card"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { leaveRequests } from "@/lib/mock-data"

export function OverviewSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total employees" value="48" delta="2 this month" deltaUp={true} accent="blue" />
        <StatCard title="Present today" value="41" meta="85% attendance rate" accent="green" />
        <StatCard title="On leave" value="4" meta="3 approved · 1 pending" accent="amber" />
        <StatCard title="Open requests" value="7" meta="4 leave · 3 DTR" accent="red" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pending approvals</p>
            <StatusBadge variant="amber">4 pending</StatusBadge>
          </div>
          <div className="space-y-3">
            {leaveRequests.filter((r) => r.status === "pending").map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {r.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{r.employee}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {r.type} · {r.days} day{r.days !== 1 ? "s" : ""} · {r.from}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button size="xs" variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/30">
                    Approve
                  </Button>
                  <Button size="xs" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Headcount by department</p>
          <div className="space-y-3">
            {[
              { dept: "Engineering", count: 18, pct: 38 },
              { dept: "Design", count: 6, pct: 13 },
              { dept: "Sales", count: 10, pct: 21 },
              { dept: "People Ops", count: 5, pct: 10 },
              { dept: "Finance", count: 4, pct: 8 },
              { dept: "Marketing", count: 5, pct: 10 },
            ].map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-[13px] text-muted-foreground">{d.dept}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="w-6 shrink-0 text-right text-[12px] font-medium tabular-nums">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
