import type { Metadata } from "next"
import { GeneralSection } from "@/components/dashboard/settings/general"

export const metadata: Metadata = { title: "General Settings" }

export default function SettingsGeneralPage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <GeneralSection />
    </div>
  )
}
