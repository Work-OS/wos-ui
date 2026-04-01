"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { employees } from "@/lib/mock-data"

export function UsersSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <Input className="pl-9" placeholder="Search users…" />
        </div>
        <Button size="sm">Add user</Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["User", "Department", "Role", "Status", "Last active", "Actions"].map((h) => (
                <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {emp.initials}
                    </div>
                    <div>
                      <p className="font-medium">{emp.name}</p>
                      <p className="text-[11px] text-muted-foreground">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{emp.department}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={emp.role === "admin" ? "amber" : emp.role === "hr" ? "purple" : "blue"} dot={false}>
                    {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge variant={emp.status === "active" ? "green" : "gray"}>
                    {emp.status === "on-leave" ? "On leave" : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-[12px] text-muted-foreground">
                  {emp.status === "active" ? "Just now" : "3 days ago"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="xs" variant="ghost">Edit</Button>
                    <Button size="xs" variant="ghost" className="text-destructive">Disable</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
