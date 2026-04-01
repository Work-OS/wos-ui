import type { Metadata } from "next"
import { RequestSection } from "@/components/dashboard/employee/request"

export const metadata: Metadata = { title: "Requests" }

export default function RequestPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <RequestSection />
    </div>
  )
}
