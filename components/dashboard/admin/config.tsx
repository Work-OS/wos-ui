"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"

export function ConfigSection() {
  return (
    <div className="space-y-4">
      {[
        {
          title: "Payroll settings",
          items: [
            { label: "Overtime multiplier", value: "1.30×", tag: "Modified" },
            { label: "Pay period", value: "Monthly (last business day)" },
            { label: "Cut-off date", value: "25th of each month" },
          ],
        },
        {
          title: "Attendance settings",
          items: [
            { label: "Core hours", value: "9:00 AM – 6:00 PM" },
            { label: "Late threshold", value: "10 minutes grace" },
            { label: "Half-day cut-off", value: "1:00 PM" },
          ],
        },
        {
          title: "Leave settings",
          items: [
            { label: "Vacation leave accrual", value: "1.25 days/month" },
            { label: "Sick leave accrual", value: "1.25 days/month" },
            { label: "Leave carry-over", value: "10 days max" },
          ],
        },
      ].map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-border p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-semibold">{section.title}</p>
            <Button size="xs" variant="outline">
              Edit
            </Button>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.value}</span>
                  {item.tag && (
                    <StatusBadge variant="amber" dot={false}>
                      {item.tag}
                    </StatusBadge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
