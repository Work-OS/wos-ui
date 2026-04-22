import type { Metadata } from "next"
import { RolesSection } from "@/components/dashboard/admin/roles"

export const metadata: Metadata = { title: "Roles & Permissions" }

export default function RolesPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] animate-in flex-col p-6 duration-300 fade-in">
      <RolesSection />
    </div>
  )
}
