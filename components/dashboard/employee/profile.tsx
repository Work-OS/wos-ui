"use client"

import { Button } from "@/components/ui/button"
import { CURRENT_USER } from "@/lib/mock-data"

export function ProfileSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {CURRENT_USER.initials}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{CURRENT_USER.name}</h2>
          <p className="text-sm text-muted-foreground">
            {CURRENT_USER.title} · {CURRENT_USER.department}
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{CURRENT_USER.employeeId}</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">Edit profile</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Personal information
          </p>
          <div className="space-y-3">
            {[
              { label: "Full name", value: CURRENT_USER.name },
              { label: "Email", value: CURRENT_USER.email },
              { label: "Phone", value: CURRENT_USER.phone },
              { label: "Address", value: CURRENT_USER.address },
            ].map((f) => (
              <div key={f.label} className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-medium text-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Employment information
          </p>
          <div className="space-y-3">
            {[
              { label: "Employee ID", value: CURRENT_USER.employeeId },
              { label: "Position", value: CURRENT_USER.title },
              { label: "Department", value: CURRENT_USER.department },
              { label: "Manager", value: CURRENT_USER.manager },
              { label: "Start date", value: CURRENT_USER.startDate },
            ].map((f) => (
              <div key={f.label} className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">{f.label}</span>
                <span className="font-medium text-foreground">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
