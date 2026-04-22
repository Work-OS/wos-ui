import type { Metadata } from "next"
import { DTRSection } from "@/components/dashboard/employee/dtr"

export const metadata: Metadata = { title: "Daily Time Record" }

export default function DTRPage() {
  return (
    <div className="animate-in p-6 duration-300 fade-in">
      <DTRSection />
    </div>
  )
}
