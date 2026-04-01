import type { Metadata } from "next"
import { EmployeesSection } from "@/components/dashboard/hr/employees"

export const metadata: Metadata = { title: "Employees" }

export default function EmployeesPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <EmployeesSection />
    </div>
  )
}
