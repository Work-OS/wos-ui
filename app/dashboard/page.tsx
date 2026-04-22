import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/overview"

export const metadata: Metadata = { title: "Overview" }

export default function DashboardPage() {
  return (
    <div className="animate-in p-6 duration-300 fade-in">
      <DashboardOverview />
    </div>
  )
}
