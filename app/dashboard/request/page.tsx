import type { Metadata } from "next"
import { RequestSection } from "@/components/dashboard/employee/request"

export const metadata: Metadata = { title: "My Request" }

export default function RequestPage() {
  return (
    <div className="animate-in p-6 duration-300 fade-in">
      <RequestSection />
    </div>
  )
}
