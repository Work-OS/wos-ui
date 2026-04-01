import type { Metadata } from "next"
import { OverviewSection } from "@/components/dashboard/hr"

export const metadata: Metadata = { title: "HR Overview" }

export default function HROverviewPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <OverviewSection />
    </div>
  )
}
