"use client"

import { useState } from "react"
import { StatCard } from "@/components/custom/stat-card"
import { StatusBadge } from "@/components/custom/status-badge"
import { PayslipModal } from "@/components/custom/payslip-modal"
import { Button } from "@/components/ui/button"
import { payslips } from "@/lib/mock-data"
import type { PayslipData } from "@/lib/types"

export function PayrollSection() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Current period" value="₱41,951.88" meta="March 2025 · Net pay" accent="green" />
        <StatCard title="YTD earnings" value="₱124,322" meta="Jan – Mar 2025" accent="blue" />
        <StatCard title="YTD deductions" value="₱16,350" meta="SSS · PhilHealth · Tax" accent="amber" />
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Payslip history</h3>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Period", "Basic", "OT", "Gross", "Deductions", "Net Pay", "Status", ""].map((h) => (
                  <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${h === "" || h === "Net Pay" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payslips.map((p, i) => (
                <tr
                  key={i}
                  className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/30"
                  onClick={() => setSelectedPayslip(p)}
                >
                  <td className="px-4 py-3 font-medium">{p.period}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{p.basic}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {p.ot !== "—" ? (
                      <span className="text-green-600 dark:text-green-400">+{p.ot}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{p.gross}</td>
                  <td className="px-4 py-3 tabular-nums text-red-600 dark:text-red-400">-{p.deductions}</td>
                  <td className="px-4 py-3 tabular-nums text-right font-semibold">{p.net}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={p.status === "released" ? "green" : "amber"}>
                      {p.status === "released" ? "Released" : "Pending"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="xs" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedPayslip(p) }}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PayslipModal open={!!selectedPayslip} onClose={() => setSelectedPayslip(null)} data={selectedPayslip} />
    </div>
  )
}
