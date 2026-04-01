import type { Metadata } from "next"
import { LeaveSection } from "@/components/dashboard/hr/leave"

export const metadata: Metadata = { title: "Leave Requests" }

export default function HRLeavePage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <LeaveSection />
    </div>
  )
}
