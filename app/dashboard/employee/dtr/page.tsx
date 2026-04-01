import type { Metadata } from "next"
import { DTRSection } from "@/components/dashboard/employee/dtr"

export const metadata: Metadata = { title: "Daily Time Record" }

export default function DTRPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <DTRSection />
    </div>
  )
}
