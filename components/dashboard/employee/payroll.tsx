"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, EyeIcon } from "@hugeicons/core-free-icons"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/custom/stat-card"
import { StatusBadge } from "@/components/custom/status-badge"
import { PayslipModal } from "@/components/custom/payslip-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { payslips, CURRENT_USER } from "@/lib/mock-data"
import { usePagination, TablePagination } from "@/components/custom/table-pagination"
import type { PayslipData } from "@/lib/types"
import { cn } from "@/lib/utils"

// ── helpers ──────────────────────────────────────────────────────────────────

function parseAmt(s: string): number {
  return parseFloat(s.replace(/[₱,]/g, "")) || 0
}

const DownloadIcon = ({ className }: { className?: string }) => (
  <HugeiconsIcon icon={Download01Icon} size={13} strokeWidth={2} className={className} />
)

// ── sub-components ────────────────────────────────────────────────────────────

function SectionBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-6 bg-muted px-6 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </p>
    </div>
  )
}

function SlipRow({
  label,
  value,
  labelClass,
  valueClass,
}: {
  label: string
  value: string
  labelClass?: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className={cn("text-[13px]", labelClass ?? "text-foreground")}>{label}</span>
      <span className={cn("text-[13px] font-medium tabular-nums", valueClass ?? "text-foreground")}>
        {value}
      </span>
    </div>
  )
}

function BreakdownBar({
  label,
  value,
  pct,
  indicatorClassName,
  valueClass,
}: {
  label: string
  value: string
  pct: number
  indicatorClassName: string
  valueClass?: string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px]">{label}</span>
        <span className={cn("text-[13px] font-semibold tabular-nums", valueClass)}>{value}</span>
      </div>
      <Progress value={pct} className="h-1.5" indicatorClassName={indicatorClassName} />
    </div>
  )
}

