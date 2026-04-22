import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/overview"

export const metadata: Metadata = { title: "Overview" }

export default function DashboardPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <DashboardOverview />
    </div>
  )
}
