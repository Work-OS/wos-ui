import type { Metadata } from "next"
import { LeaveSection } from "@/components/dashboard/hr/leave"

export const metadata: Metadata = { title: "Leave Management" }

export default function LeavePage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <LeaveSection />
    </div>
  )
}
