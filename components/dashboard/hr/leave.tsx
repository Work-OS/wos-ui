"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { TablePagination } from "@/components/custom/table-pagination"
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
import {
  useLeaveRequests,
  useApproveLeave,
  useRejectLeave,
} from "@/hooks/use-hr"

export function LeaveSection() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data, isLoading, isError } = useLeaveRequests({
    page: page - 1,
    size: pageSize,
  })
  const approveMutation = useApproveLeave()
  const rejectMutation = useRejectLeave()

  const requests = data?.content ?? []
  const total = data?.totalElements ?? 0
  const totalPages = data?.totalPages ?? 0

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Leave requests</h3>
        <div className="flex gap-2">
          <StatusBadge variant="amber">{pendingCount} pending</StatusBadge>
          <StatusBadge variant="green">{approvedCount} approved</StatusBadge>
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-danger-border bg-danger-light px-4 py-3 text-[13px] text-danger">
          Failed to load leave requests
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {[
              "Employee",
              "Type",
              "From",
              "To",
              "Days",
              "Filed",
              "Status",
              "Actions",
            ].map((h) => (
              <TableHead
                key={h}
                className={h === "Actions" ? "text-right" : undefined}
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-[13px] text-muted-foreground"
              >
                Loading…
              </TableCell>
            </TableRow>
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-[13px] text-muted-foreground"
              >
                No leave requests
              </TableCell>
            </TableRow>
          ) : (
            requests.map((r) => {
              const initials = r.employeeName
                .split(" ")
                .map((n) => n[0] ?? "")
                .join("")
                .slice(0, 2)
                .toUpperCase()
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {initials}
                      </div>
                      <span className="font-medium">{r.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.leaveType}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {r.startDate}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {r.endDate}
                  </TableCell>
                  <TableCell className="text-center">{r.days}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {r.filedAt}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={
                        r.status === "approved"
                          ? "green"
                          : r.status === "pending"
                            ? "amber"
                            : "red"
                      }
                    >
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              className="border-success-border text-success hover:bg-gbg"
                              disabled={approveMutation.isPending}
                              onClick={() => approveMutation.mutate(r.id)}
                            >
                              <HugeiconsIcon
                                icon={CheckmarkCircle01Icon}
                                size={12}
                                strokeWidth={2.5}
                              />
                              <span className="sr-only">Approve</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Approve</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon-xs"
                              variant="outline"
                              className="border-danger-border text-danger hover:bg-rbg"
                              disabled={rejectMutation.isPending}
                              onClick={() => rejectMutation.mutate(r.id)}
                            >
                              <HugeiconsIcon
                                icon={Cancel01Icon}
                                size={12}
                                strokeWidth={2.5}
                              />
                              <span className="sr-only">Decline</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Decline</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          )}
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
