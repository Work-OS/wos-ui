"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/custom/status-badge"
import { LeaveModal } from "@/components/custom/leave-modal"
import { CoeModal } from "@/components/custom/coe-modal"
import { DtrChangeModal } from "@/components/custom/dtr-change-modal"
import { ObModal } from "@/components/custom/ob-modal"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { leaveBalances } from "@/lib/mock-data"

export function LeaveSection() {
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [obOpen, setObOpen] = useState(false)
  const [coeOpen, setCoeOpen] = useState(false)
  const [dtrOpen, setDtrOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">Leave balance</h3>
        <div className="grid grid-cols-4 gap-3">
          {leaveBalances.map((b) => (
            <div key={b.type} className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {b.type.replace(" Leave", "")}
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground">{b.remaining}</p>
              <p className="text-[11px] text-muted-foreground">of {b.total} days</p>
              <Progress value={(b.remaining / b.total) * 100} className="mt-3 h-1" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setLeaveOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            File leave
          </Button>
          <Button size="sm" variant="outline" onClick={() => setObOpen(true)}>Official business</Button>
          <Button size="sm" variant="outline" onClick={() => setCoeOpen(true)}>Request COE</Button>
          <Button size="sm" variant="outline" onClick={() => setDtrOpen(true)}>DTR correction</Button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Leave history</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Type", "From", "To", "Days", "Filed", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { type: "Vacation leave", from: "Jun 14, 2025", to: "Jun 16, 2025", days: 3, filed: "Apr 1, 2025", status: "pending" },
                { type: "Sick leave", from: "Mar 5, 2025", to: "Mar 5, 2025", days: 1, filed: "Mar 5, 2025", status: "approved" },
                { type: "Vacation leave", from: "Mar 25, 2025", to: "Mar 26, 2025", days: 2, filed: "Mar 19, 2025", status: "approved" },
                { type: "Emergency leave", from: "Jan 10, 2025", to: "Jan 10, 2025", days: 1, filed: "Jan 9, 2025", status: "approved" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{r.type}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.from}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.to}</td>
                  <td className="px-4 py-3 text-center">{r.days}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{r.filed}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "red"}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveModal open={leaveOpen} onClose={() => setLeaveOpen(false)} />
      <ObModal open={obOpen} onClose={() => setObOpen(false)} />
      <CoeModal open={coeOpen} onClose={() => setCoeOpen(false)} />
      <DtrChangeModal open={dtrOpen} onClose={() => setDtrOpen(false)} />
    </div>
  )
}
