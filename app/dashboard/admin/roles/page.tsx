import type { Metadata } from "next"
import { RolesSection } from "@/components/dashboard/admin/roles"

export const metadata: Metadata = { title: "Roles & Permissions" }

export default function RolesPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col p-6 animate-in fade-in duration-300">
      <RolesSection />
    </div>
  )
}
