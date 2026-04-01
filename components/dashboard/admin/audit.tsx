"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Download01Icon } from "@hugeicons/core-free-icons"
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
import { auditLogs } from "@/lib/mock-data"

const severityVariant: Record<string, "red" | "amber" | "gray"> = {
  critical: "red",
  warning: "amber",
  info: "gray",
}

export function AuditSection() {
  const { paginated, page, setPage, pageSize, setPageSize, total, totalPages } =
    usePagination(auditLogs)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} size={14} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Filter audit log…" />
        </div>
        <Button size="sm" variant="outline">
          <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} className="mr-1.5" />
          Export
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["ID", "User", "Action", "Target", "IP Address", "Timestamp", "Severity"].map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-[11px] text-muted-foreground">{log.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                    {log.initials}
                  </div>
                  <span>{log.user}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{log.action}</TableCell>
              <TableCell className="max-w-50 truncate text-muted-foreground">{log.target}</TableCell>
              <TableCell className="font-mono text-[11px] text-muted-foreground">{log.ip}</TableCell>
              <TableCell className="text-[11px] text-muted-foreground">{log.timestamp}</TableCell>
              <TableCell>
                <StatusBadge variant={severityVariant[log.severity]}>
                  {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                </StatusBadge>
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
