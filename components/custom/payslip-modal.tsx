"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { PayslipData } from "@/lib/types"

interface PayslipModalProps {
  open: boolean
  onClose: () => void
  data: PayslipData | null
  employeeName?: string
  employeeId?: string
  position?: string
}

export function PayslipModal({
  open,
  onClose,
  data,
  employeeName = "Alex Johnson",
  employeeId = "EMP-2847",
  position = "UX Designer L2",
}: PayslipModalProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-[480px] gap-0">
        <DialogTitle className="sr-only">Payslip — {data.period}</DialogTitle>
        {/* Blue header */}
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
                Payslip
              </p>
              <p className="mt-1 text-xl font-bold">{data.period}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/15 text-white hover:bg-white/25 border border-white/30 rounded-lg text-xs"
              onClick={() => alert("PDF download started")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PDF
            </Button>
          </div>
          <p className="mt-2 text-[13px] opacity-80">
            {employeeName} · {position} · {employeeId}
          </p>
        </div>

        <div className="px-6 pb-6 pt-0">
          {/* Earnings */}
          <div className="-mx-6 bg-muted px-6 py-2 mb-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Earnings
            </p>
          </div>
          <SlipRow label="Basic salary" value={data.basic} />
          {data.ot && data.ot !== "—" && (
            <SlipRow
              label={`${data.otHrs} hrs overtime`}
              value={`+${data.ot}`}
              valueClass="text-success"
            />
          )}

          {/* Deductions */}
          <div className="-mx-6 bg-muted px-6 py-2 mt-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Deductions
            </p>
          </div>
          <SlipRow label="SSS contribution" value={`-${data.sss}`} valueClass="text-danger" />
          <SlipRow label="PhilHealth" value={`-${data.philhealth}`} valueClass="text-danger" />
          <SlipRow label="Pag-IBIG" value={`-${data.pagibig}`} valueClass="text-danger" />
          <SlipRow label="Withholding tax" value={`-${data.tax}`} valueClass="text-danger" />

          {/* Net */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="text-sm font-bold text-foreground">Net pay</span>
            <span className="text-lg font-bold text-success">
              {data.net}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SlipRow({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className={`text-[13px] font-medium tabular-nums ${valueClass ?? "text-foreground"}`}>
        {value}
      </span>
    </div>
  )
}
