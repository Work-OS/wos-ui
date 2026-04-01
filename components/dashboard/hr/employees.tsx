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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { employees } from "@/lib/mock-data"
import { usePagination, TablePagination } from "@/components/custom/table-pagination"

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

  const { paginated, page, setPage, pageSize, setPageSize, total, totalPages } =
    usePagination(filtered)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <Input className="pl-9" placeholder="Search employees…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add employee
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["Employee", "Department", "Position", "Start date", "Status", ""].map((h) => (
              <TableHead key={h} className={h === "" ? "text-right" : undefined}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((emp) => (
            <TableRow key={emp.id} className="cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {emp.initials}
                  </div>
                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-[11px] text-muted-foreground">{emp.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{emp.department}</TableCell>
              <TableCell>{emp.position}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{emp.startDate}</TableCell>
              <TableCell>
                <StatusBadge variant={emp.status === "active" ? "green" : emp.status === "on-leave" ? "amber" : "gray"}>
                  {emp.status === "on-leave" ? "On leave" : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell className="text-right">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon-xs" variant="outline">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="sr-only">View profile</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View profile</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
      />

      <AddEmployeeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
