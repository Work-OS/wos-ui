import type { Metadata } from "next"
import { ConfigSection } from "@/components/dashboard/admin/config"

export const metadata: Metadata = { title: "Configuration" }

export default function ConfigPage() {
  return (
    <div className="animate-in p-6 duration-300 fade-in">
      <ConfigSection />
    </div>
  )
}
