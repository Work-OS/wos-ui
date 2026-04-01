import type { Metadata } from "next"
import { ConfigSection } from "@/components/dashboard/admin/config"

export const metadata: Metadata = { title: "Configuration" }

export default function AdminConfigPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <ConfigSection />
    </div>
  )
}
