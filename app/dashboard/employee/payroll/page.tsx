import type { Metadata } from "next"
import { PayrollSection } from "@/components/dashboard/employee/payroll"

export const metadata: Metadata = { title: "Payroll" }

export default function PayrollPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <PayrollSection />
    </div>
  )
}
