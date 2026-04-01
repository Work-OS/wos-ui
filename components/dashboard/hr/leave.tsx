"use client"

import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
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
import { leaveRequests } from "@/lib/mock-data"

export function LeaveSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Leave requests</h3>
        <div className="flex gap-2">
          <StatusBadge variant="amber">3 pending</StatusBadge>
          <StatusBadge variant="green">12 approved</StatusBadge>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["Employee", "Type", "From", "To", "Days", "Filed", "Status", "Actions"].map((h) => (
              <TableHead key={h} className={h === "Actions" ? "text-right" : undefined}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                    {r.initials}
                  </div>
                  <span className="font-medium">{r.employee}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{r.type}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{r.from}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{r.to}</TableCell>
              <TableCell className="text-center">{r.days}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{r.filed}</TableCell>
              <TableCell>
                <StatusBadge variant={r.status === "approved" ? "green" : r.status === "pending" ? "amber" : "red"}>
                  {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                </StatusBadge>
              </TableCell>
              <TableCell className="text-right">
                {r.status === "pending" && (
                  <div className="flex justify-end gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon-xs" variant="outline" className="border-success-border text-success hover:bg-gbg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          <span className="sr-only">Approve</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Approve</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon-xs" variant="outline" className="border-danger-border text-danger hover:bg-rbg">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                          <span className="sr-only">Decline</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Decline</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
