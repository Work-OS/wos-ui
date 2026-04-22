"use client"

import { StatCard } from "@/components/custom/stat-card"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { useAuditLogs, useAdminStats } from "@/hooks/use-admin-audit"

const severityVariant: Record<string, "red" | "amber" | "gray"> = {
  critical: "red",
  warning: "amber",
  info: "gray",
}

export function OverviewSection() {
  const statsQ = useAdminStats()
  const logsQ = useAuditLogs({ size: 4 })

  const stats = statsQ.data
  const logs = logsQ.data?.content ?? []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total users"
          value={stats ? String(stats.totalUsers) : "—"}
          delta="2 this month"
          deltaUp={true}
          accent="blue"
        />
        <StatCard
          title="Active sessions"
          value={stats ? String(stats.activeSessions) : "—"}
          meta="Right now"
          accent="green"
        />
        <StatCard
          title="System health"
          value={stats ? `${stats.systemHealth}%` : "—"}
          meta="Last 30 days uptime"
          accent="green"
        />
        <StatCard
          title="Critical alerts"
          value={stats ? String(stats.criticalAlerts) : "—"}
          meta="Requires attention"
          accent="red"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border p-5">
          <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            System status
          </p>
          <div className="space-y-3">
            {[
              { svc: "API Gateway", ok: true },
              { svc: "Database", ok: true },
              { svc: "File storage", ok: true },
              { svc: "Email service", ok: false },
              { svc: "Background jobs", ok: true },
            ].map((s) => (
              <div
                key={s.svc}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-muted-foreground">{s.svc}</span>
                <StatusBadge variant={s.ok ? "green" : "amber"}>
                  {s.ok ? "Operational" : "Degraded"}
                </StatusBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 rounded-xl border border-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Recent audit events
            </p>
            <Button variant="ghost" size="xs">
              View all
            </Button>
          </div>
          {logsQ.isLoading ? (
            <p className="text-[13px] text-muted-foreground">Loading…</p>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                    {log.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium">
                        {log.action}
                      </p>
                      <StatusBadge
                        variant={severityVariant[log.severity] ?? "gray"}
                      >
                        {log.severity}
                      </StatusBadge>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {log.target}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