function YtdCard({
  label,
  value,
  meta,
  valueClass,
}: {
  label: string
  value: string
  meta?: string
  valueClass?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 text-lg font-bold tabular-nums", valueClass)}>{value}</p>
      {meta && <p className="mt-0.5 text-[11px] text-muted-foreground">{meta}</p>}
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

const latest = payslips.find((p) => p.status === "released") ?? payslips[1]

export function PayrollSection() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipData | null>(null)
  const { paginated, page, setPage, pageSize, setPageSize, total, totalPages } =
    usePagination(payslips)

  const basicAmt = parseAmt(latest.basic)
  const otAmt = parseAmt(latest.ot)
  const grossAmt = parseAmt(latest.gross)
  const ssAmt = parseAmt(latest.sss)
  const phAmt = parseAmt(latest.philhealth)
  const taxAmt = parseAmt(latest.tax)
  const dedAmt = parseAmt(latest.deductions)

  const month = latest.period.split(" ")[0]

  return (
    <div className="space-y-5">

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Basic salary"
          value="₱45,000"
          meta="Monthly base"
          accent="blue"
        />
        <StatCard
          title={`Total earnings (${month})`}
          value={latest.gross}
          delta={`Incl. ${latest.otHrs} hrs overtime`}
          deltaUp={true}
          accent="green"
        />
        <StatCard
          title="Total deductions"
          value={
            <span className="text-danger">{latest.deductions}</span>
          }
          meta="SSS · PhilHealth · Tax"
          accent="red"
        />
        <StatCard
          title={`Net pay (${month})`}
          value={
            <span className="text-success">{latest.net}</span>
          }
          delta="+₱575 vs prior month"
          deltaUp={true}
          accent="green"
        />
      </div>

      {/* ── Latest payslip + Pay breakdown ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Latest payslip — custom blue header, no Card wrapper */}
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          {/* Blue header */}
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
                  Latest payslip
                </p>
                <p className="mt-0.5 text-xl font-bold">{latest.period}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:text-white"
                onClick={() => setSelectedPayslip(latest)}
              >
                <DownloadIcon className="mr-1" />
                Download PDF
              </Button>
            </div>
            <p className="mt-2.5 text-[13px] opacity-80">
              {CURRENT_USER.name} · {CURRENT_USER.title} · {CURRENT_USER.employeeId}
            </p>
          </div>

          {/* Slip body */}
          <div className="px-6 pb-4">
            <SectionBand>Earnings</SectionBand>
            <SlipRow label="Basic salary" value={latest.basic} />
            {latest.ot !== "—" && (
              <SlipRow
                label={`Overtime — ${latest.otHrs} hrs`}
                value={`+${latest.ot}`}
                labelClass="text-muted-foreground"
                valueClass="text-success"
              />
            )}
            <SectionBand>Deductions</SectionBand>
            <SlipRow label="SSS contribution" value={`-${latest.sss}`} labelClass="text-muted-foreground" valueClass="text-danger" />
            <SlipRow label="PhilHealth" value={`-${latest.philhealth}`} labelClass="text-muted-foreground" valueClass="text-danger" />
            <SlipRow label="Pag-IBIG" value={`-${latest.pagibig}`} labelClass="text-muted-foreground" valueClass="text-danger" />
            <SlipRow label="Withholding tax" value={`-${latest.tax}`} labelClass="text-muted-foreground" valueClass="text-danger" />
            <div className="mt-3 flex items-center justify-between rounded-lg bg-muted px-4 py-3">
              <span className="text-[13px] font-bold">Net pay</span>
              <span className="text-lg font-bold text-success">
                {latest.net}
              </span>
            </div>
          </div>
        </div>

        {/* Pay breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Pay breakdown</CardTitle>
            <CardDescription>{latest.period} composition</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Earnings bars */}
            <BreakdownBar
              label="Basic salary"
              value={latest.basic.replace(".00", "")}
              pct={(basicAmt / grossAmt) * 100}
              indicatorClassName="bg-primary"
            />
            {latest.ot !== "—" && (
              <BreakdownBar
                label="Overtime"
                value={`+${latest.ot.replace(".00", "")}`}
                pct={(otAmt / grossAmt) * 100}
                indicatorClassName="bg-green-500"
                valueClass="text-success"
              />
            )}

            {/* Deduction bars */}
            <div className="space-y-3 border-t border-border pt-4">
              <BreakdownBar
                label="SSS"
                value={`-${latest.sss.replace(".00", "")}`}
                pct={(ssAmt / dedAmt) * 100}
                indicatorClassName="bg-red-500"
                valueClass="text-danger"
              />
              <BreakdownBar
                label="PhilHealth"
                value={`-${latest.philhealth.replace(".00", "")}`}
                pct={(phAmt / dedAmt) * 100}
                indicatorClassName="bg-red-500"
                valueClass="text-danger"
              />
              <BreakdownBar
                label="Withholding tax"
                value={`-${latest.tax.replace(".00", "")}`}
                pct={(taxAmt / dedAmt) * 100}
                indicatorClassName="bg-red-400"
                valueClass="text-danger"
              />
            </div>

            {/* Net total */}
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-[13px] font-semibold">Net pay</span>
              <span className="text-base font-bold text-success">
                {latest.net.replace(".00", "")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Payroll history ── */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll history</CardTitle>
          <CardDescription>Year to date · 2025</CardDescription>
          <CardAction>
            <Button size="sm" variant="outline">
              <DownloadIcon className="mr-1.5" />
              Export all
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { label: "Period", right: false },
                  { label: "Basic", right: true },
                  { label: "Overtime", right: true },
                  { label: "Gross", right: true },
                  { label: "Deductions", right: true },
                  { label: "Net pay", right: true },
                  { label: "Released", right: false },
                  { label: "Status", right: false },
                  { label: "Actions", right: false },
                ].map(({ label, right }) => (
                  <TableHead key={label} className={right ? "text-right" : undefined}>
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p, i) => {
                const isUpcoming = p.status === "upcoming"
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{p.period}</TableCell>
                    <TableCell className="tabular-nums text-right text-muted-foreground">
                      {isUpcoming ? <span className="text-muted-foreground">—</span> : p.basic}
                    </TableCell>
                    <TableCell className="tabular-nums text-right">
                      {p.ot !== "—" ? (
                        <span className="text-success">+{p.ot}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums text-right">
                      {isUpcoming ? <span className="text-muted-foreground">—</span> : p.gross}
                    </TableCell>
                    <TableCell className="tabular-nums text-right">
                      {p.deductions !== "—" ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default text-danger underline decoration-dashed underline-offset-2">
                              -{p.deductions}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="left"
                            showArrow={false}
                            className="min-w-50 flex-col items-stretch rounded-xl border border-border bg-card p-3 text-foreground shadow-raised"
                          >
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Deduction breakdown
                            </p>
                            {[
                              { label: "SSS", value: p.sss },
                              { label: "PhilHealth", value: p.philhealth },
                              { label: "Pag-IBIG", value: p.pagibig },
                              { label: "Withholding tax", value: p.tax },
                            ].map(({ label, value }) => (
                              <div
                                key={label}
                                className="flex justify-between gap-6 border-b border-border py-1 text-[12px] last:border-0"
                              >
                                <span className="text-muted-foreground">{label}</span>
                                <span className="font-medium text-danger">{value}</span>
                              </div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="tabular-nums text-right font-bold">
                      {isUpcoming ? (
                        <span className="font-normal text-muted-foreground">Pending</span>
                      ) : (
                        p.net
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.released}</TableCell>
                    <TableCell>
                      <StatusBadge variant={isUpcoming ? "amber" : "green"}>
                        {isUpcoming ? "Upcoming" : "Released"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      {isUpcoming ? (
                        <span className="text-[12px] text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon-xs" variant="outline" onClick={() => setSelectedPayslip(p)}>
                                <HugeiconsIcon icon={EyeIcon} size={12} strokeWidth={2} />
                                <span className="sr-only">View payslip</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View payslip</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon-xs" variant="default" onClick={() => setSelectedPayslip(p)}>
                                <DownloadIcon />
                                <span className="sr-only">Download PDF</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download PDF</TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
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

          {/* YTD summary */}
          <div className="mt-5 grid grid-cols-4 gap-3 border-t border-border pt-5">
            <YtdCard label="YTD gross earnings" value="₱233,325" />
            <YtdCard
              label="YTD overtime pay"
              value="₱8,325"
              valueClass="text-success"
              meta="31.25 hrs total"
            />
            <YtdCard
              label="YTD deductions"
              value="₱29,000"
              valueClass="text-danger"
            />
            <YtdCard
              label="YTD net pay"
              value="₱204,325"
              valueClass="text-success"
            />
          </div>
        </CardContent>
      </Card>

      <PayslipModal
        open={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        data={selectedPayslip}
      />
    </div>
  )
}
