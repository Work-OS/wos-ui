"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Edit01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePagination, TablePagination } from "@/components/custom/table-pagination"
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
  const { paginated, page, setPage, pageSize, setPageSize, total, totalPages } =
    usePagination(employees)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
                        <HugeiconsIcon icon={Edit01Icon} size={12} strokeWidth={2} />
                        <span className="sr-only">Edit user</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit user</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon-xs" variant="outline" className="border-danger-border text-danger hover:bg-rbg">
                        <HugeiconsIcon icon={Cancel01Icon} size={12} strokeWidth={2} />
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
      <TablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
      />
    </div>
  )
}
