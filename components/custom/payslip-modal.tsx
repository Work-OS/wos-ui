"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
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
      <DialogContent
        className="max-w-120 gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Payslip — {data.period}</DialogTitle>
        {/* Blue header */}
        <div className="bg-primary px-6 py-5 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase opacity-70">
                Payslip
              </p>
              <p className="mt-1 text-xl font-bold">{data.period}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-lg border border-white/30 bg-white/15 text-xs text-white hover:bg-white/25"
                onClick={() => alert("PDF download started")}
              >
                <HugeiconsIcon
                  icon={Download01Icon}
                  size={13}
                  strokeWidth={2}
                  className="mr-1"
                />
                PDF
              </Button>
              <DialogClose asChild>
                <button className="flex size-7 items-center justify-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25">
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={13}
                    strokeWidth={2.5}
                  />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </div>
          </div>
          <p className="mt-2 text-[13px] opacity-80">
            {employeeName} · {position} · {employeeId}
          </p>
        </div>

        <div className="px-6 pt-0 pb-6">
          {/* Earnings */}
          <div className="-mx-6 mb-0 bg-muted px-6 py-2">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
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
          <div className="-mx-6 mt-1 bg-muted px-6 py-2">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              Deductions
            </p>
          </div>
          <SlipRow
            label="SSS contribution"
            value={`-${data.sss}`}
            valueClass="text-danger"
          />
          <SlipRow
            label="PhilHealth"
            value={`-${data.philhealth}`}
            valueClass="text-danger"
          />
          <SlipRow
            label="Pag-IBIG"
            value={`-${data.pagibig}`}
            valueClass="text-danger"
          />
          <SlipRow
            label="Withholding tax"
            value={`-${data.tax}`}
            valueClass="text-danger"
          />

          {/* Net */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted p-4">
            <span className="text-sm font-bold text-foreground">Net pay</span>
            <span className="text-lg font-bold text-success">{data.net}</span>
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
      <span
        className={`text-[13px] font-medium tabular-nums ${valueClass ?? "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  )
}
