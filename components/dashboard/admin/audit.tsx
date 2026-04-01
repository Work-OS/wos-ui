"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auditLogs } from "@/lib/mock-data"

const severityVariant: Record<string, "red" | "amber" | "gray"> = {
  critical: "red",
  warning: "amber",
  info: "gray",
}

export function AuditSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <Input className="pl-9" placeholder="Filter audit log…" />
        </div>
        <Button size="sm" variant="outline">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["ID", "User", "Action", "Target", "IP Address", "Timestamp", "Severity"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{log.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      {log.initials}
                    </div>
                    <span>{log.user}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{log.action}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{log.target}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{log.ip}</td>
                <td className="px-4 py-3 text-[11px] text-muted-foreground">{log.timestamp}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={severityVariant[log.severity]}>
                    {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
