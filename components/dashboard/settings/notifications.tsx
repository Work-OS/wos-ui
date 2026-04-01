"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative h-4.75 w-8.5 rounded-full border transition-colors duration-150",
        checked ? "border-primary bg-primary" : "border-border bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-3.25 rounded-full bg-white shadow-sm transition-transform duration-150",
          checked ? "left-0.5 translate-x-3.75" : "left-0.5 translate-x-0",
        )}
      />
    </button>
  )
}

export function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    payroll: true,
    leave: true,
    dtr: true,
    announcements: false,
    digest: true,
  })

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const items = [
    { key: "payroll" as const, label: "Payroll released", desc: "Get notified when your payslip is available" },
    { key: "leave" as const, label: "Leave status updates", desc: "When your leave requests are approved or rejected" },
    { key: "dtr" as const, label: "DTR corrections", desc: "When time record corrections are processed" },
    { key: "announcements" as const, label: "Company announcements", desc: "General company news and updates" },
    { key: "digest" as const, label: "Weekly digest", desc: "Summary of your week every Friday" },
  ]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h3 className="text-[15px] font-semibold">Notifications</h3>
        <p className="text-[13px] text-muted-foreground">Choose what you'd like to be notified about</p>
      </div>
      <Separator />

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium">{item.label}</p>
              <p className="text-[12px] text-muted-foreground">{item.desc}</p>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  )
}
