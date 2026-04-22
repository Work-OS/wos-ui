"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Download01Icon } from "@hugeicons/core-free-icons"
import { StatusBadge } from "@/components/custom/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TablePagination } from "@/components/custom/table-pagination"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { useAuditLogs } from "@/hooks/use-admin-audit"

const severityVariant: Record<string, "red" | "amber" | "gray"> = {
  critical: "red",
  warning: "amber",
  info: "gray",
}

export function AuditSection() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [search, setSearch] = useState("")

  const { data, isLoading, isError } = useAuditLogs({
    page: page - 1,
    size: pageSize,
    search: search || undefined,
  })

  const logs = data?.content ?? []
  const total = data?.totalElements ?? 0
  const totalPages = data?.totalPages ?? 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={14}
            strokeWidth={2}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-9"
            placeholder="Filter audit log…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <Button size="sm" variant="outline">
          <HugeiconsIcon
            icon={Download01Icon}
            size={13}
            strokeWidth={2}
            className="mr-1.5"
          />
          Export
        </Button>
      </div>

      {isError && (
        <p className="rounded-lg border border-danger-border bg-danger-light px-4 py-3 text-[13px] text-danger">
          Failed to load audit logs
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {[
              "ID",
              "User",
              "Action",
              "Target",
              "IP Address",
              "Timestamp",
              "Severity",
            ].map((h) => (
              <TableHead key={h}>{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-[13px] text-muted-foreground"
              >
                Loading…
              </TableCell>
            </TableRow>
          ) : logs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-[13px] text-muted-foreground"
              >
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {log.logCode}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
                      {log.initials}
                    </div>
                    <span>{log.user}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell className="max-w-50 truncate text-muted-foreground">
                  {log.target}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {log.ip}
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    variant={severityVariant[log.severity] ?? "gray"}
                  >
                    {log.severity.charAt(0).toUpperCase() +
                      log.severity.slice(1)}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))
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
