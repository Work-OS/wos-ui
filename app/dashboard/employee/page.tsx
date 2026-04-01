import type { Metadata } from "next"
import { OverviewSection } from "@/components/dashboard/employee"

export const metadata: Metadata = { title: "Overview" }

export default function EmployeeOverviewPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <OverviewSection />
    </div>
  )
}
