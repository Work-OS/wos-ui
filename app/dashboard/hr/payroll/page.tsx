import type { Metadata } from "next"

export const metadata: Metadata = { title: "Payroll" }

export default function HRPayrollPage() {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
      <p className="font-medium">Payroll view</p>
      <p className="text-[12px]">Coming soon</p>
    </div>
  )
}
