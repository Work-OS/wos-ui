import type { Metadata } from "next"
import { SecuritySection } from "@/components/dashboard/settings/security"

export const metadata: Metadata = { title: "Security" }

export default function SettingsSecurityPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <SecuritySection />
    </div>
  )
}
