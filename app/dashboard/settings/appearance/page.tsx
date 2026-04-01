import type { Metadata } from "next"
import { AppearanceSection } from "@/components/dashboard/settings/appearance"

export const metadata: Metadata = { title: "Appearance" }

export default function SettingsAppearancePage() {
  return (
    <div className="p-6 animate-in fade-in duration-300">
      <AppearanceSection />
    </div>
  )
}
