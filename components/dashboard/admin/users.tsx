"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

      <Table>
        <TableHeader>
          <TableRow>
            {["User", "Department", "Role", "Status", "Last active", "Actions"].map((h) => (
              <TableHead key={h} className={h === "Actions" ? "text-right" : undefined}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
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
              <TableCell>
                <StatusBadge variant={emp.role === "admin" ? "amber" : emp.role === "hr" ? "purple" : "blue"} dot={false}>
                  {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <StatusBadge variant={emp.status === "active" ? "green" : "gray"}>
                  {emp.status === "on-leave" ? "On leave" : emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell className="text-[12px] text-muted-foreground">
                {emp.status === "active" ? "Just now" : "3 days ago"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon-xs" variant="outline">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span className="sr-only">Edit user</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit user</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon-xs" variant="outline" className="border-danger-border text-danger hover:bg-rbg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        <span className="sr-only">Disable user</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Disable user</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
