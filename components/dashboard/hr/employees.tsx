"use client"

import { useState } from "react"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { employees } from "@/lib/mock-data"

function AddEmployeeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new employee</DialogTitle>
          <DialogDescription>Create a profile for a new team member</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>First name</Label>
              <Input placeholder="Jane" />
            </div>
            <div className="space-y-1.5">
              <Label>Last name</Label>
              <Input placeholder="Smith" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Work email</Label>
            <Input type="email" placeholder="jane@company.com" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select defaultValue="Engineering">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Engineering", "Design", "Sales", "People Ops", "Finance", "Marketing"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select defaultValue="employee">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <Input type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={onClose}>Create employee</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function EmployeesSection() {
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <Input className="pl-9" placeholder="Search employees…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add employee
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {["Employee", "Department", "Position", "Start date", "Status", ""].map((h) => (
                <th key={h} className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ${h === "" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/30">
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
                <td className="px-4 py-3">{emp.position}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{emp.startDate}</td>
                <td className="px-4 py-3">
                  <StatusBadge variant={emp.status === "active" ? "green" : emp.status === "on-leave" ? "amber" : "gray"}>
                    {emp.status === "on-leave" ? "On leave" : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="xs" variant="ghost">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
