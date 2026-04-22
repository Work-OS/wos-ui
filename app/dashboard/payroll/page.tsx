import type { Metadata } from "next"
import { PayrollSection } from "@/components/dashboard/employee/payroll"

export const metadata: Metadata = { title: "Payroll" }

export default function PayrollPage() {
  return (
    <div className="animate-in p-6 duration-300 fade-in">
      <PayrollSection />
    </div>
  )
}
