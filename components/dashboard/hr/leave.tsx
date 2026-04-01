"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { leaveRequests } from "@/lib/mock-data"

export function LeaveSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Leave requests</h3>
        <div className="flex gap-2">
          <StatusBadge variant="amber">3 pending</StatusBadge>
          <StatusBadge variant="green">12 approved</StatusBadge>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Employee", "Type", "From", "To", "Days", "Filed", "Status", "Actions"].map((h) => (
                <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {r.initials}
                    </div>
                    <span className="font-medium">{r.employee}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.from}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.to}</td>
                <td className="px-4 py-3 text-center">{r.days}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.filed}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "red"}>
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  {r.status === "pending" && (
                    <div className="flex justify-end gap-1">
                      <Button size="xs" variant="outline" className="border-green-200 text-green-600 dark:border-green-900 dark:text-green-400">✓</Button>
                      <Button size="xs" variant="outline" className="border-red-200 text-red-600 dark:border-red-900 dark:text-red-400">✕</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
